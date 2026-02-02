import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  isOverLimit,
  incrementUploadCount,
  MAX_UPLOADS_PER_IP_PER_DAY,
} from "@/lib/upload-rate-limit";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function buildFileName(ext: string) {
  const now = new Date();
  const stamp = [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    String(now.getUTCDate()).padStart(2, "0"),
  ].join("-");
  return `${stamp}-${randomUUID()}${ext}`;
}

const r2Enabled =
  !!process.env.R2_BUCKET &&
  !!process.env.R2_ENDPOINT &&
  !!process.env.R2_ACCESS_KEY_ID &&
  !!process.env.R2_SECRET_ACCESS_KEY &&
  !!process.env.R2_PUBLIC_BASE_URL;

const R2_CACHE_CONTROL = "public, max-age=31536000, immutable";

const r2Client = r2Enabled
  ? new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
      forcePathStyle: true,
    })
  : null;

const r2Bucket = process.env.R2_BUCKET;
const r2PublicBase = process.env.R2_PUBLIC_BASE_URL?.replace(/\/+$/, "");

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (isOverLimit(ip)) {
      return NextResponse.json(
        {
          error: `Daily upload limit reached (${MAX_UPLOADS_PER_IP_PER_DAY} per day). Try again tomorrow.`,
        },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided. Use form-data field 'file'." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File too large. Max 10MB." },
        { status: 400 }
      );
    }

    const ext = ALLOWED_MIME[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Unsupported file type. Use png/jpg/jpeg/webp/gif." },
        { status: 400 }
      );
    }

    if (!r2Enabled || !r2Client || !r2Bucket || !r2PublicBase) {
      return NextResponse.json(
        {
          error: "Upload service is under maintenance. Please try again later.",
        },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = buildFileName(ext);

    const key = `uploads/${fileName}`;
    await r2Client.send(
      new PutObjectCommand({
        Bucket: r2Bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        CacheControl: R2_CACHE_CONTROL,
      })
    );
    incrementUploadCount(ip);
    const url = `${r2PublicBase}/${key}`;
    return NextResponse.json({ url, storage: "r2" });
  } catch (error) {
    console.error("Upload error", error);
    return NextResponse.json(
      {
        error: "Upload failed. Please try again later.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message:
      "Upload service is under maintenance. Please try again later.",
  });
}


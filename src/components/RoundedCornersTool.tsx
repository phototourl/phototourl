"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, Download, Loader2, Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

type LoadedImage = {
  url: string;
  element: HTMLImageElement;
  originalFile: File;
};

interface RoundedCornersToolProps {
  showHeading?: boolean;
}

// 默认方框尺寸（与 Circle Crop 类似：固定画布，图片在内缩放/平移）
const FRAME_SIZE = 1024; // 导出画布边长（px）
const PREVIEW_FRAME_SIZE = 480; // 预览画布边长（px）
const MIN_RADIUS = 0;
const MAX_RADIUS = 600;
const MIN_SCALE = 1;
const MAX_SCALE = 2;
const DEFAULT_RADIUS = 230;

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

export function RoundedCornersTool({ showHeading = true }: RoundedCornersToolProps) {
  const t = useTranslations("roundedCorners");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const uploadButtonRef = useRef<HTMLLabelElement | null>(null);
  const [loadedImage, setLoadedImage] = useState<LoadedImage | null>(null);
  const [radiusPx, setRadiusPx] = useState(DEFAULT_RADIUS); // 230px，不再按百分比
  const [scale, setScale] = useState(MIN_SCALE);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (loadedImage?.url) {
        URL.revokeObjectURL(loadedImage.url);
      }
    };
  }, [loadedImage]);

  // 组件挂载时：如果是刷新则清空缓存并重置滚动位置
  useEffect(() => {
    const isLanguageSwitch = sessionStorage.getItem('roundedCornersLanguageSwitch') === 'true';
    
    if (!isLanguageSwitch) {
      // 刷新时清空缓存
      sessionStorage.removeItem('roundedCornersImage');
      sessionStorage.removeItem('roundedCornersFileName');
      sessionStorage.removeItem('roundedCornersFileType');
      // 滚动条归位
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  // 从 sessionStorage 加载图片（如果是切换语言后）
  useEffect(() => {
    if (loadedImage) return; // 如果已经有图片了，不加载
    
    // 检查是否是语言切换
    const isLanguageSwitch = sessionStorage.getItem('roundedCornersLanguageSwitch') === 'true';
    
    // 如果是语言切换，清除标记
    if (isLanguageSwitch) {
      sessionStorage.removeItem('roundedCornersLanguageSwitch');
    }
    
    // 尝试从 sessionStorage 加载图片
    const base64 = sessionStorage.getItem('roundedCornersImage');
    const fileName = sessionStorage.getItem('roundedCornersFileName');
    const fileType = sessionStorage.getItem('roundedCornersFileType');
    
    if (base64 && fileName && fileType) {
      // 将 base64 转换为 File 对象
      const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
      const mimeString = fileType || (base64.includes(',') ? base64.split(',')[0].split(':')[1].split(';')[0] : 'image/jpeg');
      
      // 使用更可靠的方法将 base64 转换为二进制数据
      const byteString = atob(base64Data);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], fileName, { type: mimeString });

      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setLoadedImage({ url: objectUrl, element: img, originalFile: file });
        setScale(MIN_SCALE);
        setOffsetX(0);
        setOffsetY(0);
        // 注意：不清除 sessionStorage，以便切换语言时能恢复图片
      };
      img.src = objectUrl;
    }
  }, [loadedImage]);

  useEffect(() => {
    if (!loadedImage) return;
    const timer = setTimeout(() => {
      if (!uploadButtonRef.current) return;
      const header = document.querySelector("header");
      const headerHeight = header ? header.getBoundingClientRect().height : 64;
      const buttonRect = uploadButtonRef.current.getBoundingClientRect();
      const currentScrollY = window.scrollY;
      const targetScrollY = currentScrollY + buttonRect.top - headerHeight - 24;
      window.scrollTo({ top: Math.max(0, targetScrollY), behavior: "smooth" });
    }, 400);
    return () => clearTimeout(timer);
  }, [loadedImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    
    // 将文件转换为 base64 并保存到 sessionStorage，以便切换语言时恢复
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      sessionStorage.setItem('roundedCornersImage', base64);
      sessionStorage.setItem('roundedCornersFileName', file.name);
      sessionStorage.setItem('roundedCornersFileType', file.type);
    };
    reader.readAsDataURL(file);
    
    if (loadedImage?.url) URL.revokeObjectURL(loadedImage.url);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setScale(MIN_SCALE);
      setOffsetX(0);
      setOffsetY(0);
      setLoadedImage({ url, element: img, originalFile: file });
      // 圆角不随上传图变化，保持当前“默认方框”的圆角
    };
    img.src = url;
  };

  const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  // 固定默认方框尺寸（预览 480、导出 1024），与 Circle Crop 一致
  const getPreviewDrawSize = () => ({
    drawW: PREVIEW_FRAME_SIZE,
    drawH: PREVIEW_FRAME_SIZE,
  });

  const drawPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas || !loadedImage) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const img = loadedImage.element;
    const size = PREVIEW_FRAME_SIZE;
    const center = size / 2;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);
    const r = Math.min((radiusPx * size) / FRAME_SIZE, size / 2);
    const imgAspect = img.width / img.height;
    let drawImgW: number;
    let drawImgH: number;
    if (imgAspect > 1) {
      drawImgH = size * scale;
      drawImgW = drawImgH * imgAspect;
    } else {
      drawImgW = size * scale;
      drawImgH = drawImgW / imgAspect;
    }
    const x = center - drawImgW / 2 + offsetX;
    const y = center - drawImgH / 2 + offsetY;
    ctx.save();
    drawRoundedRectPath(ctx, 0, 0, size, size, r);
    ctx.clip();
    ctx.drawImage(img, 0, 0, img.width, img.height, x, y, drawImgW, drawImgH);
    ctx.restore();
  };

  useEffect(() => {
    if (!loadedImage || isDragging) return;
    const img = loadedImage.element;
    const size = PREVIEW_FRAME_SIZE;
    const center = size / 2;
    const imgAspect = img.width / img.height;
    const drawImgW = imgAspect > 1 ? size * scale * imgAspect : size * scale;
    const drawImgH = imgAspect > 1 ? size * scale : (size * scale) / imgAspect;
    const minOffsetX = center - drawImgW / 2;
    const maxOffsetX = drawImgW / 2 - center;
    const minOffsetY = center - drawImgH / 2;
    const maxOffsetY = drawImgH / 2 - center;
    setOffsetX((prev) => Math.max(minOffsetX, Math.min(maxOffsetX, prev)));
    setOffsetY((prev) => Math.max(minOffsetY, Math.min(maxOffsetY, prev)));
  }, [loadedImage, scale, isDragging]);

  useEffect(() => {
    drawPreview();
  }, [loadedImage, radiusPx, scale, offsetX, offsetY]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!loadedImage) return;
    const pos = getEventPos(e);
    if (pos) {
      setIsDragging(true);
      setDragStart({ x: pos.x - offsetX, y: pos.y - offsetY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && dragStart && loadedImage) {
      e.preventDefault();
      const pos = getEventPos(e);
      if (pos) {
        const img = loadedImage.element;
        const size = PREVIEW_FRAME_SIZE;
        const center = size / 2;
        const imgAspect = img.width / img.height;
        const drawImgW = imgAspect > 1 ? size * scale * imgAspect : size * scale;
        const drawImgH = imgAspect > 1 ? size * scale : (size * scale) / imgAspect;
        const minOffsetX = center - drawImgW / 2;
        const maxOffsetX = drawImgW / 2 - center;
        const minOffsetY = center - drawImgH / 2;
        const maxOffsetY = drawImgH / 2 - center;
        let newX = Math.max(minOffsetX, Math.min(maxOffsetX, pos.x - dragStart.x));
        let newY = Math.max(minOffsetY, Math.min(maxOffsetY, pos.y - dragStart.y));
        setOffsetX(newX);
        setOffsetY(newY);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!loadedImage) return;
    const pos = getEventPos(e);
    if (pos) {
      setIsDragging(true);
      setDragStart({ x: pos.x - offsetX, y: pos.y - offsetY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !dragStart || !loadedImage) return;
    e.preventDefault();
    const pos = getEventPos(e);
    if (pos) {
      const img = loadedImage.element;
      const size = PREVIEW_FRAME_SIZE;
      const center = size / 2;
      const imgAspect = img.width / img.height;
      const drawImgW = imgAspect > 1 ? size * scale * imgAspect : size * scale;
      const drawImgH = imgAspect > 1 ? size * scale : (size * scale) / imgAspect;
      const minOffsetX = center - drawImgW / 2;
      const maxOffsetX = drawImgW / 2 - center;
      const minOffsetY = center - drawImgH / 2;
      const maxOffsetY = drawImgH / 2 - center;
      let newX = Math.max(minOffsetX, Math.min(maxOffsetX, pos.x - dragStart.x));
      let newY = Math.max(minOffsetY, Math.min(maxOffsetY, pos.y - dragStart.y));
      setOffsetX(newX);
      setOffsetY(newY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container || !loadedImage) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev) =>
        Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev + delta))
      );
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [loadedImage]);

  const handleDownload = () => {
    if (!loadedImage) {
      alert(t("errorUploadFirst"));
      return;
    }
    setIsExporting(true);
    try {
      const img = loadedImage.element;
      const size = FRAME_SIZE;
      const center = size / 2;
      const r = Math.min(radiusPx, size / 2);
      const imgAspect = img.width / img.height;
      let drawImgW: number;
      let drawImgH: number;
      if (imgAspect > 1) {
        drawImgH = size * scale;
        drawImgW = drawImgH * imgAspect;
      } else {
        drawImgW = size * scale;
        drawImgH = drawImgW / imgAspect;
      }
      const exportOffsetX = offsetX * (size / PREVIEW_FRAME_SIZE);
      const exportOffsetY = offsetY * (size / PREVIEW_FRAME_SIZE);
      const x = center - drawImgW / 2 + exportOffsetX;
      const y = center - drawImgH / 2 + exportOffsetY;
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = size;
      exportCanvas.height = size;
      const ctx = exportCanvas.getContext("2d", { alpha: true, willReadFrequently: false });
      if (!ctx) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      drawRoundedRectPath(ctx, 0, 0, size, size, r);
      ctx.clip();
      ctx.drawImage(img, 0, 0, img.width, img.height, x, y, drawImgW, drawImgH);
      ctx.restore();
      const dataUrl = exportCanvas.toDataURL("image/png", 1.0);
      const a = document.createElement("a");
      a.href = dataUrl;
      const now = new Date();
      const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
      a.download = `photo-rounded-corners-${ts}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col">
      {showHeading && (
        <div className="space-y-3 text-center mb-8">
          <h1 className="flex items-center justify-center gap-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            <div className="h-8 w-8 flex items-center justify-center flex-shrink-0 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
              <NextImage
                src="/rounded-corners.png"
                alt={t("title")}
                width={48}
                height={48}
                className="h-full w-auto object-contain"
              />
            </div>
            {t("title")}
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base">
            {t("description")}
          </p>
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className={`w-full max-w-[480px] ${!loadedImage ? "flex items-center justify-center min-h-[250px] md:min-h-[300px]" : ""}`}>
          <label ref={uploadButtonRef} htmlFor="file-upload-rounded" className="w-full">
            <input
              id="file-upload-rounded"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="w-full px-12 py-6 text-lg cursor-pointer bg-white border-2 border-black text-black hover:bg-black hover:text-white font-medium"
              onClick={() => document.getElementById("file-upload-rounded")?.click()}
            >
              <Upload className="mr-3 h-5 w-5" />
              {t("upload")}
            </Button>
          </label>
        </div>

        {loadedImage && (
          <>
            <div className="mt-6 w-full max-w-[480px] space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  {t("radiusLabel")}
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0 rounded-lg border-slate-200"
                    onClick={() => setRadiusPx((p) => Math.max(MIN_RADIUS, p - 1))}
                    aria-label="Decrease radius"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <input
                    type="number"
                    min={MIN_RADIUS}
                    max={MAX_RADIUS}
                    value={radiusPx}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!Number.isNaN(v)) setRadiusPx(Math.min(MAX_RADIUS, Math.max(MIN_RADIUS, v)));
                    }}
                    className="w-20 rounded-lg border border-slate-200 bg-black px-3 py-2 text-sm text-white focus:border-white/40 focus:outline-none"
                  />
                  <input
                    type="range"
                    min={MIN_RADIUS}
                    max={MAX_RADIUS}
                    value={radiusPx}
                    onChange={(e) => setRadiusPx(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg appearance-none bg-slate-200 cursor-pointer slider-white-thumb min-w-0"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0 rounded-lg border-slate-200"
                    onClick={() => setRadiusPx((p) => Math.min(MAX_RADIUS, p + 1))}
                    aria-label="Increase radius"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div
                ref={previewContainerRef}
                className="flex justify-center overflow-hidden border border-slate-200"
                style={{
                  backgroundColor: "#fff",
                  backgroundImage: `
                    linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                    linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                    linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
                  `,
                  backgroundSize: "16px 16px",
                  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
                }}
              >
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto block cursor-move"
                  style={{ maxHeight: "70vh" }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                />
              </div>
              <div className="w-full max-w-[480px]">
                <label className="text-sm font-medium text-slate-700">
                  {t("scaleLabel")}
                </label>
                <input
                  type="range"
                  min={MIN_SCALE}
                  max={MAX_SCALE}
                  step="0.01"
                  value={scale}
                  onChange={(e) =>
                    setScale(Math.max(MIN_SCALE, Math.min(MAX_SCALE, parseFloat(e.target.value))))
                  }
                  className="mt-1 w-full h-2 rounded-lg appearance-none bg-slate-200 cursor-pointer slider-white-thumb"
                />
              </div>
              <Button
                size="lg"
                onClick={handleDownload}
                disabled={isExporting}
                className="w-full px-12 py-6 text-lg bg-black text-white hover:bg-slate-800 font-medium"
              >
                {isExporting ? (
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                ) : (
                  <Download className="mr-3 h-5 w-5" />
                )}
                {t("download")}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

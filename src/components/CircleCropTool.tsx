"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, Download, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

type LoadedImage = {
  url: string;
  element: HTMLImageElement;
  originalFile: File;
};

interface CircleCropToolProps {
  showHeading?: boolean;
}

export function CircleCropTool({ showHeading = true }: CircleCropToolProps) {
  const t = useTranslations("circleCrop");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const [loadedImage, setLoadedImage] = useState<LoadedImage | null>(null);
  const [scale, setScale] = useState<number>(1); // 默认缩放为1（100%），确保图片至少填满圆形
  const [isCropping, setIsCropping] = useState(false);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  // 清理 Object URL
  useEffect(() => {
    return () => {
      if (loadedImage?.url) {
        URL.revokeObjectURL(loadedImage.url);
      }
    };
  }, [loadedImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

            if (!file.type.startsWith("image/")) {
              alert(t("errorSelectFile"));
              return;
            }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (loadedImage?.url) {
        URL.revokeObjectURL(loadedImage.url);
      }
      setLoadedImage({ url: objectUrl, element: img, originalFile: file });
      setScale(1); // 重置为1（100%），确保图片至少填满圆形
      setOffsetX(0);
      setOffsetY(0);
    };
    img.src = objectUrl;
  };

  const drawCirclePreview = () => {
    const canvas = canvasRef.current;
    if (!canvas || !loadedImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { element: img } = loadedImage;
    const size = canvas.width; // 320
    const radius = size / 2;

    ctx.clearRect(0, 0, size, size);

    // 参考 circlecropimage.com：在预览画布上按比例显示
    const base = Math.min(img.width, img.height);
    // 在预览画布上的实际绘制尺寸（预览画布大小 * 用户缩放比例）
    const drawSize = size * scale;
    
    // 从原始图片中心裁剪正方形区域
    const sx = (img.width - base) / 2;
    const sy = (img.height - base) / 2;
    
    // 在预览画布上的位置（居中 + 用户偏移）
    const x = radius - drawSize / 2 + offsetX;
    const y = radius - drawSize / 2 + offsetY;

    // 计算源图片的裁剪尺寸（考虑用户缩放）
    // 预览画布上 scale=1 时显示完整的 base，需要将预览画布的缩放映射到原始图片
    const previewToImageScale = base / size; // 预览画布到原始图片的缩放比例
    const sourceSize = drawSize * previewToImageScale; // 原始图片上的源尺寸
    const sourceX = sx + (base - sourceSize) / 2;
    const sourceY = sy + (base - sourceSize) / 2;

    // 确保不超出边界
    const clampedSx = Math.max(0, Math.min(img.width - sourceSize, sourceX));
    const clampedSy = Math.max(0, Math.min(img.height - sourceSize, sourceY));
    const clampedSourceSize = Math.min(
      sourceSize,
      img.width - clampedSx,
      img.height - clampedSy
    );

    ctx.drawImage(
      img,
      clampedSx,
      clampedSy,
      clampedSourceSize,
      clampedSourceSize,
      x,
      y,
      drawSize,
      drawSize
    );

    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  const drawDefaultCircle = () => {
    const canvas = canvasRef.current;
    if (!canvas || loadedImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const radius = size / 2;

    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.fillStyle = "rgba(128, 128, 128, 0.1)";
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(128, 128, 128, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  useEffect(() => {
    if (loadedImage) {
      drawCirclePreview();
    } else {
      drawDefaultCircle();
    }
  }, [loadedImage, scale, offsetX, offsetY]);

  const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!loadedImage || scale === 1) return; // scale=1 时不允许移动
    e.preventDefault();
    const pos = getEventPos(e);
    if (pos) {
      setIsDragging(true);
      setDragStart({ x: pos.x - offsetX, y: pos.y - offsetY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart || !loadedImage) return;
    e.preventDefault();
    const pos = getEventPos(e);
    if (pos) {
      setOffsetX(pos.x - dragStart.x);
      setOffsetY(pos.y - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!loadedImage || scale === 1) return; // scale=1 时不允许移动
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
      setOffsetX(pos.x - dragStart.x);
      setOffsetY(pos.y - dragStart.y);
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
      setScale((prevScale) => {
        const minScale = 1; // 最小缩放为1，确保图片至少填满圆形
        const maxScale = 2;
        
        // 如果已经是最小值且尝试继续缩小，则不执行
        if (prevScale <= minScale && delta < 0) {
          return prevScale;
        }
        // 如果已经是最大值且尝试继续放大，则不执行
        if (prevScale >= maxScale && delta > 0) {
          return prevScale;
        }
        const newScale = Math.max(minScale, Math.min(maxScale, prevScale + delta));
        return newScale;
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [loadedImage]);

  const handleDownload = () => {
    if (!loadedImage) {
      alert(t("errorUploadFirst"));
      return;
    }
    setIsCropping(true);
    try {
      const previewCanvas = canvasRef.current;
      if (!previewCanvas) return;

      // 参考 circlecropimage.com：保持原始分辨率，输出高质量 PNG
      const outputFormat = "image/png";
      const fileExtension = "png";

      const { element: img } = loadedImage;
      const previewSize = previewCanvas.width; // 320
      
      // 保持原始图片分辨率（参考网站：High-resolution output - Download in original quality）
      // 使用原始图片的最小边作为圆形输出的尺寸，保持原始质量
      const base = Math.min(img.width, img.height);
      const exportSize = base; // 保持原始分辨率，不限制大小

      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = exportSize;
      exportCanvas.height = exportSize;

      const exportCtx = exportCanvas.getContext("2d", {
        alpha: true,
        willReadFrequently: false,
      });
      if (!exportCtx) return;

      // 高质量图片处理设置
      exportCtx.imageSmoothingEnabled = true;
      exportCtx.imageSmoothingQuality = "high";

      const radius = exportSize / 2;

      // 清空画布（透明背景）
      exportCtx.clearRect(0, 0, exportSize, exportSize);

      // 创建圆形裁剪路径
      exportCtx.save();
      exportCtx.beginPath();
      exportCtx.arc(radius, radius, radius, 0, Math.PI * 2);
      exportCtx.closePath();
      exportCtx.clip();

      // 计算预览画布到原始图片的缩放比例（与预览逻辑保持一致）
      const previewToImageScale = base / previewSize;

      // 将预览画布上的偏移映射到原始图片
      const imageOffsetX = offsetX * previewToImageScale;
      const imageOffsetY = offsetY * previewToImageScale;

      // 从原始图片中心裁剪正方形区域
      const sx = (img.width - base) / 2;
      const sy = (img.height - base) / 2;

      // 计算源图片的裁剪尺寸（与预览逻辑保持一致）
      // 预览画布上的绘制尺寸
      const previewDrawSize = previewSize * scale;
      // 映射到原始图片的源尺寸
      const sourceSize = previewDrawSize * previewToImageScale;
      const sourceX = sx + (base - sourceSize) / 2 - imageOffsetX;
      const sourceY = sy + (base - sourceSize) / 2 - imageOffsetY;

      // 确保不超出边界
      const clampedSx = Math.max(0, Math.min(img.width - sourceSize, sourceX));
      const clampedSy = Math.max(0, Math.min(img.height - sourceSize, sourceY));
      const clampedSourceSize = Math.min(
        sourceSize,
        img.width - clampedSx,
        img.height - clampedSy
      );

      // 在导出画布上绘制（填满整个圆形区域，保持原始分辨率）
      exportCtx.drawImage(
        img,
        clampedSx,
        clampedSy,
        clampedSourceSize,
        clampedSourceSize,
        0,
        0,
        exportSize,
        exportSize
      );

      exportCtx.restore();

      // 导出为 PNG（透明背景，参考网站：PNG format with transparency）
      const dataUrl = exportCanvas.toDataURL(outputFormat, 1.0);
      const a = document.createElement("a");
      a.href = dataUrl;
      
      // 生成 YYYYMMDDHHmmss 格式的时间戳
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
      
      a.download = `photo-to-circle-crop-${timestamp}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <div className="space-y-6">
      {showHeading && (
        <div className="space-y-3 text-center">
          <h1 className="flex items-center justify-center gap-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            <div className="h-8 w-8 rounded-xl overflow-hidden sm:h-10 sm:w-10 lg:h-12 lg:w-12">
              <Image
                src="/circle-crop-favicon.png"
                alt=""
                width={48}
                height={48}
                className="h-full w-full object-contain"
              />
            </div>
            {t("title")}
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base">
            {t("description")}
          </p>
        </div>
      )}

      <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        {/* 移动端：垂直布局 - 上传、预览、滑块、下载 */}
        <div className="flex flex-col gap-6 md:hidden">
          <label htmlFor="file-upload-circle" className="w-full">
            <input
              id="file-upload-circle"
              type="file"
              accept="image/*"
              className="hidden cursor-pointer"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="w-full cursor-pointer bg-white border-slate-300 text-slate-700 hover:bg-black hover:text-white hover:border-black transition-colors"
              onClick={() => document.getElementById("file-upload-circle")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {t("upload")}
            </Button>
          </label>

          <div className="flex items-center justify-center">
            <div ref={previewContainerRef} className="flex items-center justify-center w-full">
              <canvas
                ref={canvasRef}
                width={320}
                height={320}
                className={`w-full max-w-[320px] aspect-square border border-slate-200 bg-slate-50 ${
                  loadedImage 
                    ? scale === 1 
                      ? "rounded-lg cursor-default" 
                      : "rounded-lg cursor-move"
                    : "rounded-full"
                }`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </div>
          </div>

          <div>
            <input
              type="range"
              min="1"
              max="2"
              step="0.01"
              value={scale}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value);
                setScale(Math.max(1, Math.min(2, newValue)));
              }}
              disabled={!loadedImage}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed slider-white-thumb"
            />
          </div>

          {loadedImage && (
            <button
              onClick={handleDownload}
              disabled={isCropping}
              className="w-full h-11 px-8 rounded-md cursor-pointer bg-black text-white hover:bg-white hover:text-black hover:border hover:border-slate-300 transition-colors disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed inline-flex items-center justify-center text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {isCropping ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("processing")}
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  {t("download")}
                </>
              )}
            </button>
          )}
        </div>

        {/* 桌面端：左右布局 */}
        <div className="hidden md:flex md:flex-row md:items-center md:gap-6">
          <div className="flex-1 flex flex-col">
            <label htmlFor="file-upload-circle-desktop" className="w-full mb-12">
              <input
                id="file-upload-circle-desktop"
                type="file"
                accept="image/*"
                className="hidden cursor-pointer"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="w-full cursor-pointer bg-white border-slate-300 text-slate-700 hover:bg-black hover:text-white hover:border-black transition-colors"
                onClick={() => document.getElementById("file-upload-circle-desktop")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                {t("upload")}
              </Button>
            </label>

            <div className="mb-12">
              <input
                type="range"
                min="1"
                max="2"
                step="0.01"
                value={scale}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value);
                  setScale(Math.max(1, Math.min(2, newValue)));
                }}
                disabled={!loadedImage}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed slider-white-thumb"
              />
            </div>

            {loadedImage && (
              <button
                onClick={handleDownload}
                disabled={isCropping}
                className="w-full h-11 px-8 rounded-md cursor-pointer bg-black text-white hover:bg-white hover:text-black hover:border hover:border-slate-300 transition-colors disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed inline-flex items-center justify-center text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                {isCropping ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("processing")}
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    {t("download")}
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex flex-1 flex-col items-center">
            <div ref={previewContainerRef} className="flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={320}
                height={320}
                className={`h-64 w-64 border border-slate-200 bg-slate-50 ${
                  loadedImage 
                    ? scale === 1 
                      ? "rounded-lg cursor-default" 
                      : "rounded-lg cursor-move"
                    : "rounded-full"
                }`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


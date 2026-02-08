"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
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

// 预览画布大小 - 参考 circlecropimage.com，使用更大的尺寸让展示更大气
const PREVIEW_CANVAS_SIZE = 480; // 从 320 增加到 480，让展示区域更大气
// 圆形内边距 - 参考 circlecropimage.com，圆形不应该贴着画布边缘
const CIRCLE_PADDING = 40; // 圆形距离画布边缘的内边距（从 20 增加到 40，让圆圈更小）

export function CircleCropTool({ showHeading = true }: CircleCropToolProps) {
  const t = useTranslations("circleCrop");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const uploadButtonRef = useRef<HTMLLabelElement | null>(null);
  const [loadedImage, setLoadedImage] = useState<LoadedImage | null>(null);
  const [scale, setScale] = useState<number>(1); // 默认缩放为1（100%），确保图片至少填满圆形
  // 初始偏移量：对于竖图，从顶部开始显示；对于横图，从左边开始显示
  const [isCropping, setIsCropping] = useState(false);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isOverImage, setIsOverImage] = useState(false);

  // 清理 Object URL
  useEffect(() => {
    return () => {
      if (loadedImage?.url) {
        URL.revokeObjectURL(loadedImage.url);
      }
    };
  }, [loadedImage]);

  // 组件挂载时：如果是刷新则清空缓存并重置滚动位置
  useEffect(() => {
    const isLanguageSwitch = sessionStorage.getItem('circleCropLanguageSwitch') === 'true';
    const isFromHome = sessionStorage.getItem('circleCropFromHome') === 'true';
    
    if (!isLanguageSwitch && !isFromHome) {
      // 刷新时清空缓存
      sessionStorage.removeItem('circleCropImage');
      sessionStorage.removeItem('circleCropFileName');
      sessionStorage.removeItem('circleCropFileType');
      // 滚动条归位
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  // 图片加载后自动滚动到合适位置，让首屏显示：头部导航、上传按钮、图片、缩放、下载按钮
  useEffect(() => {
    if (!loadedImage) return;

    // 延迟一下确保 DOM 已更新（图片渲染完成）
    const timer = setTimeout(() => {
      if (!uploadButtonRef.current) return;

      // 获取头部导航的实际高度（h-14 sm:h-16 = 56px/64px）
      const header = document.querySelector('header');
      const headerHeight = header ? header.getBoundingClientRect().height : 64;
      
      // 获取上传按钮的位置
      const buttonRect = uploadButtonRef.current.getBoundingClientRect();
      const currentScrollY = window.scrollY;
      
      // 计算需要滚动的位置：让上传按钮刚好在头部导航下方
      // 添加一点间距（24px）让视觉效果更好
      const spacing = 24;
      const targetScrollY = currentScrollY + buttonRect.top - headerHeight - spacing;
      
      window.scrollTo({
        top: Math.max(0, targetScrollY),
        behavior: 'smooth'
      });
    }, 600); // 增加延迟确保图片、缩放滑块、下载按钮都已渲染完成

    return () => clearTimeout(timer);
  }, [loadedImage]);

  // 从 sessionStorage 加载图片（如果是从 Photo To URL 页面跳转过来的，或者切换语言后）
  useEffect(() => {
    if (loadedImage) return; // 如果已经有图片了，不加载
    
    // 检查是否是语言切换
    const isLanguageSwitch = sessionStorage.getItem('circleCropLanguageSwitch') === 'true';
    const isFromHome = sessionStorage.getItem('circleCropFromHome') === 'true';
    
    // 如果是语言切换，清除标记
    if (isLanguageSwitch) {
      sessionStorage.removeItem('circleCropLanguageSwitch');
    }
    
    // 如果是从首页跳转过来的，清除标记
    if (isFromHome) {
      sessionStorage.removeItem('circleCropFromHome');
    }
    
    // 尝试从 sessionStorage 加载图片（无论是从首页跳转还是语言切换）
    const base64 = sessionStorage.getItem('circleCropImage');
    const fileName = sessionStorage.getItem('circleCropFileName');
    const fileType = sessionStorage.getItem('circleCropFileType');
    
    if (base64 && fileName && fileType) {
      // 将 base64 转换为 File 对象
      // 提取 base64 数据部分（去掉 data:image/jpeg;base64, 前缀）
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
        // 参考 circlecropimage.com：上传后从图片中心裁剪，初始位置居中
        // 用户可以后续通过拖拽和缩放来调整位置
        setLoadedImage({ url: objectUrl, element: img, originalFile: file });
        setScale(1); // 初始缩放为 1，确保图片至少填满圆形
        setOffsetX(0); // 初始偏移为 0，从中心开始
        setOffsetY(0);
        // 注意：不清除 sessionStorage，以便切换语言时能恢复图片
      };
      img.src = objectUrl;
    }
  }, [loadedImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

            if (!file.type.startsWith("image/")) {
              alert(t("errorSelectFile"));
              return;
            }

    // 将文件转换为 base64 并保存到 sessionStorage，以便切换语言时恢复
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      sessionStorage.setItem('circleCropImage', base64);
      sessionStorage.setItem('circleCropFileName', file.name);
      sessionStorage.setItem('circleCropFileType', file.type);
    };
    reader.readAsDataURL(file);

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (loadedImage?.url) {
        URL.revokeObjectURL(loadedImage.url);
      }
      // 参考 circlecropimage.com：上传后从图片中心裁剪，初始位置居中
      // 用户可以后续通过拖拽和缩放来调整位置
      setLoadedImage({ url: objectUrl, element: img, originalFile: file });
      setScale(1); // 初始缩放为 1，确保图片至少填满圆形
      setOffsetX(0); // 初始偏移为 0，从中心开始
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
    const size = canvas.width; // PREVIEW_CANVAS_SIZE
    // 圆形半径 = (画布大小 - 内边距 * 2) / 2
    const circleRadius = (size - CIRCLE_PADDING * 2) / 2;
    const centerX = size / 2;
    const centerY = size / 2;

    // 清除整个 canvas
    ctx.clearRect(0, 0, size, size);

    // 显示完整原图，不截取任何部分
    const imgAspect = img.width / img.height;
    const circleDiameter = circleRadius * 2;
    
    // 计算绘制尺寸：以圆形直径为基准，按比例缩放
    let drawWidth: number;
    let drawHeight: number;
    
    if (imgAspect > 1) {
      // 横图：以高度为基准
      drawHeight = circleDiameter * scale;
      drawWidth = drawHeight * imgAspect;
    } else {
      // 竖图或正方形：以宽度为基准
      drawWidth = circleDiameter * scale;
      drawHeight = drawWidth / imgAspect;
    }
    
    // 在预览画布上的位置（居中 + 用户偏移）
    const x = centerX - drawWidth / 2 + offsetX;
    const y = centerY - drawHeight / 2 + offsetY;

    // 绘制完整原图
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      x,
      y,
      drawWidth,
      drawHeight
    );

    // 绘制圆形外的蒙版（半透明深色）- 只在圆形外部，圆形内部保持原图
    ctx.save();
    // 创建裁剪路径：整个画布减去圆形区域
    ctx.beginPath();
    ctx.rect(0, 0, size, size); // 整个画布
    ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2, true); // 圆形（逆时针，从矩形中减去）
    ctx.clip(); // 裁剪到复合路径，只在圆形外绘制
    
    // 在圆形外绘制蒙版（圆形内不会绘制，保持原图）
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)"; // 半透明黑色蒙版，不要太深
    ctx.fillRect(0, 0, size, size);
    ctx.restore();

    // 绘制圆形边框
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)"; // 白色边框
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };


  // 限制偏移量，确保图片边缘不超出圆形
  useEffect(() => {
    if (!loadedImage || isDragging) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const size = canvas.width;
    const circleRadius = (size - CIRCLE_PADDING * 2) / 2;
    const _centerX = size / 2;
    const _centerY = size / 2;
    const circleDiameter = circleRadius * 2;
    
    // 计算图片绘制尺寸
    const img = loadedImage.element;
    const imgAspect = img.width / img.height;
    let drawWidth: number;
    let drawHeight: number;
    
    if (imgAspect > 1) {
      drawHeight = circleDiameter * scale;
      drawWidth = drawHeight * imgAspect;
    } else {
      drawWidth = circleDiameter * scale;
      drawHeight = drawWidth / imgAspect;
    }
    
    // 计算偏移量范围：确保图片边缘不超出圆形
    const minOffsetX = circleRadius - drawWidth / 2;
    const maxOffsetX = drawWidth / 2 - circleRadius;
    const minOffsetY = circleRadius - drawHeight / 2;
    const maxOffsetY = drawHeight / 2 - circleRadius;
    
    setOffsetX((prev) => Math.max(minOffsetX, Math.min(maxOffsetX, prev)));
    setOffsetY((prev) => Math.max(minOffsetY, Math.min(maxOffsetY, prev)));
  }, [loadedImage, scale, isDragging]);

  useEffect(() => {
    if (loadedImage) {
      drawCirclePreview();
    }
  }, [loadedImage, scale, offsetX, offsetY]);

  const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // 检查鼠标位置是否在图片区域内
  const isPointInImage = (x: number, y: number): boolean => {
    if (!loadedImage || !canvasRef.current) return false;
    
    const canvas = canvasRef.current;
    const size = canvas.width;
    const circleRadius = (size - CIRCLE_PADDING * 2) / 2;
    const circleDiameter = circleRadius * 2;
    const centerX = size / 2;
    const centerY = size / 2;
    
    const img = loadedImage.element;
    const imgAspect = img.width / img.height;
    let drawWidth: number;
    let drawHeight: number;
    
    if (imgAspect > 1) {
      drawHeight = circleDiameter * scale;
      drawWidth = drawHeight * imgAspect;
    } else {
      drawWidth = circleDiameter * scale;
      drawHeight = drawWidth / imgAspect;
    }
    
    // 计算图片在画布上的实际位置
    const imageX = centerX - drawWidth / 2 + offsetX;
    const imageY = centerY - drawHeight / 2 + offsetY;
    
    // 检查点是否在图片矩形区域内
    return x >= imageX && x <= imageX + drawWidth && y >= imageY && y <= imageY + drawHeight;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!loadedImage) return;
    const pos = getEventPos(e);
    if (pos && isPointInImage(pos.x, pos.y)) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: pos.x - offsetX, y: pos.y - offsetY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!loadedImage) return;
    
    const pos = getEventPos(e);
    if (pos) {
      // 更新鼠标是否在图片区域内的状态
      setIsOverImage(isPointInImage(pos.x, pos.y));
      
      // 如果正在拖拽，更新位置
      if (isDragging && dragStart) {
        e.preventDefault();
        // 计算新的偏移量
        let newOffsetX = pos.x - dragStart.x;
        let newOffsetY = pos.y - dragStart.y;
        
        // 应用边界限制，确保图片边缘不超出圆形
        const canvas = canvasRef.current;
        if (canvas) {
          const size = canvas.width;
          const circleRadius = (size - CIRCLE_PADDING * 2) / 2;
          const circleDiameter = circleRadius * 2;
          
          const img = loadedImage.element;
          const imgAspect = img.width / img.height;
          let drawWidth: number;
          let drawHeight: number;
          
          if (imgAspect > 1) {
            drawHeight = circleDiameter * scale;
            drawWidth = drawHeight * imgAspect;
          } else {
            drawWidth = circleDiameter * scale;
            drawHeight = drawWidth / imgAspect;
          }
          
          const minOffsetX = circleRadius - drawWidth / 2;
          const maxOffsetX = drawWidth / 2 - circleRadius;
          const minOffsetY = circleRadius - drawHeight / 2;
          const maxOffsetY = drawHeight / 2 - circleRadius;
          
          newOffsetX = Math.max(minOffsetX, Math.min(maxOffsetX, newOffsetX));
          newOffsetY = Math.max(minOffsetY, Math.min(maxOffsetY, newOffsetY));
        }
        
        setOffsetX(newOffsetX);
        setOffsetY(newOffsetY);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleMouseLeave = () => {
    setIsOverImage(false);
    handleMouseUp();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!loadedImage) return; // 允许在任何缩放级别下移动
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
      // 计算新的偏移量
      let newOffsetX = pos.x - dragStart.x;
      let newOffsetY = pos.y - dragStart.y;
      
      // 应用边界限制，确保图片边缘不超出圆形
      const canvas = canvasRef.current;
      if (canvas) {
        const size = canvas.width;
        const circleRadius = (size - CIRCLE_PADDING * 2) / 2;
        const circleDiameter = circleRadius * 2;
        
        const img = loadedImage.element;
        const imgAspect = img.width / img.height;
        let drawWidth: number;
        let drawHeight: number;
        
        if (imgAspect > 1) {
          drawHeight = circleDiameter * scale;
          drawWidth = drawHeight * imgAspect;
        } else {
          drawWidth = circleDiameter * scale;
          drawHeight = drawWidth / imgAspect;
        }
        
        const minOffsetX = circleRadius - drawWidth / 2;
        const maxOffsetX = drawWidth / 2 - circleRadius;
        const minOffsetY = circleRadius - drawHeight / 2;
        const maxOffsetY = drawHeight / 2 - circleRadius;
        
        newOffsetX = Math.max(minOffsetX, Math.min(maxOffsetX, newOffsetX));
        newOffsetY = Math.max(minOffsetY, Math.min(maxOffsetY, newOffsetY));
      }
      
      setOffsetX(newOffsetX);
      setOffsetY(newOffsetY);
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
      setScale((prevScale: number) => {
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
      const previewSize = previewCanvas.width; // PREVIEW_CANVAS_SIZE
      
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

      // 计算预览画布到原始图片的缩放比例
      const circleRadius = (previewSize - CIRCLE_PADDING * 2) / 2;
      const circleDiameter = circleRadius * 2;
      const centerX = previewSize / 2;
      const centerY = previewSize / 2;
      
      // 计算预览画布上图片的绘制尺寸（与预览逻辑一致）
      const imgAspect = img.width / img.height;
      let previewDrawWidth: number;
      let previewDrawHeight: number;
      
      if (imgAspect > 1) {
        previewDrawHeight = circleDiameter * scale;
        previewDrawWidth = previewDrawHeight * imgAspect;
      } else {
        previewDrawWidth = circleDiameter * scale;
        previewDrawHeight = previewDrawWidth / imgAspect;
      }
      
      // 计算预览画布到原始图片的缩放比例
      const previewToImageScaleX = img.width / previewDrawWidth;
      const previewToImageScaleY = img.height / previewDrawHeight;
      
      // 计算预览画布上圆形中心在原始图片中的位置
      const previewCircleCenterX = centerX + offsetX;
      const previewCircleCenterY = centerY + offsetY;
      const imageCenterX = previewCircleCenterX * previewToImageScaleX;
      const imageCenterY = previewCircleCenterY * previewToImageScaleY;
      
      // 从原始图片中裁剪正方形区域（用于圆形输出）
      const sourceSize = base;
      const sourceX = imageCenterX - sourceSize / 2;
      const sourceY = imageCenterY - sourceSize / 2;

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
    <div className="flex flex-col">
      {showHeading && (
        <div className="space-y-3 text-center mb-8">
          <h1 className="flex items-center justify-center gap-3 text-xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            <div className="h-8 w-8 rounded-xl overflow-hidden sm:h-10 sm:w-10 lg:h-12 lg:w-12">
              <NextImage
                src="/circle-crop.png"
                alt={t("title")}
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

      <div className="flex flex-col items-center">
        {/* 上传按钮 - 始终显示 */}
        <div className={`w-full max-w-[480px] ${!loadedImage ? 'flex items-center justify-center min-h-[250px] md:min-h-[300px]' : ''}`}>
          <label ref={uploadButtonRef} htmlFor="file-upload-circle" className="w-full">
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
              className="w-full px-12 py-6 text-lg cursor-pointer bg-white border-2 border-black text-black hover:bg-black hover:text-white hover:border-black transition-colors font-medium"
              onClick={() => document.getElementById("file-upload-circle")?.click()}
            >
              <Upload className="mr-3 h-5 w-5" />
              {t("upload")}
            </Button>
          </label>
        </div>

        {/* 图片预览区域 - 仅在已上传图片时显示 */}
        {loadedImage && (
          <>
            <div ref={previewContainerRef} className="flex items-center justify-center mt-4">
              <canvas
                ref={canvasRef}
                width={PREVIEW_CANVAS_SIZE}
                height={PREVIEW_CANVAS_SIZE}
                className={`${
                  isOverImage 
                    ? "w-full max-w-[480px] aspect-square rounded-lg cursor-move border border-white bg-white"
                    : "w-full max-w-[480px] aspect-square rounded-lg cursor-default border border-white bg-white"
                }`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </div>

            <div className="w-full max-w-[480px] mt-4">
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
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-white-thumb"
              />
            </div>

            <div className="w-full max-w-[480px] mt-4">
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={handleDownload}
                disabled={isCropping}
                className="w-full px-12 py-6 text-lg cursor-pointer bg-black border-2 border-black text-white hover:bg-white hover:text-black hover:border-black transition-colors font-medium disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed"
              >
                {isCropping ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    {t("processing")}
                  </>
                ) : (
                  <>
                    <Download className="mr-3 h-5 w-5" />
                    {t("download")}
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


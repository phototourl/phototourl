"use client";

import { useEffect, useState } from "react";
import { LanguageSelectModal } from "./LanguageSelectModal";

const STORAGE_KEY = "phototourl-language-selected";

/**
 * 语言选择触发器组件
 * 首次访问时显示语言选择弹框
 */
export function LanguageSelectTrigger() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // 检查是否已经选择过语言
    const hasSelected = localStorage.getItem(STORAGE_KEY);
    if (!hasSelected) {
      // 延迟显示，让页面先加载
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShowModal(false);
    // 标记已选择过语言
    localStorage.setItem(STORAGE_KEY, "true");
  };

  return <LanguageSelectModal open={showModal} onClose={handleClose} />;
}

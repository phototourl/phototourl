import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 导入动画演示所需的图标
import { Link as LinkIcon, Check, Copy, FileImage } from 'lucide-react';

// --- 静态配置 ---
const UPLOAD_DURATION = 2800; // 模拟上传和处理时间 (2.8秒)
const SIMULATED_URL = "https://piclink.ai/u/creative-shot-2024.jpg"; 
// --------------------


// --- 组件：打字机效果 URL (Typewriter Url) ---
const TypewriterUrl = ({ text }) => {
	const [displayedText, setDisplayedText] = useState('');
	const [isTyping, setIsTyping] = useState(true);

	useEffect(() => {
		setDisplayedText(''); 
		setIsTyping(true);
		let i = 0;
		
		// 延迟开始打字，以配合 Check 动画
		const startDelay = setTimeout(() => {
			const timer = setInterval(() => {
				if (i < text.length) {
					setDisplayedText((prev) => prev + text.charAt(i));
					i++;
				} else {
					clearInterval(timer);
					setIsTyping(false);
				}
			}, 10); // 打字速度 (Typing speed)

			return () => clearInterval(timer);
		}, 300); // 等待 Check 动画 (Wait for the checkmark bounce)

		return () => clearTimeout(startDelay);
	}, [text]);

	return (
		<span className="font-mono text-indigo-400 font-medium whitespace-nowrap overflow-hidden text-sm sm:text-base">
			{displayedText}
			{/* 光标闪烁 (Cursor blinks only while typing) */}
			{isTyping && (
				<motion.span 
					animate={{ opacity: [0, 1, 0] }}
					transition={{ repeat: Infinity, duration: 0.8 }}
					className="inline-block w-0.5 h-4 bg-indigo-400 ml-0.5 align-middle"
				/>
			)}
		</span>
	);
};

// --- 自动演示组件：移动的手 (AutoDemoOverlay) ---
const AutoDemoOverlay = ({ step }) => {
	
	// --- 老照片图片URL (Old Photo Image URL) ---
	const OLD_PHOTO_URL = "https://pbs.twimg.com/media/GzVCENqa4AYtKPx?format=jpg&name=medium";

	// 占位符图片 (Placeholder Image)
	const PlaceholderImage = () => (
        // 增大了占位符图片尺寸 (Increased placeholder image size)
        <div className="w-24 h-24 bg-gray-400 rounded-lg shadow-xl flex items-center justify-center text-white text-xs">
            [Image of Old Photo]
        </div>
	);

	// 动画序列定义 (Animation sequence definition)
	const photoAnimation = {
		// 初始位置 (Start position relative to the box center) - 调整了坐标以适应新尺寸和更小的目标区域
		initial: { x: -240, y: -120, scale: 0.7, opacity: 1, rotate: -10 }, 
		
		// 循环序列：从左上角 -> 中心 -> 返回左上角 (Loop: Top-left -> Center -> Top-left)
		animate: {
			x: [-240, 0, -240],
			y: [-120, 0, -120],
			scale: [0.7, 1.1, 0.7], // 模拟放大和缩小 (Simulate approach and retract)
			opacity: [1, 1, 1],
			rotate: [-10, 5, -10], // 轻微旋转 (Slight rotation)
			transition: {
				x: { duration: 3.5, ease: "easeInOut", repeat: Infinity },
				y: { duration: 3.5, ease: "easeInOut", repeat: Infinity },
				scale: { duration: 3.5, ease: "easeInOut", repeat: Infinity },
				opacity: { duration: 3.5, ease: "easeInOut", repeat: Infinity },
				rotate: { duration: 3.5, ease: "easeInOut", repeat: Infinity },
				delay: 0.5 // 延迟开始 (Start delay)
			}
		}
	};
	
	const [imageError, setImageError] = useState(false);


	// 只有在闲置状态才显示拖放动画 (Only show drag animation when idle)
	if (step !== 'idle') return null;

	return (
		<motion.div
			className="absolute z-20 pointer-events-none"
			variants={photoAnimation}
			initial="initial"
			animate="animate"
		>
			<motion.div 
				className="relative" 
				style={{ transform: 'translate(-50%, -50%)' }} // 居中组合元素 (Center the combined elements)
			>
				{imageError ? (
                    <PlaceholderImage />
                ) : (
                    <img 
                        src={OLD_PHOTO_URL} 
                        alt="[Image of Old Photo]"
                        onError={() => setImageError(true)}
                        // 增大了图片尺寸 (Increased image size)
                        className="w-24 h-24 object-cover rounded-lg shadow-2xl border-4 border-white ring-2 ring-gray-200"
                    />
                )}
			</motion.div>
		</motion.div>
	);
};


// --- 组件：交互演示核心 (InteractiveDemo) ---
const InteractiveDemo = () => {
	// States: idle (闲置), upload-in (文件进入), processing (处理中), done (完成)
	// 已移除 upload-in 状态 (The upload-in state has been removed)
	const [step, setStep] = useState('idle'); 
	const [initialLoad, setInitialLoad] = useState(true);

	// --- 自动循环和过渡逻辑 (Auto-Looping and Transition Logic) ---
	useEffect(() => {
		let timer;
		
		const transitionTo = (nextStep, delay) => {
			timer = setTimeout(() => setStep(nextStep), delay);
		};

		if (step === 'idle') {
			// 自动开始序列 (Start the sequence automatically)
			// 延迟 2400ms 允许飞入动画到达中心后，直接过渡到处理中状态。
			const delay = initialLoad ? 4000 : 2400; 
			transitionTo('processing', delay);  // 直接跳过 upload-in 状态 (Skip upload-in state directly)
			setInitialLoad(false); 

		} else if (step === 'processing') {
			// 模拟上传和处理时间 -> 完成 (Simulate upload/processing time -> Done)
			transitionTo('done', UPLOAD_DURATION); 

		} else if (step === 'done') {
			// 保持在完成状态 3 秒后，重置并自动循环 (Hold for 3s, then reset and loop)
			transitionTo('idle', 3000); 
		}

		return () => clearTimeout(timer);
	}, [step]);
	
	
	// --- 基于状态的 UI 渲染 (State-Based UI Rendering) ---
	const renderContent = () => {
		
		// --- 4. 完成状态 (Done State) ---
		if (step === 'done') {
			const fullLink = SIMULATED_URL;

			return (
				<motion.div 
					key="done"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					// 确保在 h-full 容器内居中
					className="w-full h-full flex flex-col items-center justify-center max-w-lg"
				>
					{/* 成功图标可视化 (Checkmark Visual) */}
					<motion.div 
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ type: "spring", stiffness: 300, damping: 25 }}
						className="relative w-20 h-20 mb-8 bg-indigo-500/10 rounded-full flex items-center justify-center"
					>
						<motion.div
							animate={{ scale: [1, 1.2, 1] }}
							transition={{ duration: 0.5, type: "spring", stiffness: 500, delay: 0.1 }}
							className="p-3 bg-green-500 rounded-full shadow-xl ring-4 ring-green-500/30"
						>
							{/* 成功状态图标：Check (Success icon: Check) */}
							<Check size={24} className="text-white" strokeWidth={2.5} />
						</motion.div>
					</motion.div>
					
					{/* 链接显示框 (Link Display Box) */}
					<motion.div 
						initial={{ opacity: 0, scale: 0.8 }} 
						animate={{ opacity: 1, scale: 1 }} 
						transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 25 }}
						className="w-full bg-gray-900 rounded-xl p-1 shadow-2xl ring-1 ring-gray-900/5 mb-8 transform transition-all hover:scale-[1.02]"
					>
						<div className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between group">
							<div className="flex items-center gap-3 overflow-hidden">
								{/* 打字机效果显示链接 (Typewriter URL display) */}
								<TypewriterUrl text={fullLink} />
							</div>
							{/* 复制按钮占位 (Copy Button Placeholder) */}
							<div className="bg-indigo-600 w-24 h-8 rounded-md flex items-center justify-center shadow-lg ml-4 shrink-0 cursor-pointer hover:bg-indigo-700 transition-colors">
								<Copy size={14} className="text-white" />
							</div>
						</div>
					</motion.div>
					
					{/* 循环提示 (Looping hint) */}
					<p className="text-sm text-gray-400 font-mono">Looping in 3s...</p>
				</motion.div>
			);
		}

		// --- 3. 处理状态 (Processing State / 上传中) ---
		if (step === 'processing') {
			 return (
				<motion.div 
					key="processing"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					// 确保在 h-full 容器内居中
					className="w-full h-full flex flex-col items-center justify-center"
				>
					{/* 文件图标消失/旋转动画 (File icon disappear/rotate animation) */}
					<motion.div
						initial={{ rotate: 0, scale: 1, opacity: 1, color: '#4f46e5' }} // indigo-600
						animate={{ 
							rotate: 360, 
							scale: 0.5, 
							opacity: 0.1, 
							color: '#4f46e5' 
						}}
						transition={{ 
							rotate: { duration: 1.5, repeat: 0, ease: "easeInOut" },
							scale: { duration: 1.5, repeat: 0, ease: "easeInOut" },
							opacity: { duration: 1.5, repeat: 0, ease: "easeInOut" },
							color: { duration: 1.5, repeat: 0, ease: "easeInOut" }
						}}
						className="mb-8"
					>
						{/* 处理中状态，使用 FileImage 图标 (Processing state uses FileImage icon) */}
						<FileImage size={64} strokeWidth={1.5} className="text-indigo-600"/>
					</motion.div>

					{/* 动态转换指示器 (Dynamic conversion indicator) */}
					<div className="relative w-40 h-1 mb-8">
						{/* 能量流动画 (Energy flow animation) */}
						<motion.div
							initial={{ x: "-100%" }}
							animate={{ x: "100%" }}
							transition={{ duration: UPLOAD_DURATION / 1000, repeat: 0, ease: "easeInOut" }}
							className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
						/>
						{/* 脉冲环 (Pulsing ring) */}
						<motion.div
							animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
							transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
							className="absolute inset-0 w-full h-full rounded-full ring-2 ring-indigo-500/50"
						/>
					</div>

					<div className="flex flex-col items-center space-y-2">
						{/* 弹跳点 (Bouncing dots) */}
						<div className="flex space-x-1">
							{[0, 1, 2].map((i) => (
								<motion.div
									key={i}
									animate={{ y: [0, -6, 0] }}
									transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
									className="w-2 h-2 bg-indigo-600 rounded-full"
								/>
							))}
						</div>
						{/* 隐藏文本 (Invisible text) */}
						<p className="text-sm text-gray-400 font-mono mt-4 invisible h-0">Optimizing & Uploading...</p>
					</div>
				</motion.div>
			);
		}
		
		// --- 1. 闲置状态 (Idle State / 模拟上传入口) ---
		return (
			<motion.div 
				key="idle"
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
				// 确保在 h-full 容器内居中
				className="flex flex-col items-center text-center w-full h-full justify-center p-8 cursor-pointer"
			>
				{/* 自动演示覆盖层 (AutoDemoOverlay running) */}
				<AutoDemoOverlay step={step} /> 

				{/* --- 重新设计：现代上传/修复区域 (Redesigned: Modern Upload/Restoration Area) --- */}
				<motion.div
					// 缩小了 padding 从 p-12 到 p-8，并限制了最大宽度到 max-w-xs
					className="flex flex-col items-center justify-center p-8 w-full max-w-xs border-4 border-dashed border-indigo-300/50 rounded-2xl bg-indigo-50/50 transition-all duration-300 group hover:border-indigo-500/80 hover:bg-indigo-100/70"
					whileHover={{ scale: 1.03 }}
					transition={{ type: "spring", stiffness: 400, damping: 15 }}
				>
					{/* 中央图标 (Central Icon) - 使用 FileImage 并添加动画 */}
					<motion.div
						animate={{ y: [0, -5, 0] }}
						transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
						className="relative mb-4"
					>
						{/* 文件图标 (File icon) */}
						<FileImage size={56} strokeWidth={1.5} className="text-indigo-600" />
						{/* 小小的上传箭头 (Small upload arrow/indicator) */}
						<LinkIcon size={16} className="absolute -bottom-1 -right-1 transform rotate-45 text-indigo-500 bg-white rounded-full p-0.5 shadow-md" />
					</motion.div>
					
					{/* 标题和说明 (Title and Description) - 隐藏 */}
					<h3 className="text-2xl font-extrabold text-gray-800 mb-2 invisible h-0">
						拖动旧照片到这里
					</h3>
					<p className="text-gray-500 text-sm mb-4 invisible h-0">
						自动进行 AI 增强与修复，即时生成高清链接。
					</p>
					
					{/* 按钮/提示文本 (Button/Hint Text) - 隐藏 */}
					<span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-100 px-4 py-2 rounded-full shadow-sm invisible h-0">
						点击或拖放 (JPG/PNG, Max 10MB)
					</span>
				</motion.div>

			</motion.div>
		);
	};

	return (
		<div className="relative w-full max-w-3xl mx-auto min-h-[500px] perspective-1000 p-4">
			{/* 背景发光效果 (Background glow effect) */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl -z-10 animate-pulse-slow"></div>
			
			<motion.div 
				layout
				// 设置固定高度 h-[450px] 确保所有状态高度一致
				className="relative bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 overflow-hidden border border-gray-100 h-[450px] flex flex-col items-center justify-center p-8 transition-all"
			>
				<AnimatePresence mode="wait">
					{renderContent()}
				</AnimatePresence>
			</motion.div>
		</div>
	);
};


// --- 主应用 (Main App - Only contains the Demo) ---
export default function App() {
	return (
		<div className="min-h-screen bg-gray-50/50 font-sans text-gray-900 flex items-center justify-center p-4">
			{/* 添加一个容器来限制最大宽度和高度，并居中显示 (Container to limit max width/height and center the display) */}
			<div className="w-full max-w-4xl">
				<InteractiveDemo />
			</div>
		</div>
	);
}
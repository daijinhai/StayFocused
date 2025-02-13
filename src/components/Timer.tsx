import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Square, RotateCcw, Bell, BellOff } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useTimerStore } from '../store/timerStore';
import { AlertDialog } from './AlertDialog';
import { useTranslation } from 'react-i18next';

const TIME_PRESETS = [
  { minutes: 25, label: '25' },
  { minutes: 45, label: '45' },
  { minutes: 60, label: '60' }
];

export const Timer: React.FC = () => {
  const { t } = useTranslation();
  // 从 store 获取状态和动作
  const { minutes, isRunning, soundEnabled, actions } = useTimerStore();
  const { getTheme } = useThemeStore();
  const theme = getTheme();

  // 本地状态
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const [showAlert, setShowAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState(minutes.toString());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 初始化音频
  useEffect(() => {
    audioRef.current = new Audio('/sounds/bell.mp3');
    audioRef.current.preload = 'auto';
  }, []);

  // 播放声音
  const playSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Audio play failed:", error);
      });
    }
  }, [soundEnabled]);

  // 计时器完成处理
  const handleTimerComplete = useCallback(() => {
    actions.stop();
    playSound();
    setShowAlert(true);
  }, [actions, playSound]);

  // 计时器逻辑
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, handleTimerComplete]);

  // 监听 minutes 变化
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(minutes * 60);
      setEditingValue(minutes.toString());
    }
  }, [minutes, isRunning]);

  // 重置计时器
  const handleReset = () => {
    actions.reset();
    setTimeLeft(minutes * 60);
    setShowAlert(false);
  };

  // 处理时间变更
  const handleTimeChange = (newMinutes: number) => {
    if (!isRunning && newMinutes >= 1 && newMinutes <= 999) {
      actions.setMinutes(newMinutes);
    }
  };

  // 处理自定义时间输入
  const handleCustomTimeSubmit = () => {
    const newMinutes = Math.min(999, Math.max(1, parseInt(editingValue) || 25));
    handleTimeChange(newMinutes);
    setIsEditing(false);
  };

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 计算进度
  const progress = ((minutes * 60 - timeLeft) / (minutes * 60)) * 100;
  const progressColor = progress >= 75 ? 'text-red-500' : 
                       progress >= 50 ? 'text-yellow-500' : 
                       'text-green-500';

  return (
    <div className={`${theme.colors.foreground} p-6 rounded-xl relative overflow-hidden ${theme.shadows.lg}`}>
      {/* 标题 */}
      <h2 className={`text-xl font-semibold mb-4 ${theme.colors.text}`}>
        {t('timer.title')}
      </h2>

      {/* 声音开关 */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={actions.toggleSound}
          className={`p-1.5 rounded-lg transition-all duration-200 
            ${soundEnabled ? theme.colors.primary : 'bg-gray-400'}`}
        >
          {soundEnabled ? (
            <Bell size={16} className="text-white" />
          ) : (
            <BellOff size={16} className="text-white" />
          )}
        </button>
      </div>

      <div className="flex flex-col items-center">
        {/* 时间显示 */}
        <div className="relative w-48 h-48 mb-4">
          <div className="absolute inset-0 flex items-center justify-center z-10">
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => {
                    handleCustomTimeSubmit();
                    setIsEditing(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCustomTimeSubmit();
                      setIsEditing(false);
                    } else if (e.key === 'Escape') {
                      setIsEditing(false);
                      setEditingValue(minutes.toString());
                    }
                  }}
                  className={`w-20 text-3xl text-center bg-transparent border-b-2 
                    ${theme.colors.border} focus:outline-none font-mono 
                    ${theme.colors.text}`}
                  min="1"
                  max="999"
                  autoFocus
                />
                <span className={`text-xl ${theme.colors.textSecondary}`}>分钟</span>
              </div>
            ) : (
              <div 
                onClick={() => !isRunning && setIsEditing(true)}
                className={`text-4xl tracking-wider cursor-pointer
                  ${timeLeft === 0 
                    ? 'text-red-500' 
                    : isRunning 
                      ? theme.colors.accent
                      : theme.colors.accent + ' opacity-80'}
                  transition-colors duration-300
                  ${!isRunning && 'hover:opacity-100'}`}
                style={{
                  textShadow: isRunning ? '0 0 10px rgba(var(--accent-rgb), 0.5)' : 'none'
                }}
              >
                {formatTime(timeLeft)}
              </div>
            )}
          </div>

          {/* 进度环 */}
          <svg className="w-full h-full transform -rotate-90">
            {/* 发光效果 */}
            {isRunning && (
              <circle
                cx="96"
                cy="96"
                r="90"
                className={`stroke-current ${theme.colors.accent} opacity-10`}
                strokeWidth="12"
                fill="none"
                filter="url(#glow)"
              />
            )}
            
            {/* 背景环 */}
            <circle
              cx="96"
              cy="96"
              r="90"
              className={`stroke-current ${theme.colors.secondary} opacity-20`}
              strokeWidth="6"
              fill="none"
              strokeDasharray="565.2"
              strokeLinecap="round"
            />
            
            {/* 进度环 */}
            <circle
              cx="96"
              cy="96"
              r="90"
              className={`stroke-current ${theme.colors.accent} transition-all duration-300`}
              strokeWidth="6"
              fill="none"
              strokeDasharray="565.2"
              strokeDashoffset={565.2 * (1 - progress / 100)}
              strokeLinecap="round"
            />

            {/* 发光滤镜 */}
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* 刻度 */}
            {Array.from({ length: 60 }).map((_, i) => {
              const rotation = i * 6;
              const isMajor = i % 5 === 0;
              return (
                <line
                  key={i}
                  x1="96"
                  y1="20"
                  x2="96"
                  y2={isMajor ? "25" : "22"}
                  className={`stroke-current ${theme.colors.secondary} ${isMajor ? 'opacity-30' : 'opacity-15'}`}
                  strokeWidth={isMajor ? 2 : 1}
                  transform={`rotate(${rotation} 96 96)`}
                />
              );
            })}
          </svg>
        </div>

        {/* 预设时间按钮 */}
        <div className="grid grid-cols-3 gap-2 w-full mb-4">
          {TIME_PRESETS.map(({ minutes: mins, label }) => (
            <button
              key={mins}
              onClick={() => handleTimeChange(mins)}
              disabled={isRunning}
              className={`py-1.5 px-2 rounded-lg text-sm transition-all duration-200 
                ${minutes === mins
                  ? theme.colors.primary + ' text-white'
                  : theme.colors.secondary + ' ' + theme.colors.text}
                hover:opacity-90 disabled:opacity-50`}
            >
              {`${label} ${t('timer.minutes')}`}
            </button>
          ))}
        </div>

        {/* 控制按钮 */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleReset}
            disabled={isRunning}
            className={`p-3 ${theme.colors.primary} text-white rounded-lg 
              transition-all duration-200 ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RotateCcw size={20} />
          </button>
          
          {!isRunning ? (
            <button
              onClick={() => {
                actions.start();
                setIsEditing(false);
              }}
              className={`p-3 ${theme.colors.primary} text-white rounded-lg 
                transition-all duration-200`}
            >
              <Play size={24} />
            </button>
          ) : (
            <button
              onClick={() => {
                actions.stop();
                setIsEditing(false);
              }}
              className="p-3 bg-red-600 text-white rounded-lg transition-all duration-200"
            >
              <Square size={24} />
            </button>
          )}
        </div>
      </div>

      {/* 完成提示 */}
      <AlertDialog
        isOpen={showAlert}
        onClose={() => {
          setShowAlert(false);
          handleReset();
        }}
        title={t('timer.completeTitle')}
        message={t('timer.completeMessage')}
      />
    </div>
  );
};
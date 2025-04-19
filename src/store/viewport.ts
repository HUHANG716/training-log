import { create } from 'zustand';

interface ViewportState {
  dvh: number;
  initViewportListeners: () => void;
}

export const useViewportStore = create<ViewportState>((set) => ({
  dvh: 0,
  initViewportListeners: () => {
    // 初始化设置dvh值
    const updateDvh = () => {
      set({ dvh: window.innerHeight * 0.01 });
    };

    // 立即设置一次
    updateDvh();

    // 添加事件监听
    window.addEventListener('resize', updateDvh);
    window.addEventListener('orientationchange', updateDvh);

    // 返回清理函数（虽然全局状态可能不需要，但保持良好习惯）
    return () => {
      window.removeEventListener('resize', updateDvh);
      window.removeEventListener('orientationchange', updateDvh);
    };
  },
}));

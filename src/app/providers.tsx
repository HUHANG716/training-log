'use client';

import React, { useEffect } from 'react';
import { useViewportStore } from '@/store/viewport';

export function ViewportProvider({ children }: { children: React.ReactNode }) {
  const { initViewportListeners } = useViewportStore();

  // 在应用初始化时设置监听器
  useEffect(initViewportListeners, [initViewportListeners]);

  return <>{children}</>;
}

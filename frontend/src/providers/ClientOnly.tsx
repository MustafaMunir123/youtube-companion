'use client';

import { ReactNode, useState, useEffect } from 'react';

import { orgInfo } from '@/atoms/auth.atom';
import { useAtomValue } from 'jotai';

export const ClientOnly = ({ children }: { children: ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);
  const org = useAtomValue(orgInfo);

  useEffect(() => {
    setHasMounted(true);
  }, [org]);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

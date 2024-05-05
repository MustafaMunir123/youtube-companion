'use client';

import { createContext, useState } from 'react';

import { isAuthenticatedRequest, orgInfo, userInfo } from '@/atoms/auth.atom';
import { useIsUserAuthenticated } from '@/services/auth/auth.service';
import { isObjectEmpty } from '@/utils/helpers';
import { useAtomValue, useSetAtom } from 'jotai';

// context
export const AuthContext = createContext<null>(null);

// context provider
export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const orgDetails = useAtomValue(orgInfo);
  const userDetails = useAtomValue(userInfo);
  const setOrgInfo = useSetAtom(orgInfo);
  const setUserInfo = useSetAtom(userInfo);
  const { data, isLoading } = useIsUserAuthenticated();
  const isAuthenticated = useAtomValue(isAuthenticatedRequest);


  if (isLoading) {
    return null;
  }

  // if (isAuthenticated && (isObjectEmpty(userDetails) || isObjectEmpty(orgDetails))) {
  //   setUserInfo(data?.data);
  //   setOrgInfo(data?.data?.organization);
  // }

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};

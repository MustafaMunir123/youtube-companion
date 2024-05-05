'use client';

import { ReactNode, useEffect, useState } from 'react';

import { usePathname, useRouter, useSearchParams, notFound } from 'next/navigation';

import { orgInfo } from '@/atoms/auth.atom';
import { useUserPermissions } from '@/services/rbac/rbac.service';
import { publicRoutes } from '@/utils/routes';
import routePermissions from '@/utils/routes.private';
import { Spinner } from 'flowbite-react';
import { useAtomValue } from 'jotai';

import { CaslAbilityFactory } from './abilities/ability-factory';
import { EActions, Role, ESubjects } from './abilities/ability.enum';
import { Permission } from './abilities/permissions.types';
import useUserAbility from './abilities/useAbility';

const RouteGuard = (props: { children: ReactNode }) => {
  const { children } = props;

  const organizationInfo = useAtomValue(orgInfo);
  const { replace } = useRouter();
  const currentRoute = usePathname().slice(3);
  const searchParams = useSearchParams();
  const [authorized, setAuthorized] = useState(true);
  const ability = useUserAbility();

  const { data: permissions, isLoading } = useUserPermissions(organizationInfo?.id as string);

  const setAbilities = () => {
    if (permissions?.data?.role) {
      const abilityFactory = new CaslAbilityFactory();
      const rules = abilityFactory.createPermissionsForUser(
        permissions?.data?.role as Role,
        permissions?.data?.permissions as unknown as Permission[],
      );
      ability.update(rules);
    }
  };

  useEffect(() => {
    setAbilities();
  }, [permissions?.data]);

  useEffect(() => {
    const authCheck = () => {
      routePermissions.map((rp) => {
        if (
          (rp.dynamic && currentRoute?.includes(rp.path || '')) ||
          (rp.path === currentRoute && ability.rules.length)
        ) {
          if (!ability.can(rp.permission?.action as EActions, rp.permission?.subject)) {
            setAuthorized(false);
            notFound();
          }
        }
      });
    };

    if (!isLoading) {
      authCheck();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, currentRoute, searchParams, ability.rules]);

  return authorized ? children : <Spinner aria-label="loading" size="sm" color="purple" />;
};

export default RouteGuard;

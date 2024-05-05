import { Actions, EActions, ESubjects, Subjects } from '@/rbac/abilities/ability.enum';

import { protectedRoutes } from './routes';

export type IPermissionMeta = {
  action: Actions;
  subject: Subjects;
};

export type RoutingList = {
  path?: string;
  index?: boolean;
  permission?: IPermissionMeta;
  dynamic?: boolean;
};

const routePermissions: RoutingList[] = [
  {
    path: protectedRoutes.DASHBOARD,
    permission: {
      action: EActions.VIEW,
      subject: ESubjects.DASHBOARD,
    },
  },
  {
    path: protectedRoutes.MANAGE_USERS,
    permission: {
      action: EActions.READ,
      subject: ESubjects.USERS,
    },
  },
  {
    path: protectedRoutes.YOUR_BOTS,
    permission: {
      action: EActions.READ,
      subject: ESubjects.BOTS,
    },
  },
  {
    path: protectedRoutes.CREATE_CHATBOT,
    permission: {
      action: EActions.CREATE,
      subject: ESubjects.BOTS,
    },
  },
  {
    path: protectedRoutes.UPDATE_CHATBOT,
    permission: {
      action: EActions.UPDATE,
      subject: ESubjects.BOTS,
    },
  },
  {
    path: protectedRoutes.CHATBOT,
    permission: {
      action: EActions.READ,
      subject: ESubjects.BOTS,
    },
  },
  {
    path: protectedRoutes.ORGANIZATION,
    permission: {
      action: EActions.MANAGE,
      subject: ESubjects.ALL,
    },
    dynamic: true,
  },
];

export default routePermissions;

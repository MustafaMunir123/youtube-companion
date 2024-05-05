export enum publicRoutes {
  AUTH_SIGNIN = '/en/auth/signin',
  // AUTH_SIGNIN = '/user/login',
  AUTH_SIGNUP = '/auth/signin',
  AUTH_VERIFY_EMAIL = '/auth/verify-email',
  AUTH_POST_SIGNUP_VERIFY_EMAIL = '/auth/post-signup-verify-email',
  AUTH_FORGOT_PASSWORD = '/auth/forgot-password',
  AUTH_RESET_PASSWORD = '/auth/reset-password',
  ORG_JOIN_ORGNIZATION = '/org/join-organization',
  CHATBOT_IFRAME = '/chatbot-iframe',
  NOT_FOUND = '/404',
}

export enum protectedRoutes {
  YOUTUBE_COMPANION = '/en/youtube-companion',
  CREATE_CHAT = '/en/create-chat',
  ORG_CREATE_ORGNIZATION = '/org/create-organization',
  DASHBOARD = '/dashboard',
  CHATBOT = '/en/chatbot',
  CREATE_CHATBOT = '/create-chatbot',
  UPDATE_CHATBOT = '/update-chatbot',
  YOUR_BOTS = '/your-bots',
  MANAGE_USERS = '/manage-users',
  ORGANIZATION = '/org',
  PROFILE_SETTINGS = '/profile-settings',
}

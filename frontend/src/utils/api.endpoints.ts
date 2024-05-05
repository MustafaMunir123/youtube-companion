export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const SEED_SERVICE_PATH =
  process.env.NODE_ENV === 'development'
    ? `${process.env.NEXT_PUBLIC_API_URL}/seed/v1`
    : 'http://localhost:8080/seed/v1';
export const AI_SERVICE_PATH = "https://4639-101-53-226-26.ngrok-free.app/api"
  // process.env.NODE_ENV === 'production'
  //   ? `${process.env.NEXT_PUBLIC_AI_SERVICE_URL}/api`
  //   : 'http://localhost:8000/api';

console.log('API_BASE_URL', API_BASE_URL, AI_SERVICE_PATH);

export enum apiPath {
// Auth
  MSIGN_IN = `/user/login/`,
  SIGN_UP = '/auth/signup/',
  USER_SIGN_UP = '/user/signup/',
  SIGN_OUT = '/user/signout/',
  RENEW_TOKEN = '/auth/renew-token',
  IS_AUTHENTICATED = '/auth/authenticate',

  CREATE_ORG = '/user/create-organization/',
  EDIT_ORG = '/user/edit-organization/',
  JOIN_ORG = '/user/join-organization/',
  VALIDATE_TENANT = '/user/validate-tenant/',
  DASHBOARD = '/dashboard',

  USER_CONFIGS = '/user/user-configs/',
  USER_UPDATE_CONFIGS = '/user/user-update-configs/',

  // Chatbot
  MCHAT_SESSION = '/search/chats',
  MINITIATE_CHAT = '/search/chats/initiate',
  START_SESSION = '/start-session/',
  MGET_CHATBOTS = '/search/chats/all',
  CHATBOT = '/chatbot/',
  MASK_PROMPT = '/prompt',
  TRAIN = '/train/',
  fetch_links = 'fetch-links/',
  FETCH_STATUS = 'fetch-status/',
  EDIT_SESSION = 'edit-session/',
  CHAT_ANALYSIS = 'chat-analysis/',
  PRE_SIGNED_URL = 'pre-signed-url/',
  UNEXPECTED_RESPONSES_LIST = 'list-unexpected-responses-files/',
  download = 'download/',

  //Workflow
  WORKFLOWS = '/workflows/',
  WORKFLOW = '/workflow/',

  //Chat History
  CHAT = '/chat/',
  CONVERSATIONS = '/conversations/',
  messages = '/messages/',
  message = '/message/',
  CHAT_APPEARANCE = '/get-chatbot-appearance/',
  UPDATE_APPEARANCE = '/edit-chatbot-appearance/',
  FILTER_CONV = '/filter-conv/',
  CHAT_SUGGESTIONS = '/generate-prompt_suggestion/',

  //Subscriptions
  SUBSCRIPTIONS = '/subscriptions/quota',
  ORG_SUBSCRIPTION = '/subscription/quota/',

  //AddOns
  ADD_ONS = '/subscriptions/addon',
  ORG_ADDONS = '/subscription/addon/',

  //Roles
  ROLES = '/user/roles/',

  //User Invite
  INVITE_USER = '/user/user-invite/',
  USERS = '/users/',
  ME = '/user/me',
  USER = '/user/',
  VERIFY_TOKEN = '/user/verify-token/',
  ORG_CONVERSATIONS = '/user/get-all-conversation-organization/',
  ORG_CHATBOTS_CHARACTERS = '/user/get-char-per-bot/',

  // Permissions
  PERMISSIONS = '/user/get-rbac-permissions/',

  // goole auth
  GOOGLE_AUTH = '/auth/google',
}

export const publicApiEndpoints: string[] = [
  apiPath.MSIGN_IN,
  apiPath.SIGN_UP,
  apiPath.SIGN_OUT,
  apiPath.RENEW_TOKEN,
];

import { CONVERT_TO_MB, PAYLOAD_CHAT_HISTORY_LENGTH } from './constants';

import { ChatRole, IPromptAndAnswer, MessageObject, RoleAndContent } from '@/types';

export interface ICalculateTotalFileSize {
  files: File[];
  uploadedFilesSize?: number;
}

type IFetchedUrls = {
  url: string;
  size: Blob;
};

/**
 * Calculate size of Total files in MB
 */
export const calculateTotalFileSize = ({
  files,
  uploadedFilesSize = 0,
}: ICalculateTotalFileSize) => {
  const fileSzie = files.reduce((acc, file) => acc + file.size, uploadedFilesSize) / CONVERT_TO_MB;
  return fileSzie.toFixed(2);
};

/**
 * Calculate individual file size in MB
 */
export const calculateFileSize = (size: number) => (size / CONVERT_TO_MB).toFixed(2);

// Modify the messages to match the payload format
const modifyMessages = (
  latestTenMessages: IPromptAndAnswer[],
  desiredKeys: (keyof RoleAndContent)[],
): RoleAndContent[] =>
  latestTenMessages.map((obj) => {
    const modifiedObj: RoleAndContent = { content: '', role: ChatRole.User };

    desiredKeys.forEach((key) => {
      modifiedObj[key] = obj[key] as ChatRole;
    });

    return modifiedObj;
  });

/**
 * Get Chat History for Payload from Desired Keys
 */
export const getChatHistory = (
  data: MessageObject,
  desiredKeys: (keyof RoleAndContent)[],
): RoleAndContent[] => {
  let latestTenMessages = data.messages;
  if (data.messages.length > PAYLOAD_CHAT_HISTORY_LENGTH) {
    latestTenMessages = data.messages.slice(-PAYLOAD_CHAT_HISTORY_LENGTH);
  }
  // Modify the messages to match the payload format
  const modifiedArray = modifyMessages(latestTenMessages, desiredKeys);
  return modifiedArray;
};

export const isObjectEmpty = (objectName: Record<string, any>) => {
  if (objectName === null || objectName === undefined) {
    return true;
  }
  return Object?.keys(objectName).length === 0;
};

export const isLocalStorageAvailable = () => {
  let test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getCharCount(prevUrlsObject: IFetchedUrls[], urlsObject: IFetchedUrls[]) {
  const prevData = new Set(prevUrlsObject);
  let count = 0;
  urlsObject.forEach((item) => {
    if (!prevData.has(item)) {
      count += Number(item.size);
    }
  });
  return count;
}

export const getFormattedDateString = (date: number | Date | string) => {
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export function getFormatMessageTimestamp(timestamp?: string | null): string | void {
  if (timestamp) {
    const dateObject = new Date(timestamp);
    return dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

export function sortDesc(data: any) {
  return data?.sort((a: any, b: any) => {
    const dateA = new Date(a.last_message_timestamp ?? a.created_at);
    const dateB = new Date(b.last_message_timestamp ?? b.created_at);
    return dateB.getTime() - dateA.getTime();
  });
}

export const formatNumber = (n: number) => {
  if (n < 1e6) return n;
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + ' million(s)';
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + ' billion(s)';
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + ' trillion(s)';
};

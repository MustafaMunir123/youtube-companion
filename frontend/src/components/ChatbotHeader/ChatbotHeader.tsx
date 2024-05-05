'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { useRouter } from 'next/navigation';

import { orgInfo } from '@/atoms/auth.atom';
import { botNameAtom } from '@/atoms/chat.atoms';
import { useConfirm } from '@/hooks/useConfirm/useConfirm';
import { useGetChatDetails } from '@/services/chatbot/chatbot.service';
import { useDeleteBot } from '@/services/chatbot/chatbot.service';
import { HeaderSkeleton, PageHeader } from '@/ui-components';
import { getFormattedDateString } from '@/utils/helpers';
import { protectedRoutes } from '@/utils/routes';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/outline';
import { HttpStatusCode } from 'axios';
import { useAtom, useAtomValue } from 'jotai';

import { useI18n } from '@/i18n/client';

export const ChatbotHeader = ({ lng, chat_id }: { lng: string; chat_id: string }) => {
  const t = useI18n();
  const { replace } = useRouter();
  const confirm = useConfirm();

  const orgDetails = useAtomValue(orgInfo);

  const { data, isFetching, error } = useGetChatDetails(chat_id);
  const deleteBot = useDeleteBot();
  const [botName, setBotName] = useAtom(botNameAtom(chat_id));


  useEffect(() => {
    setBotName(data?.data?.chat_title);
  }, [data?.data]);

  if (isFetching) {
    return <HeaderSkeleton />;
  }

  if (error) {
    toast.error('Error occured while fetching bot');
    replace(protectedRoutes.YOUTUBE_COMPANION);
  }

  return (
    <>
      {/* Page Header */}
      <PageHeader
        chatId={chat_id}
        title={data?.data?.chat_title}
        url={data?.data?.url}
        status={data?.data?.status}
        is_playlist={data?.data?.is_playlist}
      />
    </>
  );
};

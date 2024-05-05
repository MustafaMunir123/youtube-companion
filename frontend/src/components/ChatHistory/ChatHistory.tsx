'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { botNameAtom } from '@/atoms/chat.atoms';
import {
  useGetInfiniteAllConversations,
  useGetInfiniteFilteredConversations,
  useUpdateSessionName,
} from '@/services/chat/chat.service';
import { useStartSession } from '@/services/chatbot/chatbot.service';
import { Button } from '@/ui-components';
import { LoadingSpinner } from '@/ui-components/LoadingSpinner/LoadingSpinner';
import { EFilterOptions } from '@/utils/constants';
import { sortDesc } from '@/utils/helpers';
import { FunnelIcon, ChevronLeftIcon } from '@heroicons/react/20/solid';
import { ArrowPathIcon, FunnelIcon as FunnelOutline } from '@heroicons/react/24/outline';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';

import { IChatHistory, ISelectedFilters } from './ChatHistory.types';

import { useI18n } from '@/i18n/client';

import { PreviousChatComponentProps } from '@/types';
import { YoutubeEmbedding } from '../YoutubeEmbedding/YoutubeEmbedding';
import { PreviousChat } from '../PreviousChat/PreviousChat';

export const ChatHistory = (props: IChatHistory) => {
  const { bot_id } = props;
  const { mutate: mutateSession } = useStartSession();
  const [botName] = useAtom(botNameAtom(bot_id));

  const t = useI18n();
  const queryClient = useQueryClient();
  const [previousChatComponentProps, setPreviousChatComponentProps] =
    useState<PreviousChatComponentProps>({
      sessionId: '',
      botName: '',
      isMarkedConversation: false,
      isReaded: 0,
      name: '',
      created_at: '',
    });
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [sessionTopInView, setSessionTopInView] = useState<boolean>(false);
  const defaultSessionQuery = `interfaces=${EFilterOptions.ALL}&status=${EFilterOptions.ALL}`;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState<string>(defaultSessionQuery);
  const [ytPLayerConfig, setYtPLayerConfig] = useState<{yt_id: string, time: string}>({yt_id: '', time: ''});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const {
    data: resdata,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
  } = useGetInfiniteAllConversations(bot_id);


  useEffect(() => {
    if (sessionTopInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [sessionTopInView]);

  const UpdateSession = useUpdateSessionName();

  const handleRefreshChatHistory = async () => {
    setPreviousChatComponentProps((previousChatComponentProps) => ({
      ...previousChatComponentProps,
      sessionId: '',
      isReaded: 0,
    }));
    setIsRefresh(true);
    await refetch();
    setIsRefresh(false);
    refetchConversation();
    setIsSidebarOpen(false);
  };


  const refetchConversation = async () => {
    const [firstConversation] = sortDesc(resdata?.pages[0].data?.results) || [];
    if (!previousChatComponentProps.sessionId && firstConversation) {
      const { id, chatbot, is_starred, unread_messages, feedback_status, name, created_at } =
        firstConversation;
    }
  };


  useEffect(() => {
    refetchConversation();
    const newData = resdata?.pages?.map((page) => page?.data?.results).flat();
    if (!newData?.length) {
      setPreviousChatComponentProps((previousChatComponentProps) => ({
        ...previousChatComponentProps,
        sessionId: '',
        isReaded: 0,
      }));
    }
  }, [resdata]);

  useEffect(() => {
    setPreviousChatComponentProps((previousChatComponentProps) => ({
      ...previousChatComponentProps,
      sessionId: '',
      isReaded: 0,
    }));
  }, [botName]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner spinnerSize="lg" />
      </div>
    );
  }

  return (
    <>
      {/* All Previous Conversations */}
      <div className={`bottom-0 h-full`} ref={scrollRef}>
        <div className="h-[84vh] flex flex-col tablet:flex-row gap-x-3 laptop:gap-x-8">
          <PreviousChat
              lng={bot_id}
              bot_id={bot_id}
              isSidebarOpen={isSidebarOpen}
              ytPLayerConfig={ytPLayerConfig}
              setYtPLayerConfig={setYtPLayerConfig}
            />
          <div
            className={`w-full tablet:w-full bg-white rounded-md border overflow-x-hidden ${
              !isSidebarOpen ? 'hidden tablet:block' : ''
            }`}
          >
            <YoutubeEmbedding yt_id={ytPLayerConfig.yt_id} start_time={ytPLayerConfig.time}/>
          </div>

          {!isSidebarOpen ? (
            <div className="mb-2.5 tablet:hidden">
              <ChevronLeftIcon onClick={() => setIsSidebarOpen(true)} className="h-7 w-7" />
            </div>
          ) : null}

        </div>
      </div>
    </>
  );
};

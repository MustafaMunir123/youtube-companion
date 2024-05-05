'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { cookies } from 'next/dist/client/components/headers';
import { useSearchParams } from 'next/navigation';

import { orgInfo, userConfigs } from '@/atoms/auth.atom';
import { botNameAtom, botSessionAtom } from '@/atoms/chat.atoms';
import { CharacterCountProvider } from '@/context/CharacterCountContext/CharacterCountContext';
import { RawCharacterCountProvider } from '@/context/CharacterCountContext/RawCharacterCountContext';
import { useStartSession } from '@/services/chatbot/chatbot.service';
import { Button } from '@/ui-components';
import { AddOns } from '@/utils/constants';
import { protectedRoutes } from '@/utils/routes';
import {
  ChatBubbleBottomCenterIcon,
  PaintBrushIcon,
  Cog6ToothIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';
import { RectangleGroupIcon } from '@heroicons/react/24/outline';
import { useAtom, useAtomValue } from 'jotai';
import { ChatbotTabEnum, ChatbotTabType } from './ChatbotTabs.types';

import { useI18n } from '@/i18n/client';
import { ChatHistory } from '../ChatHistory/ChatHistory';

export const ChatbotTabs = ({
  lng,
  bot_id,
}: {
  lng: string;
  bot_id: string;
}) => {
  const t = useI18n();
  const [selectedTab, setSelectedTab] = useState<ChatbotTabType>(ChatbotTabEnum.CHAT);
  const [botSessionsAtom, setBotSessionsAtom] = useAtom(botSessionAtom(bot_id));
  const [botName, setBotName] = useAtom(botNameAtom(bot_id));
  const searchParams = useSearchParams();
  const docName = searchParams.get('doc_name');
  const userConfig = useAtomValue(userConfigs);
  const orgDetails = useAtomValue(orgInfo);
  const [appearanceSubscrbied, setAppearanceSubscribed] = useState(false);

  useEffect(() => {
    if (docName) {
      setSelectedTab(ChatbotTabEnum.SETTINGS);
    }
  }, [docName]);

  useEffect(() => {
    const index = userConfig?.feature_list?.findIndex(
      (obj: { name: string }) => obj.name === AddOns.APPEARANCE,
    );
    if (index > -1 && userConfig?.feature_list[index].is_active) {
      setAppearanceSubscribed(true);
    }
  }, [userConfig]);

  const resetTab = (tab: ChatbotTabType) => {
    setSelectedTab(tab);
  };

  return (
    <>
      <ChatHistory bot_id={bot_id} />
    </>
  );
};

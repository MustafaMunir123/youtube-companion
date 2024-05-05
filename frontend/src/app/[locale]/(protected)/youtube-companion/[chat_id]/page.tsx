'use client';

import { ChatbotHeader, ChatbotTabs } from '@/components';

export default function Page({ params }: { params: { locale: string; chat_id: string } }) {
  return (
    <>
      <ChatbotHeader lng={params.locale} chat_id={params.chat_id} />
      <ChatbotTabs lng={params.locale} bot_id={params.chat_id} />
    </>
  );
}

import { Chat } from '@/components';

export default function Page({
  params,
}: {
  params: { lng: string; org_id: string; bot_id: string };
}) {
  return (
    <main className="flex flex-col gap-y-6 flex-1 bg-content-main bg-no-repeat bg-cover relative h-screen">
      <Chat
        lng={params.lng}
        orgId={params.org_id}
        bot_id={params.bot_id}
        customStyle="w-[100%]"
        postionRight="right-[28px]"
        isChatBubble={true}
      />
    </main>
  );
}

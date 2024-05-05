'use client';

import { CustomFlowbiteTheme, Tabs } from 'flowbite-react';

// import BotsDataTable from '@/components/BotsDataTable/BotsDataTable';
// import { tabTheme } from '@/components/Organization/custom.themes';

export const tabTheme: CustomFlowbiteTheme['tab'] = {
  tablist: {
    tabitem: {
      base: 'flex items-center justify-center pb-2 pt-4 px-8 rounded-t-lg text-md font-semibold first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 focus:outline-none',
      styles: {
        underline: {
          active: {
            on: 'text-primary-500 rounded-t-lg border-b-2 border-primary-500 active',
          },
        },
      },
    },
  },
};

export const MyBots = (lng: { lng: string }) => {

  return (
    <>
      <Tabs.Group theme={tabTheme} style="underline">
        <Tabs.Item active title={'activated'}>
          <div className="flex w-full flex-col border border-gray-200 rounded-md p-6 bg-white shadow-sm gap-y-6">
            {/* <BotsDataTable isActiveBots={true} /> */}
          </div>
        </Tabs.Item>
        <Tabs.Item active title={'deactivated'}>
          <div className="flex w-full flex-col border border-gray-200 rounded-md p-6 bg-white shadow-sm gap-y-6">
            {/* <BotsDataTable isActiveBots={false} /> */}
          </div>
        </Tabs.Item>
      </Tabs.Group>
    </>
  );
};

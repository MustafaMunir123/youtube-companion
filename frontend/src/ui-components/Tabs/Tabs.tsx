import React, { ReactSVGElement, useEffect, useState } from 'react';

import { ChatbotTabEnum } from '@/components/ChatbotTabs/ChatbotTabs.types';

import { Button } from '../Button/Button';
import { ITabs, ProfileSettingTabEnum } from './Tabs.types';

export const Tabs = (tabData: ITabs<ProfileSettingTabEnum | ChatbotTabEnum>) => {
  const { getSelectedTab, tabItemArray } = tabData;
  const [selectedTab, setSelectedTab] = useState(tabItemArray[0].value);

  const selectTabHandler = (val: typeof selectedTab) => {
    setSelectedTab(val);
    getSelectedTab(val);
  };

  return (
    <div className="flex items-center w-full laptop:w-1/2 bg-gray-50 border border-gray-200 p-1 rounded-md gap-x-2">
      {tabItemArray.map((data, index) => {
        return (
          <Button
            key={data.value + index}
            data-testid="data-chat"
            size="md"
            className={`${
              selectedTab === data.value
                ? 'bg-primary-500 border-primary-500 text-white'
                : 'bg-transparent border-transparent'
            }`}
            onClick={() => selectTabHandler(data.value)}
          >
            {data.icon}
            <span className="font-regular">{data.title}</span>
          </Button>
        );
      })}
    </div>
  );
};

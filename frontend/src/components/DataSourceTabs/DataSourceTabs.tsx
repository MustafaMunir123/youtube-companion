'use client';

import { useEffect } from 'react';

import { Button } from '@/ui-components';
import { ArrowUpTrayIcon, GlobeAltIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

import { PlainTextInput } from '../PlainTextInput/PlainTextInput';
import { WebsiteCrawling } from '../WebsiteCrawling/WebsiteCrawling';
import { IDataSourceTabsProps, Tabs } from './DataSourceTabs.types';

import { useI18n } from '@/i18n/client';

export const DataSourceTabs = (props: IDataSourceTabsProps) => {
  const {
    selectedTab,
    setSelectedTab,
    functionSetSelectedCrawledLinks,
    setErrorMsg,
    errorMsg,
    register,
    errors,
    disableCreateBot,
    setFetchPeriod,
    selectedCrawlingLinks,
    websiteCrawlingTabErrorMsg,
    setWebsiteCrawlingTabErrorMsg,
    customStyle,
  } = props;

  const { DataSourcelist, handleDeleteDataSource, fetchPeriod } = props.fromUpdateForm || {
    DataSourcelist: [],
    handleDeleteDataSource: () => {},
    fetchPeriod: '',
    heading: '',
  };

  const t = useI18n();

  const tabLabels = {
    [Tabs.WEBSITE_CRAWLING]: t('url'),
  };

  return (
    <>
      <div className="flex justify-center tablet:justify-normal items-center w-full bg-gray-50 border border-gray-200 p-1 rounded-md gap-x-0 tablet:gap-x-2">
        {Object.values(Tabs).map((tab) => (
          <Button
            key={tab}
            type="button"
            size="md"
            data-testid={`data-${tabLabels[tab].toLocaleLowerCase().replace(' ', '-')}`}
            className={`${
              selectedTab === tab
                ? 'border-primary-500 border-t-0 border-l-0 border-r-0 border-b-1 rounded-none border-2'
                : 'bg-transparent border-transparent'
            }`}
            onClick={() => {
              setSelectedTab(tab);
            }}
          >
            {tab === Tabs.WEBSITE_CRAWLING && (
              <GlobeAltIcon className="w-4 tablet:w-5 h-4 tablet:h-5 mr-1" />
            )}
            <span className="font-regular">
              <span className="font-regular normal-case">{tabLabels[tab]}</span>
            </span>
          </Button>
        ))}
      </div>
      <WebsiteCrawling
        display={selectedTab === Tabs.WEBSITE_CRAWLING}
        functionSetSelectedCrawledLinks={functionSetSelectedCrawledLinks}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
        fromUpdateForm={{ DataSourcelist, handleDeleteDataSource, fetchPeriod }}
        disableCreateBot={disableCreateBot}
        setFetchPeriod={setFetchPeriod}
        selectedCrawlingLinks={selectedCrawlingLinks}
        websiteCrawlingTabErrorMsg={websiteCrawlingTabErrorMsg}
        setWebsiteCrawlingTabErrorMsg={setWebsiteCrawlingTabErrorMsg}
        customStyle={customStyle}
      />
    </>
  );
};

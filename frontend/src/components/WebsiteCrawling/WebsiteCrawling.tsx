'use client';

import { ChangeEvent, SyntheticEvent, useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';

import { orgInfo, userConfigs } from '@/atoms/auth.atom';
import { useCharacterCount } from '@/context/CharacterCountContext/CharacterCountContext';
import { EActions, ESubjects } from '@/rbac/abilities/ability.enum';
import useAbility from '@/rbac/abilities/useAbility';
import { useGetCrawlingUrls } from '@/services/chatbot/chatbot.service';
import {
  Button,
  CharactersCounter,
  Input,
  CustomDropdown,
  DropdownOptionType,
} from '@/ui-components';
import Table from '@/ui-components/Table/Table';
import { IColumn } from '@/ui-components/Table/Table.type';
import { AddOns, DataSourceType, DEFAULT_CRAWLING_SCHEDULE } from '@/utils/constants';
import { getCharCount } from '@/utils/helpers';
import { TrashIcon, ClipboardDocumentListIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Progress } from 'flowbite-react';
import { useAtomValue } from 'jotai';

import './WebsiteCrawling.Progressbar.Style.css';
import { FetchedLinks, WebcrawlingResponse, WebsiteCrawlingProps } from './WebsiteCrawling.types';
import { useWebsiteCrawlingSchema } from './useWebsiteCrawling.Schema';

import { useI18n } from '@/i18n/client';

export const WebsiteCrawling = (props: WebsiteCrawlingProps) => {
  const {
    display,
    functionSetSelectedCrawledLinks,
    errorMsg,
    setErrorMsg,
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
  };

  const crawlingSchedules = [
    { label: DEFAULT_CRAWLING_SCHEDULE, value: DEFAULT_CRAWLING_SCHEDULE },
  ];

  const { characterCount, updateCharacterCount, decreamentCharacterCount } = useCharacterCount();

  const [selectedCrawlingUrls, setSelectedCrawlingUrls] = useState<FetchedLinks[]>([]);

  useEffect(() => {
    if (!selectedCrawlingLinks?.length) {
      setSelectedCrawlingUrls([]);
    }
  }, [selectedCrawlingLinks]);

  const t = useI18n();
  const ability = useAbility();
  const { websiteCrawlingSchema } = useWebsiteCrawlingSchema();
  const [selectedUrl, setSelectedUrl] = useState<string>();
  const [url, setUrl] = useState('');
  const userConfig = useAtomValue(userConfigs);
  const [crawlingSubscribed, setCrawlingSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const defaultRandomValue = Math.floor(Math.random() * 9) + 2; // generate random value between 1 to 10
  const [progress, setProgress] = useState(defaultRandomValue);
  const ref = useRef(false);

  userConfig?.fetch_periods?.map((fetchPeriod: string) => {
    crawlingSchedules.push({ label: fetchPeriod, value: fetchPeriod });
  });

  const { data, refetch, isFetched, isFetching } = useGetCrawlingUrls(url);

  useEffect(() => {
    const featureindex = userConfig?.feature_list?.findIndex(
      (obj: { name: string }) => obj.name === AddOns.AUTOMATED_WEBSITE_CRAWLING,
    );
    if (featureindex > -1 && userConfig?.feature_list[featureindex]?.is_active) {
      setCrawlingSubscribed(true);
    }
  }, [userConfig]);

  const getAllcrawlingUrlsCharacterCount = (crawlingUrls: FetchedLinks[]) => {
    return crawlingUrls.reduce((acc, item) => {
      return acc + Number(item.size);
    }, 0);
  };

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      decodeURI(event.target.value) !== event.target.value
        ? setUrl(event.target.value)
        : setUrl(encodeURI(event.target.value));
    } catch {
      setUrl(event.target.value);
    }

    if (!!websiteCrawlingTabErrorMsg && !event.target.value.trim()) {
      setWebsiteCrawlingTabErrorMsg('');
    }
  };
  const handleFetchLinks = async () => {
    setWebsiteCrawlingTabErrorMsg('');
    setIsLoading(true);
    fetchData();
    setProgress(2);
    ref.current = false;
    try {
      disableCreateBot(true);
      await websiteCrawlingSchema.validate({ url });
      setWebsiteCrawlingTabErrorMsg('');
      const response = (await refetch()) as WebcrawlingResponse;
      if (response?.data) {
        const updatedCrawledLinks = Array.from(
          new Set([...selectedCrawlingUrls, ...response?.data?.fetchedLinks]),
        ) as FetchedLinks[];
        const charCount = getCharCount(selectedCrawlingUrls, response?.data?.fetchedLinks);
        setSelectedCrawlingUrls(updatedCrawledLinks as FetchedLinks[]);
        functionSetSelectedCrawledLinks(updatedCrawledLinks as FetchedLinks[]);
        updateCharacterCount(charCount);
        ref.current = true;
        setTimeout(() => {
          setIsLoading(false);
          setProgress(2);
          ref.current = false;
        }, 1000);
      }
      if (response?.error) {
        toast.error(response?.error?.response?.data?.message as string);
        setIsLoading(false);
        setProgress(2);
        ref.current = false;
      }
    } catch (error: any) {
      setIsLoading(false);
      setProgress(2);
      ref.current = false;
      setWebsiteCrawlingTabErrorMsg(error.message);
    } finally {
      disableCreateBot(false);
    }
  };
  const fetchData = () => {
    const firstRandomValue = Math.floor(Math.random() * 5) + 80; // generate random value between 80 to 85
    const firstRandomNumberAfterMinus = firstRandomValue - defaultRandomValue;
    const secondRandomNumber = Math.floor(Math.random() * 5) + 92; // generate random value between 92 to 97
    const timeOutValue = 210000 / (100 - firstRandomNumberAfterMinus);
    const intervalTime = 60000 / firstRandomNumberAfterMinus;
    const intervalId = setInterval(() => {
      setProgress((prevProgress: number) => {
        if (prevProgress < 100) {
          if (ref.current) {
            return 100;
          } else {
            if (prevProgress < firstRandomNumberAfterMinus) {
              return (prevProgress += 1);
            } else if (prevProgress < secondRandomNumber) {
              setTimeout(() => {
                if (!ref.current) {
                  setProgress((prevProgress += 1));
                } else {
                  return 100;
                }
              }, timeOutValue);
            } else {
              return prevProgress;
            }
          }
        } else {
          clearInterval(intervalId);
        }
        return prevProgress; // Return the current progress if it's already 100 or greater
      });
    }, intervalTime);
  };
  const handleDeletAllCrawlingUrls = () => {
    const characters = getAllcrawlingUrlsCharacterCount(selectedCrawlingUrls);
    decreamentCharacterCount(characters);
    setSelectedCrawlingUrls([]);
    functionSetSelectedCrawledLinks([]);
    setIsLoading(false);
    setProgress(2);
    ref.current = false;
  };

  // new crawling table functionality
  const onCopyUrl = async (rowData: FetchedLinks) => {
    setSelectedUrl(rowData.url);
    try {
      await navigator.clipboard.writeText(decodeURIComponent(decodeURIComponent(rowData.url)));
    } catch (error: any) {
      console.error('Clipboard copy failed:', error);
    }
  };

  const onDeleteUrl = (rowData: FetchedLinks) => {
    // Remove the selected URL from the state and create an updated array
    const updatedCrawledLinks = selectedCrawlingUrls.filter((item) => item.url !== rowData.url);
    setSelectedCrawlingUrls(updatedCrawledLinks as FetchedLinks[]);
    // Pass the updatedCrawledLinks to a function for further processing or updates
    functionSetSelectedCrawledLinks(updatedCrawledLinks as FetchedLinks[]);
    // Decrement the character count
    decreamentCharacterCount(Number(rowData.size));
  };

  const urlFormatter = (rowData: FetchedLinks) => {
    const url = rowData?.url || rowData?.link;
    return (
      <div
        className="flex flex-col justify-center gap-y-1"
        title={url && decodeURIComponent(decodeURIComponent(url))}
      >
        <p>{url && decodeURIComponent(decodeURIComponent(url))}</p>
        {alreadySelectedUrls?.find((item: any) => item.link === rowData.url) && (
          <div className="text-xs font-semibold text-danger-500">{t('already_trained')}</div>
        )}
      </div>
    );
  };

  const actionsFormatter = (rowData: FetchedLinks) => {
    return (
      <>
        <div className="flex gap-x-2">
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            className="!px-0 w-[32px] h-[32px] group hover:bg-primary-700 hover:text-white"
            onClick={() => onCopyUrl(rowData)}
          >
            {rowData.url === selectedUrl ? (
              <CheckCircleIcon className="w-5 h-5 text-green-500 group-hover:text-white" />
            ) : (
              <ClipboardDocumentListIcon className="w-5 h-5 text-gray-500 group-hover:text-white" />
            )}
          </Button>

          <Button
            type="button"
            variant="tertiary"
            size="sm"
            className="!px-0 w-[32px] h-[32px] group hover:bg-danger-500"
            onClick={() => onDeleteUrl(rowData)}
          >
            <TrashIcon className="w-5 h-5 text-gray-500 group-hover:text-white" />
          </Button>
        </div>
      </>
    );
  };

  const columns: IColumn[] = [
    { header: t('url'), accessor: 'url', cellFormatter: urlFormatter as any },
    { header: t('size'), accessor: 'size' },
  ];

  if (ability.can(EActions.UPDATE, ESubjects.BOTS)) {
    columns.push({ header: t('actions'), accessor: 'actions', cellFormatter: actionsFormatter });
  }

  const rowClick = (row: object) => {};

  // Already Selected Crawling Tables Functionality
  const alreadySelectedUrls = DataSourcelist?.filter((item) => item.type === DataSourceType.LINK);

  const onDeleteAlreadySelectedUrl = (rowData: any, index: number, e: SyntheticEvent) => {
    handleDeleteDataSource(index, rowData?.id!, rowData?.type!, rowData?.size!, e);
  };

  const onCopyAlreadySelectedUrl = async (rowData: any) => {
    setSelectedUrl(rowData.link);
    try {
      await navigator.clipboard.writeText(decodeURIComponent(decodeURIComponent(rowData.link)));
    } catch (error: any) {
      console.error('Clipboard copy failed:', error);
    }
  };

  const alreadySelectedUrlsActionFormatter = (rowData: any, index?: number) => {
    return (
      <>
        <div className="flex gap-x-2">
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            className="!px-0 w-[32px] h-[32px] group hover:bg-primary-700 hover:text-white"
            onClick={() => onCopyAlreadySelectedUrl(rowData)}
          >
            {rowData.link === selectedUrl ? (
              <CheckCircleIcon className="w-5 h-5 text-green-500 group-hover:text-white" />
            ) : (
              <ClipboardDocumentListIcon className="w-5 h-5 text-gray-500 group-hover:text-white" />
            )}
          </Button>

          <Button
            type="button"
            variant="tertiary"
            size="sm"
            className="!px-0 w-[32px] h-[32px] group hover:bg-danger-500"
            onClick={(e) => onDeleteAlreadySelectedUrl(rowData, index!, e)}
            data-testid="delete-link"
          >
            <TrashIcon className="w-5 h-5 text-gray-500 group-hover:text-white" />
          </Button>
        </div>
      </>
    );
  };

  const selectedCrawlingColumns: IColumn[] = [
    { header: t('url'), accessor: 'link', cellFormatter: urlFormatter as any },
    { header: t('size'), accessor: 'size' },
  ];

  if (ability.can(EActions.UPDATE, ESubjects.BOTS)) {
    selectedCrawlingColumns.push({
      header: t('actions'),
      accessor: 'actions',
      cellFormatter: alreadySelectedUrlsActionFormatter,
    });
  }

  // Todo : We will Create a Single Table Component for both lists (selectedCrawlingUrls and alreadySelectedUrls)

  return (
    <div className={`${!display && 'hidden'} flex flex-col w-full gap-y-2`}>
      <div className="flex flex-col gap-y-2">
        <div className="flex gap-x-2 laptop:gap-x-4 flex-col tablet:flex-row">
          <div className={`flex-1 ${customStyle ?? 'max-w-[520px]'}`}>
            <Input
              type="text"
              variant="primary"
              label={t('url')}
              placeholder={t('crawling_description')}
              helpText={t(`crawling_help_text`, { url: url })}
              fullWidth
              required
              error={!!websiteCrawlingTabErrorMsg}
              errorMessage={websiteCrawlingTabErrorMsg}
              onChange={handleUrlChange}
              data-testid="url-input-link"
            />
          </div>
          <div className="mt-7">
            <Button
              type="button"
              disabled={url === '' || isLoading}
              variant="primary"
              fullWidth
              onClick={handleFetchLinks}
              isLoading={isFetching}
              className="whitespace-nowrap"
              data-testid="fetch-url-train-link"
            >
              <span className="text-sm normal-case">{t('fetch_link')}</span>
            </Button>
          </div>
        </div>
        {isLoading && (
          <>
            <Progress
              progress={progress}
              size="sm"
              color="indigo"
              className="!bg-white !text-transparent"
            />
            <div className="flex justify-center text-xs">
              <p>{progress}%</p>
            </div>
          </>
        )}
      </div>
      {!!errorMsg && <p className="text-sm font-regular text-danger-300">{errorMsg}</p>}
      {(!!alreadySelectedUrls?.length ||
        (selectedCrawlingUrls && selectedCrawlingUrls.length > 0 && !isLoading)) && (
        <>
          {crawlingSubscribed && (
            <div className="my-2">
              <CustomDropdown
                data-testid="crawling-schedule"
                dropdownOptions={crawlingSchedules}
                handleClick={(option: DropdownOptionType) => {
                  setFetchPeriod(option.value as string);
                }}
                label={t('fetch_period')}
                currentValue={
                  userConfig?.fetch_periods?.includes(fetchPeriod)
                    ? fetchPeriod
                    : DEFAULT_CRAWLING_SCHEDULE
                }
              />
            </div>
          )}
        </>
      )}

      {/* // tables */}
      {/* Todo: We will add a ProgressBar Component in Feature here */}
      {selectedCrawlingUrls && selectedCrawlingUrls.length > 0 && !isLoading && (
        <>
          <div className="flex justify-between w-full">
            <h3 className="text-sm text-gray-700 normal-case">
              {t('links_found', { found: <strong>{selectedCrawlingUrls.length}</strong> })}
            </h3>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleDeletAllCrawlingUrls}
              data-testid="delete-all-links"
            >
              Delete all
            </Button>
          </div>
          <div className="w-full overflow-hidden border border-gray-200 rounded-md">
            <Table columns={columns} data={selectedCrawlingUrls} rowClick={rowClick} />
          </div>
        </>
      )}
      {!!alreadySelectedUrls?.length && (
        <>
          <div className="flex justify-between w-full text-sm font-semibold rtl:text-right ltr:text-left">
            <p>{t('already_trained_urls')}</p>
            <h3 className="text-sm text-gray-700">
              {t('links_found', { found: <strong>{alreadySelectedUrls.length}</strong> })}
            </h3>
          </div>
          <div className="w-full overflow-hidden border border-gray-200 rounded-md">
            <Table
              columns={selectedCrawlingColumns}
              data={alreadySelectedUrls}
              rowClick={rowClick}
            />
          </div>
        </>
      )}
    </div>
  );
};

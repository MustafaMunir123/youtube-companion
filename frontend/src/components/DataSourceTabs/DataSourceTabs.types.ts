import { FieldErrors } from 'react-hook-form';

import { FetchedLinks } from '../WebsiteCrawling/WebsiteCrawling.types';
import { SyntheticEvent } from 'react';

export interface IDataSourcesList {
  id?: string;
}

export interface IDataSourcesProps {
  DataSourcelist: IDataSourcesList[];
  handleDeleteDataSource: (
    index: number,
    dataSourceId: string,
    dataSourceType: string,
    characters: number,
    e: SyntheticEvent,
  ) => void;
  heading?: string;
}

export const Tabs = {
  // UPLOAD_FILES: 1,
  WEBSITE_CRAWLING: 2,
  // PLAIN_TEXT_INPUT: 3,
};

export interface IFromUpdaeteForm extends IDataSourcesProps {
  fetchPeriod?: string;
}

export interface IDataSourceTabsProps {
  errors: FieldErrors;
  selectedTab: number;
  setSelectedTab: (value: number) => void;
  functionSetSelectedCrawledLinks: (value: FetchedLinks[]) => void;
  setErrorMsg: (value: string) => void;
  fromUpdateForm?: IFromUpdaeteForm;
  disableCreateBot: (value: boolean) => void;
  setFetchPeriod: (value: string) => void;
  selectedCrawlingLinks?: FetchedLinks[];
  websiteCrawlingTabErrorMsg: string;
  setWebsiteCrawlingTabErrorMsg: (value: string) => void;
  customStyle?: string;
  // ADDED BY ME
  errorMsg?: string;
  register: any;
}

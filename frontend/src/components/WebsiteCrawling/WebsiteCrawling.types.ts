import { IFromUpdaeteForm } from '../DataSourceTabs/DataSourceTabs.types';

export type FetchedLinks = {
  url: string;
  size: Blob;
  link?: string;
};

export interface WebsiteCrawlingProps {
  display: boolean;
  functionSetSelectedCrawledLinks: (value: FetchedLinks[]) => void;
  errorMsg?: string;
  setErrorMsg: (value: string) => void;
  fromUpdateForm?: IFromUpdaeteForm;
  disableCreateBot: (value: boolean) => void;
  setFetchPeriod: (value: string) => void;
  selectedCrawlingLinks?: FetchedLinks[];
  websiteCrawlingTabErrorMsg: string;
  setWebsiteCrawlingTabErrorMsg: (value: string) => void;
  customStyle?: string;
}

export type WebcrawlingResponse = {
  data:
    | {
        fetchedLinks: FetchedLinks[];
      }
    | undefined;
  error?: {
    response?: {
      data?: {
        message?: string;
      };
    };
  };
};

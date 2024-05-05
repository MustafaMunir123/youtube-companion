import { ReactElement } from 'react';

export interface ITabItem<T> {
  title: string;
  value: T;
  icon: ReactElement;
}
export interface ITabs<T> {
  tabItemArray: ITabItem<T>[];
  getSelectedTab: (val: T) => void;
}

export enum ProfileSettingTabEnum {
  MY_ACCOUNT = 'MY_ACCOUNT',
  PASSWORD = 'PASSWORD',
}

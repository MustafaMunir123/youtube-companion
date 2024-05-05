'use client';

import { ChangeEventHandler } from 'react';

import { Search } from '@/ui-components/Search/Search';

interface ITableHeaderProps {
  setSearchValue?: (value: string) => void;
  lng?: string;
}

export const TableHeader = (props: ITableHeaderProps) => {
  const { setSearchValue } = props;

  const onChangeSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (setSearchValue) {
      setSearchValue(encodeURIComponent(e.target.value));
    }
  };

  const onSearchApplied = (searchValue: string) => {
    console.log(searchValue, 'searchValue');
  };

  return (
    <>
      <Search
        searchInput={''}
        onSearchApplied={onSearchApplied}
        onChangeSearch={onChangeSearch}
        lng={props.lng}
      />
    </>
  );
};

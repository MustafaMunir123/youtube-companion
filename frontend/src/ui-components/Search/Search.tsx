'use client';

import React, { useState } from 'react';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import { ISearch } from './Search.interface';

import { useI18n } from '@/i18n/client';

export const Search = (props: ISearch) => {
  const { onSearchApplied, onChangeSearch } = props;
  const t = useI18n();
  const [searchValue, setSearchValue] = useState('');

  const onSearchClicked = () => {
    onSearchApplied(searchValue);
  };

  // const { onSearchApplied } = props;
  return (
    <div className="relative w-full tablet:w-2/5 laptop:w-[370px]">
      <div
        className="absolute top-0 bottom-0 h-4 w-4 my-auto ltr:left-3 rtl:right-3"
        onClick={onSearchClicked}
      >
        <MagnifyingGlassIcon className="h-full w-full" />
      </div>
      <input
        type="text"
        placeholder={t('search')}
        onChange={onChangeSearch}
        className="w-full py-2 ltr:pl-8 rtl:pr-8 ltr:pr-4 rtl:pl-4 text-gray-500 rounded-md outline-none bg-gray-100 border border-gray-200 focus:bg-gray-100 focus:border-primary-500"
      />
    </div>
  );
};

import { ChangeEvent } from 'react';

export interface ISearch {
  searchInput: string;
  onSearchApplied: (search: string) => void;
  onChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  lng?: string;
}

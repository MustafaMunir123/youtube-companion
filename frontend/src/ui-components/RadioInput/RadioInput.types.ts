import { ComponentPropsWithoutRef } from 'react';

export interface IRadioInput extends ComponentPropsWithoutRef<'input'> {
  value: string;
  onChange: (event: any) => void;
  name: string;
  radioLabel?: string;
  radioDescription?: string;
}

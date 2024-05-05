'use client';

import { IRadioInput } from './RadioInput.types';

export const RadioInput = (props: IRadioInput) => {
  const { name, value, radioLabel, radioDescription, onChange, ...nativeRadioProps } = props;

  return (
    <div className={`flex items-start gap-x-2 justify-start w-full`}>
      <input
        id="radio-group"
        type="radio"
        value={value}
        name={name}
        onChange={onChange}
        className="mt-1 w-4 h-4 bg-gray-50 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        {...nativeRadioProps}
      ></input>
      <label htmlFor="radio-group" className={`text-sm font-semibold w-full tracking-wide`}>
        {radioLabel}
        <p className="text-xs font-regular text-gray-500">{radioDescription}</p>
      </label>
    </div>
  );
};

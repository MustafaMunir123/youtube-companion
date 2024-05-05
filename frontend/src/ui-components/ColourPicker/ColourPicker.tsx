import { UseFormSetValue } from 'react-hook-form';

import { Input } from '@/ui-components';
import { PaintBrushIcon } from '@heroicons/react/24/outline';

import { AppearanceFormValues } from '@/components/ChatAppearance/AppearanceForm/AppearanceForm.types';
import { UseFormInputReturnType } from '@/components/FormInput/FormInput.types';

export const ColourPicker = ({
  colourComponentProps,
  label,
  placeholder,
  id,
  setValue,
  isPrimaryColor,
}: {
  colourComponentProps: UseFormInputReturnType<string>;
  label: string;
  placeholder: string;
  id: keyof AppearanceFormValues;
  setValue: UseFormSetValue<AppearanceFormValues>;
  isPrimaryColor?: boolean;
}) => {
  return (
    <div className="flex flex-row w-full relative gap-x-4">
      <Input
        type="text"
        variant="primary"
        label={label}
        placeholder={placeholder}
        required
        fullWidth
        errorMessage={colourComponentProps.error}
        {...colourComponentProps}
        data-testid="colour-picker-text"
      />
      <div
        className="w-20 mt-7 rounded-md border relative"
        style={{ backgroundColor: colourComponentProps.value }}
      >
        <PaintBrushIcon
          className={`absolute left-4 top-3 w-6 h-6 ${isPrimaryColor && 'text-white'}`}
        />
        <input
          className="opacity-0 h-full w-full"
          id="colorPicker"
          type="color"
          data-testid="colour-picker"
          onInput={(e) => setValue(id, (e.target as HTMLInputElement).value)}
          value={colourComponentProps.value}
        />
      </div>
    </div>
  );
};

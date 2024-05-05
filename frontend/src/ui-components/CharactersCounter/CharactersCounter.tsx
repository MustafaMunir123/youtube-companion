'use client';

import { userInfo } from '@/atoms/auth.atom';
import { useCharacterCount } from '@/context/CharacterCountContext/CharacterCountContext';
import { useAtomValue } from 'jotai';

import { useI18n } from '@/i18n/client';

export const CharactersCounter = ({
  totalAllowedCharacters,
}: {
  totalAllowedCharacters: number;
}) => {
  const t = useI18n();
  const { characterCount } = useCharacterCount();

  return (
    <div className="flex justify-between w-full ">
      <span className="text-sm ml-auto">
        <span
          className={`${
            characterCount > totalAllowedCharacters ? 'text-danger-500' : ''
          } font-semibold`}
        >
          {`${t('total_detected_characters')} `}: &nbsp;
          {`${t('actual', { size: characterCount.toLocaleString('en-us') })} / `}
        </span>
        <span className="font-light">{`${t('allowed', {
          size: totalAllowedCharacters?.toLocaleString('en-us'),
        })} ${t('limit')} `}</span>
      </span>
    </div>
  );
};

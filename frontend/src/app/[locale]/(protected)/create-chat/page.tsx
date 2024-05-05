import { CharacterCountProvider } from '@/context/CharacterCountContext/CharacterCountContext';
import { RawCharacterCountProvider } from '@/context/CharacterCountContext/RawCharacterCountContext';

import { CreateChatForm } from '@/components';

import { LngParam, QParams } from '@/types';

export default function Page() {
  return (
    <>
      <CharacterCountProvider>
        <RawCharacterCountProvider>
          <CreateChatForm />
        </RawCharacterCountProvider>
      </CharacterCountProvider>
    </>
  );
}

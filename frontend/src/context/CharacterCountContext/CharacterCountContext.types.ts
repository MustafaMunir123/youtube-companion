export interface CharacterCountContextProps {
  characterCount: number;
  updateCharacterCount: (value: number) => void;
  decreamentCharacterCount: (value: number) => void;
  updateCharacterCountOnRetrain: (value: number) => void;
}

import { CreatebotFieldsFormValues } from '../CreateChatForm/CreateChatForm.types';

export type UpdateBotFieldsFormValues = Partial<CreatebotFieldsFormValues>;

export interface DeleteDataSources {
  id: string;
  type: string;
}

export interface SelectedFiles extends Partial<File> {
  selectedFiles: File;
  characterCount: number | string | undefined;
}

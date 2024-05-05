'use client';

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { orgInfo } from '@/atoms/auth.atom';
import {
  useGetChatDetails,
  useUpdateBot,
  useTrainChatbot,
} from '@/services/chatbot/chatbot.service';
import { Button, Input } from '@/ui-components';
import { DataSourceType, acceptedFiles } from '@/utils/constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Spinner } from 'flowbite-react';
import { useAtomValue } from 'jotai';

import { ChatbotTabEnum, ChatbotTabType } from '../ChatbotTabs/ChatbotTabs.types';
import { Tabs } from '../DataSourceTabs/DataSourceTabs.types';
import FormInput from '../FormInput/FormInput';
import { usePlainTextInputSchema } from '../PlainTextInput/usePlainTextInput.Schema';
import { FetchedLinks } from '../WebsiteCrawling/WebsiteCrawling.types';
import { DeleteDataSources, SelectedFiles, UpdateBotFieldsFormValues } from './General.type';
import { useUpdateBotFormSchema } from './useGeneralSchema';

import { useI18n } from '@/i18n/client';

export function General({
  lng,
  display,
  bot_id,
  resetTab,
  isSidebarOpen,
}: {
  lng: string;
  bot_id: string;
  display: boolean;
  resetTab: (tab: ChatbotTabType) => void;
  isSidebarOpen: boolean;
}) {
  const t = useI18n();
  const { updateBotFormSchema } = useUpdateBotFormSchema();
  const { push } = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDisableUpdateBot, setIsDisableUpdateBot] = useState(false);

  const orgDetails = useAtomValue(orgInfo);

  const updateChatbot = useUpdateBot();

  const {
    data: resData,
    isLoading: isloading,
    isSuccess,
    isError,
    error,
  } = useGetChatDetails(bot_id, orgDetails?.id);

  const formData = new FormData();

  const {
    control,
    handleSubmit,
    setValue,
    register,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm<UpdateBotFieldsFormValues>({
    resolver: yupResolver<UpdateBotFieldsFormValues>(updateBotFormSchema),
    defaultValues: {
      name: resData?.data?.name ?? '',
      description: resData?.data?.description ?? '',
      files: [],
      text: '',
    },
  });

  const watchName = watch('name');
  const watchDescription = watch('description');

  useEffect(() => {
    handleDisableUpdateBot(!watchName || !watchDescription);
  }, [watchName, watchDescription]);

  useEffect(() => {
    setValue('name', resData?.data?.name);
    setValue('description', resData?.data?.description);
  }, [resData]);

  const handleDisableUpdateBot = (value: boolean) => {
    setIsDisableUpdateBot(value);
  };

  const onSubmit: SubmitHandler<UpdateBotFieldsFormValues> = async (data) => {
    const createSubmissionPayloadFormData = (): FormData => {
      formData.append('name', data.name as string);
      formData.append('description', data.description as string);
      formData.append('organization_id', orgDetails?.id);

      return formData;
    };

    try {
      setIsLoading(true);
      const formData = createSubmissionPayloadFormData();
      const chatbot = await updateChatbot.mutateAsync({ data: formData, id: bot_id });
      if (chatbot?.data?.id) {
        toast.success(t('chatbot_updated'));
        resetTab(ChatbotTabEnum.CHAT);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col gap-2 h-full w-full ${!display ? 'hidden' : ''} ${
        display && isSidebarOpen ? 'hidden tablet:block' : ''
      }`}
    >
      <Card className="flex h-full overflow-wrap overflow-auto">
        <h3
          className="text-xl font-bold leading-none text-gray-900 shrink-0 dark:text-white"
          title={t('prompt_settings')}
        >
          {t('general')}
        </h3>
        <form
          encType="multipart/form-data"
          className="w-full h-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
          <div className="flex flex-col gap-y-4 items-center bg-white rounded-md shadow-sm w-full m-auto mt-6 p-6 border border-primary-400">
            {isloading ? (
              <Spinner aria-label="loading" size="md" color="purple" />
            ) : (
              <FormInput<string>
                control={control}
                names={['name', 'description']} // Pass an array of field names
                render={(inputPropsList) => {
                  // Destructuring the inputPropsList array
                  const [nameProps, descriptionProps] = inputPropsList;
                  return (
                    <>
                      <Input
                        type="text"
                        variant="primary"
                        label={t('name_your_bot')}
                        placeholder={t('type_name')}
                        required
                        fullWidth
                        errorMessage={nameProps.error}
                        data-testid="update-bot-name"
                        {...nameProps}
                      />
                      <Input
                        type="text"
                        variant="primary"
                        label={t('description')}
                        placeholder={t('bot_description')}
                        data-testid="update-bot-description"
                        required
                        fullWidth
                        errorMessage={descriptionProps.error}
                        {...descriptionProps}
                      />
                      <div className="flex flex-row ml-auto mb-2">
                        <Button
                          size="md"
                          variant="primary"
                          type="submit"
                          disabled={isDisableUpdateBot}
                          isLoading={isLoading}
                          data-testid="update-bot-button"
                        >
                          {t('update')}
                        </Button>
                      </div>
                    </>
                  );
                }}
              />
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

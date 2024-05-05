'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { useRouter } from 'next/navigation';

import {
  useCreateChatbot,
  useTrainChat,
  useTrainChatbot,
} from '@/services/chatbot/chatbot.service';
import { Input, PageHeader } from '@/ui-components';
import { DEFAULT_CRAWLING_SCHEDULE, DataSourceType, acceptedFiles, excelFiles } from '@/utils/constants';
import { protectedRoutes } from '@/utils/routes';
import { yupResolver } from '@hookform/resolvers/yup';

import { DataSourceTabs } from '../DataSourceTabs/DataSourceTabs';
import FormInput from '../FormInput/FormInput';
import { FetchedLinks } from '../WebsiteCrawling/WebsiteCrawling.types';
import { CreatebotFieldsFormValues } from './CreateChatForm.types';
import { useCreateBotFormSchema } from './useCreateChatFormSchema';

import { useI18n } from '@/i18n/client';

export const CreateChatForm = () => {
  const t = useI18n();
  const { createBotFormSchema } = useCreateBotFormSchema();
  const [errorMsg, setErrorMsg] = useState('');
  const [isDisableCreateBot, setIsDisableCreateBot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(t('create_train'));
  const [selectedCrawlingUrls, setSelectedCrawlingUrls] = useState<FetchedLinks[]>([]);
  const [fetchPeriod, setFetchPeriod] = useState<string>(DEFAULT_CRAWLING_SCHEDULE);
  const [websiteCrawlingTabErrorMsg, setWebsiteCrawlingTabErrorMsg] = useState('');

  const CreateChatbot = useCreateChatbot();
  const trainChatbot = useTrainChatbot();

  const TrainChat = useTrainChat()

  // const { data: orgSubscription } = useFetchOrgSubscriptions(orgDetails?.id);

  const [totalAllowedCharacters, setTotalAllowedCharacters] = useState<number>(
    1000000 as number,
  );

  const router = useRouter();

  const formData = new FormData();
  const dataSources: DataSourceType[] = [];
  const acceptedFormats = acceptedFiles.map((file) => file.format);

  const {
    control,
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreatebotFieldsFormValues>({
    resolver: yupResolver<CreatebotFieldsFormValues>(createBotFormSchema),
    defaultValues: {
      title: '',
      url: '',
    },
  });

  const functionSetSelectedCrawledLinks = (unSelectedcrawling: FetchedLinks[]) => {
    // set the selected crawling links to pass it to the payload
    setSelectedCrawlingUrls(unSelectedcrawling);
  };

  useEffect(() => {
    setTotalAllowedCharacters(1000000 as number);
  }, []);

  const watchName = watch('title');
  const watchDescription = watch('url');

  useEffect(() => {
    handleDisableCreateBot(!watchName || !watchDescription );
  }, [watchName, watchDescription]);


  // TODO: THIS IS FORMDATA RIGHT NOW, MAKE IT JSON
  const onSubmit: SubmitHandler<CreatebotFieldsFormValues> = async (data) => {

    // const createSubmissionPayloadFormData = (): FormData => {
    //   formData.append('chat_title', data.title);
    //   // formData.append('description', data.description);
    //   // TODO: Add the url field in the API, may keep this multiple
    //   // formData.append('url', selectedCrawlingUrls.map((url) => url.url).join(',') || '');

    //   // if (fetchPeriod !== DEFAULT_CRAWLING_SCHEDULE && fetchPeriod) {
    //   //   formData.append('crawling_schedule', fetchPeriod);
    //   // }

    //   // if (data.text) {
    //   //   handlePlainText(data.text);
    //   // }
    //   // formData.append('data_source_type', JSON.stringify(dataSources));
    //   return formData;
    // };
    // Try Catch Bock Doing The Following Tasks:
    // 1. Validate Files
    // 2. Create Bot
    // 3. Train Bot
    // 4. Redirect to Chatbot Page
    try {
      setErrorMsg('');
      try {
        console.log("data in createchatform", data)
        const chatbot = await TrainChat.mutateAsync({chat_title: data.title, url: data.url});

        if (chatbot?.data?.id) {
          toast.success(t('chatbot_created'));
        }
      } catch (createBotError: any) {
        let errorMessage = '';
        if (
          createBotError?.response?.data?.message &&
          createBotError?.response?.data?.message.includes('Maximum chatbot limit reached')
        ) {
          errorMessage = t('maximum_chatbot_limit_reached');
        } else {
          errorMessage = createBotError?.response?.data?.message || t('not_found_error');
        }
        toast.error(errorMessage);
      }
    } catch (validationError: any) {
      setErrorMsg(validationError.message);
    } finally {
      setIsLoading(false);
      setLoadingText(t('create_train'));
    }
  };

  const handleDisableCreateBot = (value: boolean) => {
    setIsDisableCreateBot(value);
  };

  return (
    <>
      <form encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
        <PageHeader
          title={t('create_your_bot')}
          actionButton={{
            text: t('create_train'),
            type: 'submit',
            error: !!errorMsg || !!websiteCrawlingTabErrorMsg,
            isLoading: isLoading,
            disabled: isDisableCreateBot,
            onClick: handleSubmit(onSubmit)
          }}
        />
        <div className="flex flex-col gap-y-4 items-center bg-white rounded-md shadow-sm w-full max-w-[720px] m-auto mt-6 p-3 tablet:p-6 border border-gray-200">
          <FormInput<string>
            control={control}
            names={['title', 'url']} // Pass an array of field names
            render={(inputPropsList) => {
              // Destructuring the inputPropsList array
              const [titleProps, urlProps] = inputPropsList;
              return (
                <>
                  <Input
                    type="text"
                    variant="primary"
                    label={t('name_your_bot')}
                    placeholder={t('type_name')}
                    required
                    fullWidth
                    errorMessage={titleProps.error}
                    {...titleProps}
                  />
                  <Input
                    type="text"
                    variant="primary"
                    label={t('url')}
                    placeholder={t('youtube_url')}
                    required
                    fullWidth
                    errorMessage={urlProps.error}
                    {...urlProps}
                  />
                </>
              );
            }}
          />

          {/* <DataSourceTabs
            selectedTab={2}
            setSelectedTab={() => {}}
            functionSetSelectedCrawledLinks={functionSetSelectedCrawledLinks}
            setErrorMsg={setErrorMsg}
            errorMsg={errorMsg}
            register={register}
            errors={errors}
            disableCreateBot={handleDisableCreateBot}
            setFetchPeriod={setFetchPeriod}
            websiteCrawlingTabErrorMsg={websiteCrawlingTabErrorMsg}
            setWebsiteCrawlingTabErrorMsg={setWebsiteCrawlingTabErrorMsg}
          /> */}
        </div>
      </form>
    </>
  );
};

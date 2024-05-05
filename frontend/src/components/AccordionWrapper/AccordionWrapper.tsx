import { Flowbite, CustomFlowbiteTheme } from 'flowbite-react';

export const AccordionWrapper = ({
  children,
}: {
  children: string | JSX.Element | JSX.Element[];
}) => {
  const cwAccordion: CustomFlowbiteTheme = {
    accordion: {
      root: {
        flush: {
          off: 'border rounded-md',
          on: 'border-b bg-primary-50',
        },
      },
      content: {
        base: 'py-5 px-5 last:rounded-b-md bg-white dark:bg-gray-900 first:rounded-t-md',
      },
      title: {
        base: 'flex w-full items-center justify-between first:rounded-t-md last:rounded-b-md py-5 px-5 text-left font-semibold text-base text-neutral-800 dark:text-gray-400',
        flush: {
          off: 'hover:bg-primary-50 ring-0 dark:hover:bg-gray-800',
          on: 'bg-white dark:bg-transparent',
        },
        heading: '',
        open: {
          off: 'bg-white first:rounded-md',
          on: 'text-primary-500 font-semibold text-base bg-primary-50 dark:bg-gray-800 dark:text-white',
        },
      },
    },
  };

  return <Flowbite theme={{ theme: cwAccordion }}>{children}</Flowbite>;
};

import { IProgressBarProps } from "./ProgressBar.types";

export const ProgressBar = (props: IProgressBarProps) => {
  const { loadingProgress } = props;
  return (
    <div className="w-full bg-gray-200 rounded-md dark:bg-gray-700">
      <div
        className="bg-primary-500 border-primary-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-md"
        style={{ width: `${loadingProgress}%` }}
      >
        {loadingProgress}%
      </div>
    </div>
  );
};
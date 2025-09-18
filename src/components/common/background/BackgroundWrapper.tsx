import { BackgroundPaths } from "./BackgroundPath";

interface BackgroundPathsWrapperProps {
  className: string;
  // Add any other props you want to pass down
}

const BackgroundPathsWrapper = ({
  className,
}: BackgroundPathsWrapperProps) => {
  return <BackgroundPaths className={className} />;
};

export default BackgroundPathsWrapper;

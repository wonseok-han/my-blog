import { PropsWithChildren } from 'react';

const Main = ({ children }: PropsWithChildren) => {
  return <main className="relative pt-4 pb-16">{children}</main>;
};

export default Main;

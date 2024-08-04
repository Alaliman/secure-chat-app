import { FC } from 'react';

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="rounded-none bg-slate-200 p-10">{children}</div>
    </div>
  );
};

export default AuthLayout;

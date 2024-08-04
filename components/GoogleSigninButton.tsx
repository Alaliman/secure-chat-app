import { FC } from 'react';
import { Button } from './ui/button';

type GoogleSigninButtonProps = {
  children: React.ReactNode;
};

const GoogleSigninButton: FC<GoogleSigninButtonProps> = ({ children }) => {
  const logInWithGoogle = () => {
    console.log('login with Google');
  };
  return (
    <Button onClick={logInWithGoogle} className="w-full">
      {children}
    </Button>
  );
};

export default GoogleSigninButton;

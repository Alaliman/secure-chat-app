'use client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type UserPanelProps = {
  username: string;
};

const UserPanel: React.FC<UserPanelProps> = ({ username }) => {
  const fallback = (title: string): string => {
    title = title + '';

    let newTitle = title.split(' ');

    if (newTitle.length < 2) return `${newTitle[0].slice(0, 2).toUpperCase()}`;

    return `${newTitle[0].slice(0, 1).toUpperCase()}${newTitle[1].slice(0, 1).toUpperCase()}`;
  };
  return (
    <div className="flex sm:flex-row sm:items-center md:flex-col">
      <div className="flex items-center gap-4 p-4">
        <Avatar>
          <AvatarFallback>{fallback(username)}</AvatarFallback>
        </Avatar>
        <h2 className="sm: mt-2 text-center">{username}</h2>
      </div>
      <div className="bg-blue-400 sm:h-10 sm:w-[3px] md:mx-auto md:mb-5 md:h-[3px] md:w-3/4" />
    </div>
  );
};

export default UserPanel;

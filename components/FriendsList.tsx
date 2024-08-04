'use client';

import { useChatContext } from '@/app/context/chatContext';
import { useQuery } from '@tanstack/react-query';
import { getFriends } from '@/lib/helper';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type ListProps = {
  userId: string;
};

type chat = {
  chatId: string;
  friend: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

const FriendsList: React.FC<ListProps> = ({ userId }) => {
  const {
    data: friends,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: ['friends'],
    queryFn: () => getFriends(userId),
    staleTime: 5 * 1000,
  });

  return (
    <div>
      {isLoading && <p className="text-center text-red-500">Loading...</p>}

      {friends && friends.length > 0 && (
        <div className="flex h-full w-fit flex-row items-start justify-center md:w-full md:flex-col">
          {friends.map((chat) => (
            <div
              key={chat.chatId}
              className="ml-4 transition hover:bg-primary md:ml-0 md:w-full"
            >
              <UserChat chat={chat} />
            </div>
          ))}
        </div>
      )}

      {isFetched && ((friends && friends.length == 0) || !friends) && (
        <p className="text-center text-red-500">No friends found.</p>
      )}
    </div>
  );
};
type ChatProps = {
  chat: chat;
};

const UserChat: React.FC<ChatProps> = ({ chat }) => {
  //
  const { dispatch } = useChatContext();
  const chatId = chat.chatId;
  const friend = chat.friend;
  const fallback = (title: string): string => {
    let newTitle: string[] = title.split(' ');

    if (newTitle.length < 2) return `${newTitle[0].slice(0, 2).toUpperCase()}`;

    return `${newTitle[0].slice(0, 1).toUpperCase()}${newTitle[1].slice(0, 1).toUpperCase()}`;
  };

  const startChat = () => {
    dispatch({
      type: 'CHANGE_CHAT',
      payload: chat,
    });
  };

  return (
    <div
      onClick={startChat}
      className="flex cursor-pointer items-center gap-4 p-4 md:w-full md:pl-5"
    >
      <Avatar>
        <AvatarFallback>{friend && fallback(friend.name)}</AvatarFallback>
      </Avatar>
      <a className="hidden p-2 sm:block">{friend?.name}</a>
    </div>
  );
};

export default FriendsList;

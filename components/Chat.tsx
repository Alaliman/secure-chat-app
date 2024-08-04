// components/Chat.tsx
'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useChatContext } from '@/app/context/chatContext';
import { getMessages } from '@/lib/helper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pusherClient } from '@/lib/pusher';
import { decrypt } from '@/lib/crypto';
import { Paperclip, Phone, SendHorizontal, Video } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

type Message = {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  sender: {
    name: string;
  };
  isSent: boolean;
  createdAt: string;
};

const Chat: React.FC = () => {
  const { state } = useChatContext();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const [isFriendOnline, setIsFriendOnline] = useState(false);
  const { chat } = state;
  const chatId = chat?.chatId;

  const {
    data: chatMessages,
    isLoading,
    isFetched,
    isError,
  } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => getMessages(chat?.chatId!, session?.user.id!),
    staleTime: 5 * 1000,
    enabled: !!chatId,
  });

  useEffect(() => {
    setMessages(chatMessages || []);

    const channel = pusherClient.subscribe(`chat-${chat?.chatId}`);

    // Listen for new messages
    channel.bind('new-message', (message: Message) => {
      const decryptMessage = {
        ...message,
        content: decrypt(message.content),
        isSent: message.senderId === chat?.friend.id ? false : true,
      };
      console.log();
      setMessages((prevMessages) => [...prevMessages, decryptMessage]);
    });

    // Cleanup on unmount
    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`chat-${chat?.chatId}`);
    };
  }, [chat, chatMessages]);

  useEffect(() => {
    //3️⃣ bring the last item into view
    listRef.current?.lastElementChild?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'end',
    });
  }, [messages]);

  const fallback = (title: string): string => {
    title = title + '';

    let newTitle = title.split(' ');

    if (newTitle.length < 2) return `${newTitle[0].slice(0, 2).toUpperCase()}`;

    return `${newTitle[0].slice(0, 1).toUpperCase()}${newTitle[1].slice(0, 1).toUpperCase()}`;
  };

  return (
    <div className="flex h-full w-full flex-col rounded-lg bg-slate-100 p-4 shadow-lg">
      {chat ? (
        <div>
          <div className="flex items-center justify-between rounded-md bg-slate-200 px-3 py-2 shadow-md">
            <div className="flex items-center">
              <Avatar>
                <AvatarFallback>{fallback(chat.friend.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">{chat?.friend?.name}</h2>
                <p className="text-sm text-gray-500">{chat?.friend?.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <button className="text -sm mr-2 rounded-full bg-slate-200 px-3 py-1 font-semibold text-gray-500">
                <Phone />
              </button>
              <button className="text -sm rounded-full bg-slate-200 px-3 py-1 font-semibold text-gray-500">
                <Video />
              </button>
            </div>
          </div>

          <div
            ref={listRef}
            className="h-96 flex-grow overflow-y-scroll scrollbar-default"
          >
            {isFetched && !isError && (
              <>
                {messages && messages.length > 0 ? (
                  messages.map((message: Message) => (
                    <Message key={message.id} message={message} />
                  ))
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <h2>Start a chat with {chat.friend.name} ...</h2>
                  </div>
                )}
              </>
            )}
          </div>
          <MessageInput chatId={chat.chatId} />
        </div>
      ) : (
        <p className="text-center text-red-500">
          Please select a chat to start messaging.
        </p>
      )}
    </div>
  );
};

// components/Message.tsx

type MessageProps = {
  message: {
    id: string;
    content: string;
    senderId: string;
    chatId: string;
    sender: {
      name: string;
    };
    isSent: boolean;
    createdAt: string;
  };
};

const Message: React.FC<MessageProps> = ({ message }) => {
  // Replace with actual sender check logic

  return (
    <div className={`py-2 ${message.isSent ? 'text-right' : 'text-left'}`}>
      <div
        className={`text-md inline-block rounded-lg px-4 py-2 ${message.isSent ? 'bg-blue-500/70 text-white' : 'bg-white text-gray-900'}`}
      >
        {message.content}
      </div>
      <span className="block text-sm">
        {message.isSent ? 'me' : message.sender.name}
      </span>
    </div>
  );
};

// components/MessageInput.tsx

type MessageInputProps = {
  chatId: string;
};

const MessageInput: React.FC<MessageInputProps> = ({ chatId }) => {
  const [message, setMessage] = useState('');
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['sendMessage', chatId],
    mutationFn: async () => {
      if (!session) return;
      if (message === '') return;
      const res = await fetch(`/api/message/${chatId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          content: message,
        }),
      });

      return res.json();
    },
    onSuccess: (data: Message) => {
      queryClient.invalidateQueries({ queryKey: ['messaages', chatId] });
    },
  });

  return (
    <div className="mt-4 flex flex-row gap-2">
      <button
        onClick={async () => {
          try {
            await mutateAsync();
            setMessage('');
          } catch (err) {
            console.log(err);
          }
        }}
        className="w-fit rounded-lg bg-gray-500/70 px-4 py-2 text-white hover:bg-gray-600/70 focus:outline-none"
      >
        <Paperclip />
      </button>
      <input
        type="text"
        value={message}
        onKeyDown={async (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            await mutateAsync();
            setMessage('');
          }
        }}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-grow rounded-2xl border px-4 py-2 focus:border-gray-500 focus:outline-none"
      />
      <button
        onClick={async () => {
          try {
            await mutateAsync();
            setMessage('');
          } catch (err) {
            console.log(err);
          }
        }}
        className="w-fit rounded-lg bg-gray-500/70 px-4 py-2 text-white hover:bg-gray-600/70 focus:outline-none"
      >
        {isPending ? '....' : <SendHorizontal />}
      </button>
    </div>
  );
};

export default Chat;

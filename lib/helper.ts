type friend = {
  chatId: string;
  friend: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export const getFriends = async (id: string): Promise<friend[]> => {
  const res = await fetch(`/api/friends/${id}`);

  const data = (await res.json()) as friend[];
  return data;
};

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

export const getMessages = async (
  chatId: string,
  userId: string,
): Promise<Message[]> => {
  const res = await fetch(`/api/message/${chatId}/${userId}`);
  const data = (await res.json()) as Message[];
  return data;
};

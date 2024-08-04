'use client';
import React, {
  createContext,
  Dispatch,
  useContext,
  useReducer,
  useState,
} from 'react';

// type Theme = "dark" | "light"

// type ThemeContext = {
//   theme: Theme
//   setTheme: Dispatch<React.SetStateAction<Theme>>
// }

type chatContext = {
  state: StateType;
  dispatch: React.Dispatch<ActionType>;
};

const INITIAL_STATE = {
  chat: null,
};
const ChatContext = createContext<chatContext>({
  state: INITIAL_STATE,
  dispatch: () => {},
});

type ChatProviderProps = {
  children: React.ReactNode;
};

type StateType = {
  chat: {
    chatId: string;
    friend: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  } | null;
};

type ActionType = {
  type: 'CHANGE_CHAT';
  payload: {
    chatId: string;
    friend: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
};

const ChatReducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case 'CHANGE_CHAT':
      return {
        chat: action.payload,
      };
    default:
      return state;
  }
};

export default function ChatContextProvider({ children }: ChatProviderProps) {
  //const [theme, setTheme ] = useState<Theme>('light')
  const [state, dispatch] = useReducer(ChatReducer, INITIAL_STATE);

  console.log(state);

  return (
    <ChatContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);

  if (!context)
    throw new Error('useChatContxt must be used within a ChatContextProvider');

  return context;
}

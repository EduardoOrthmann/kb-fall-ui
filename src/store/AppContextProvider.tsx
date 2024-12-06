import useMessage from 'antd/es/message/useMessage';
import { MessageInstance } from 'antd/es/message/interface';
import { createContext, useContext, useMemo, useState } from 'react';

export interface IAppContext {
  selectedConversation: string | null;
  setSelectedConversation: (id: string) => void;
}

export const AppContext = createContext<IAppContext | undefined>(undefined);
export const MessageContext = createContext<MessageInstance | undefined>(undefined);

const AppContextProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messageApi, contextHolder] = useMessage();

  const value = useMemo(
    () => ({
      selectedConversation,
      setSelectedConversation,
    }),
    [selectedConversation]
  );

  return (
    <AppContext.Provider value={value}>
      <MessageContext.Provider value={messageApi}>
        {contextHolder}
        {children}
      </MessageContext.Provider>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
};

export const useMessageContext = () => {
  const context = useContext(MessageContext);

  if (!context) {
    throw new Error('useMessageContext must be used within an AppProvider');
  }

  return context;
};

export default AppContextProvider;


import { createContext, useContext, useState } from 'react';

export interface IAppContext {
  selectedConversation: string | null;
  setSelectedConversation: (id: string) => void;
}

export const AppContext = createContext<IAppContext | undefined>(undefined);

const AppContextProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);

  return (
    <AppContext.Provider
      value={{
        selectedConversation,
        setSelectedConversation,
      }}
    >
      {children}
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

export default AppContextProvider;


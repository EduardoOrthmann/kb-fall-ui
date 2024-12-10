'use client';

import keycloak from '@/config/keycloak';
import AppContextProvider from '@/store/AppContextProvider';
import { ThemeProvider, useTheme } from '@/store/ThemeContext';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { ConfigProvider, Spin } from 'antd';

const AppProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AppContextProvider>
      <ThemeProvider>
        <ThemeConfig>{children}</ThemeConfig>
      </ThemeProvider>
    </AppContextProvider>
  );
};

const ThemeConfig = ({ children }: { children: React.ReactNode }) => {
  const { algorithm } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm,
        token: {
          colorPrimary: '#e20074',
        },
        components: {
          Layout: {
            headerBg: '#e20074',
          },
        },
      }}
    >
      {keycloak && (
        <ReactKeycloakProvider
          onEvent={(event, error) => console.log('onKeycloakEvent', event, error)}
          authClient={keycloak}
          initOptions={{
            onLoad: 'login-required',
          }}
          LoadingComponent={<Spin size="large" />}
        >
          {children}
        </ReactKeycloakProvider>
      )}
    </ConfigProvider>
  );
};

export default AppProvider;

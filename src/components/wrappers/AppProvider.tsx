'use client';

import keycloak from '@/config/keycloak';
import AppContextProvider from '@/store/AppContextProvider';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { ConfigProvider, Spin, theme } from 'antd';

const AppProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AppContextProvider>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
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
            onEvent={(event, error) =>
              console.log('onKeycloakEvent', event, error)
            }
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
    </AppContextProvider>
  );
};

export default AppProvider;


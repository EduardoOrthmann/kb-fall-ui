import { useKeycloak } from '@react-keycloak/web';
import { Button, Typography } from 'antd';
const { Text } = Typography;
import AccountButton from './AccountButton';
import { useCallback } from 'react';

const AuthButton = () => {
  const { keycloak, initialized } = useKeycloak();
  
  const getAccountButton = useCallback(() => {
    if (!initialized) {
      return <Button loading>Loading</Button>;
    } else if (keycloak.authenticated) {
      return (
        <>
          <Text strong>{keycloak.tokenParsed?.name || 'Anonymous'}</Text>
          <AccountButton text="Sign out" onClick={() => keycloak.logout()} />
        </>
      );
    } else {
      return <AccountButton text="Sign in" onClick={() => keycloak.login()} />;
    }
  }, [initialized, keycloak]);

  return <div className="flex items-center gap-4">{getAccountButton()}</div>;
};

export default AuthButton;


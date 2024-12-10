import { useKeycloak } from '@react-keycloak/web';
import { Avatar, Dropdown, MenuProps, Radio, RadioChangeEvent, Space, Typography } from 'antd';
const { Text } = Typography;
import { useCallback } from 'react';
import { BulbOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useTheme } from '@/store/ThemeContext';

const AuthButton = () => {
  const { keycloak, initialized } = useKeycloak();
  const { currentTheme, switchTheme } = useTheme();

  const handleLogout = useCallback(() => {
    keycloak.logout();
  }, [keycloak]);

  const handleLogin = useCallback(() => {
    keycloak.login();
  }, [keycloak]);

  const handleThemeChange = (e: RadioChangeEvent) => {
    switchTheme(e.target.value as 'light' | 'dark');
  };

  if (!initialized) {
    return <Text>Loading...</Text>;
  }

  if (!keycloak.authenticated) {
    return (
      <button onClick={handleLogin} className="flex items-center gap-2">
        <Avatar icon={<UserOutlined />} />
        <Text>Sign In</Text>
      </button>
    );
  }

  const items: MenuProps['items'] = [
    {
      key: 'user',
      disabled: true,
      label: <Text strong>{keycloak.tokenParsed?.name.toUpperCase() || 'Anonymous'}</Text>,
    },
    {
      key: 'theme',
      icon: <BulbOutlined />,
      label: (
        <Space>
          <Text strong>Theme</Text>
          <Radio.Group
            value={currentTheme}
            onChange={handleThemeChange}
            options={[
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
            ]}
            optionType="button"
          />
        </Space>
      ),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      label: 'Sign Out',
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight" arrow={{ pointAtCenter: true }} trigger={['click']}>
      <Avatar size="large" style={{ cursor: 'pointer', backgroundColor: '#353535' }} icon={<UserOutlined />} />
    </Dropdown>
  );
};

export default AuthButton;


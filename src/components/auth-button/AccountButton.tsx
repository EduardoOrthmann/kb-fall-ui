import { UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface AccountButtonProps {
  text: string;
  onClick: () => void;
}

const AccountButton = ({ text, onClick }: AccountButtonProps): JSX.Element => {
  return (
    <Button onClick={onClick} icon={<UserOutlined />}>
      {text}
    </Button>
  );
};

export default AccountButton;

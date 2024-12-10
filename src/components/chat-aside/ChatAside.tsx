'use client';

import { Avatar, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useQuery } from '@tanstack/react-query';
import { FormOutlined, UserOutlined } from '@ant-design/icons';
import { useAppContext } from '@/store/AppContextProvider';
import { useKeycloak } from '@react-keycloak/web';
import { Conversation } from '@/utils/types';
import { fetchConversations } from '@/utils/apiService';
import { MenuItemType } from 'antd/es/menu/interface';
import DeleteConversation from '../delete-conversation/DeleteConversation';
import { useMemo } from 'react';
import CreateConversationModal from '../create-conversation-modal/CreateConversationModal';
import useToggle from '@/hooks/useToggle';

const ChatAside = () => {
  const { selectedConversation, setSelectedConversation } = useAppContext();
  const [isModalVisible, setIsModalVisible] = useToggle(false);
  const { keycloak } = useKeycloak();

  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ['conversations', keycloak.tokenParsed?.sub],
    queryFn: () => fetchConversations(keycloak.tokenParsed?.sub as string),
  });

  const menuItems: MenuItemType[] = useMemo(
    () => [
      {
        key: 'new',
        icon: <FormOutlined />,
        label: 'New Conversation',
        onClick: () => setIsModalVisible(true),
        style: { marginBottom: '15px' },
      },
      ...conversations.map((conv) => ({
        key: conv._id,
        icon: <Avatar icon={<UserOutlined />} />,
        onClick: () => setSelectedConversation(conv._id),
        label: (
          <div className="conversation-item">
            {conv.name}
            <div onClick={(e) => e.stopPropagation()}>
              <DeleteConversation conversationId={conv._id} />
            </div>
          </div>
        ),
      })),
    ],
    [conversations, setIsModalVisible, setSelectedConversation]
  );

  return (
    <>
      <Sider width={250}>
        <Menu
          mode="inline"
          selectedKeys={[selectedConversation as string]}
          style={{ height: '100%' }}
          items={menuItems}
        />
      </Sider>

      <CreateConversationModal
        open={isModalVisible}
        closeModal={() => setIsModalVisible(false)}
      />
    </>
  );
};

export default ChatAside;


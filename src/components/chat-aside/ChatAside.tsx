'use client';

import { Avatar, Button, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DeleteOutlined, FormOutlined, UserOutlined } from '@ant-design/icons';
import { useAppContext } from '@/store/AppContextProvider';
import { useKeycloak } from '@react-keycloak/web';
import { Conversation } from '@/utils/types';
import { deleteConversation, fetchConversations } from '@/utils/apiService';
import { MouseEvent } from 'react';

interface ChatAsideProps {
  setIsModalVisible: (value: boolean) => void;
}

const ChatAside = ({ setIsModalVisible }: ChatAsideProps) => {
  const { selectedConversation, setSelectedConversation } = useAppContext();
  const { keycloak } = useKeycloak();
  const queryClient = useQueryClient();

  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ['conversations', keycloak.tokenParsed?.sub],
    queryFn: () => fetchConversations(keycloak.tokenParsed?.sub as string),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['conversations', keycloak.tokenParsed?.sub],
      });
    },
  });

  const handleDeleteConversation = (
    e: MouseEvent<HTMLElement, MouseEvent>,
    conversationId: string
  ) => {
    e.stopPropagation();

    deleteMutation.mutate(conversationId);
  };

  return (
    <Sider width={250}>
      <Menu
        mode="inline"
        selectedKeys={[selectedConversation as string]}
        style={{ height: '100%' }}
      >
        <Menu.Item
          key="new"
          onClick={() => setIsModalVisible(true)}
          icon={<FormOutlined />}
          style={{ marginBottom: '15px' }}
        >
          New Conversation
        </Menu.Item>
        {conversations.map((conv) => (
          <Menu.Item
            key={conv._id}
            icon={<Avatar icon={<UserOutlined />} />}
            onClick={() => setSelectedConversation(conv._id)}
            className="conversation-item"
          >
            {conv.name}
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="delete-icon"
              onClick={() => handleDeleteConversation}
            ></Button>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
};

export default ChatAside;


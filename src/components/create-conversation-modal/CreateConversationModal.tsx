'use client';

import { useAppContext } from '@/store/AppContextProvider';
import { createConversation } from '@/utils/apiService';
import { Conversation } from '@/utils/types';
import { useKeycloak } from '@react-keycloak/web';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Input, message, Modal } from 'antd';
import { useState } from 'react';

interface CreateConversationModalProps {
  open: boolean;
  closeModal: () => void;
}

const CreateConversationModal = ({
  open,
  closeModal,
}: CreateConversationModalProps) => {
  const { setSelectedConversation } = useAppContext();
  const [newConversationName, setNewConversationName] = useState('');
  const { keycloak } = useKeycloak();
  const queryClient = useQueryClient();

  const handleCreateConversation = async () => {
    if (!newConversationName.trim()) return;

    try {
      const userId = keycloak.tokenParsed?.sub as string;
      const newConversation = await createConversation(
        newConversationName,
        userId
      );

      queryClient.setQueryData(
        ['conversations', userId],
        (old: Conversation[] = []) => [...old, newConversation]
      );

      closeModal();
      setNewConversationName('');
      setSelectedConversation(newConversation._id);
      message.success('Conversation created successfully!');
    } catch (error) {
      console.error(error);
      message.error('Failed to create conversation.');
    }
  };

  return (
    <Modal
      title="Create New Conversation"
      open={open}
      onCancel={closeModal}
      onOk={handleCreateConversation}
    >
      <Form layout="vertical" style={{ marginTop: '15px' }}>
        <Form.Item label="Conversation Name" required>
          <Input
            value={newConversationName}
            onChange={(e) => setNewConversationName(e.target.value)}
            placeholder="Enter conversation name"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateConversationModal;


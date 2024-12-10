'use client';

import { deleteConversation } from '@/utils/apiService';
import { DeleteOutlined } from '@ant-design/icons';
import { useKeycloak } from '@react-keycloak/web';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from 'antd';
import { MouseEvent } from 'react';
import ConfirmDelete from '../confirm-delete/ConfirmDelete';
import { useAppContext, useMessageContext } from '@/store/AppContextProvider';
import useToggle from '@/hooks/useToggle';

interface DeleteButtonProps {
  conversationId: string;
  onDeleteSuccess?: () => void;
}

const DeleteConversation = ({
  conversationId,
  onDeleteSuccess,
}: DeleteButtonProps) => {
  const [isModalVisible, setIsModalVisible] = useToggle(false);
  const { keycloak } = useKeycloak();
  const queryClient = useQueryClient();
  const { selectedConversation, setSelectedConversation } = useAppContext();
  const messageApi = useMessageContext();

  const deleteMutation = useMutation({
    mutationFn: deleteConversation,
    onSuccess: () => {
      messageApi.success('Conversation deleted successfully!');

      queryClient.invalidateQueries({
        queryKey: ['conversations', keycloak.tokenParsed?.sub],
      });

      if (selectedConversation === conversationId) {
        // @ts-expect-error
        setSelectedConversation(null);
      }

      if (onDeleteSuccess) onDeleteSuccess();
    },
    onError: (error) => {
      console.error(error);
      messageApi.error('Failed to delete conversation.');
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(conversationId, {
      onSuccess: () => setIsModalVisible(false),
    });
  };

  const handleOpenModal = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button
        type="text"
        icon={<DeleteOutlined />}
        onClick={handleOpenModal}
        className="delete-icon"
      />
      <ConfirmDelete
        visible={isModalVisible}
        title="Confirm Deletion"
        message="Are you sure you want to delete this conversation?"
        onConfirm={handleDelete}
        onCancel={handleCancel}
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonProps={{ danger: true }}
      />
    </>
  );
};

export default DeleteConversation;


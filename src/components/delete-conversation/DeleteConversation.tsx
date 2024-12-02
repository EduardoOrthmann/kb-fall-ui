'use client';

import { deleteConversation } from '@/utils/apiService';
import { DeleteOutlined } from '@ant-design/icons';
import { useKeycloak } from '@react-keycloak/web';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, message } from 'antd';
import { MouseEvent, useState } from 'react';
import ConfirmDelete from '../confirm-delete/ConfirmDelete';

interface DeleteButtonProps {
  conversationId: string;
  onDeleteSuccess?: () => void;
}

const DeleteConversation = ({
  conversationId,
  onDeleteSuccess,
}: DeleteButtonProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { keycloak } = useKeycloak();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['conversations', keycloak.tokenParsed?.sub],
      });

      message.success('Conversation deleted successfully!');

      if (onDeleteSuccess) onDeleteSuccess();
    },
    onError: (error) => {
      console.error(error);
      message.error('Failed to delete conversation.');
    }
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


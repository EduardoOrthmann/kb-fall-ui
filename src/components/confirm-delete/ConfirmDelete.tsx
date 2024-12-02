'use client';

import { ButtonProps, Modal, Typography } from 'antd';
import { ReactNode } from 'react';
const { Text } = Typography;

interface ConfirmDeleteProps {
  visible: boolean;
  title: string;
  message: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
}

const ConfirmDelete = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonProps = {},
  cancelButtonProps = {},
}: ConfirmDeleteProps) => {
  return (
    <Modal
      title={title}
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={confirmText}
      cancelText={cancelText}
      okButtonProps={confirmButtonProps}
      cancelButtonProps={cancelButtonProps}
    >
      <Text>{message}</Text>
    </Modal>
  );
};

export default ConfirmDelete;


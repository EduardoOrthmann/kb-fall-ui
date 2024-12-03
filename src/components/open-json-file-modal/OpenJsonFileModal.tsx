'use client';

import { Modal } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface OpenJsonFileModalProps {
  fileContent: string | null;
  open: boolean;
  closeModal: () => void;
}

const OpenJsonFileModal = ({
  fileContent,
  open,
  closeModal,
}: OpenJsonFileModalProps) => {
  return (
    <Modal title="File Details" open={open} onCancel={closeModal} footer={null}>
      <SyntaxHighlighter language="json" style={a11yDark}>
        {fileContent ?? 'No content to display'}
      </SyntaxHighlighter>
    </Modal>
  );
};

export default OpenJsonFileModal;


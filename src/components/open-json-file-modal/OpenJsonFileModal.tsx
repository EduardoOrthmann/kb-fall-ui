'use client';

import { Modal } from 'antd';
import dynamic from 'next/dynamic';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface OpenJsonFileModalProps {
  fileContent: string | null;
  open: boolean;
  closeModal: () => void;
}

const SyntaxHighlighter = dynamic(() => import('react-syntax-highlighter'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const OpenJsonFileModal = ({ fileContent, open, closeModal }: OpenJsonFileModalProps) => {
  return (
    <Modal title="File Details" open={open} onCancel={closeModal} footer={null}>
      {fileContent ? (
        <SyntaxHighlighter language="json" style={a11yDark}>
          {fileContent}
        </SyntaxHighlighter>
      ) : (
        <p>Loading file content...</p>
      )}
    </Modal>
  );
};

export default OpenJsonFileModal;


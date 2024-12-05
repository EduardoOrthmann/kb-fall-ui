'use client';

import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, UploadFile as IUploadFile, UploadProps } from 'antd';
import React, { useEffect, useState } from 'react';
import OpenJsonFileModal from '../open-json-file-modal/OpenJsonFileModal';
import { readAsText } from '@/utils/fileUtils';
import { socket } from '@/socket';
import { useKeycloak } from '@react-keycloak/web';
import { Message } from '@/utils/types';
import ProgressBar from '../progress-bar/ProgressBar';

const { Dragger } = Upload;

interface UploadFileProps {
  conversationId: string;
  numberOfMessages: number;
}

const UploadFile = ({ conversationId, numberOfMessages }: UploadFileProps) => {
  const { keycloak } = useKeycloak();

  const [uploadedFile, setUploadedFile] = useState<
    Record<string, IUploadFile | null>
  >({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setUploadedFile((prevState) => ({
      ...prevState,
      [conversationId]: null,
    }));
    setFileContent(null);
  }, [conversationId]);

  const handleFileUpload = async (fileContent: string) => {
    try {
      setIsProcessing(true);

      const messageData: Message = {
        text: fileContent,
        user: keycloak.tokenParsed?.preferred_username || 'Anonymous',
        timestamp: new Date().toISOString(),
        conversationId: conversationId,
        isJsonFile: true,
      };

      socket.emit('message', messageData);

      socket.on('message', (response: Message) => {
        if (response.conversationId === conversationId && response.isJsonFile) {
          setIsProcessing(false);
        }
      });
    } catch (error) {
      console.error('Error uploading and processing file:', error);
      message.error('Failed to upload and process the file.');
      setIsProcessing(false);
    }
  };

  const props: UploadProps = {
    name: 'file',
    accept: '.json',
    multiple: false,
    maxCount: 1,
    listType: 'picture',
    disabled: isProcessing,
    onChange(info) {
      const { file } = info;

      if (file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
        return;
      }

      if (file.status === 'done' && file.originFileObj) {
        message.success(`${file.name} file uploaded successfully.`);

        setUploadedFile((prev) => ({
          ...prev,
          [conversationId]: file,
        }));

        readAsText(file.originFileObj).then((content) => {
          setFileContent(content);
          handleFileUpload(content);
        });
      }
    },
  };

  const currentFile = uploadedFile[conversationId] || null;

  return (
    <div>
      {isProcessing && <ProgressBar isProcessing={isProcessing} />}
      {!currentFile && numberOfMessages < 1 && !isProcessing && (
        <Dragger {...props} height={250}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint m-4">
            The error within the JSON will be analyzed and the result will be
            shown in the table below.
          </p>
        </Dragger>
      )}

      {currentFile && (
        <Upload
          {...props}
          showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
          defaultFileList={[currentFile]}
          onPreview={() => setIsModalVisible(true)}
          className="upload-file"
        />
      )}

      <OpenJsonFileModal
        fileContent={fileContent}
        open={isModalVisible}
        closeModal={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default UploadFile;


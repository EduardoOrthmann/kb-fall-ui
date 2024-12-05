'use client';

import { InboxOutlined } from '@ant-design/icons';
import {
  message,
  Upload,
  UploadFile as IUploadFile,
  UploadProps,
  Progress,
} from 'antd';
import React, { useEffect, useState } from 'react';
import OpenJsonFileModal from '../open-json-file-modal/OpenJsonFileModal';
import { readAsText } from '@/utils/fileUtils';
import { socket } from '@/socket';
import { useKeycloak } from '@react-keycloak/web';
import { Message } from '@/utils/types';
import { useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '@/store/AppContextProvider';

const { Dragger } = Upload;

interface UploadFileProps {
  conversationId: string;
  numberOfMessages: number;
}

const UploadFile = ({ conversationId, numberOfMessages }: UploadFileProps) => {
  const { keycloak } = useKeycloak();
  const queryClient = useQueryClient();
  const { selectedConversation } = useAppContext();
  const [uploadedFile, setUploadedFile] = useState<IUploadFile | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  useEffect(() => {
    return () => {
      setUploadedFile(null);
      setFileContent(null);
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  }, []);

  useEffect(() => {
    const handleProgress = ({
      progress,
      error,
      conversationId: id,
    }: {
      progress: number;
      error?: boolean;
      conversationId: string;
    }) => {
      if (id === conversationId) {
        if (error) {
          message.error('Error processing the file.');
          setProcessingProgress(0);
          setIsProcessing(false);
          return;
        }

        setProcessingProgress(progress);
        setIsProcessing(progress < 100);
      }
    };

    socket.on('progress', handleProgress);

    return () => {
      socket.off('progress', handleProgress);
    };
  }, [conversationId]);

  const handleFileUpload = async (fileContent: string) => {
    try {
      const messageData: Message = {
        text: fileContent,
        user: keycloak.tokenParsed?.preferred_username || 'Anonymous',
        timestamp: new Date().toISOString(),
        conversationId: conversationId,
        isJsonFile: true,
      };

      socket.emit('message', messageData);

      queryClient.invalidateQueries({
        queryKey: ['messages', selectedConversation],
      });
    } catch (error) {
      console.error('Error uploading and processing file:', error);
      message.error('Failed to upload and process the file.');
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
      const { status } = file;

      if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
        console.error('Error uploading file', info.file);

        return;
      }

      if (status === 'done' && file.originFileObj) {
        message.success(`${file.name} file uploaded successfully.`);

        setUploadedFile(file);

        readAsText(file.originFileObj).then((content) => {
          setFileContent(content);
          handleFileUpload(content);
        });
      }
    },
  };

  return (
    <div>
      {isProcessing && (
        <>
          <span>Searching for the solution...</span>
          <Progress
            percent={processingProgress}
            status={processingProgress === 100 ? 'success' : 'active'}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </>
      )}
      {!uploadedFile && numberOfMessages < 1 && !isProcessing && (
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

      {uploadedFile && (
        <Upload
          {...props}
          showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
          defaultFileList={[uploadedFile]}
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


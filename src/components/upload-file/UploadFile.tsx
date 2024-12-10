'use client';

import { InboxOutlined } from '@ant-design/icons';
import { Upload, UploadFile as IUploadFile, UploadProps } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import OpenJsonFileModal from '../open-json-file-modal/OpenJsonFileModal';
import { readAsText } from '@/utils/fileUtils';
import { socket } from '@/socket';
import { useKeycloak } from '@react-keycloak/web';
import { FileData, Message } from '@/utils/types';
import ProgressBar from '../progress-bar/ProgressBar';
import { useMessageContext } from '@/store/AppContextProvider';
import { useQuery } from '@tanstack/react-query';
import { getFileByConversationId } from '@/utils/apiService';
import useToggle from '@/hooks/useToggle';

const { Dragger } = Upload;

interface UploadFileProps {
  conversationId: string;
  numberOfMessages: number;
}

const UploadFile = ({ conversationId, numberOfMessages }: UploadFileProps) => {
  const { keycloak } = useKeycloak();
  const messageApi = useMessageContext();

  const [uploadedFile, setUploadedFile] = useState<Record<string, IUploadFile | null>>({});
  const [isModalVisible, setIsModalVisible] = useToggle(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useToggle(false);
  const [hasError, setHasError] = useToggle(false);

  const { data: fileData, error: fileDataError } = useQuery<FileData>({
    queryKey: ['file', conversationId],
    queryFn: () => getFileByConversationId(conversationId),
    enabled: !!conversationId,
    retry: false,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  useEffect(() => {
    setUploadedFile((prevState) => ({
      ...prevState,
      [conversationId]: null,
    }));
    setFileContent(null);
  }, [conversationId, messageApi]);

  useEffect(() => {
    if (fileDataError) {
      messageApi.error('Failed to fetch file data.');
      return;
    }
    if (!fileData) return;

    setFileContent(fileData.fileData);
  }, [fileData, fileDataError, messageApi]);

  const currentFile = useMemo(() => {
    if (fileData) {
      return {
        uid: conversationId,
        name: fileData.fileName,
        status: 'done',
        url: '',
        originFileObj: new Blob([fileData.fileData], { type: 'application/json' }),
      } as IUploadFile;
    }
    return uploadedFile[conversationId] || null;
  }, [fileData, conversationId, uploadedFile]);

  const handleFileUpload = async (fileContent: string, fileName: string) => {
    try {
      setIsProcessing(true);

      const messageData: Message = {
        text: fileContent,
        user: keycloak.tokenParsed?.preferred_username || 'Anonymous',
        timestamp: new Date().toISOString(),
        conversationId: conversationId,
        fileName: fileName,
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
      messageApi.error('Failed to upload and process the file.');
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
    onRemove() {
      setUploadedFile((prev) => ({
        ...prev,
        [conversationId]: null,
      }));
      setFileContent(null);
    },
    onChange(info) {
      const { file } = info;

      if (!conversationId) {
        if (!hasError) {
          messageApi.error('Please select or create a conversation before uploading a file.');
          setHasError(true);
        }

        setUploadedFile((prev) => ({
          ...prev,
          [conversationId]: null,
        }));
        return;
      }

      if (file.status === 'error') {
        messageApi.error(`${info.file.name} file upload failed.`);

        setUploadedFile((prev) => ({
          ...prev,
          [conversationId]: null,
        }));
        return;
      }

      if (file.status === 'done' && file.originFileObj) {
        messageApi.success(`${file.name} file uploaded successfully.`);

        setUploadedFile((prev) => ({
          ...prev,
          [conversationId]: file,
        }));

        readAsText(file.originFileObj).then((content) => {
          setFileContent(content);
          handleFileUpload(content, file.name);
        });
      }
    },
  };

  return (
    <div>
      {isProcessing && <ProgressBar isProcessing={isProcessing} />}
      {!currentFile && numberOfMessages < 1 && !isProcessing && (
        <Dragger {...props} height={250}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint m-4">The error within the JSON will be analyzed and the result will be shown in the table below.</p>
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

      <OpenJsonFileModal fileContent={fileContent} open={isModalVisible} closeModal={() => setIsModalVisible(false)} />
    </div>
  );
};

export default UploadFile;


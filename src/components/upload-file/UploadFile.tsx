'use client';

import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, UploadFile as IUploadFile, UploadProps } from 'antd';
import React, { useState } from 'react';
import OpenJsonFileModal from '../open-json-file-modal/OpenJsonFileModal';
import { readAsText } from '@/utils/fileUtils';

const { Dragger } = Upload;

const UploadFile = () => {
  const [uploadedFile, setUploadedFile] = useState<IUploadFile | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const props: UploadProps = {
    name: 'file',
    accept: '.json',
    multiple: false,
    action: 'https://jsonplaceholder.typicode.com/posts',
    maxCount: 1,
    listType: 'picture',
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
        });
      }
    },
  };

  return (
    <div>
      {!uploadedFile && (
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
          className='upload-file'
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


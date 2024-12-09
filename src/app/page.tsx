'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Input, Button, List, Avatar, Card } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import { socket } from '../socket';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppContext, useMessageContext } from '@/store/AppContextProvider';
import { Message, Solution } from '@/utils/types';
import { fetchMessages } from '@/utils/apiService';
import UploadFile from '@/components/upload-file/UploadFile';
import SolutionTable from '@/components/solution-table/SolutionTable';
import useToggle from '@/hooks/useToggle';
import ThreeDotsLoading from '@/components/three-dots-loading/ThreeDotsLoading';

const { TextArea } = Input;

const Home = () => {
  const { keycloak, initialized } = useKeycloak();
  const { selectedConversation } = useAppContext();
  const messageApi = useMessageContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState('');
  const queryClient = useQueryClient();
  const [isLoadingMessageResponse, toggleIsLoadingMessageResponse] = useToggle(false);

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['messages', selectedConversation],
    queryFn: () => fetchMessages(selectedConversation as string),
    enabled: !!selectedConversation,
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!initialized || !keycloak.authenticated) return;

    const handleMessage = (message: Message & { conversationId: string }) => {
      if (message.conversationId === selectedConversation) {
        queryClient.setQueryData<Message[]>(['messages', selectedConversation], (old) => [...(old || []), message]);
        toggleIsLoadingMessageResponse(false);
        scrollToBottom();
      }
    };

    socket.on('message', handleMessage);

    return () => {
      socket.off('message');
    };
  }, [initialized, keycloak.authenticated, selectedConversation, queryClient, scrollToBottom, toggleIsLoadingMessageResponse]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (!selectedConversation) {
      messageApi.error('Please select or create a conversation before sending a message.');
      setInput('');
      return;
    }

    toggleIsLoadingMessageResponse(true);

    const messageData: Message = {
      text: input,
      user: keycloak.tokenParsed?.preferred_username || 'Anonymous',
      timestamp: new Date().toISOString(),
      conversationId: selectedConversation,
    };

    socket.emit('message', messageData);
    queryClient.setQueryData<Message[]>(['messages', selectedConversation], (old) => [...(old || []), messageData]);
    setInput('');
  };

  const handleRenderItem = useCallback((item: Message): React.ReactNode => {
    if (!item.text) return null;

    const itemText: string | Solution = Array.isArray(item.text) ? item.text[0] : item.text;
    const description = item.isJsonFile ? <SolutionTable data={itemText as Solution} /> : (item.text as string);

    return (
      <List.Item>
        <List.Item.Meta avatar={<Avatar icon={<UserOutlined />} />} title={item.user} description={description} />
        {!item.isJsonFile && <div className="text-xs text-gray-400"> {new Date(item.timestamp).toLocaleTimeString()}</div>}
      </List.Item>
    );
  }, []);

  if (!initialized) return null;
  if (!keycloak.authenticated) return <div>Please log in to access the chat.</div>;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <div className="h-96 overflow-y-auto mb-4 custom-scrollbar">
        <UploadFile conversationId={selectedConversation ?? ''} numberOfMessages={messages.length} />

        <List
          itemLayout="horizontal"
          dataSource={messages}
          locale={{
            emptyText: <div></div>,
          }}
          renderItem={handleRenderItem}
        />

        {isLoadingMessageResponse && <ThreeDotsLoading />}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type your message..."
          autoSize={{ minRows: 1, maxRows: 4 }}
        />

        <Button type="primary" icon={<SendOutlined />} onClick={sendMessage} iconPosition="end">
          Send
        </Button>
      </div>
    </Card>
  );
};

export default Home;


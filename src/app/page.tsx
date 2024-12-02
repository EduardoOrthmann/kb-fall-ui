'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Input, Button, List, Avatar, Card } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import { socket } from '../socket';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '@/store/AppContextProvider';
import { Message } from '@/utils/types';
import { fetchMessages } from '@/utils/apiService';

const { TextArea } = Input;

const Home = () => {
  const { keycloak, initialized } = useKeycloak();
  const [input, setInput] = useState('');
  const { selectedConversation } = useAppContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch messages for selected conversation
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
        queryClient.setQueryData<Message[]>(
          ['messages', selectedConversation],
          (old) => [...(old || []), message]
        );
        scrollToBottom();
      }
    };

    socket.on('message', handleMessage);

    return () => {
      socket.off('message');
    };
  }, [
    initialized,
    keycloak.authenticated,
    selectedConversation,
    queryClient,
    scrollToBottom,
  ]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedConversation) return;

    const messageData = {
      text: input,
      user: keycloak.tokenParsed?.preferred_username || 'Anonymous',
      timestamp: new Date().toISOString(),
      conversationId: selectedConversation,
    };

    socket.emit('message', messageData);
    queryClient.setQueryData<Message[]>(
      ['messages', selectedConversation],
      (old) => [...(old || []), messageData]
    );
    setInput('');
  };

  if (!initialized) return null;
  if (!keycloak.authenticated)
    return <div>Please log in to access the chat.</div>;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <div className="h-96 overflow-y-auto mb-4 custom-scrollbar">
        <List
          itemLayout="horizontal"
          dataSource={messages}
          renderItem={(msg) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={msg.user}
                description={msg.text}
              />
              <div className="text-xs text-gray-400">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </List.Item>
          )}
        />
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2">
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={sendMessage}
          placeholder="Type your message..."
          autoSize={{ minRows: 1, maxRows: 4 }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={sendMessage}
          iconPosition="end"
        >
          Send
        </Button>
      </div>
    </Card>
  );
};

export default Home;


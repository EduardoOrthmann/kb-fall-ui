import { nextApi } from '@/lib/axios';
import { AxiosError } from 'axios';

export const fetchMessages = async (conversationId: string) => {
  const response = await nextApi.get('/messages', {
    params: { conversationId },
  });
  return response.data;
};

export const fetchConversations = async (userId: string) => {
  const response = await nextApi.get('/conversations', {
    params: { userId },
  });
  return response.data;
};

export const createConversation = async (name: string, userId: string) => {
  const response = await nextApi.post('/conversations', { name, userId });
  return response.data;
};

export const deleteConversation = async (conversationId: string) => {
  const response = await nextApi.delete(`/conversations/${conversationId}`);
  return response.data;
};

export const addMessage = async (
  conversationId: string,
  text: string,
  user: string,
  timestamp: string
) => {
  const response = await nextApi.post('/messages', {
    conversationId,
    text,
    user,
    timestamp,
  });
  return response.data;
};

export const getFileByConversationId = async (conversationId: string) => {
  try {
    const response = await nextApi.get('/files', {
      params: { conversationId },
    });

    return response.data;
  } catch (error: unknown) {
    console.log('Error fetching file:', error);
    if (error instanceof AxiosError && error.response && error.response.status === 404) {
      return null;
    }

    console.error('Error fetching file:', error);
    throw error;
  }
}

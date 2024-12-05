import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import next from 'next';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.NEXT_PUBLIC_HOSTNAME;
const port = process.env.NEXT_PUBLIC_PORT;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

mongoose
  .connect(process.env.NEXT_PUBLIC_MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

const messageSchema = new mongoose.Schema({
  text: { type: [mongoose.Schema.Types.Mixed] },
  user: String,
  timestamp: String,
  isJsonFile: Boolean,
});

const conversationSchema = new mongoose.Schema({
  name: String,
  user: String,
  messages: [messageSchema],
});

const Conversation = mongoose.model('Conversation', conversationSchema);

app.prepare().then(() => {
  const expressApp = express();
  expressApp.use(express.json());

  // Get all conversations for a user
  expressApp.get('/api/conversations', async (req, res) => {
    const { userId } = req.query;
    const conversations = await Conversation.find({ user: userId });
    res.json(conversations);
  });

  // Get all messages for a conversation
  expressApp.get('/api/messages', async (req, res) => {
    const { conversationId } = req.query;
    const conversation = await Conversation.findById(conversationId);
    res.json(conversation ? conversation.messages : []);
  });

  // Create a new conversation
  expressApp.post('/api/conversations', async (req, res) => {
    const { name, userId } = req.body;
    const newConversation = new Conversation({
      name,
      user: userId,
    });
    await newConversation.save();
    res.json(newConversation);
  });

  // Delete a conversation
  expressApp.delete('/api/conversations/:id', async (req, res) => {
    const { id } = req.params;
    await Conversation.findByIdAndDelete(id);
    res.json({ id });
  });

  // Add a new message to a conversation
  expressApp.post('/api/messages', async (req, res) => {
    const { conversationId, text, user, timestamp } = req.body;
    const conversation = await Conversation.findById(conversationId);

    if (conversation) {
      const newMessage = { text, user, timestamp };
      conversation.messages.push(newMessage);
      await conversation.save();
      res.json(newMessage);
    } else {
      res.status(404).json({ error: 'Conversation not found' });
    }
  });

  const httpServer = createServer(expressApp);
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('message', async (msg) => {
      const { conversationId } = msg;
      const conversation = await Conversation.findById(conversationId);

      if (conversation) {
        if (msg.isJsonFile) {
          try {
            const response = await api.post('/upload-file', {
              json_request: msg.text,
            });

            const aiMessage = {
              text: response.data,
              user: 'AI',
              timestamp: new Date().toISOString(),
              conversationId,
              isJsonFile: true,
            };

            conversation.messages.push(aiMessage);
            await conversation.save();

            io.emit('message', aiMessage);
          } catch (error) {
            console.error('Failed to fetch AI response:', error);
          }
        } else {
          conversation.messages.push(msg);
          await conversation.save();

          socket.broadcast.emit('message', msg);

          try {
            const { data } = await api.post('/generate-response', {
              conversation_id: conversationId,
              messages: conversation.messages,
            });

            const aiMessage = {
              text: data.response,
              user: 'AI',
              timestamp: new Date().toISOString(),
              conversationId,
            };

            conversation.messages.push(aiMessage);
            await conversation.save();

            io.emit('message', aiMessage);
          } catch (error) {
            console.error('Failed to fetch AI response:', error);
          }
        }
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  expressApp.all('*', (req, res) => handler(req, res));

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});


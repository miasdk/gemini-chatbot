import { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, ChatConfig, ChatContext, ChatResponse, UsageInfo } from '../types';

export interface UseChatBotResult {
  // State
  messages: ChatMessage[];
  isLoading: boolean;
  inputMessage: string;
  usage: UsageInfo | null;
  error: string | null;
  
  // Actions
  sendMessage: (message?: string) => Promise<void>;
  setInputMessage: (message: string) => void;
  clearMessages: () => void;
  resetUsage: () => void;
  
  // Utilities
  canSendMessage: boolean;
  scrollToBottom: () => void;
}

export function useChatBot(config: ChatConfig, context?: ChatContext): UseChatBotResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const apiUrl = config.apiUrl || 'http://localhost:3001';
  const maxMessages = config.maxMessages || 50;

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load usage info on mount
  useEffect(() => {
    if (config.userId) {
      loadUsageInfo();
    }
  }, [config.userId]);

  // Load usage information
  const loadUsageInfo = async () => {
    if (!config.userId) return;

    try {
      const response = await fetch(`${apiUrl}/api/chat/usage/${config.userId}`);
      if (response.ok) {
        const usageData = await response.json();
        setUsage(usageData);
      }
    } catch (err) {
      console.warn('Failed to load usage info:', err);
    }
  };

  // Check if user can send messages
  const canSendMessage = !isLoading && 
    inputMessage.trim().length > 0 && 
    (usage?.questionsRemaining || 0) > 0;

  // Send message to chatbot
  const sendMessage = async (messageOverride?: string) => {
    const messageToSend = messageOverride || inputMessage.trim();
    
    if (!messageToSend || isLoading) return;
    
    // Check usage limits
    if (usage && usage.questionsRemaining <= 0) {
      setError('Daily message limit reached. Please try again tomorrow.');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const requestBody = {
        message: messageToSend,
        userId: config.userId || 'anonymous',
        conversationId: config.conversationId,
        persona: config.persona || 'assistant',
        context: context
      };

      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get AI response');
      }

      const data: ChatResponse = await response.json();

      if (data.error) {
        throw new Error(data.response);
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update usage info
      if (config.userId) {
        await loadUsageInfo();
      }

      // Trigger callbacks
      config.onMessageSent?.(messageToSend);
      config.onMessageReceived?.(data.response);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Add error message to chat
      const errorChatMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble right now. Please try again in a moment!",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorChatMessage]);
      
      config.onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all messages
  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  // Reset usage (admin function)
  const resetUsage = async () => {
    if (!config.userId) return;

    try {
      const response = await fetch(`${apiUrl}/api/admin/reset-usage/${config.userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_ADMIN_TOKEN || 'admin-secret'}`
        }
      });

      if (response.ok) {
        await loadUsageInfo();
      }
    } catch (err) {
      console.warn('Failed to reset usage:', err);
    }
  };

  // Initialize chat with welcome message
  useEffect(() => {
    if (messages.length === 0 && config.welcomeMessage) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: config.welcomeMessage,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [config.welcomeMessage, messages.length]);

  // Cleanup old messages if exceeding limit
  useEffect(() => {
    if (messages.length > maxMessages) {
      setMessages(prev => prev.slice(-maxMessages));
    }
  }, [messages.length, maxMessages]);

  return {
    // State
    messages,
    isLoading,
    inputMessage,
    usage,
    error,
    
    // Actions
    sendMessage,
    setInputMessage,
    clearMessages,
    resetUsage,
    
    // Utilities
    canSendMessage,
    scrollToBottom
  };
}
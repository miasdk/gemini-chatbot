// Frontend types for the Gemini ChatBot

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatContext {
  // Generic context - can be customized for any domain
  subject?: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  currentTopic?: string;
  userProgress?: any;
  customData?: Record<string, any>;
  
  // Domain-specific contexts (examples)
  problem?: {
    title: string;
    description: string;
    difficulty: string;
    researchTopics?: string[];
  };
  userCode?: string;
  hintsUsed?: number;
}

export interface ChatConfig {
  apiUrl?: string;
  persona?: 'tutor' | 'assistant' | 'support' | 'codeReviewer' | string;
  userId?: string;
  conversationId?: string;
  maxMessages?: number;
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  welcomeMessage?: string;
  placeholder?: string;
  showQuickSuggestions?: boolean;
  quickSuggestions?: string[];
  
  // Event handlers
  onMessageSent?: (message: string) => void;
  onMessageReceived?: (message: string) => void;
  onError?: (error: string) => void;
}

export interface UsageInfo {
  questionsUsed: number;
  questionsRemaining: number;
  resetDate: string;
  model: string;
  dailyLimit: number;
}

export interface ChatResponse {
  response: string;
  model: string;
  error?: boolean;
  conversationId?: string;
}

export interface GeminiChatBotProps {
  // Required
  config: ChatConfig;
  context?: ChatContext;
  
  // Optional styling
  className?: string;
  style?: React.CSSProperties;
  
  // Event handlers
  onMessageSent?: (message: string) => void;
  onMessageReceived?: (message: string) => void;
  onUsageLimitReached?: () => void;
  onError?: (error: string) => void;
  
  // Custom components (for advanced customization)
  customMessageComponent?: React.ComponentType<{ message: ChatMessage }>;
  customHeaderComponent?: React.ComponentType<{ config: ChatConfig; usage: UsageInfo | null }>;
}

// Predefined themes
export const CHAT_THEMES = {
  light: {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-gray-100',
    background: 'bg-white',
    border: 'border-gray-200',
    text: 'text-gray-900',
    textSecondary: 'text-gray-500'
  },
  dark: {
    primary: 'bg-blue-500 hover:bg-blue-600',
    secondary: 'bg-gray-800',
    background: 'bg-gray-900',
    border: 'border-gray-700',
    text: 'text-white',
    textSecondary: 'text-gray-400'
  }
};

// Position styles
export const POSITION_STYLES = {
  'bottom-right': 'fixed bottom-6 right-6',
  'bottom-left': 'fixed bottom-6 left-6',
  'top-right': 'fixed top-6 right-6',
  'top-left': 'fixed top-6 left-6'
};

// Default quick suggestions by persona
export const DEFAULT_QUICK_SUGGESTIONS: Record<string, string[]> = {
  tutor: [
    "How do I approach this problem?",
    "What concept should I learn?",
    "Debug my code",
    "Explain this error"
  ],
  assistant: [
    "How can I help you?",
    "Explain this concept",
    "Show me an example",
    "What's the best practice?"
  ],
  support: [
    "I need help with...",
    "How do I fix this?",
    "What's the next step?",
    "Contact human support"
  ],
  codeReviewer: [
    "Review my code",
    "How can I improve this?",
    "Is this good practice?",
    "Optimize performance"
  ]
};
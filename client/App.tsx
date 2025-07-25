import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { FaHeart } from 'react-icons/fa';
import { 
  Bot, 
  User, 
  Brain,
  Code,
  Headphones,
  MessageCircle,
  Github,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from './components/ui/button';
import { cn } from './lib/utils';

const profile = {
  name: "Mia Elena"
};

interface PersonaConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  context: any;
  welcomeMessage: string;
  sampleMessages: string[];
}

interface ThemeConfig {
  id: 'default' | 'dark' | 'modern' | 'minimal';
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
    accent: string;
  };
}

const themes: ThemeConfig[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean gray theme with professional look',
    colors: {
      primary: 'bg-gray-900',
      secondary: 'bg-gray-50',
      background: 'bg-white',
      text: 'text-gray-900',
      border: 'border-gray-200',
      accent: 'text-gray-600'
    }
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Elegant dark theme for low-light environments',
    colors: {
      primary: 'bg-blue-600',
      secondary: 'bg-gray-800',
      background: 'bg-gray-900',
      text: 'text-white',
      border: 'border-gray-700',
      accent: 'text-gray-300'
    }
  },
  {
    id: 'modern',
    name: 'Modern Blue',
    description: 'Vibrant blue accents with modern styling',
    colors: {
      primary: 'bg-blue-500',
      secondary: 'bg-blue-50',
      background: 'bg-white',
      text: 'text-gray-900',
      border: 'border-blue-200',
      accent: 'text-blue-600'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean design with subtle accents',
    colors: {
      primary: 'bg-slate-600',
      secondary: 'bg-slate-50',
      background: 'bg-white',
      text: 'text-slate-900',
      border: 'border-slate-200',
      accent: 'text-slate-500'
    }
  }
];

const personas: PersonaConfig[] = [
  {
    id: 'tutor',
    name: 'AI Tutor',
    description: 'Educational guidance without giving direct answers',
    icon: <Brain className="w-5 h-5" />,
    context: { subject: 'Learning', userLevel: 'beginner' },
    welcomeMessage: "Hi! I'm your AI tutor. What would you like to learn today?",
    sampleMessages: [
      "Explain how React hooks work",
      "Help me understand async/await",
      "What's the difference between let and const?"
    ]
  },
  {
    id: 'assistant',
    name: 'Assistant',
    description: 'General-purpose AI for diverse tasks',
    icon: <Bot className="w-5 h-5" />,
    context: { subject: 'General Assistance' },
    welcomeMessage: "Hello! I'm your AI assistant. How can I help you today?",
    sampleMessages: [
      "Write a professional email",
      "Plan my weekend schedule",
      "Explain quantum computing simply"
    ]
  },
  {
    id: 'codeReviewer',
    name: 'Code Reviewer',
    description: 'Expert code analysis and feedback',
    icon: <Code className="w-5 h-5" />,
    context: { subject: 'Code Review', userLevel: 'intermediate' },
    welcomeMessage: "Ready to review your code! Share it and I'll provide detailed feedback.",
    sampleMessages: [
      "Review this React component",
      "Check my API endpoint security",
      "Optimize this SQL query"
    ]
  },
  {
    id: 'support',
    name: 'Support Agent',
    description: 'Customer support with empathy',
    icon: <Headphones className="w-5 h-5" />,
    context: { subject: 'Customer Support' },
    welcomeMessage: "Hello! I'm here to help resolve any issues you're experiencing.",
    sampleMessages: [
      "I can't log into my account",
      "How do I cancel my subscription?",
      "My payment didn't go through"
    ]
  }
];

function isDotAppDomain() {
  if (typeof window !== 'undefined') {
    return window.location.hostname.endsWith('.app');
  }
  return false;
}

function App() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaConfig>(personas[0]);
  const [serverStatus, setServerStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [chatKey, setChatKey] = useState<number>(0);
  const [showImplementation, setShowImplementation] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<'default' | 'dark' | 'modern' | 'minimal'>('default');

  useEffect(() => {
    // Check server status
    fetch('/api/health')
      .then(res => res.json())
      .then(() => setServerStatus('connected'))
      .catch(() => setServerStatus('disconnected'));
  }, []);

  const handlePersonaChange = (persona: PersonaConfig) => {
    setSelectedPersona(persona);
    // Force chat component to re-render with new key
    setChatKey(prev => prev + 1);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const installCode = `npm install @google/generative-ai express cors dotenv react lucide-react`;
  
  const usageCode = `import { GeminiChatBot } from './components/GeminiChatBot';

function App() {
  return (
    <div>
      <GeminiChatBot
        config={{
          persona: 'tutor',
          userId: 'user123',
          welcomeMessage: 'Hi! How can I help you learn?',
          theme: 'light',
          position: 'bottom-right',
          placeholder: 'Ask me anything...'
        }}
        context={{
          subject: 'JavaScript',
          userLevel: 'beginner'
        }}
        onMessageSent={(msg) => console.log('User:', msg)}
        onMessageReceived={(response) => console.log('AI:', response)}
      />
    </div>
  );
}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/80 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <Bot className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Gemini ChatBot</h1>
        </div>
        {/* Online/Offline indicator */}
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full inline-block ${isDotAppDomain() && serverStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={`${isDotAppDomain() && serverStatus === 'connected' ? 'text-green-600' : 'text-red-600'} text-sm font-medium`}>
            {isDotAppDomain() && serverStatus === 'connected' ? 'Online' : 'Offline'}
          </span>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium mb-8 hover:bg-gray-800 transition-colors cursor-pointer">
            <span>Powered by Google Gemini AI</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Smart Chat Component
            <span className="block text-gray-600 mt-3 text-2xl md:text-3xl font-normal">For Modern Applications</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            A React component with intelligent AI personas and TypeScript support. 
            Perfect for customer support, tutoring, and code assistance.
          </motion.p>
          
          
          <motion.div 
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Try different personas below ↓
          </motion.div>
        </div>
      </section>

      {/* Chat Demo Section */}
      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-gray-600">Interactive demo with persona switching and theme customization</p>
            
            {/* Theme Selector */}
            <div className="mt-6 flex justify-center">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Choose Theme</h4>
                <div className="flex space-x-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setSelectedTheme(theme.id);
                        setChatKey(prev => prev + 1);
                      }}
                      className={cn(
                        "px-3 py-2 rounded-lg text-xs font-medium transition-all",
                        selectedTheme === theme.id
                          ? 'bg-gray-900 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {themes.find(t => t.id === selectedTheme)?.description}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-6 items-start">
            {/* Persona Selector */}
            <motion.div 
              className="w-64 bg-white rounded-2xl shadow-lg border border-gray-200 p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Choose Assistant</h3>
                <p className="text-sm text-gray-600">Select your AI persona</p>
              </div>
              
              <div className="space-y-3">
                {personas.map((persona, index) => (
                  <motion.button
                    key={persona.id}
                    onClick={() => handlePersonaChange(persona)}
                    className={cn(
                      "w-full p-3 rounded-xl text-left transition-all",
                      selectedPersona.id === persona.id
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100 hover:shadow-md'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                        selectedPersona.id === persona.id ? 'bg-gray-700' : 'bg-gray-200'
                      )}>
                        <div className={selectedPersona.id === persona.id ? 'text-white' : 'text-gray-600'}>
                          {persona.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-sm">{persona.name}</h4>
                          {selectedPersona.id === persona.id && (
                            <motion.div 
                              className="w-2 h-2 bg-green-400 rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </div>
                        <p className={cn(
                          "text-xs",
                          selectedPersona.id === persona.id ? 'text-gray-300' : 'text-gray-600'
                        )}>
                          {persona.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
            
            {/* Chat Dialogue Box */}
            <motion.div 
              className={cn(
                "flex-1 max-w-2xl rounded-2xl shadow-lg overflow-hidden",
                themes.find(t => t.id === selectedTheme)?.colors.background,
                themes.find(t => t.id === selectedTheme)?.colors.border,
                "border"
              )}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {/* Chat Header */}
              <motion.div 
                className={cn(
                  "p-4 border-b",
                  themes.find(t => t.id === selectedTheme)?.colors.background,
                  themes.find(t => t.id === selectedTheme)?.colors.border
                )}
                key={`${selectedPersona.id}-${selectedTheme}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-white",
                      themes.find(t => t.id === selectedTheme)?.colors.primary
                    )}
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {selectedPersona.icon}
                  </motion.div>
                  <div>
                    <h3 className={cn(
                      "text-lg font-semibold",
                      themes.find(t => t.id === selectedTheme)?.colors.text
                    )}>
                      {selectedPersona.name}
                    </h3>
                    <p className={cn(
                      "text-sm",
                      themes.find(t => t.id === selectedTheme)?.colors.accent
                    )}>
                      {selectedPersona.description}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Chat Interface */}
              <div className="h-[500px]">
                <ChatInterface 
                  key={`${chatKey}-${selectedTheme}`}
                  persona={selectedPersona}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Implementation Instructions */}
      {showImplementation && (
        <section id="integration-section" className="bg-gray-100 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                <Code className="inline w-6 h-6 mr-2" />
                Integration Instructions
              </h2>
              <p className="text-gray-600">Add this AI chat component to your React application</p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">1. Install Dependencies</h3>
                  <button 
                    onClick={() => copyToClipboard(installCode, 'install')}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {copiedCode === 'install' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode === 'install' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
                  <code className="text-gray-100 text-sm font-mono whitespace-pre">
                    {installCode}
                  </code>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">2. Use Component</h3>
                  <button 
                    onClick={() => copyToClipboard(usageCode, 'usage')}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {copiedCode === 'usage' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode === 'usage' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
                  <code className="text-gray-100 text-sm font-mono whitespace-pre">
                    {usageCode}
                  </code>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">3. That's it! Enjoy your new context-aware chat box component 🎉</h3>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Your smart chat component is ready!</h4>
                      <p className="text-sm text-gray-600">Start conversations with any of the 4 AI personas</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    💡 <strong>Pro tip:</strong> Customize the context prop to make conversations more relevant to your domain
                  </div>
                  <div className="flex items-center justify-center pt-4 border-t border-green-200">
                    <a 
                      href="https://github.com/miasdk/gemini-chatbot" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>Read More Here!</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-gray-900" />
            </div>
            <span className="text-lg font-semibold">Gemini ChatBot</span>
          </div>
          
          <p className="text-gray-400 mb-4">
            Smart AI chatbot component for React applications
          </p>
          
          <div className="flex items-center justify-center space-x-6">
            <a 
              href="https://github.com/miasdk/gemini-chatbot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm">GitHub</span>
            </a>
          </div>
          
          <div className="border-t border-gray-800 mt-6 pt-4">
            <p className="text-gray-500 text-sm mb-2">
              Built with TypeScript, React, and Google Gemini AI
            </p>
            <p className="text-gray-500 text-sm">
              Made with <FaHeart className="inline text-red-500" /> by {profile.name}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Embedded Chat Interface Component
function ChatInterface({ persona }: { persona: PersonaConfig }) {
  const [messages, setMessages] = useState<Array<{id: string, role: 'user' | 'assistant', content: string, timestamp: Date}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Add welcome message when persona changes
  useEffect(() => {
    const welcomeMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant' as const,
      content: persona.welcomeMessage,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [persona]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          persona: persona.id,
          userId: 'demo-user',
          context: persona.context
        })
      });

      const data = await response.json();
      
      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant' as const,
        content: data.response || 'Sorry, I encountered an error.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant' as const,
        content: 'Sorry, I\'m having trouble connecting right now. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 1 && (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Questions</h3>
            <div className="grid gap-3 max-w-md mx-auto">
              {persona.sampleMessages.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputMessage(sample);
                  }}
                  className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all text-sm text-gray-700 hover:text-gray-900"
                >
                  <div className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span>"{sample}"</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {message.role === 'user' ? <User className="w-4 h-4" /> : persona.icon}
              </div>
              
              <div className={`rounded-xl px-4 py-3 shadow-sm ${
                message.role === 'user'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}>
                <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                  <ReactMarkdown 
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                      pre: ({ children }) => <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto">{children}</pre>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
                <div className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700">
                {persona.icon}
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Input */}
      <div className="border-t border-gray-200 p-6 bg-white">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${persona.name}...`}
              className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              rows={1}
              style={{ minHeight: '52px', maxHeight: '120px' }}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className={`p-3 rounded-xl transition-all transform hover:scale-105 ${
              inputMessage.trim() && !isLoading
                ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}


export default App;
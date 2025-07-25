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
import { apiEndpoints } from './config';

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
    description: 'Clean professional design with sophisticated grays',
    colors: {
      primary: 'bg-gradient-to-r from-gray-900 to-gray-800',
      secondary: 'bg-gradient-to-br from-gray-50 to-white',
      background: 'bg-white',
      text: 'text-gray-900',
      border: 'border-gray-200',
      accent: 'text-gray-600'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Professional dark theme with sophisticated styling',
    colors: {
      primary: 'bg-gradient-to-r from-slate-700 to-slate-800',
      secondary: 'bg-gradient-to-br from-slate-700 to-slate-800',
      background: 'bg-slate-800',
      text: 'text-white',
      border: 'border-slate-600',
      accent: 'text-slate-300'
    }
  },
  {
    id: 'modern',
    name: 'Ocean',
    description: 'Professional ocean theme with calming blues',
    colors: {
      primary: 'bg-gradient-to-r from-blue-500 to-blue-600',
      secondary: 'bg-gradient-to-br from-blue-500 to-blue-600',
      background: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
      text: 'text-white',
      border: 'border-blue-400',
      accent: 'text-blue-100'
    }
  },
  {
    id: 'minimal',
    name: 'Mint',
    description: 'Ultra-clean minimal design with subtle mint accents',
    colors: {
      primary: 'bg-gradient-to-r from-slate-700 to-emerald-600',
      secondary: 'bg-gradient-to-br from-slate-50 to-emerald-50',
      background: 'bg-white',
      text: 'text-slate-900',
      border: 'border-slate-200',
      accent: 'text-emerald-600'
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
    fetch(apiEndpoints.health)
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

  const installCode = `git clone https://github.com/miasdk/gemini-chatbot.git
cd gemini-chatbot
npm install`;

  const setupCode = `# 1. Create your .env file
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
PORT=3001

# 2. Start the development servers
npm run dev          # Starts backend server (port 3001)
npm run dev:frontend # Starts frontend (port 3000)`;
  
  const usageCode = `// Copy the components you need from the project:
// - /client/components/ChatInterface (main chat component)
// - /client/components/ui/* (UI components)
// - /server/* (backend API)

// Example: Using ChatInterface in your React app
import { useState } from 'react';
import { ChatInterface } from './components/ChatInterface';

const personas = [
  { 
    id: 'tutor', 
    name: 'AI Tutor', 
    description: 'Educational guidance',
    icon: <Brain className="w-5 h-5" />,
    welcomeMessage: 'Hi! How can I help you learn?'
  }
];

function App() {
  const [selectedPersona, setSelectedPersona] = useState(personas[0]);
  
  return (
    <div className="app">
      <ChatInterface 
        persona={selectedPersona}
        key={selectedPersona.id}
      />
    </div>
  );
}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Bot className="w-8 h-8 text-gray-900" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Gemini ChatBot</h1>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    serverStatus === 'connected' ? 'bg-green-500' :
                    serverStatus === 'disconnected' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-xs text-gray-500">
                    {serverStatus === 'connected' ? 'Connected' : 
                     serverStatus === 'disconnected' ? 'Offline' : 'Starting...'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={() => {
                  setShowImplementation(!showImplementation);
                  setTimeout(() => {
                    const integrationSection = document.getElementById('integration-section');
                    if (integrationSection) {
                      integrationSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showImplementation 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Code className="w-4 h-4 inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Integration</span>
                <span className="sm:hidden">Code</span>
              </button>
              
              <a 
                href="https://github.com/miasdk/gemini-chatbot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium mb-8 hover:bg-gray-800 transition-colors cursor-pointer">
            <span>Powered by Google Gemini AI</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
          
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Smart Chat Component
            <span className="block text-gray-600 mt-2 sm:mt-3 text-xl sm:text-2xl md:text-3xl font-normal">For Modern Applications</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
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
      <div className="flex-1 bg-gray-50 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-gray-600 text-sm sm:text-base">Interactive demo with persona switching and theme customization</p>
            
            {/* Theme Selector */}
            <div className="mt-4 sm:mt-6 flex justify-center">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-3 sm:p-4 w-full max-w-md sm:max-w-none sm:w-auto">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Choose Theme</h4>
                <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setSelectedTheme(theme.id);
                        setChatKey(prev => prev + 1);
                      }}
                      className={cn(
                        "px-2 sm:px-3 py-2 rounded-lg text-xs font-medium transition-all text-center",
                        selectedTheme === theme.id
                          ? 'bg-gray-900 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 px-1">
                  {themes.find(t => t.id === selectedTheme)?.description}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">
            {/* Persona Selector */}
            <motion.div 
              className="w-full lg:w-64 bg-white rounded-2xl shadow-lg border border-gray-200 p-4"
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
                "flex-1 w-full lg:max-w-2xl rounded-2xl shadow-lg overflow-hidden",
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
              <div className="h-[400px] sm:h-[500px]">
                <ChatInterface 
                  key={`${chatKey}-${selectedTheme}`}
                  persona={selectedPersona}
                  theme={themes.find(t => t.id === selectedTheme)!}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Display Configurations Section */}
      <section className="bg-white py-12 sm:py-16 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Display Configurations</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              See how the chat component appears in different layouts and positions when integrated into your application
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Floating Bottom Right */}
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-gray-300 transition-colors">
                <div className="relative bg-white rounded-lg h-48 border border-gray-200 overflow-hidden mb-4">
                  {/* Mock app background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-50">
                    <div className="p-4">
                      <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  {/* Floating chat button */}
                  <div className="absolute bottom-4 right-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center shadow-lg">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Floating Chat Button</h3>
                <p className="text-sm text-gray-600 mb-3">Bottom-right floating button that expands into chat window</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">position: "bottom-right"</code>
              </div>
            </motion.div>

            {/* Embedded Sidebar */}
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-gray-300 transition-colors">
                <div className="relative bg-white rounded-lg h-48 border border-gray-200 overflow-hidden mb-4">
                  <div className="flex h-full">
                    {/* Main content */}
                    <div className="flex-1 bg-gradient-to-br from-green-50 to-gray-50 p-4">
                      <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    {/* Chat sidebar */}
                    <div className="w-24 bg-white border-l border-gray-200 p-2">
                      <div className="flex items-center space-x-1 mb-2">
                        <Bot className="w-3 h-3 text-gray-600" />
                        <div className="h-2 bg-gray-200 rounded flex-1"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                        <div className="h-1.5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-1.5 bg-blue-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Embedded Sidebar</h3>
                <p className="text-sm text-gray-600 mb-3">Integrated into your app's sidebar or navigation</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">position: "sidebar"</code>
              </div>
            </motion.div>

            {/* Modal/Popup */}
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-gray-300 transition-colors">
                <div className="relative bg-white rounded-lg h-48 border border-gray-200 overflow-hidden mb-4">
                  {/* Mock app background with overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-gray-50">
                    <div className="p-4 opacity-50">
                      <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  {/* Modal chat */}
                  <div className="absolute inset-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        <Bot className="w-3 h-3 text-gray-600" />
                        <div className="h-2 bg-gray-200 rounded w-12"></div>
                      </div>
                      <div className="w-3 h-3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                      <div className="h-1.5 bg-blue-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Modal Popup</h3>
                <p className="text-sm text-gray-600 mb-3">Centered modal overlay with backdrop blur</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">position: "modal"</code>
              </div>
            </motion.div>

            {/* Inline Chat */}
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-gray-300 transition-colors">
                <div className="relative bg-white rounded-lg h-48 border border-gray-200 overflow-hidden mb-4">
                  <div className="p-4 space-y-3">
                    {/* Page header */}
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    {/* Chat component inline */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="w-4 h-4 text-gray-600" />
                        <div className="h-2 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                        <div className="h-2 bg-blue-200 rounded w-3/4"></div>
                      </div>
                    </div>
                    {/* More content */}
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Inline Component</h3>
                <p className="text-sm text-gray-600 mb-3">Embedded directly within your page content</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">position: "inline"</code>
              </div>
            </motion.div>

            {/* Fullscreen */}
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-gray-300 transition-colors">
                <div className="relative bg-white rounded-lg h-48 border border-gray-200 overflow-hidden mb-4">
                  {/* Full chat interface */}
                  <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="bg-gray-900 text-white p-2 flex items-center space-x-2">
                      <Bot className="w-4 h-4" />
                      <div className="h-2 bg-gray-300 rounded w-20"></div>
                    </div>
                    {/* Messages */}
                    <div className="flex-1 p-3 space-y-2">
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-2 bg-blue-200 rounded w-1/2 ml-auto"></div>
                      <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    {/* Input */}
                    <div className="border-t border-gray-200 p-2">
                      <div className="h-3 bg-gray-100 rounded border"></div>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Fullscreen Chat</h3>
                <p className="text-sm text-gray-600 mb-3">Dedicated chat page or full viewport experience</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">position: "fullscreen"</code>
              </div>
            </motion.div>

            {/* Custom Theme */}
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-gray-300 transition-colors">
                <div className="relative bg-white rounded-lg h-48 border border-gray-200 overflow-hidden mb-4">
                  {/* Custom themed chat */}
                  <div className="h-full flex flex-col bg-gradient-to-br from-purple-900 to-blue-900">
                    {/* Header */}
                    <div className="bg-purple-800 text-white p-2 flex items-center space-x-2">
                      <Bot className="w-4 h-4" />
                      <div className="h-2 bg-purple-300 rounded w-16"></div>
                    </div>
                    {/* Messages */}
                    <div className="flex-1 p-3 space-y-2">
                      <div className="h-2 bg-purple-200 rounded w-3/4"></div>
                      <div className="h-2 bg-blue-200 rounded w-1/2 ml-auto"></div>
                      <div className="h-2 bg-purple-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Custom Themes</h3>
                <p className="text-sm text-gray-600 mb-3">Match your brand colors and design system</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">theme: custom</code>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                <Sparkles className="inline w-5 h-5 mr-2 text-blue-600" />
                Fully Customizable
              </h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Configure position, themes, personas, and behavior to match your application perfectly
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-sm">
                <span className="bg-white px-3 py-1 rounded-full border border-blue-200">
                  Custom Themes
                </span>
                <span className="bg-white px-3 py-1 rounded-full border border-blue-200">
                  TypeScript Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Instructions */}
      {showImplementation && (
        <section id="integration-section" className="bg-gray-100 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                <Code className="inline w-5 sm:w-6 h-5 sm:h-6 mr-2" />
                Integration Instructions
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">Add this AI chat component to your React application</p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">1. Clone & Install</h3>
                  <button 
                    onClick={() => copyToClipboard(installCode, 'install')}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {copiedCode === 'install' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode === 'install' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 sm:p-6 overflow-x-auto">
                  <code className="text-gray-100 text-xs sm:text-sm font-mono whitespace-pre">
                    {installCode}
                  </code>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">2. Setup & Run</h3>
                  <button 
                    onClick={() => copyToClipboard(setupCode, 'setup')}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {copiedCode === 'setup' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode === 'setup' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 sm:p-6 overflow-x-auto">
                  <code className="text-gray-100 text-xs sm:text-sm font-mono whitespace-pre">
                    {setupCode}
                  </code>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">3. Use Component</h3>
                  <button 
                    onClick={() => copyToClipboard(usageCode, 'usage')}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {copiedCode === 'usage' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode === 'usage' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 sm:p-6 overflow-x-auto">
                  <code className="text-gray-100 text-xs sm:text-sm font-mono whitespace-pre">
                    {usageCode}
                  </code>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">4. That's it! Your AI chat component is ready 🎉</h3>
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
      <footer className="bg-gray-900 text-white py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
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
function ChatInterface({ persona, theme }: { persona: PersonaConfig; theme: ThemeConfig }) {
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
      const response = await fetch(apiEndpoints.chat, {
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
      <div className={cn(
        "border-t p-6",
        theme.colors.background,
        theme.colors.border
      )}>
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${persona.name}...`}
              className={cn(
                "w-full p-4 rounded-xl resize-none focus:outline-none focus:ring-2 focus:border-transparent transition-all",
                theme.id === 'dark'
                  ? "bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-slate-500"
                  : theme.id === 'modern' 
                  ? "bg-blue-600 border border-blue-500 text-white placeholder-blue-200 focus:ring-blue-400"
                  : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-gray-900"
              )}
              rows={1}
              style={{ minHeight: '52px', maxHeight: '120px' }}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className={cn(
              "p-3 rounded-xl transition-all transform hover:scale-105",
              inputMessage.trim() && !isLoading
                ? `${theme.colors.primary} text-white hover:opacity-90 shadow-md`
                : theme.id === 'dark'
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : theme.id === 'modern'
                  ? 'bg-blue-500 text-blue-200 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            )}
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}


export default App;
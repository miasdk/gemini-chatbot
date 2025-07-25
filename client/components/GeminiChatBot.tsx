import React, { useState } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Lightbulb,
  Loader2,
  Minimize2,
  Maximize2,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

import { 
  GeminiChatBotProps, 
  CHAT_THEMES, 
  POSITION_STYLES, 
  DEFAULT_QUICK_SUGGESTIONS 
} from '../types';
import { useChatBot } from '../hooks/useChatBot';

export function GeminiChatBot({ 
  config, 
  context, 
  className = '',
  style,
  onMessageSent: onMessageSentProp,
  onMessageReceived: onMessageReceivedProp,
  onUsageLimitReached: _onUsageLimitReached,
  onError: onErrorProp,
  customMessageComponent: CustomMessage,
  customHeaderComponent: CustomHeader
}: GeminiChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const {
    messages,
    isLoading,
    inputMessage,
    usage,
    error,
    sendMessage,
    setInputMessage,
    clearMessages,
    canSendMessage
  } = useChatBot({
    ...config,
    onMessageSent: onMessageSentProp,
    onMessageReceived: onMessageReceivedProp,
    onError: onErrorProp
  }, context);

  const theme = CHAT_THEMES[config.theme || 'light'];
  const position = POSITION_STYLES[config.position || 'bottom-right'];
  const quickSuggestions = config.quickSuggestions || 
    DEFAULT_QUICK_SUGGESTIONS[config.persona || 'assistant'] || 
    DEFAULT_QUICK_SUGGESTIONS['assistant'];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const startNewChat = () => {
    // Welcome message is handled in useChatBot hook
  };

  // Floating chat button (closed state)
  if (!isOpen) {
    return (
      <div className={`${position} z-50 ${className}`} style={style}>
        <button
          onClick={() => {
            setIsOpen(true);
            if (messages.length === 0) {
              startNewChat();
            }
          }}
          className={`${theme.primary} text-white shadow-lg rounded-full w-14 h-14 p-0 hover:scale-105 transition-transform flex items-center justify-center`}
          title="Open AI Chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
        
        {/* Usage badge */}
        {usage && (
          <div className="absolute -top-2 -left-2 bg-orange-500 text-white text-xs rounded-full px-2 py-1 min-w-[24px] text-center">
            {usage.questionsUsed}/{usage.dailyLimit}
          </div>
        )}
      </div>
    );
  }

  // Chat window (open state)
  return (
    <div 
      className={`${position} z-50 ${theme.background} ${theme.border} border rounded-lg shadow-xl transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      } ${className}`}
      style={style}
    >
      {/* Chat Header */}
      {CustomHeader ? (
        <CustomHeader config={config} usage={usage} />
      ) : (
        <div className={`p-4 ${theme.border} border-b`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${theme.primary} rounded-full flex items-center justify-center`}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${theme.text}`}>
                  {config.persona === 'tutor' ? 'AI Tutor' :
                   config.persona === 'support' ? 'Support Agent' :
                   config.persona === 'codeReviewer' ? 'Code Reviewer' :
                   'AI Assistant'}
                </h3>
                {usage && (
                  <div className={`text-xs ${theme.textSecondary}`}>
                    {usage.questionsUsed}/{usage.dailyLimit} questions used
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-6 h-6 p-0 hover:bg-gray-100 rounded transition-colors"
                title={isMinimized ? 'Maximize' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              </button>
              
              <button
                onClick={clearMessages}
                className="w-6 h-6 p-0 hover:bg-gray-100 rounded transition-colors"
                title="Clear chat"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 p-0 hover:bg-gray-100 rounded transition-colors"
                title="Close chat"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          {/* Usage warning */}
          {usage && usage.questionsRemaining <= 2 && (
            <div className="bg-amber-50 border border-amber-200 rounded p-2 mt-2">
              <div className="text-xs text-amber-800 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {usage.questionsRemaining === 0 
                  ? "Daily limit reached. Resets tomorrow."
                  : `${usage.questionsRemaining} questions remaining today.`
                }
              </div>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-2 mt-2">
              <div className="text-xs text-red-800 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {error}
              </div>
            </div>
          )}
        </div>
      )}

      {!isMinimized && (
        <>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 h-[420px]">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id}>
                  {CustomMessage ? (
                    <CustomMessage message={message} />
                  ) : (
                    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-start space-x-2 max-w-[85%] ${
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user' 
                            ? `${theme.primary} text-white`
                            : `${theme.secondary} ${theme.textSecondary}`
                        }`}>
                          {message.role === 'user' ? (
                            <User className="w-3 h-3" />
                          ) : (
                            <Bot className="w-3 h-3" />
                          )}
                        </div>
                        
                        <div className={`rounded-lg p-3 text-sm ${
                          message.role === 'user'
                            ? `${theme.primary} text-white`
                            : `${theme.secondary} ${theme.text}`
                        }`}>
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          <div className={`text-xs mt-1 opacity-70 ${
                            message.role === 'user' 
                              ? 'text-blue-100' 
                              : theme.textSecondary
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className={`w-6 h-6 ${theme.secondary} rounded-full flex items-center justify-center`}>
                      <Bot className={`w-3 h-3 ${theme.textSecondary}`} />
                    </div>
                    <div className={`${theme.secondary} rounded-lg p-3`}>
                      <Loader2 className={`w-4 h-4 animate-spin ${theme.textSecondary}`} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
            </div>
          </div>

          {/* Chat Input */}
          <div className={`${theme.border} border-t p-4`}>
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  usage && usage.questionsRemaining === 0
                    ? "Daily limit reached..."
                    : config.placeholder || "Type your message..."
                }
                disabled={isLoading || (usage?.questionsRemaining === 0)}
                className={`flex-1 text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.background} ${theme.text} ${theme.border}`}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!canSendMessage}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  canSendMessage 
                    ? `${theme.primary} text-white`
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            
            {/* Quick suggestions */}
            {config.showQuickSuggestions !== false && messages.length <= 1 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {quickSuggestions.map((suggestion: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSuggestion(suggestion)}
                    className="inline-flex items-center px-2 py-1 text-xs border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Lightbulb className="w-3 h-3 mr-1" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
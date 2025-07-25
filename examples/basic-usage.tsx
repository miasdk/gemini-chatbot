import React from 'react';
import { GeminiChatBot } from '../client/components/GeminiChatBot';

// Example 1: Basic Educational Tutor
export function TutorExample() {
  return (
    <div>
      <h1>Python Learning Platform</h1>
      
      <GeminiChatBot
        config={{
          persona: 'tutor',
          userId: 'student_123',
          welcomeMessage: "Hi! I'm your Python tutor. What would you like to learn today?",
          theme: 'light',
          position: 'bottom-right',
          showQuickSuggestions: true,
          quickSuggestions: [
            "How do I use variables?",
            "Explain functions",
            "Help with my code",
            "What are data types?"
          ]
        }}
        context={{
          subject: 'Python Programming',
          userLevel: 'beginner',
          currentTopic: 'Variables and Data Types',
          customData: {
            course: 'Python Fundamentals',
            lesson: 'Lesson 1: Getting Started'
          }
        }}
        onMessageSent={(message) => {
          console.log('Student asked:', message);
        }}
        onMessageReceived={(response) => {
          console.log('Tutor responded:', response);
        }}
      />
    </div>
  );
}

// Example 2: Customer Support Agent
export function SupportExample() {
  return (
    <div>
      <h1>E-commerce Support</h1>
      
      <GeminiChatBot
        config={{
          persona: 'support',
          userId: 'customer_456',
          welcomeMessage: "Hello! I'm here to help with your order or any questions you have.",
          theme: 'light',
          position: 'bottom-left',
          placeholder: "How can I help you today?",
          maxMessages: 30
        }}
        context={{
          subject: 'Order Support',
          customData: {
            orderId: 'ORD-12345',
            customerTier: 'premium',
            lastOrderDate: '2024-01-15'
          }
        }}
        onUsageLimitReached={() => {
          alert('Please contact human support for further assistance.');
        }}
      />
    </div>
  );
}

// Example 3: Code Review Assistant
export function CodeReviewExample() {
  const [userCode, setUserCode] = React.useState(`
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
  `.trim());

  return (
    <div>
      <h1>Code Review Tool</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2>Your Code</h2>
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            className="w-full h-64 p-2 border rounded font-mono text-sm"
          />
        </div>
        
        <div>
          <h2>AI Code Review</h2>
          <p>Click the chat button to get feedback on your code!</p>
        </div>
      </div>

      <GeminiChatBot
        config={{
          persona: 'codeReviewer',
          userId: 'developer_789',
          welcomeMessage: "I'll help review your code! Share your code and I'll provide feedback.",
          theme: 'dark',
          position: 'bottom-right',
          quickSuggestions: [
            "Review my code",
            "How can I improve performance?",
            "Check for bugs",
            "Suggest best practices"
          ]
        }}
        context={{
          subject: 'Code Review',
          userLevel: 'intermediate',
          userCode: userCode,
          customData: {
            language: 'Python',
            codeType: 'algorithm',
            framework: 'none'
          }
        }}
      />
    </div>
  );
}

// Example 4: Custom Styled Chatbot
export function CustomStyledExample() {
  const customMessageComponent = ({ message }) => (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs px-4 py-2 rounded-lg ${
        message.role === 'user' 
          ? 'bg-blue-500 text-white rounded-br-none' 
          : 'bg-gray-200 text-gray-800 rounded-bl-none'
      }`}>
        <p className="text-sm">{message.content}</p>
        <p className="text-xs opacity-75 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <h1>Custom Styled Chat</h1>
      
      <GeminiChatBot
        config={{
          persona: 'assistant',
          userId: 'custom_user',
          welcomeMessage: "Welcome to our custom-styled chat!",
          theme: 'light',
          position: 'bottom-right'
        }}
        customMessageComponent={customMessageComponent}
        className="shadow-2xl border-2 border-purple-500"
        style={{ 
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      />
    </div>
  );
}

// Example 5: Multi-Domain Chat
export function MultiDomainExample() {
  const [currentDomain, setCurrentDomain] = React.useState('education');

  const domainConfigs = {
    education: {
      persona: 'tutor',
      welcomeMessage: "I'm your educational assistant. What subject would you like help with?",
      context: { subject: 'General Education', userLevel: 'student' }
    },
    business: {
      persona: 'assistant',
      welcomeMessage: "I'm here to help with business questions and strategy.",
      context: { subject: 'Business Consulting', customData: { department: 'strategy' } }
    },
    technical: {
      persona: 'codeReviewer',
      welcomeMessage: "I can help with technical problems and code review.",
      context: { subject: 'Software Development', userLevel: 'professional' }
    }
  };

  const currentConfig = domainConfigs[currentDomain];

  return (
    <div>
      <h1>Multi-Domain AI Assistant</h1>
      
      <div className="mb-4">
        <label className="mr-2">Choose Domain:</label>
        <select 
          value={currentDomain} 
          onChange={(e) => setCurrentDomain(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="education">Education</option>
          <option value="business">Business</option>
          <option value="technical">Technical</option>
        </select>
      </div>

      <GeminiChatBot
        key={currentDomain} // Re-mount when domain changes
        config={{
          ...currentConfig,
          userId: `user_${currentDomain}`,
          theme: 'light',
          position: 'bottom-right'
        }}
        context={currentConfig.context}
      />
    </div>
  );
}
# 🚀 Gemini ChatBot Integration Guide

This guide shows how to integrate the Gemini ChatBot into different types of applications.

## 📦 Installation & Setup

### 1. Copy Files to Your Project
```bash
# Copy the entire mini-project or specific files
cp -r mini-projects/gemini-chatbot /path/to/your/project/
```

### 2. Install Dependencies
```bash
npm install @google/generative-ai express cors dotenv react lucide-react
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Add your Gemini API key
echo "GEMINI_API_KEY=your_api_key_here" >> .env
```

## 🎯 Integration Patterns

### Pattern 1: Standalone Service
Run the chatbot as a separate microservice that any application can use.

```bash
# Start the chatbot server
npm run dev
# Server runs on http://localhost:3001
```

```javascript
// From any application, make API calls
const response = await fetch('http://localhost:3001/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "Hello!",
    persona: "tutor",
    userId: "user123"
  })
});
```

### Pattern 2: Embedded React Component
Import the React component directly into your app.

```jsx
import { GeminiChatBot } from './gemini-chatbot/client/components/GeminiChatBot';

function MyApp() {
  return (
    <div>
      <YourAppContent />
      
      <GeminiChatBot
        config={{
          persona: 'tutor',
          userId: 'current_user_id',
          apiUrl: 'http://localhost:3001' // or your API URL
        }}
      />
    </div>
  );
}
```

### Pattern 3: Express Middleware
Integrate the chatbot routes into your existing Express app.

```javascript
import express from 'express';
import { chatService } from './gemini-chatbot/server/chatbot.js';

const app = express();

// Your existing routes
app.get('/', (req, res) => res.send('My App'));

// Add chatbot routes
app.post('/api/chat', async (req, res) => {
  const response = await chatService.processMessage(req.body);
  res.json(response);
});

app.get('/api/chat/usage/:userId', (req, res) => {
  const usage = chatService.getUsageInfo(req.params.userId);
  res.json(usage);
});
```

## 🎨 Customization Examples

### Custom Personas
```javascript
// Define your own persona
const customPersona = {
  name: 'Medical Assistant',
  systemPrompt: `You are a medical information assistant. Provide helpful health information but always recommend consulting healthcare professionals for medical advice.
  
  GUIDELINES:
  1. Provide general health information
  2. Never diagnose medical conditions
  3. Always recommend consulting doctors
  4. Be empathetic and supportive`,
  temperature: 0.3,
  maxTokens: 400,
  fallbackResponse: "I recommend consulting with a healthcare professional for personalized medical advice."
};

// Add to server configuration
import { ConfigManager } from './server/config.js';
const config = ConfigManager.getInstance();
config.updatePersona('medical', customPersona);
```

### Custom Context Injection
```javascript
const chatbotConfig = {
  persona: 'tutor',
  userId: 'student123',
  // ... other config
};

const dynamicContext = {
  subject: 'Advanced Mathematics',
  userLevel: 'graduate',
  currentTopic: 'Differential Equations',
  userProgress: {
    completedTopics: ['algebra', 'calculus'],
    currentGrade: 'A-',
    strugglingWith: ['complex numbers']
  },
  customData: {
    university: 'MIT',
    course: 'MATH-18.03',
    professor: 'Dr. Smith',
    nextExam: '2024-02-15'
  }
};

<GeminiChatBot 
  config={chatbotConfig}
  context={dynamicContext}
/>
```

## 🏗️ Framework-Specific Integration

### Next.js Integration
```javascript
// pages/api/chat.js
import { chatService } from '../../gemini-chatbot/server/chatbot.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const response = await chatService.processMessage(req.body);
    res.json(response);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// components/ChatBot.jsx
import { GeminiChatBot } from '../gemini-chatbot/client/components/GeminiChatBot';

export default function ChatBot() {
  return (
    <GeminiChatBot
      config={{
        apiUrl: '/api',  // Use Next.js API routes
        persona: 'assistant',
        userId: 'nextjs_user'
      }}
    />
  );
}
```

### Vue.js Integration
```vue
<template>
  <div>
    <div ref="chatContainer"></div>
  </div>
</template>

<script>
import { createApp } from 'vue';
import { GeminiChatBot } from './gemini-chatbot/client/components/GeminiChatBot';

export default {
  mounted() {
    // Mount React component in Vue
    const chatApp = createApp({
      render: () => GeminiChatBot({
        config: {
          persona: 'assistant',
          userId: 'vue_user'
        }
      })
    });
    
    chatApp.mount(this.$refs.chatContainer);
  }
}
</script>
```

### Angular Integration
```typescript
// chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ChatService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  sendMessage(message: string, persona: string = 'assistant') {
    return this.http.post(`${this.apiUrl}/chat`, {
      message,
      persona,
      userId: 'angular_user'
    });
  }
}

// chat.component.ts
import { Component } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  template: `
    <div class="chat-container">
      <div *ngFor="let message of messages" class="message">
        {{ message.content }}
      </div>
      <input [(ngModel)]="inputMessage" (keyup.enter)="sendMessage()">
    </div>
  `
})
export class ChatComponent {
  messages: any[] = [];
  inputMessage = '';

  constructor(private chatService: ChatService) {}

  sendMessage() {
    this.chatService.sendMessage(this.inputMessage)
      .subscribe(response => {
        this.messages.push({ content: response.response, role: 'assistant' });
      });
  }
}
```

## 🔐 Security Considerations

### API Key Protection
```javascript
// Never expose API keys in frontend
// Use environment variables on server
const apiKey = process.env.GEMINI_API_KEY;

// For production, use a proxy pattern
app.post('/api/chat', authenticateUser, async (req, res) => {
  // Add user authentication
  // Rate limiting per user
  // Input sanitization
  const response = await chatService.processMessage({
    ...req.body,
    userId: req.user.id  // From authentication
  });
  res.json(response);
});
```

### Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

const chatRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many chat requests, please try again later.'
});

app.use('/api/chat', chatRateLimit);
```

## 📊 Analytics Integration

### Custom Analytics
```javascript
const chatConfig = {
  // ... other config
  onMessageSent: (message) => {
    // Track user messages
    analytics.track('Chat Message Sent', {
      userId: config.userId,
      persona: config.persona,
      messageLength: message.length
    });
  },
  onMessageReceived: (response) => {
    // Track AI responses
    analytics.track('Chat Response Received', {
      userId: config.userId,
      persona: config.persona,
      responseLength: response.length
    });
  },
  onUsageLimitReached: () => {
    // Track limit events
    analytics.track('Chat Usage Limit Reached', {
      userId: config.userId
    });
  }
};
```

## 🚀 Deployment Options

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  gemini-chatbot:
    build: .
    ports:
      - "3001:3001"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - NODE_ENV=production
```

### Cloud Deployment
```yaml
# Vercel deployment (vercel.json)
{
  "builds": [
    { "src": "server/index.ts", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/server/index.ts" }
  ]
}
```

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
```javascript
// Add CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}));
```

2. **API Key Issues**
```bash
# Check if API key is set
echo $GEMINI_API_KEY

# Test API directly
curl -X POST http://localhost:3001/api/health
```

3. **React Component Not Rendering**
```javascript
// Make sure all dependencies are installed
npm install react react-dom lucide-react

// Check console for errors
console.log('ChatBot component loaded');
```

## 📚 Additional Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [React Integration Examples](./examples/basic-usage.tsx)
- [Server API Reference](./README.md#api-endpoints)

## 🤝 Support

For integration help:
1. Check the examples in `/examples/`
2. Review the API documentation
3. Test with the included demo page
4. Open an issue in the repository

---

**Happy integrating! 🚀**
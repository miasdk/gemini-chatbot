# Smart Chat Component

A production-ready React component with intelligent AI personas powered by Google Gemini. Features TypeScript support, multiple themes, and responsive design for customer support, tutoring, and code assistance applications.

## Features

- **Google Gemini AI** - Fast, intelligent responses with Gemini 1.5 Flash
- **Multiple Personas** - Tutor, Assistant, Support Agent, Code Reviewer
- **TypeScript Ready** - Full type safety and IntelliSense support
- **Theme System** - 4 built-in themes with customization options
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Context Aware** - Domain-specific conversations with custom context
- **Easy Integration** - Copy components to your React application

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/miasdk/gemini-chatbot.git
cd gemini-chatbot
npm install
```

### 2. Environment Setup

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
PORT=3001
```

### 3. Run Development Servers

```bash
npm run dev          # Starts backend server (port 3001)
npm run dev:frontend # Starts frontend (port 3000)
```

Visit `http://localhost:3000` to see the interactive demo.

### 4. Use Components in Your App

Copy the components you need from the project:
- `/client/components/ChatInterface` - Main chat component
- `/client/components/ui/*` - UI components (buttons, etc.)
- `/server/*` - Backend API (optional, if you want your own server)

```tsx
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
}
```

## Available Personas

| Persona | Description | Best For |
|---------|-------------|----------|
| **Tutor** | Educational guidance without giving direct answers | Learning, homework help |
| **Assistant** | General-purpose AI for diverse tasks | Productivity, general questions |
| **Support** | Customer support with empathy | Help desk, troubleshooting |
| **Code Reviewer** | Expert code analysis and feedback | Development, code review |

## Configuration

### Component Props

```tsx
interface GeminiChatBotProps {
  config: {
    persona: 'tutor' | 'assistant' | 'support' | 'codeReviewer';
    userId: string;
    welcomeMessage?: string;
    theme?: 'light' | 'dark';
    position?: 'bottom-right' | 'bottom-left' | 'center';
    placeholder?: string;
    showQuickSuggestions?: boolean;
  };
  context?: Record<string, any>;
  onMessageSent?: (message: string) => void;
  onMessageReceived?: (response: string) => void;
  onError?: (error: string) => void;
}
```

### Server Configuration

```typescript
// server/config.ts
export const config = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-1.5-flash',
  },
  server: {
    port: 3001,
    corsOrigins: ['http://localhost:3000'],
  },
  chat: {
    dailyLimit: 50,
    rateLimitWindow: 15 * 60 * 1000, // 15 minutes
    rateLimitMax: 10,
  }
};
```

## API Endpoints

### Send Message
```
POST /api/chat
Content-Type: application/json

{
  "message": "How do I use React hooks?",
  "persona": "tutor",
  "userId": "user123",
  "context": {
    "subject": "React",
    "userLevel": "beginner"
  }
}
```

### Health Check
```
GET /api/health
```

### Usage Stats
```
GET /api/chat/usage/:userId
```

## Project Structure

```
gemini-chatbot/
├── client/                 # React frontend
│   ├── components/         # UI components
│   │   ├── ui/            # shadcn/ui components
│   │   └── GeminiChatBot.tsx
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities
│   └── types.ts           # TypeScript definitions
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── chatbot.ts        # Gemini integration
│   └── config.ts         # Configuration
└── examples/              # Usage examples
```

## Customization

### Custom Themes

```tsx
const customTheme = {
  primary: 'bg-blue-600',
  secondary: 'bg-gray-100',
  text: 'text-gray-900',
  background: 'bg-white',
  border: 'border-gray-200'
};
```

### Custom Personas

```typescript
const customPersona = {
  id: 'therapist',
  name: 'Wellness Coach',
  description: 'Supportive mental health guidance',
  systemPrompt: 'You are a compassionate wellness coach...',
  context: { specialty: 'mindfulness' }
};
```

## Security

- **API Key Protection** - Environment variables only
- **Rate Limiting** - Prevents abuse (10 requests/15min)
- **Input Validation** - Sanitized user inputs
- **CORS Security** - Configurable origins
- **Usage Limits** - Daily message limits per user

## Deployment

### Split Deployment (Recommended)

**Frontend (Vercel):**
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build` (builds client)
3. Set output directory: `dist`
4. Deploy automatically on push

**Backend (Render/Railway):**
1. Connect your GitHub repository to Render
2. Set build command: `npm install && npm run build:server`
3. Set start command: `node dist-server/index.js`
4. Add environment variables:
   ```
   GEMINI_API_KEY=your_api_key
   NODE_ENV=production
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   ```

### Full Stack Deployment

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:full
EXPOSE 3001
CMD ["npm", "start"]
```

**Single Platform:**
1. Deploy to Railway/Render/Heroku
2. Set build command: `npm run build:full`
3. Set start command: `npm start`
4. Add environment variables

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for the language model
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide Icons](https://lucide.dev/) for iconography

---

**Built with TypeScript, React, and modern web technologies**

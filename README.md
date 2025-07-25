# Smart Chat Component

A React component with intelligent AI personas powered by Google Gemini. Perfect for customer support, tutoring, and code assistance.

## Features

- **Google Gemini AI** - Fast, intelligent responses with Gemini 1.5 Flash
- **Multiple Personas** - Tutor, Assistant, Support Agent, Code Reviewer
- **TypeScript Ready** - Full type safety and IntelliSense support
- **Context Aware** - Domain-specific conversations with custom context
- **Easy Integration** - Drop into any React application

## Quick Start

### Installation

```bash
npm install @google/generative-ai express cors dotenv react lucide-react framer-motion
```

### Basic Usage

```tsx
import { GeminiChatBot } from './components/GeminiChatBot';

function App() {
  return (
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
  );
}
```

### Environment Setup

```bash
# .env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development
```

### Run the Demo

```bash
npm install
npm run build
npm start
```

Visit `http://localhost:3001` to see the interactive demo.

## Available Personas

| Persona | Description | Best For |
|---------|-------------|----------|
| **Tutor** | Educational guidance without giving direct answers | Learning, homework help |
| **Assistant** | General-purpose AI for diverse tasks | Productivity, general questions |
| **Support** | Customer support with empathy | Help desk, troubleshooting |
| **Code Reviewer** | Expert code analysis and feedback | Development, code review |

## ⚙️ Configuration

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

## 📡 API Endpoints

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

### Vercel
```bash
npm run build
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### Railway/Render
1. Connect your repository
2. Set environment variables
3. Deploy with `npm run build && npm start`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for the language model
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide Icons](https://lucide.dev/) for iconography

---

**Built with TypeScript, React, and modern web technologies**

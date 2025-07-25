import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { chatService } from './chatbot.js';
import { ChatRequest } from './types.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Basic rate limiting (in production, use Redis-based rate limiting)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 10; // 10 requests per window

function rateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const clientId = req.ip || 'unknown';
  const now = Date.now();

  const clientData = rateLimitMap.get(clientId);
  if (!clientData || clientData.resetTime < now) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }

  if (clientData.count >= RATE_LIMIT_MAX) {
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
    });
  }

  clientData.count += 1;
  next();
}

// ====================================
// CHAT ENDPOINTS
// ====================================

/**
 * POST /api/chat - Send a message to the chatbot
 */
app.post('/api/chat', rateLimit, async (req, res) => {
  try {
    const request: ChatRequest = {
      message: req.body.message,
      context: req.body.context,
      userId: req.body.userId || req.ip || 'anonymous',
      conversationId: req.body.conversationId,
      persona: req.body.persona || 'assistant'
    };

    // Validate required fields
    if (!request.message || typeof request.message !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Message is required and must be a string'
      });
    }

    const response = await chatService.processMessage(request);
    res.json(response);

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process chat message'
    });
  }
});

/**
 * GET /api/chat/usage/:userId - Get usage information for a user
 */
app.get('/api/chat/usage/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const usageInfo = chatService.getUsageInfo(userId);
    res.json(usageInfo);
  } catch (error) {
    console.error('Usage endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch usage information'
    });
  }
});

/**
 * GET /api/chat/conversation/:conversationId - Get conversation history
 */
app.get('/api/chat/conversation/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = chatService.getConversation(conversationId);
    
    if (!conversation) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Conversation not found'
      });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Conversation endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch conversation'
    });
  }
});

/**
 * GET /api/chat/conversations/:userId - Get all conversations for a user
 */
app.get('/api/chat/conversations/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = chatService.getUserConversations(userId);
    res.json({ conversations });
  } catch (error) {
    console.error('Conversations endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch conversations'
    });
  }
});

/**
 * DELETE /api/chat/conversation/:conversationId - Clear conversation history
 */
app.delete('/api/chat/conversation/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    const deleted = chatService.clearConversation(conversationId);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Conversation not found'
      });
    }

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Delete conversation endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete conversation'
    });
  }
});

// ====================================
// ADMIN/DEBUG ENDPOINTS
// ====================================

/**
 * GET /api/admin/stats - Get service statistics (for monitoring)
 */
app.get('/api/admin/stats', (req, res) => {
  try {
    // Simple auth check - in production, use proper authentication
    const authHeader = req.headers.authorization;
    const expectedAuth = process.env.ADMIN_TOKEN || 'admin-secret';
    
    if (authHeader !== `Bearer ${expectedAuth}`) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Valid admin token required'
      });
    }

    const stats = chatService.getServiceStats();
    res.json(stats);
  } catch (error) {
    console.error('Stats endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch service statistics'
    });
  }
});

/**
 * POST /api/admin/reset-usage/:userId - Reset usage for a user
 */
app.post('/api/admin/reset-usage/:userId', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const expectedAuth = process.env.ADMIN_TOKEN || 'admin-secret';
    
    if (authHeader !== `Bearer ${expectedAuth}`) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Valid admin token required'
      });
    }

    const { userId } = req.params;
    chatService.resetUserUsage(userId);
    
    res.json({
      message: `Usage reset successfully for user ${userId}`
    });
  } catch (error) {
    console.error('Reset usage endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to reset user usage'
    });
  }
});

// ====================================
// UTILITY ENDPOINTS
// ====================================

/**
 * GET /api/health - Health check endpoint
 */
app.get('/api/health', (_, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime()
  });
});

/**
 * GET /api/config - Get public configuration information
 */
app.get('/api/config', (_, res) => {
  try {
    const config = chatService.getServiceStats().config;
    
    // Return only safe config info (no secrets)
    res.json({
      model: config.model,
      defaultPersona: config.defaultPersona,
      availablePersonas: config.availablePersonas,
      dailyLimit: config.dailyLimit,
      usageTracking: config.usageTracking,
      environment: config.nodeEnv
    });
  } catch (error) {
    console.error('Config endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch configuration'
    });
  }
});

// ====================================
// STATIC FILE SERVING (for demo)
// ====================================

// Serve static files from dist directory (built React app)
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

// Serve static files from dist directory if it exists
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  
  // Catch-all handler for SPA routing - serve index.html for non-API routes
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({
        error: 'Not found',
        message: 'API endpoint not found'
      });
    }
    
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Frontend not built. Run `npm run build` first.');
    }
  });
} else {
  // Fallback for development - serve basic HTML
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({
        error: 'Not found',
        message: 'API endpoint not found'
      });
    }
    
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Gemini ChatBot - Development</title>
          <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f8fafc; }
              .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin: 2rem 0; }
              .status { background: #fef3c7; color: #92400e; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
              .endpoint { background: #f1f5f9; padding: 12px; margin: 8px 0; border-radius: 6px; font-family: monospace; }
              code { background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-family: monospace; }
              .command { background: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 8px; font-family: monospace; overflow-x: auto; }
              .title { color: #1e293b; margin-bottom: 1rem; }
          </style>
      </head>
      <body>
          <div class="card">
              <h1 class="title">🤖 Gemini ChatBot API - Development Mode</h1>
              
              <div class="status">
                  <strong>⚠️ Frontend not built:</strong> Run the commands below to see the full landing page.
              </div>
              
              <h2>🚀 Quick Start:</h2>
              <div class="command">npm run build && npm start</div>
              
              <h2>📡 Available API Endpoints:</h2>
              <div class="endpoint">POST /api/chat - Send a message to the chatbot</div>
              <div class="endpoint">GET /api/chat/usage/:userId - Get usage information</div>
              <div class="endpoint">GET /api/health - Health check endpoint</div>
              <div class="endpoint">GET /api/config - Get public configuration</div>
              
              <h2>🧪 Test API Directly:</h2>
              <div class="command">curl -X POST http://localhost:${PORT}/api/chat \\
    -H "Content-Type: application/json" \\
    -d '{
      "message": "Hello! Can you introduce yourself?",
      "persona": "tutor",
      "userId": "dev-user",
      "context": {
        "subject": "Testing",
        "userLevel": "beginner"
      }
    }'</div>
              
              <p><strong>💡 Tip:</strong> For the full landing page experience with live demos, build the frontend first!</p>
          </div>
      </body>
      </html>
    `);
  });
}

// Error handling middleware
app.use((err: Error, _: express.Request, res: express.Response, __: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Gemini ChatBot API server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`⚙️  Configuration: http://localhost:${PORT}/api/config`);
  
  // Log environment info
  try {
    const stats = chatService.getServiceStats();
    console.log(`🤖 Default persona: ${stats.config.defaultPersona}`);
    console.log(`🎭 Available personas: ${stats.config.availablePersonas.join(', ')}`);
    console.log(`📊 Daily limit: ${stats.config.dailyLimit} messages`);
    console.log(`🔑 Gemini API: ${stats.config.hasApiKey ? 'Connected ✅' : 'Missing ❌'}`);
  } catch (error) {
    console.error('❌ Startup configuration check failed:', error);
  }
});
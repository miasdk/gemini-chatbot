import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatRequest, ChatResponse, UsageInfo, ConversationHistory, ChatMessage } from './types.js';
import { ConfigManager } from './config.js';

export class GeminiChatService {
  private genAI: GoogleGenerativeAI;
  private config: ConfigManager;
  private conversations: Map<string, ConversationHistory> = new Map();
  private usageTracking: Map<string, { count: number; resetDate: Date }> = new Map();

  constructor() {
    this.config = ConfigManager.getInstance();
    const { apiKey } = this.config.getConfig();
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Process a chat message and return AI response
   */
  async processMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const { message, context, userId = 'anonymous', conversationId, persona = 'assistant' } = request;

      // Check usage limits
      if (this.config.getConfig().usageTracking && userId !== 'anonymous') {
        const usageCheck = this.checkUsageLimit(userId);
        if (!usageCheck.allowed) {
          return {
            response: `You've reached your daily limit of ${this.config.getConfig().dailyLimit} messages. Your limit resets at ${usageCheck.resetTime}.`,
            model: this.config.getConfig().model,
            error: true
          };
        }
      }

      // Get persona configuration
      const personaConfig = this.config.getPersona(persona);
      
      // Create context-aware system prompt
      const systemPrompt = this.config.createSystemPrompt(persona, context);
      const fullPrompt = `${systemPrompt}\n\nUser Message: ${message}`;

      // Configure AI model
      const model = this.genAI.getGenerativeModel({
        model: this.config.getConfig().model,
        generationConfig: {
          maxOutputTokens: personaConfig.maxTokens,
          temperature: personaConfig.temperature,
        },
      });

      // Generate response
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const aiResponse = response.text();

      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      // Update usage tracking
      if (this.config.getConfig().usageTracking && userId !== 'anonymous') {
        this.updateUsageCount(userId);
      }

      // Store conversation if conversationId provided
      if (conversationId) {
        this.storeConversation(conversationId, userId, message, aiResponse, context);
      }

      // Log interaction for analytics
      this.logInteraction(userId, persona, context);

      return {
        response: aiResponse,
        model: this.config.getConfig().model,
        conversationId
      };

    } catch (error) {
      console.error('Gemini Chat Service error:', error);
      
      // Return fallback response
      const personaConfig = this.config.getPersona(request.persona || 'assistant');
      
      return {
        response: personaConfig.fallbackResponse,
        model: this.config.getConfig().model,
        error: true
      };
    }
  }

  /**
   * Get usage information for a user
   */
  getUsageInfo(userId: string): UsageInfo {
    const dailyLimit = this.config.getConfig().dailyLimit;
    const usage = this.usageTracking.get(userId);
    
    if (!usage || usage.resetDate < new Date()) {
      return {
        questionsUsed: 0,
        questionsRemaining: dailyLimit,
        resetDate: this.getNextResetDate().toISOString(),
        model: this.config.getConfig().model,
        dailyLimit
      };
    }

    return {
      questionsUsed: usage.count,
      questionsRemaining: Math.max(0, dailyLimit - usage.count),
      resetDate: usage.resetDate.toISOString(),
      model: this.config.getConfig().model,
      dailyLimit
    };
  }

  /**
   * Get conversation history
   */
  getConversation(conversationId: string): ConversationHistory | null {
    return this.conversations.get(conversationId) || null;
  }

  /**
   * Get all conversations for a user
   */
  getUserConversations(userId: string): ConversationHistory[] {
    return Array.from(this.conversations.values())
      .filter(conv => conv.userId === userId)
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
  }

  /**
   * Clear conversation history
   */
  clearConversation(conversationId: string): boolean {
    return this.conversations.delete(conversationId);
  }

  /**
   * Reset usage for a user (admin function)
   */
  resetUserUsage(userId: string): void {
    this.usageTracking.delete(userId);
  }

  /**
   * Get service statistics
   */
  getServiceStats() {
    const totalConversations = this.conversations.size;
    const totalUsers = new Set(Array.from(this.conversations.values()).map(c => c.userId)).size;
    const totalMessages = Array.from(this.conversations.values())
      .reduce((sum, conv) => sum + conv.messages.length, 0);

    return {
      totalConversations,
      totalUsers,
      totalMessages,
      activeUsersToday: this.getActiveUsersCount(),
      serviceUptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      config: this.config.getEnvironmentInfo()
    };
  }

  // Private helper methods

  private checkUsageLimit(userId: string): { allowed: boolean; resetTime?: string } {
    const dailyLimit = this.config.getConfig().dailyLimit;
    const usage = this.usageTracking.get(userId);
    
    if (!usage || usage.resetDate < new Date()) {
      return { allowed: true };
    }

    if (usage.count >= dailyLimit) {
      return { 
        allowed: false, 
        resetTime: usage.resetDate.toLocaleString() 
      };
    }

    return { allowed: true };
  }

  private updateUsageCount(userId: string): void {
    const today = new Date();
    const resetDate = this.getNextResetDate();
    const usage = this.usageTracking.get(userId);

    if (!usage || usage.resetDate < today) {
      this.usageTracking.set(userId, { count: 1, resetDate });
    } else {
      usage.count += 1;
    }
  }

  private getNextResetDate(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }

  private storeConversation(
    conversationId: string, 
    userId: string, 
    message: string, 
    response: string, 
    context?: any
  ): void {
    const now = new Date();
    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message,
      response,
      timestamp: now,
      userId,
      conversationId
    };

    const existing = this.conversations.get(conversationId);
    if (existing) {
      existing.messages.push(chatMessage);
      existing.lastMessageAt = now;
    } else {
      this.conversations.set(conversationId, {
        id: conversationId,
        userId,
        messages: [chatMessage],
        startedAt: now,
        lastMessageAt: now,
        context
      });
    }

    // Cleanup old conversations (keep last 100 per user)
    this.cleanupOldConversations(userId);
  }

  private cleanupOldConversations(userId: string): void {
    const userConversations = this.getUserConversations(userId);
    if (userConversations.length > 100) {
      const toDelete = userConversations.slice(100);
      toDelete.forEach(conv => this.conversations.delete(conv.id));
    }
  }

  private getActiveUsersCount(): number {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return Array.from(this.usageTracking.entries())
      .filter(([_, usage]) => usage.resetDate > oneDayAgo)
      .length;
  }

  private logInteraction(userId: string, persona: string, context?: any): void {
    const logData = {
      timestamp: new Date().toISOString(),
      userId,
      persona,
      hasContext: !!context,
      contextType: context?.subject || context?.problem?.title || 'general'
    };
    
    // In production, you might want to send this to a logging service
    console.log('Chat Interaction:', JSON.stringify(logData));
  }
}

// Export singleton instance
export const chatService = new GeminiChatService();
import dotenv from 'dotenv';
import { DEFAULT_CONFIG, PERSONA_TEMPLATES } from './types.js';
// Load environment variables
dotenv.config();
export class ConfigManager {
    constructor() {
        this.config = this.loadConfig();
    }
    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
    loadConfig() {
        // Validate required environment variables
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY environment variable is required');
        }
        return {
            apiKey,
            model: process.env.GEMINI_MODEL || DEFAULT_CONFIG.model,
            defaultPersona: process.env.DEFAULT_PERSONA || DEFAULT_CONFIG.defaultPersona,
            usageTracking: process.env.USAGE_TRACKING !== 'false',
            dailyLimit: parseInt(process.env.DAILY_MESSAGE_LIMIT || '50'),
            rateLimit: {
                windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
                maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10')
            },
            personas: {
                ...PERSONA_TEMPLATES,
                // Allow custom persona overrides via environment
                ...(process.env.CUSTOM_PERSONAS ? JSON.parse(process.env.CUSTOM_PERSONAS) : {})
            }
        };
    }
    getConfig() {
        return this.config;
    }
    getPersona(personaName) {
        return this.config.personas[personaName] || this.config.personas[this.config.defaultPersona];
    }
    updatePersona(personaName, persona) {
        this.config.personas[personaName] = persona;
    }
    // Create context-aware system prompt
    createSystemPrompt(personaName, context) {
        const persona = this.getPersona(personaName);
        let systemPrompt = persona.systemPrompt;
        // Inject context if provided
        if (context) {
            systemPrompt += '\n\nCURRENT CONTEXT:';
            if (context.subject) {
                systemPrompt += `\n- Subject: ${context.subject}`;
            }
            if (context.userLevel) {
                systemPrompt += `\n- User Level: ${context.userLevel}`;
            }
            if (context.currentTopic) {
                systemPrompt += `\n- Current Topic: ${context.currentTopic}`;
            }
            // Educational context (for tutor persona)
            if (context.problem) {
                systemPrompt += `\n- Problem: "${context.problem.title}" (${context.problem.difficulty})`;
                systemPrompt += `\n- Problem Description: ${context.problem.description}`;
                if (context.problem.researchTopics) {
                    systemPrompt += `\n- Research Topics: ${context.problem.researchTopics.join(', ')}`;
                }
            }
            if (context.userCode) {
                systemPrompt += `\n\nUSER'S CURRENT CODE:\n\`\`\`\n${context.userCode}\n\`\`\``;
            }
            if (context.hintsUsed) {
                systemPrompt += `\n- Hints Used: ${context.hintsUsed}`;
            }
            // Custom context data
            if (context.customData) {
                systemPrompt += '\n\nADDITIONAL CONTEXT:';
                Object.entries(context.customData).forEach(([key, value]) => {
                    systemPrompt += `\n- ${key}: ${value}`;
                });
            }
        }
        return systemPrompt;
    }
    // Environment info for debugging
    getEnvironmentInfo() {
        return {
            nodeEnv: process.env.NODE_ENV || 'development',
            port: process.env.PORT || 3001,
            hasApiKey: !!process.env.GEMINI_API_KEY,
            model: this.config.model,
            defaultPersona: this.config.defaultPersona,
            availablePersonas: Object.keys(this.config.personas),
            dailyLimit: this.config.dailyLimit,
            usageTracking: this.config.usageTracking
        };
    }
}

import responses from '../data/chatbot-responses.json';

// js utility class
class Chatbot {
    constructor() {
        this.responses = responses;
        this.conversationHistory = [];
    }

    findResponse(input) {
        const lowerInput = input.toLowerCase().trim();
        
        // Check each category
        for (const [category, data] of Object.entries(this.responses)) {
        if (category === 'default') continue;
        
        // Check if input matches any pattern
        if (data.patterns && data.patterns.some(pattern => 
            lowerInput.includes(pattern) || pattern.includes(lowerInput)
        )) {
            // Return random response from matched category
            const randomIndex = Math.floor(Math.random() * data.responses.length);
            return {
            response: data.responses[randomIndex],
            category
            };
        }
        }
        
        // Default response
        const defaultResponses = this.responses.default.responses;
        const randomIndex = Math.floor(Math.random() * defaultResponses.length);
        return {
        response: defaultResponses[randomIndex],
        category: 'default'
        };
    }

    // Optional: Add context awareness
    addContext(input, response) {
        this.conversationHistory.push({
        input,
        response,
        timestamp: new Date()
        });
        
        // Keep only last 10 messages
        if (this.conversationHistory.length > 10) {
        this.conversationHistory.shift();
        }
    }

    getResponse(input) {
        const result = this.findResponse(input);
        this.addContext(input, result.response);
        return result;
    }
}

export const chatbot = new Chatbot();
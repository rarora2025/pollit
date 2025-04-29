require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
    origin: ['https://rarora2025.github.io', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

// Debug endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// API root endpoint
app.get('/api', (req, res) => {
    res.json({ 
        message: 'API is running',
        endpoints: {
            news: '/api/news',
            generateContent: '/api/generate-content'
        }
    });
});

// News API endpoint
app.get('/api/news', async (req, res) => {
    try {
        console.log('Fetching news...');
        console.log('NEWS_API_KEY:', process.env.NEWS_API_KEY ? 'Set' : 'Not set');
        
        if (!process.env.NEWS_API_KEY) {
            throw new Error('NEWS_API_KEY is not defined');
        }

        const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`;
        console.log('Fetching from URL:', url);

        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`NewsAPI responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('News API response:', data);
        
        if (data.status === 'error') {
            throw new Error(`NewsAPI error: ${data.message}`);
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ 
            error: 'Failed to fetch news', 
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// OpenAI API endpoint
app.post('/api/generate-content', async (req, res) => {
    try {
        console.log('Generating content...');
        console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');
        
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not defined');
        }

        const { article } = req.body;
        if (!article) {
            throw new Error('Article data is required');
        }
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a political analyst. Generate a simple, engaging poll question with 3 clear answer choices and a concise summary for the given news article. The question should be easy to understand without prior knowledge. Format your response exactly like this:\n\nQuestion: [Your question here]\n\nOptions:\n- [First option]\n- [Second option]\n- [Third option]\n\nSummary: [Your summary here]"
                    },
                    {
                        role: "user",
                        content: `Article: ${article.title}\n\n${article.description}\n\nGenerate a poll question, three options, and a summary.`
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('OpenAI API response:', data);
        res.json(data);
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({ 
            error: 'Failed to generate content', 
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Environment variables loaded:', {
        NEWS_API_KEY: process.env.NEWS_API_KEY ? 'Set' : 'Not set',
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Set' : 'Not set'
    });
}); 
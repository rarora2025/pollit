require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// News API endpoint
app.get('/api/news', async (req, res) => {
    try {
        if (!process.env.NEWS_API_KEY) {
            throw new Error('NEWS_API_KEY is not defined');
        }

        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// OpenAI API endpoint
app.post('/api/generate-content', async (req, res) => {
    try {
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

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Environment variables loaded:', {
        NEWS_API_KEY: process.env.NEWS_API_KEY ? 'Set' : 'Not set',
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Set' : 'Not set'
    });
}); 
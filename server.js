require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Endpoint to handle OpenAI API calls
app.post('/api/generate-poll', async (req, res) => {
    try {
        const { title, description } = req.body;
        
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
                        content: "Generate a simple poll question and exactly 5 answer choices based on the news article. Keep it concise and engaging. Do not include any prefixes, numbering, or formatting. Just provide the raw question and answers, one per line. The first line should be the question, followed by 5 answer choices."
                    },
                    {
                        role: "user",
                        content: `Article title: ${title}\nDescription: ${description}`
                    }
                ],
                max_tokens: 150
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ error: 'Failed to generate poll content' });
    }
});

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 
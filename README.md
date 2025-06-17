# Poll.it

A news polling application that allows users to vote on news articles and share their opinions.

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/rarora2025/pollit.git
cd pollit
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
NEWS_API_KEY=your_news_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
UNSPLASH_API_KEY=your_unsplash_api_key_here
PORT=3000
```

4. Run the application:
```bash
npm start
```

The application will be available at http://localhost:3000

## Environment Variables

- `NEWS_API_KEY`: Your News API key from https://newsapi.org
- `OPENAI_API_KEY`: Your OpenAI API key
- `UNSPLASH_API_KEY`: Your Unsplash API key (optional, will use fallback images if not provided)
- `PORT`: The port number to run the server on (default: 3000)

## Features

- Real-time news updates
- Interactive polls for each article
- Category-based news browsing
- Responsive design
- Image fallbacks for missing article images

## Technologies Used

- Node.js
- Express.js
- News API
- OpenAI API
- Unsplash API
- HTML5/CSS3
- JavaScript

## License

© 2025 Rahul Arora. All rights reserved. 
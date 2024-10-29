const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize YouTube API
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

// Initialize Google Custom Search API
const customSearch = google.customsearch('v1');

// Helper function to get search rankings
const calculateRanking = (item) => {
  let score = 0;
  if (item.statistics) {
    score += parseInt(item.statistics.viewCount || 0) * 0.4;
    score += parseInt(item.statistics.likeCount || 0) * 0.6;
  }
  return score;
};

// YouTube search endpoint
app.get('/api/search/youtube', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await youtube.search.list({
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: 10,
      key: process.env.YOUTUBE_API_KEY,
    });

    const videoIds = response.data.items.map((item) => item.id.videoId);
    const statsResponse = await youtube.videos.list({
      part: 'statistics',
      id: videoIds.join(','),
      key: process.env.YOUTUBE_API_KEY,
    });

    const results = response.data.items.map((item, index) => ({
      type: 'video',
      title: item.snippet.title,
      link: `https://youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.medium.url,
      description: item.snippet.description,
      statistics: statsResponse.data.items[index]?.statistics,
      ranking: calculateRanking(statsResponse.data.items[index]),
    }));

    results.sort((a, b) => b.ranking - a.ranking);
    res.json(results);
  } catch (error) {
    console.error('Error in YouTube search:', error.response ? error.response.data : error);
    res.status(500).json({ error: 'An error occurred while searching YouTube' });
  }
});

// Google Custom Search endpoint for articles and blogs
app.get('/api/search/articles', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await customSearch.cse.list({
      auth: process.env.GOOGLE_API_KEY,
      cx: process.env.GOOGLE_CSE_ID,
      q: query,
      num: 10,
    });

    const results = response.data.items.map((item) => ({
      type: 'article',
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      source: item.displayLink,
    }));

    res.json(results);
  } catch (error) {
    console.error('Error in article search:', error.response ? error.response.data : error);
    res.status(500).json({ error: 'An error occurred while searching for articles' });
  }
});

// Academic papers search endpoint (using Semantic Scholar API)
app.get('/api/search/papers', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(
      `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=10&fields=title,abstract,url,year,citationCount`
    );

    const results = response.data.data.map((paper) => ({
      type: 'paper',
      title: paper.title,
      abstract: paper.abstract,
      link: paper.url,
      year: paper.year,
      citations: paper.citationCount,
    }));

    results.sort((a, b) => (b.citations || 0) - (a.citations || 0));
    res.json(results);
  } catch (error) {
    console.error('Error in papers search:', error.response ? error.response.data : error);
    res.status(500).json({ error: 'An error occurred while searching for academic papers' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import ResultsSection from './components/ResultsSection';

function App() {
  const [results, setResults] = useState({
    videos: [],
    articles: [],
    papers: [],
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ contentType: 'all' });

  const handleSearch = async (query, contentType = 'all') => {
    setLoading(true);
    setFilters({ contentType });

    try {
      const [videosRes, articlesRes, papersRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/api/search/youtube?query=${query}`),
        fetch(`${process.env.REACT_APP_API_URL}/api/search/articles?query=${query}`),
        fetch(`${process.env.REACT_APP_API_URL}/api/search/papers?query=${query}`),
      ]);

      const [videos, articles, papers] = await Promise.all([
        videosRes.json(),
        articlesRes.json(),
        papersRes.json(),
      ]);

      setResults({ videos, articles, papers });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Search Aggregator</h1>
      </header>
      <main className="main-content">
        <SearchBar onSearch={handleSearch} loading={loading} />
        <ResultsSection
          results={results}
          loading={loading}
          filters={filters}
          onSearch={handleSearch}
        />
      </main>
    </div>
  );
}

export default App;
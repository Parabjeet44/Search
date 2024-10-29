import React from 'react';
import VideoCard from './VideoCard';
import ArticleCard from './ArticleCard';
import PaperCard from './PaperCard';

function ResultsSection({ results, loading, filters, onSearch }) {
  const filteredResults = {
    videos: filters.contentType === 'all' || filters.contentType === 'video' ? results.videos : [],
    articles: filters.contentType === 'all' || filters.contentType === 'article' ? results.articles : [],
    papers: filters.contentType === 'all' || filters.contentType === 'paper' ? results.papers : [],
  };

  return (
    <div className="results-section">
      <div className="filters">
        <button
          className={`filter-btn ${filters.contentType === 'all' ? 'active' : ''}`}
          onClick={() => onSearch(filters.query, 'all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filters.contentType === 'video' ? 'active' : ''}`}
          onClick={() => onSearch(filters.query, 'video')}
        >
          Videos
        </button>
        <button
          className={`filter-btn ${filters.contentType === 'article' ? 'active' : ''}`}
          onClick={() => onSearch(filters.query, 'article')}
        >
          Articles
        </button>
        <button
          className={`filter-btn ${filters.contentType === 'paper' ? 'active' : ''}`}
          onClick={() => onSearch(filters.query, 'paper')}
        >
          Academic Papers
        </button>
      </div>
      {loading ? (
        <div className="loading">Loading results...</div>
      ) : (
        <>
          {filteredResults.videos.length > 0 && (
            <div className="results-column">
              <h2>Videos</h2>
              {filteredResults.videos.map((video, index) => (
                <VideoCard key={index} video={video} />
              ))}
            </div>
          )}
          {filteredResults.articles.length > 0 && (
            <div className="results-column">
              <h2>Articles</h2>
              {filteredResults.articles.map((article, index) => (
                <ArticleCard key={index} article={article} />
              ))}
            </div>
          )}
          {filteredResults.papers.length > 0 && (
            <div className="results-column">
              <h2>Academic Papers</h2>
              {filteredResults.papers.map((paper, index) => (
                <PaperCard key={index} paper={paper} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ResultsSection;
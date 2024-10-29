import React from 'react';

function ArticleCard({ article }) {
  return (
    <div className="card article-card">
      <div className="card-content">
        <a href={article.link} target="_blank" rel="noopener noreferrer">
          {article.title}
        </a>
        <div className="article-source">{article.source}</div>
        <p className="article-snippet">{article.snippet}</p>
      </div>
    </div>
  );
}

export default ArticleCard;
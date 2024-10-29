import React from 'react';

function PaperCard({ paper }) {
  return (
    <div className="card paper-card">
      <div className="card-content">
        <a href={paper.link} target="_blank" rel="noopener noreferrer">
          {paper.title}
        </a>
        <div className="paper-meta">
          Year: {paper.year} | Citations: {paper.citations}
        </div>
        <p className="paper-abstract">
          {paper.abstract?.slice(0, 150)}...
        </p>
      </div>
    </div>
  );
}

export default PaperCard;
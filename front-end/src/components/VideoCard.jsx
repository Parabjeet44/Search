import React from 'react';

function VideoCard({ video }) {
  return (
    <div className="card video-card">
      <img src={video.thumbnail} alt={video.title} />
      <div className="card-content">
        <a href={video.link} target="_blank" rel="noopener noreferrer">
          {video.title}
        </a>
        <div className="video-stats">
          {video.statistics?.viewCount?.toLocaleString()} views
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
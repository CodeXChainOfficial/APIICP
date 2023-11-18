import React from 'react';

interface CardProps {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  imageSrc: string;
}

const Card: React.FC<CardProps> = ({ id, title, subtitle, time, imageSrc }) => {
  return (
    <label className="card" htmlFor={id}>
      <img src={imageSrc} alt={title} />
      <div className="song-info">
        <div className="title">{title}</div>
        <div className="sub-line">
          <div className="subtitle">{subtitle}</div>
          <div className="time">{time}</div>
        </div>
      </div>
    </label>
  );
};

export default Card;

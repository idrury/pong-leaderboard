import React from 'react';
import './PlayerHome.css'; // You might need to create this file
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PlayerHome: React.FC = () => {
  const [eventId, setEventId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle event ID submission logic here
    console.log('Event ID:', eventId);
   navigate(eventId)
  };

  return (
    <div className="player-home-page">
      <div className="player-home-container">
        <h1>Player Home</h1>
        <p>Welcome to your Ping-Pong-A-Thon dashboard!</p>

        {/* More player-specific content can go here */}
        <div className="stats-container">
          <h2>Your Stats</h2>
          <p>Hello World! This is your player dashboard.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className='event-id-input'
          type="text"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          placeholder="Event ID"
          required
        />
        <br />
        <button type="submit">Enter</button>
      </form>
    </div>
  );
};

export default PlayerHome;
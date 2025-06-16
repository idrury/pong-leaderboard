import React, { useState } from 'react';
import './EventId.css';

const EventId: React.FC = () => {
  const [eventId, setEventId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle event ID submission logic here
    console.log('Event ID:', eventId);
  };

  return (
    <div className="event-id-page">
      <div className="event-id-container">
        <h1>Enter Event ID</h1>
        <p>Please enter your event ID to access the leaderboard</p>

        <form onSubmit={handleSubmit}>
          <input
            className='event-id-input'
            type="text"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            placeholder="Event ID"
            required
          />
          <button type="submit">Enter</button>
        </form>
      </div>
    </div>
  );
};

export default EventId;
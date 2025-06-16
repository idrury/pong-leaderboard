import React, { useState } from 'react';
import './EventId.css';
import IonIcon from '@reacticons/ionicons';

const EventId: React.FC = () => {
  const [eventId, setEventId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle event ID submission logic here
    console.log('Event ID:', eventId);
  };

  return (
    <div className="event-id-page gradient-bg">
      <div className="event-id-container">
        <IonIcon name="trophy-outline" style={{ fontSize: 48, color: '#146679', marginBottom: 16 }} />
        <h1 style={{ marginBottom: 8, color: '#124450', fontWeight: 700 }}>Enter Event ID</h1>
        <p style={{ marginBottom: 24, color: '#333', fontSize: 18 }}>Please enter your event ID to access the leaderboard</p>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            className='event-id-input'
            type="text"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            placeholder="Event ID"
            required
            style={{ marginBottom: 16, textAlign: 'center', background: '#f7fafc', border: '1.5px solid #146679', fontWeight: 500 }}
          />
          <button type="submit" className="event-id-btn">Enter</button>
        </form>
      </div>
    </div>
  );
};

export default EventId;

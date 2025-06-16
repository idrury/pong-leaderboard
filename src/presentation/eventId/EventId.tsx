import React, { useState } from 'react';
import './EventId.css';
import IonIcon from '@reacticons/ionicons';

interface EventIdProps {
  onSubmit?: (eventId: string) => void;
}

const EventId: React.FC<EventIdProps> = ({ onSubmit }) => {
  const [eventId, setEventId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(eventId);
    // Handle event ID submission logic here
    console.log('Event ID:', eventId);
  };

  return (
    <div className="event-id-container">
      <IonIcon name="trophy-outline" style={{ fontSize: 48, color: 'var(--primaryColor)', marginBottom: 16 }} />
      <h1 style={{ marginBottom: 8, color: 'var(--primaryColor)', fontWeight: 700 }}>Enter Event ID</h1>
      <p style={{ marginBottom: 24, color: 'grey', fontSize: 18 }}>Please enter your event ID to access the leaderboard</p>
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
  );
};

export default EventId;

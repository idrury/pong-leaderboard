import React, { useState } from 'react';
import './EventId.css';
import IonIcon from '@reacticons/ionicons';
import { fetchEvent } from "../../DatabaseAccess/select";
import { PopSavedModalFn } from "../../Types";
import { useNavigate } from 'react-router-dom';

interface EventIdProps {
  popModal: PopSavedModalFn;
  onSubmit?: (eventId: string) => void;
}

const EventId: React.FC<EventIdProps> = ({ popModal }) => {
  const [eventId, setEventId] = useState('');
  const navigate = useNavigate();

  async function handleSubmit (e: React.FormEvent) {
    e.preventDefault();
    // Handle event ID submission logic here
    try {
      const event = await fetchEvent(eventId);
      if (event) navigate(`/${eventId}`); // Use navigate to go to event page
    } catch (error) {
      popModal(
        "Looks like that event doesn't exist!",
        undefined,
        true
      );
      return;
    }
  }

  return (
    <div>
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
            style={{ marginBottom: 16, textAlign: 'center', fontWeight: 500 }}
          />
          <button type="submit" className="event-id-btn">Enter</button>
        </form>
      </div>
    </div>
  );
};

export default EventId;

import React from 'react';
import './PlayerHome.css';
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
    <div>
      <div>
        <h1>Player Home</h1>
        <p>Welcome to your Ping-Pong-A-Thon dashboard!</p>
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
      <div className="CampaignList">
        <ListGroup className="CampaignTable">
          <ListGroup.Item className="CampaignRow CampaignHeaderRow">
            <span className="CampaignCol CampaignColName">Campaign Name</span>
            <span className="CampaignCol CampaignColYear">Year</span>
          </ListGroup.Item>
          {campaigns.map((item, idx) => (
            <ListGroup.Item className="CampaignRow" key={idx}>
              <span className="CampaignCol CampaignColName">{item.name}</span>
              <span className="CampaignCol CampaignColYear">{item.year}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default PlayerHome;
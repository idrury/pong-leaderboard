import React from 'react';
import './PlayerHome.css';
import { useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { fetchEvent } from '../../DatabaseAccess/select';
import { PopSavedModalFn } from '../../Types';
import { useNavigate } from 'react-router-dom';

interface PlayerHomeProps {
  popModal: PopSavedModalFn;
}

export function PlayerHome({popModal}:PlayerHomeProps) {
  const campaigns = [
    { name: 'Campaign 1', year: '2023' },
    { name: 'Campaign 2', year: '2022' },
    { name: 'Campaign 3', year: '2021' },
  ];
  const [eventId, setEventId] = useState('');
  const navigate = useNavigate();

  async function handleSubmit (e: React.FormEvent) {
    e.preventDefault();
    // Handle event ID submission logic here
    
    try {
      const event = await fetchEvent(eventId);
      if(event) navigate(eventId);
    } catch(error) {
      popModal("Looks like that event doesn't exist!",undefined, true);
      return;
    }

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

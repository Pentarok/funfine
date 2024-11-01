import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Link, useLocation } from 'react-router-dom';
import CardMedia from '@mui/material/CardMedia';
import './Card.css';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MediaCard({event}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };

  
  return (
    <div className="event-details-container">
       
      <Card sx={{ maxWidth: 500 }}>
        <CardMedia sx={{ height: 350 }} image={event.file} title="green iguana" />

        <CardContent>
          <Typography gutterBottom variant="h5" component="div" className='text-center'>
            {event.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'black' }}>
            <span style={{ fontWeight: 'bold' }}>Started:</span> {formatDate(event.startDateTime)}
          </Typography>
          <Typography variant="body2" sx={{ color: 'black' }}>
            <span style={{ fontWeight: 'bold' }}>Ended:</span> {formatDate(event.endDateTime)}
          </Typography>
          <Typography variant="" sx={{ color: 'black' }}>
            <span style={{ fontWeight: 'bold' }}>Venue:</span> {event.venue}
          </Typography>
       
         
          
        
          <div dangerouslySetInnerHTML={{ __html: event.content }}></div>
        </CardContent>
      </Card>
   
    </div>
  );
}

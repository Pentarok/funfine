import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Link, useLocation } from 'react-router-dom';
import CardMedia from '@mui/material/CardMedia';

import Typography from '@mui/material/Typography';

export default function MediaCard({ event, formatDate }) {
  const location = useLocation();
  const currentUrl = location.pathname;

  return (
    <Card sx={{   }}> {/* Adjusted maxHeight to better fit content */}
     {/*  <CardMedia
        component="img"
        sx={{
         height:'300px',
         width:'300px',
         aspectRatio:'1/1'
        }}
        image={event.file}
        alt={event.title}
      /> */}
         <img src={event.file} alt="" style={{aspectRatio:'1/1',maxWidth:'300px',borderRadius:'5px',marginLeft:'20px',width:'100%'}} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {event.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'black' }}>
          <span style={{ fontWeight: 'bold' }}>Date:</span> {formatDate(event.startDateTime)}
        </Typography>
        <Typography variant="body2" sx={{ color: 'black' }}>
          <span style={{ fontWeight: 'bold' }}>Venue:</span> {event.venue}
        </Typography>
        <Typography variant="body2" sx={{ color: 'black' }}>
          <div>{event.summary}</div>
        </Typography>
      </CardContent>
      <CardActions>
        <div className="link-wrapper" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Link
            className="btn btn-primary text-white"
            to={currentUrl.includes("user") ? `/user/event/details` : '/home/event/details'}
            state={{ event }}
          >
            View more
          </Link>
       
        </div>
      </CardActions>
    </Card>
  );
}

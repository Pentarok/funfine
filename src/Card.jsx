import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Link, useLocation } from 'react-router-dom';
import PartyImage from './assets/Party.webp'
import CardMedia from '@mui/material/CardMedia';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MediaCard({event, formatDate}) {
  console.log(event)
  const location = useLocation();
  const currentUrl = location.pathname;

  console.log(currentUrl)
  return (
    <Card sx={{ maxWidth: 280 }}>
      <CardMedia
        sx={{ height: 200 }}
        image={event.file}

      />
   
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
       {event.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'black' }}>
        <span style={{ fontWeight: 'bold' }}>Date:</span> {formatDate(event.startDateTime)}

        </Typography>
        <Typography variant="" sx={{ color: 'black' }}>
        <span style={{ fontWeight: 'bold' }}>Venue:</span> {event.venue}
        </Typography>
        
        <Typography variant="" sx={{ color: 'black' }}>
        <div  >{event.summary}</div>
          </Typography>
      </CardContent>
      <CardActions>
{/*         <Button size="small">Share</Button> */}
      <div className="link-wrapper" style={{display:'flex',justifyContent:'center',width:'100%'}}>

     
        <Link
          className='btn btn-primary text-white'
          to={currentUrl.includes("user")?`/user/event/details`:'/home/event/details'}
          state={{ event }}  // Passing the `event` as state
        >
          
          View more
        </Link>
        </div>
</CardActions>
    </Card>
  );
}

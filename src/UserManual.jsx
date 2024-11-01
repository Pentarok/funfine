import React from 'react'

const UserManual = () => {
  return (
    <div style={{color:'white',padding:'20px'}}>
        <h2>Chapter 3: Managing Posts
      </h2>
      <h3>  Overview</h3>
      <p>In this web app, posts revolve around creating, updating, and sharing events. You can manage upcoming events and past events, with options to make them public. Follow the guidelines below to make the most of these features.</p>
    
    <h3>3.1 Creating a New Post</h3>
    <p>1.Navigate to the "Create Post" Section: Select “Create Post” from your dashboard to start a new event.</p>
   <p>2.Enter Event Details: Add details, including:
    <ul>
        <li>Event Title</li>
         <li>Description</li>
         <li>
         Start and End Date: The end date determines when an event will transition from the Upcoming Events section to the Past Events section.
         </li>
         </ul>
         </p>
<p>3.Save Your Post: Review your information and save the post to schedule it in the Upcoming Events section.</p>

<h3>3.2 Automatic Transition to Past Events
</h3>
<ul>
    <li>
    Once an event’s end date elapses, it automatically moves from Upcoming Events to Past Events.
    </li>
    <li>
    Past events are not editable until they are moved to this section, making them easy to manage after they have occurred.

    </li>
</ul>
    <h3>3.3 Updating Past Events</h3>
 <p>Once an event has ended, it’s ready for updates. This may include adding media and narrating the event for archival or public access purposes.</p>
<p>1.Go to Past Events: Select the event you want to update from the Past Events section.</p>
  <p>2.Edit Event Details
    <ul>
        <li>Add a Cover Photo: Upload a representative image to capture the event’s highlights.</li>
   <li>Narrate the Event: Provide a summary of what took place, key moments, and any other details that might interest your audience.</li>
    </ul>
  </p>
  <p>Save Updates: When satisfied with the added details, save the updates</p>
   
   <h3>3.4 Enabling Public Access for Past Events</h3>
   <p>Once an event has been updated with additional details, you may choose to make it publicly accessible.

</p>
<p>1.Review Updates: Before enabling public access, ensure all added content is appropriate for public viewing.</p>
    <p>2.Enable Public Access: Select the option to make the event publicly accessible.
   <p>⚠️ Important: Once public access is enabled, the event will be displayed under Updated Past Events for broader visibility. Ensure you’re comfortable with the content before taking this step.</p> </p>
 
 <p>Save Your Changes: After enabling public access, save the event. It will now appear in the Updated Past Events section.</p>
    </div>


  )
}

export default UserManual
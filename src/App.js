import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { io } from 'socket.io-client';


function App() {
  const socket = io('http://localhost:5000', {reconnectionAttempts: 5});

  const [roomId, setRoomId] = useState('Placeholder');
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  

  // const [singleMessage, setSingleMessage] = useState('');
  // const [broadcastMessage, setBroadcastMessage] = useState('');
  // const [messages, setMessages] = useState(['------Begining of the chat------']);

  // function handleSingleMessage(event) {
  //   setSingleMessage(event.target.value)
  // }

  // function handleBroadcastMessage(event) {
  //   setBroadcastMessage(event.target.value)
  // }

  // function buttonClick(event) {
  //   if (event.target.innerHTML === 'Send Single Message') {
  //     socket.emit('single message', singleMessage)
  //   } else if (event.target.innerHTML === 'Send Broadcast Message') {
  //     socket.emit('broadcast message', broadcastMessage)
  //   }
  // }

  // socket.on("single message response", (response) => {
  //   setMessages([...messages, response.data]); 
  // });

  // socket.on("broadcase message response", (response) => {
  //   setMessages([...messages, response.data]); 
  // });

  function createRoom(event) {
    socket.emit('create', (response) => {
      console.log(response)
      setRoomId(response[0])
      setNumberOfPlayers(response[1])
    })
  }

  function connectToRoom() {
    socket.emit('connect to room', roomId, (response) => {
      console.log(response)
      setNumberOfPlayers(response[1])
    })
  }

  return (
  <Grid container direction='colum' spacing={5}>
    <Grid item container direction='row' spacing={2}>
      {/* <Grid item container direction='column' spacing={3} xs>
        <Grid item>
          <TextField multiline fullWidth={true} rowsMax={4} value={singleMessage} onChange={handleSingleMessage} />
        </Grid>
        <Grid item>
          <Button variant="contained" color="default"  onClick={buttonClick}> 
            Send Single Message
          </Button>
        </Grid>
      </Grid>
      <Grid item container direction='column' spacing={3} xs>
        <Grid item>
          <TextField multiline fullWidth={true} rowsMax={4} value={broadcastMessage} onChange={handleBroadcastMessage} />
        </Grid>
        <Grid item>
        <Button variant="contained" color="default" onClick={buttonClick}>
            Send Broadcast Message
        </Button>
        </Grid>
      </Grid> */}
      <Grid item>
          <Button variant="contained" color="default" onClick={createRoom}>
              Create room
          </Button>
      </Grid>
      <Grid item>
         {roomId}
      </Grid>
    </Grid>
    <Grid item>
      <TextField fullWidth={true} value={roomId} />
        <Button variant="contained" color="default" onClick={connectToRoom}>
            Connect
        </Button>
    </Grid>
    <Grid item>
      <div>Number of players in room: {numberOfPlayers}</div>
    </Grid>
    {/* <Grid item>
     
      {messages.map((message) => {
        return <p>{message}</p>
      })}
    </Grid> */}
  </Grid>
  );
}

export default App;

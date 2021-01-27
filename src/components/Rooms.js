import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { io } from 'socket.io-client';

export default function Rooms() {
    const socket = io('http://localhost:5000', {reconnectionAttempts: 5});
    
    const [roomId, setRoomId] = useState('Placeholder');
    const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  
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
    </Grid>
    );
}

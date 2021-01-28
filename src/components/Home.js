import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { io } from 'socket.io-client';
import { useHistory } from 'react-router-dom';
import { useSocket } from '../context/socket';
import { Typography } from '@material-ui/core';


export default function Home() {
    const { socket } = useSocket();
    
    const [roomId, setRoomId] = useState('');
    const [hostName, setHostName] = useState('');
    const [name, setName] = useState('');
    const [players, setPlayers] = useState({});

    const history = useHistory();
  
    function createRoom(event) {
      socket.emit('create', hostName, (response) => {
        history.push({pathname: `/lobby/${response[0]}`, state: { players: response[1], admin: response[2] }})
      })
    }
  
    function connectToRoom() {
      socket.emit('connect to room', roomId, name, (response) => {
        history.push({pathname: `/lobby/${roomId}`, state: { players: response[0], admin: response[1] }})
      })
    }
  
    return (
    <Grid container direction='column' justify='center' spacing={3} style={{paddingTop: 150}}>
      <Grid item>
        <TextField fullWidth={true} label="Host Name" value={hostName} onChange={e => { setHostName(e.target.value) }} />
      </Grid>
      <Grid item>
        <Button fullWidth={true} variant="contained" color="primary" onClick={createRoom}>
            Create room
        </Button>
      </Grid>
      <Grid item >
        <Typography variant='body1' align='center'>---or join room---</Typography>
      </Grid>
      <Grid item container direction='column' spacing={2}>
        <Grid item>
          <TextField fullWidth={true} label="Room ID" value={roomId} onChange={e => { setRoomId(e.target.value) }} />
        </Grid>
        <Grid item>
          <TextField fullWidth={true} label="Your Name" value={name} onChange={e => { setName(e.target.value) }} />
        </Grid>
        <Grid item>
          <Button variant="contained" fullWidth={true} color="secondary" onClick={connectToRoom}>
              Connect
          </Button> 
        </Grid>
      </Grid>
      {/* <Grid item>
        <div>Number of players in room: {numberOfPlayers}</div>
      </Grid> */}
    </Grid>
    );
}

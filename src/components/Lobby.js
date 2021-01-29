import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import { useParams } from "react-router-dom";
import { useSocket } from '../context/socket';
import { useLocation, useHistory } from 'react-router-dom';
import { useGame } from '../context/game'



export default function Lobby() {

    const location = useLocation();
    const history = useHistory();

    const { id } = useParams();
    const { socket } = useSocket();

    const { setGameData } = useGame();

    const [players, setPlayers] = useState(location.state.players.players);
    const [admin, setAdmin] = useState(location.state.admin);

    socket.on("join_room", (response) => {
        setPlayers(response.room.players);
      });

    socket.on("game_started", (response) =>{
        history.push(`/game/${id}`)
        setGameData(response.movies)
    })

    function startGame() {
        socket.emit('start_game', id)
        // , (response) => {
        //     history.push(`/game/${id}`)
        //   })
    }
    
    return (
        <Grid container direction='column' justify='center' spacing={3} style={{paddingTop: 150}}>
            <Grid item>
                <Typography variant="h6" color="initial">Room id: {id}</Typography>
            </Grid>
            <Grid item>
                { admin ? 
                    (<Button variant="contained" fullWidth={true} color="primary" onClick={startGame}>
                        Start
                    </Button>) :
                    (<Typography variant="body1" color="initial">Wait game to start</Typography>)
                }
                
            </Grid>
            <Grid item>
                {
                    Object.keys(players).map((key, index) => ( 
                        <p key={index}>{players[key]}</p> 
                      ))
                }
            </Grid>
        </Grid>
    )
}

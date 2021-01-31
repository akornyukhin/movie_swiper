import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import Grid from '@material-ui/core/Grid';
import '../styles/SwipeCard.css';
import database from '../firebase/firebase';
import { useParams, useLocation } from "react-router-dom";
import { useSocket } from '../context/socket';
import { useGame } from '../context/game';


export default function SwipeCard() {

    const location = useLocation();

    const { id } = useParams();
    const { socket } = useSocket();

    // const { gameData } = useGame();

    const [people, setPeople] = useState([]);

    const [gameData, setGameData] = useState(location.state.movies);


    // useEffect(() => {
        
    //     const unsubscribe = database.collection('people').onSnapshot((snapshot) => setPeople(snapshot.docs.map((doc) => doc.data())))  

    //     return () => { unsubscribe() }

    // }, [])

    function onSwipe(direction, movieTitle) {
        if (direction === 'right') {
            socket.emit('right swipe', {"room_id": id, "movie_title": movieTitle}, (response) => {
                console.log(response)
              })
        }
      }

    return (
        <div>
            <h1>Tinder cards</h1>
            <h1> ID: {id} </h1>
            <Grid container justifyContent='center' justify='center'>
                {gameData.map((movie) => (
                    <TinderCard
                    className='swipe'
                    key={movie.name}
                    onSwipe={(direction) => onSwipe(direction, movie.name)}
                    preventSwipe={['up', 'down']}>
                        <div 
                        style={{ backgroundImage: `url(${movie.poster_src})` }}
                        className='card'>
                            <h3>{movie.name}</h3>
                        </div>
                        {/* <div>
                            <h3>{movie.description}</h3>  
                        </div> */}
                    </TinderCard>
                ))}
            </Grid>
        </div>
    )
}

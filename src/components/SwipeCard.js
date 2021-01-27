import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import Grid from '@material-ui/core/Grid';
import '../styles/SwipeCard.css';
import database from '../firebase/firebase';
import { useParams } from "react-router-dom";
import { useSocket } from '../context/socket';

export default function SwipeCard() {

    const { id } = useParams();
    const { socket } = useSocket();

    const [people, setPeople] = useState([]);

    useEffect(() => {
        
        const unsubscribe = database.collection('people').onSnapshot((snapshot) => setPeople(snapshot.docs.map((doc) => doc.data())))  

        return () => { unsubscribe() }

    }, [])

    function onSwipe(direction, person) {
        if (direction === 'right') {
            socket.emit('right swipe', {"room_id": id, "movie_title": person}, (response) => {
                console.log(response)
              })
        }
      }

    return (
        <div>
            <h1>Tinder cards</h1>
            <h1> ID: {id} </h1>
            <Grid container justifyContent='center' justify='center'>
                {people.map((person) => (
                    <TinderCard
                    className='swipe'
                    key={person.name}
                    onSwipe={(direction) => onSwipe(direction, person.name)}
                    preventSwipe={['up', 'down']}>
                        <div 
                        style={{ backgroundImage: `url(${person.url})` }}
                        className='card'>
                            <h3>{person.name}</h3>
                        </div> 
                    </TinderCard>
                ))}
            </Grid>
        </div>
    )
}

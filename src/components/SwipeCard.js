import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import Grid from '@material-ui/core/Grid';
import '../styles/SwipeCard.css';
// import database from '../firebase/firebase'

export default function SwipeCard() {

    const [people, setPeople] = useState([]);

    useEffect(() => {
        
        const unsubscribe = database.collection('people').onSnapshot((snapshot) => setPeople(snapshot.docs.map((doc) => doc.data())))  

        return () => { unsubscribe() }

    }, [])


    console.log(people)

    return (
        <div>
            <h1>Tinder cards</h1>
            <Grid container justifyContent='center' justify='center'>
                {people.map((person) => (
                    <TinderCard
                    className='swipe'
                    key={person.name}
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

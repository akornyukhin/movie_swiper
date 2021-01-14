import React, { useState } from 'react';
import TinderCard from 'react-tinder-card';
import Grid from '@material-ui/core/Grid';



export default function SwipeCard() {


    const swipe = {
        position: 'relative'
      }
      
    const cardContainer = {
        width: '90vw',
        maxWidth: '260px',
        height: '300px'
      }
      
    const card = {
        position: 'absolute',
        backgroundColor: 'black',
        color: 'white',
        width: '80vw',
        maxWidth: '260px',
        height: '300px',
        border: 'solid',
        // boxShadow: '0px 0px 60px 0px rgba(0,0,0,0.30)',
        borderRadius: '20px',
        backgroundSize: 'cover',
        // backgroundPosition: 'center'
      }

    const db = [
        {name: 'Alex'},
        {name: 'Alex1'},
        {name: 'Alex2'},
        {name: 'Alex3'},
        {name: 'Alex4'},
        {name: 'Alex5'},
    ]

    const [chars, setChars] = useState(db);

    console.log(chars)
    
    return (
        <Grid container justify='center'>
            {chars.map((item) => 
                <TinderCard style={swipe} onSwipe={() => console.log('swiped')} onCardLeftScreen={() => console.log('left the screen')} preventSwipe={['up', 'down']} style={{position: 'absolute'}}>
                    <Grid item style={card}>{item.name}</Grid>
                </TinderCard>
            )} 
        </Grid>
    )
}

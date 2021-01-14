import React, { useState } from 'react';
import TinderCard from 'react-tinder-card';
import Grid from '@material-ui/core/Grid';
import '../styles/SwipeCard.css';



export default function SwipeCard() {

    const db = [
        {
            name: 'Doge',
            url: 'https://crhscountyline.com/wp-content/uploads/2020/03/Capture.png'
        },
        {
            name: 'Pepe',
            url: 'https://c.files.bbci.co.uk/16620/production/_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg'
        },
        {
            name: 'Vova',
            url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Vladimir_Putin_%282018-03-01%29_03_%28cropped%29.jpg'
        },
        {
            name: 'Donald',
            url: 'https://fm.cnbc.com/applications/cnbc.com/resources/img/editorial/2017/05/12/104466932-PE_Color.530x298.jpg?v=1591298823'
        },
        {
            name: 'Sanya',
            url: 'https://static-prod.weplay.tv/2019-06-12/35720c0e929f3160cabdcb9147fe4ce5_large_cover.jpeg'
        },
        
    ]

    const [people, setPeople] = useState(db);

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

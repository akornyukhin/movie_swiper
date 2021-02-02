import React, { useState, useRef, useMemo } from 'react';
import TinderCard from 'react-tinder-card';
import Grid from '@material-ui/core/Grid';
import '../styles/SwipeCard.css';
import database from '../firebase/firebase';
import { useParams, useLocation } from "react-router-dom";
import { useSocket } from '../context/socket';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@material-ui/core'

const alreadyRemoved = []
export default function SwipeCard() {

    const location = useLocation();

    const { id } = useParams();
    const { socket } = useSocket();

    const [gameMovies, setGameMovies] = useState(location.state.movies);
    const [matchedMovies, setMatchedMovies] = useState([]);

    const childRefs = useMemo(() => Array(gameMovies.length).fill(0).map(i => React.createRef()), [])

    function swiped(direction, movieTitle) {
        // console.log('removing: ' + movieTitle)
        alreadyRemoved.push(movieTitle)
        if (direction === 'right') {
            socket.emit('right swipe', {"room_id": id, "movie_title": movieTitle}, (response) => {
                // console.log(response)
                setMatchedMovies(response[1])
                // console.log(matchedMovies)
              })
        }
      }
    // function onSwipe(direction, movieTitle) {
    //     if (direction === 'right') {
    //         socket.emit('right swipe', {"room_id": id, "movie_title": movieTitle}, (response) => {
    //             console.log(response)
    //           })
    //     }
    //   }

    function swipe(direction) {
        const cardsLeft = gameMovies.filter(movie => !alreadyRemoved.includes(movie.name))
        if (cardsLeft.length) {
            const toBeRemoved = cardsLeft[cardsLeft.length - 1].name // Find the card object to be removed
            const index = gameMovies.map(movie => movie.name).indexOf(toBeRemoved) // Find the index of which to make the reference to
            alreadyRemoved.push(toBeRemoved) // Make sure the next card gets removed next time if this card do not have time to exit the screen
            childRefs[index].current.swipe(direction) // Swipe the card!
        }
    }

    socket.on("check_match", (response) =>{
        console.log(response)
        setMatchedMovies(response.movies)
    })
    
    // function swipe(dir) {
    //     childRefs[index].current.swipe(dir)
    //     // console.log(childRefs)
    // }

    return (
        <div>
            {/* <Typography variant="h4" color="initial" align='center'>Tinder cards</Typography> */}
            <Typography variant="h4" color="initial" align='center'>ID: {id}</Typography>
            <Grid container justifyContent='center' justify='center'>
                {gameMovies.map((movie, index) => (
                    <TinderCard
                    className='swipe'
                    ref={childRefs[index]}
                    key={movie.name}
                    onSwipe={(direction) => swiped(direction, movie.name)}
                    preventSwipe={['up', 'down']}>
                        <div 
                        style={{ backgroundImage: `url(${movie.poster_src})` }}
                        className='card'>
                            {/* <h3>{movie.name}</h3> */}
                        </div>
                        {/* <div>
                            <h3>{movie.description}</h3>  
                        </div> */}
                    </TinderCard>
                ))}  
            <div className='bottom'>
                <div className='buttons'>
                    <Button variant="contained" color="default" onClick={() => swipe('left')}>
                    Left
                    </Button>
                    <Button variant="contained" color="default" onClick={() => swipe('right')}>
                    Right
                    </Button>
                </div>
                 {/* <div className='movies'> */}
                 <Carousel animation='slide' autoPlay={false}>
                    {matchedMovies.length && matchedMovies.map((movie, index) => (
                            <>
                            <div className='movie'>
                                {movie}
                                <p>Description</p>
                            </div>
                            </>
                        ))}
                </Carousel>  
                {/* </div> */}
            </div>
            </Grid>
            
        </div>
    )
}

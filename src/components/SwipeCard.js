import React, { useState, useRef, useMemo } from 'react';
import TinderCard from 'react-tinder-card';
import Grid from '@material-ui/core/Grid';
import '../styles/SwipeCard.css';
import { useParams, useLocation } from "react-router-dom";
import { useSocket } from '../context/socket';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Carousel from 'react-material-ui-carousel';

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
            socket.emit('right_swipe', {"room_id": id, "movie_title": movieTitle}, (response) => {
                // console.log(response)
                // setMatchedMovies(response[1])
                // console.log(matchedMovies)
              })
        }
      }

    function swipe(direction) {
        const cardsLeft = gameMovies.filter(movie => !alreadyRemoved.includes(movie.name))
        if (cardsLeft.length) {
            const toBeRemoved = cardsLeft[cardsLeft.length - 1].name // Find the card object to be removed
            const index = gameMovies.map(movie => movie.name).indexOf(toBeRemoved) // Find the index of which to make the reference to
            alreadyRemoved.push(toBeRemoved) // Make sure the next card gets removed next time if this card do not have time to exit the screen
            childRefs[index].current.swipe(direction) // Swipe the card!
        }
    }

    socket.on("check_match", (response) => {
        // console.log(response);
        setMatchedMovies(response.matched_movies);
    })

    return (
        <div>
            <Grid container justifyContent='center' justify='center'>
                {gameMovies.map((movie, index) => (
                    <TinderCard
                    className='swipe'
                    ref={childRefs[index]}
                    key={movie.name}
                    onSwipe={(direction) => swiped(direction, movie.name)}
                    preventSwipe={['up', 'down']}>
                        <div 
                        className='card'>
                            <div 
                            style={{ backgroundImage: `url(${movie.poster_src})` }}
                            className='picture'></div>
                            <div className='info'>
                                <h4>{movie.name} <p style={{margin: 0, color: 'grey', fontSize: 12}}>{movie.movie_time}</p></h4>
                                <h5>IMDB: {movie.movie_rating}/10</h5>
                                <p>{movie.description}</p>
                            </div>                 
                        </div>      
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
                                {/* <p>{gameMovies[gameMovies.findIndex(item => item.name === `${movie}`)].description}</p> */}
                                <p><a style={{margin: '5px'}}href={gameMovies[gameMovies.findIndex(item => item.name === `${movie}`)].movie_url} target="_blank" rel="noopener noreferrer">Read more</a></p>
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

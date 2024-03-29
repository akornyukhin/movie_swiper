import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { io } from 'socket.io-client';
import Home from './components/Home';
import { BrowserRouter as Router,
          Route,
          Switch } from "react-router-dom";
import SwipeCard from './components/SwipeCard';
import { SocketContext } from "./context/socket";
import { GameContext } from "./context/game"
import Lobby from './components/Lobby';


function App() {


  const apiUrl = process.env.REACT_APP_API_URL

  const socket = io(`${apiUrl}`, {reconnectionAttempts: 5});

  const [gameData, setGameData] = useState([]);

  return (
    <SocketContext.Provider value={{ socket: socket }}>
    <GameContext.Provider value={{ gameData, setGameData: setGameData }} >
      <Grid container direction='column' alignItems='center'>
        <Grid item xs={2} />
        <Grid item xs={8}>
          <Router>
            <Switch>
              <Route exact path='/' component={Home} />
              {/* <Route exact path='/lobby' component={Lobby} /> */}
              <Route path='/lobby/:id' children={<Lobby />} />
              <Route path='/game/:id' children={<SwipeCard />} />
            </Switch>
          </Router>
        </Grid>
        <Grid item xs={2} />
      </Grid>
    </GameContext.Provider>
    </SocketContext.Provider>
    
    
  );
}

export default App;

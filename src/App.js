import React, { useState } from 'react';
import { io } from 'socket.io-client';
import Rooms from './components/Rooms';
import Test from './components/Test';
import { BrowserRouter as Router,
          Link,
          Route,
          Switch } from "react-router-dom";
import SwipeCard from './components/SwipeCard';
import { SocketContext } from "./context/socket";

function App() {
  const socket = io('http://localhost:5000', {reconnectionAttempts: 5});
  return (
    <SocketContext.Provider value={{ socket: socket}}>
      <Router>
        <Switch>
          <Route exact path='/' component={Rooms} />
          <Route path='/rooms/:id' children={<SwipeCard />} />
        </Switch>
      </Router>
    </SocketContext.Provider>
    
    
  );
}

export default App;

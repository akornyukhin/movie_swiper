import React, { useState } from 'react';
import { io } from 'socket.io-client';
import Rooms from './components/Rooms';


function App() {
  return (
    <Rooms />
  );
}

export default App;

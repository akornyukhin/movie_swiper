import React from 'react';
import { Grid, Typography } from "@material-ui/core";
import SwipeCard from './components/SwipeCard';
import IconsBar from './components/IconsBar';

function App() {
  return (
    <Grid container justify="center" alignItems="center" wrap='wrap'>
      <Grid item md={2} xs={0}></Grid>
      <Grid item container direction='column' md={8} xs={12} alignItems='center'>
          <SwipeCard />
          {/* <IconsBar /> */}
      </Grid>
      <Grid item md={2} xs={0}></Grid>
    </Grid>
  )
   
}

export default App;

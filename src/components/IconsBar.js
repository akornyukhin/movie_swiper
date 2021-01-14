import React from 'react';
import Grid from '@material-ui/core/Grid';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ClearIcon from '@material-ui/icons/Clear';

export default function IconsBar() {
    return (
        <Grid container alignContent='center' justify='space-evenly'>
            <ClearIcon />
            <FavoriteIcon />
        </Grid>

    )
}

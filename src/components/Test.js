import React from 'react';
import { useParams } from "react-router-dom";
import SwipeCard from './SwipeCard'

export default function Test() {
    let { id } = useParams()

    return (
        <>
        <div> ID: {id} </div>
        <SwipeCard />
        </>  
    )
}

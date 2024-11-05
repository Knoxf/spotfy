import RecentlyMusicCard from "./RecentlyMusicCard";
import './RecentlySong.css';
import musicMap from '../../musicMap.json'
import React, { useState, useEffect } from 'react';

const RecentlySong = ({recentlyList}) => {


    return (
        <React.Fragment>
            <div className="recently">
                <div className = "recently-song-container">
                    <div className= "recently-song-txt"><strong>Recently</strong></div>
                </div>

                <div className="recently-music-grid-container">
                    <div className={"carousel-items"}>
                        {recentlyList.map((index) => (
                            <RecentlyMusicCard key={index} data={musicMap[index]} />
                        ))}
                    </div>
                </div>
            </div>

        </React.Fragment>



    );
};

export default RecentlySong;
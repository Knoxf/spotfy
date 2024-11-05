import React from 'react';
import MusicCards from "../MusicCard/MusicCard";
import musicMap from '../../musicMap.json';
import './New.css';


const New = ( {onPlay, addToPlayList, playList}) => {

    return (
        <div className="new music-grid">

            <div className="NewTextContainer">
                <b className="newtext">New</b>
            </div>
            <div className="music-grid-container">
                {Object.keys(musicMap).map((key) => (
                    musicMap[key].NotLike !== true && <MusicCards key={key} id={key} data={musicMap[key]} onPlay={onPlay} addToPlayList={addToPlayList} playList={playList}/>
                ))}
            </div>
        </div>
    );
};

export default New;
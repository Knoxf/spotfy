import React, {memo, useState, useEffect} from 'react';
import './musicPlayer.css';

const PlayMusic = memo(({ file, cover }) => {
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.className !== 'play-music-cover zoomed centered') {
                setIsZoomed(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (

        <React.Fragment>
            {isZoomed && <div className="blur" onClick={() => setIsZoomed(false)} />}
            <div className="play-music">
                <img className={`play-music-cover ${isZoomed ? 'zoomed centered' : ''}`} src={process.env.PUBLIC_URL +cover} onClick={(e) => {e.stopPropagation(); setIsZoomed(!isZoomed);}} />
                <audio className={`player ${isZoomed?  'zoom-player' : ''}`} key={file} controls autoPlay>
                    <source type="audio/mpeg" src={process.env.PUBLIC_URL +file}/>
                    Your browser does not support the audio element.
                </audio>
            </div>
        </React.Fragment>
    );

});

export default PlayMusic;
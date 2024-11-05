import React, {useState, useEffect, useRef} from 'react';
import './RecentlyMusicCard.css';


function formatDuration(duration) {
    const totalSeconds = Math.round(duration); // Round to nearest whole number
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    // Ensuring two digits for seconds
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${minutes}:${formattedSeconds}`;
}
const RecentlyMusicCard = ({ data }) => {
    const [cover, setCover] = useState(null);
    const [music, setMusic] = useState(null);
    const [isPressed, setIsPressed] = useState(false)
    const [duration, setDuration] = useState(null);

    const musicCardRef = React.useRef(null); // Add this line
    const audioRef = useRef(null);


    useEffect(() => {
        setCover(`/musicFile/albumCover/${data.cover}`)
    }, [data.cover]);

    useEffect(() => {
        setMusic(`/musicFile/music/${data.musicSrc}`)

    }, [data.musicSrc]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (musicCardRef.current && !musicCardRef.current.contains(event.target)) {
                setIsPressed(false);
            }
        };

        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMouseDown = () => {
        setIsPressed(true);
    };

    function handleCardClick() {

    }

    const handleAlbumCoverClick = () => {
        setIsPressed(!isPressed)
    };

    const onMetadataLoaded = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    return (
        <div
            ref={musicCardRef} // Add this line
            className={`recently-music-card`}
            onMouseDown={handleMouseDown}
        >

            <audio
                ref={audioRef}
                src={process.env.PUBLIC_URL +`/musicFile/music/${data.musicSrc}`}
                onLoadedMetadata={onMetadataLoaded}
                preload="metadata"
            />

            <img className="recently-music-card-image" src={process.env.PUBLIC_URL +cover} alt={data.musicName} />

            <div className="recently-music-card-info">

                <h2 className="recently-music-card-title ">{data.musicName}</h2>
                {isPressed &&
                    <>
                        <p className="recently-music-Author-name">{data.musicAuthor}</p>

                        <div className="recently-container">
                            <button className="recently-play-button" onClick={handleCardClick}>
                                <img src={process.env.PUBLIC_URL +"/play-circle.svg"} alt="Play" />
                            </button>
                            <div className="recently-music-duration">
                                <p className="recently-music-duration">{formatDuration(duration)}</p>
                            </div>
                            <button className="recently-more-button" onClick={handleCardClick}>
                                <img src={process.env.PUBLIC_URL +"/dots-vertical.svg"} alt="more"/>
                            </button>
                        </div>
                    </>
                }
            </div>
        </div>
    );
};

export default RecentlyMusicCard;
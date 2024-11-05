import React, {useState, useEffect, useRef} from 'react';
import './MusicCard.css';


function formatDuration(duration) {
    const totalSeconds = Math.round(duration); // Round to nearest whole number
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    // Ensuring two digits for seconds
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${minutes}:${formattedSeconds}`;
}
const MusicCard = ({id ,data, onPlay, addToPlayList, playList}) => {

    const [isPlaylistPopupOpen, setIsPlaylistPopupOpen] = useState(false);
    const [cover, setCover] = useState(null);
    const [music, setMusic] = useState(null);
    const [isPressed, setIsPressed] = useState(false)
    const [duration, setDuration] = useState(null);
    const [isPlay, setIsPlay] = useState(false);
    const musicCardRef = React.useRef(null); // Add this line
    const audioRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [isVisible, setIsVisible] = useState(true);

    const handleMoreButtonClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const togglePlaylistPopup = (event) => {
        event.stopPropagation(); // Prevents click event from propagating to parent elements
        setIsPlaylistPopupOpen(!isPlaylistPopupOpen);
    };


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
                setIsDropdownOpen(false);
                setIsPlaylistPopupOpen(false);
            }
        };

        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isPlay) {
            onPlay(music, cover, id);
            console.log(cover)
        }
        setIsPlay(false);
    }, [cover, isPlay, music, onPlay]);

    const handleMouseDown = () => {
        setIsPressed(true);

    };

    const handleCardClick =() => {
        setIsPlay(true);

    };

    const handleNotLike = () => {
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }


    const onMetadataLoaded = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const addFavourite = () =>{
        addToPlayList("Favourite", id);
    }

    const handleAddToPlayList =(playListName) =>{
        addToPlayList(playListName,id);
        setIsDropdownOpen(false);
        setIsPlaylistPopupOpen(false);
    }

    return (
        <React.Fragment>
            <div
                ref={musicCardRef}
                className={`music-card ${isPressed ? 'music-card--large' : ''}`}
                onMouseDown={handleMouseDown}
            >
                <audio
                    ref={audioRef}
                    src={process.env.PUBLIC_URL +`/musicFile/music/${data.musicSrc}`}
                    onLoadedMetadata={onMetadataLoaded}
                    preload="metadata"
                />
                <img className="music-card-image" src={process.env.PUBLIC_URL +cover} alt={data.musicName} />
                <div className="music-card-info">
                    <h2 className="music-card-title">{data.musicName}</h2>
                    {isPressed &&
                        <>
                            <p className="music-Author-name">{data.musicAuthor}</p>
                            <div className="container">
                                <button className="play-button" onClick={handleCardClick}>
                                    <img src={process.env.PUBLIC_URL +"/play-circle.svg"} alt="Play" />
                                </button>
                                <div className="music-duration">
                                    <p className="music-duration">{formatDuration(duration)}</p>
                                </div>
                                <button className="more-button" onClick={handleMoreButtonClick}>
                                    <img src={process.env.PUBLIC_URL +"/dots-vertical.svg"} alt="more"/>
                                    {isDropdownOpen && (
                                        <ul className="dropdown-menu">
                                            <button className="drop-button" onClick={togglePlaylistPopup}><span>➕</span> Add to playlist</button>
                                            <button className="drop-button" onClick={addFavourite}><span>❤️</span>Favourite</button>
                                            <button className="drop-button" onClick={handleNotLike}><span>❌</span>Not Like</button>
                                        </ul>
                                    )}
                                </button>
                                {isPlaylistPopupOpen && (
                                    <div className="playlist-popup">
                                        {playList.map((playlist, index) => (
                                            index > 0 && ( // Skip the first playlist (index 0)
                                                <div key={index} className="playlist-item" onClick={() => handleAddToPlayList(playlist[0])} >
                                                    {playlist[0]}
                                                </div>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    }
                </div>
            </div>
        </React.Fragment>

    );
};



export default MusicCard;
import React, {useEffect, useRef, useState} from 'react';
import "./NavigationBarStyle.css";
import musicMap from '../../musicMap.json'

const NavigationBar = ({createPlayList, playList, handleDragStart, handleDragOver, handleDrop, handlePlay, handleDelete}) => {

    const [isSearching, setIsSearching] = useState(false);
    const searchRef = useRef(null);
    const playlistRef = useRef(null);
    const buttonRef = useRef(null);
    const [isPlaylistRotated, setIsPlaylistRotated] = useState(false);
    const [showSearchText, setShowSearchText] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isUnfoldSearchClicked, setIsUnfoldSearchClicked] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [playlistName, setPlaylistName] = useState("");

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchInputChange = (event) => {
        window.scrollTo(0,0);
        const query = event.target.value;
        setSearchQuery(query);
        setSearchResults(query ? getSearchResults(query) : []);
    };

    const getSearchResults = (query) => {
        return Object.values(musicMap).filter(item =>
            item.musicName.toLowerCase().includes(query.toLowerCase()) ||
            item.musicAuthor.toLowerCase().includes(query.toLowerCase())
        );

    };

    const toggleInputArea = () => {

        setIsInputVisible(!isInputVisible);
    };

    const handleInputChange = (event) => {
        setPlaylistName(event.target.value);
    };

    useEffect(() => {
        const handleNonPlaylistClick = (event) => {
            if(playlistRef.current && !playlistRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
                setIsOpen(false);
                setIsPlaylistRotated(false);
            }
    
        }; 
    
        document.addEventListener('mousedown', handleNonPlaylistClick);
    
        return () => {
            document.removeEventListener('mousedown', handleNonPlaylistClick);
        }
    }, []);    

    // Event handler for the "New" button
    const handleNewButtonClick = () => {
        window.scrollTo(0, 0);
    };

    // Event handler for the "Category" button
    const handleCategoryButtonClick = () => {
        const spotfyBigText = document.querySelector('.spotfy-big-text');
        spotfyBigText.style.transform = `scale(${0.36}) translateY(-${260}px)`;
        window.scrollTo(0,2000)
    };




    // Event handler for the "PlayList" button
    const handlePlayListButtonClick = () => {
        setIsPlaylistRotated(prevState => !prevState);
        setIsOpen(!isOpen);
    };

    const toggleSearchInput = () => {
        setIsSearching(true);
        setIsExpanded(!isExpanded);
        setIsUnfoldSearchClicked(true);
    };

    //call back function for event listener to detect outside clickes
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {

                setIsSearching(false); // Set to false only if clicked outside
                setSearchQuery("")
                setIsExpanded(false);
                setIsUnfoldSearchClicked(false);
            }
        }

        // Bind the event listener
        if (isSearching) {

            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSearching]);


    const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
        setShowSearchText(position < 80);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const calculateWidth = () => {
        if (isExpanded) {
            return { width: 500, marginLeft: 0 }; // Normal width and no margin
        }

        const maxWidth = 500;
        const minWidth = 62;
        const threshold = 250;

        const currentWidth = scrollPosition >= threshold ? minWidth : maxWidth - (maxWidth - minWidth) * (scrollPosition / threshold);
        const marginLeft = maxWidth - currentWidth; // Calculate the margin to shift left

        return { width: currentWidth, marginLeft };
    };

    const handleLogoClick =() =>{
        window.scrollTo(0,0);
    }



    const handleSubmit = (event) => {
        event.preventDefault();
        createPlayList(playlistName);
        setIsInputVisible(!isInputVisible);
    };

    const { width, marginLeft } = calculateWidth();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const exploreGroup = document.querySelector('.exploregroup');
        if (exploreGroup) {
            const maxScroll = 250; // Adjust this value as needed
            const maxTranslate = 500; // Adjust this value as needed
            const scrollRatio = Math.min(scrollY / maxScroll, 1);
            const translateX = scrollRatio * maxTranslate;

            exploreGroup.style.transform = `translateX(${translateX}px)`;
        }
    }, [scrollY]);

    useEffect(() => {
        const spotfyBigText = document.querySelector('.spotfy-big-text');
        const newText = document.querySelector('.newtext');
        if (spotfyBigText && newText && scrollY < 200) {
            const maxScroll = 200; // Adjust this value as needed
            const minScale = newText.getBoundingClientRect().width / spotfyBigText.getBoundingClientRect().width;
            const scrollRatio = Math.min(scrollY / maxScroll, 100);
            const scale = 1 - scrollRatio * (1 - minScale);

            const maxTranslate = 270;
            const translateY = scrollRatio * maxTranslate;

            spotfyBigText.style.transform = `scale(${scale}) translateY(-${translateY}px)`;
            console.log(scale, translateY)
            spotfyBigText.style.position = 'relative';
            spotfyBigText.style.transformOrigin = 'left';
        }
    }, [scrollY]);

    const play =(id)=>{
        handlePlay(`/musicFile/music/${musicMap[id].musicSrc}`, `/musicFile/albumCover/${musicMap[id].cover}`, id);
    }

    return (
        <React.Fragment>

            <div className="spotfy-container" onClick={handleLogoClick}>
                <div className="spotfy-big-text">Spotfy</div>
            </div>

            <div className="negativebar" >
                <div className={`exploregroup ${isUnfoldSearchClicked && scrollY > 0 ? 'hidden' : ''}`}>
                    <button className="newbutton" id="NewButton" onClick={handleNewButtonClick}>
                        <b className="newtext">New</b>
                    </button>
                    <button className="newbutton" id="CategoryButton" onClick={handleCategoryButtonClick}>
                        <b className="newtext">Category</b>
                    </button>

                </div>
                <div className="unfoldsearch" ref={searchRef} onClick={toggleSearchInput}  style={{ width: `${width}px`, marginLeft: `${marginLeft}px` }}>
                    <div className="searchbar-icon" ></div>
                    <div className="search-container">
                        <img className="searchicon" alt="Search Icon" src={process.env.PUBLIC_URL +"/searchicon.svg" }/>
                        {isSearching ? (
                            <div className="searching">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="search-input"
                                    autoFocus
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                />

                                {searchQuery && (
                                    <div className="search-results-window">
                                        {searchResults.length > 0 ? (
                                            searchResults.map((result, index) => (
                                                <div key={index} className="search-result-item">
                                                    <div onClick={()=>play(result.id)}>
                                                        <div>{result.musicName}</div>
                                                        <div>{result.musicAuthor}</div>
                                                    </div>

                                                </div>
                                            ))
                                        ) : (
                                            <div>No results found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            showSearchText && (
                                <b className={`searchtext ${!showSearchText ? 'fade-out' : ''}`}>Search</b>
                            )
                        )}
                    </div>
                </div>
                <div className="usersnap">
                    <div className="usersnap1">
                        <b className="username">UserName</b>
                        <img
                            className="w-ksrcfsng4xa-1-icon"
                            alt=""
                            src={process.env.PUBLIC_URL +"/1600wksrcfsng4xa-1@2x.png"}

                        />
                    </div>
                    <button ref={buttonRef} className="playlistbutton" id="PlayListButton" onClick={handlePlayListButtonClick}>
                        <b className="playlisttext">PlayList</b>
                        <img
                            className={`playlisticon ${isPlaylistRotated ? 'rotate' : 'original'}`}
                            alt=""
                            src={process.env.PUBLIC_URL +"/playlisticon.svg"}
                        />
                    </button>
                    {isOpen && (
                        <div ref={playlistRef} className="popup-box">
                            <div className="create-play-list">
                                <button className="create-play-list-button" onClick={toggleInputArea}>
                                    <span>➕</span> Create playlist
                                </button>
                                {isInputVisible && (
                                    <form onSubmit={handleSubmit}>
                                        <input
                                            type="text"
                                            className="playlist-input"
                                            placeholder="Enter playlist name"
                                            value={playlistName}
                                            onChange={handleInputChange}
                                        />
                                        <button type="submit">Create</button>
                                    </form>
                                )}
                            </div>


                            <li className="music-info">
                                {playList.map((playlist, index) => (
                                    <div key={index} className="playlist" onDragOver={handleDragOver} onDrop={(event) => handleDrop(event, playlist[0])}>
                                        <h3 >{playlist[0]}</h3> {/* Playlist name */}
                                        <ul className="music-list">
                                            {playlist.slice(1).map((musicId) => {
                                                const musicInfo = musicMap[musicId.toString()];
                                                return (
                                                    <li key={musicId} className="music-item">

                                                        <button className="hamburgerIco" id="HamburgerIcon" draggable onDragStart={(event) => handleDragStart(event, musicId, playlist[0])}>
                                                            <img src={process.env.PUBLIC_URL + "/playlisticon.svg"} />
                                                        </button>
                                                        <button className="music-button" onClick={() => play(musicId)}>

                                                                <div className="music-info" >
                                                                    <img src={process.env.PUBLIC_URL +`/musicFile/albumCover/${musicMap[musicId].cover}`} alt={musicInfo.musicName} draggable="false" className="thumbnail"/>
                                                                    <span className="music-name">{musicInfo.musicName} - {musicInfo.musicAuthor}</span>
                                                                </div>

                                                        </button>
                                                        <button className="delete-button" onClick={ ()=>handleDelete(playlist[0], musicId)}><span>🗑️</span></button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                ))}
                            </li>
                        </div>



                    )}
                </div>
            </div>



        </React.Fragment>

    );
};
export default NavigationBar;

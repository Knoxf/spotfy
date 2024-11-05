import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar/NavigationBar"
import New from "../components/New/New"
import "./HomePage.css";
import PlayMusic from "../components/MusicPlayer/musicPlayer";
import RecentlySong from "../components/Recently/RecentlySong";
import Category from "../components/Category/Category";


const HomePage = () => {

    const [currentPlay, setCurrentPlay] = useState(null);
    const [currentPlayCover, setCurrentPlayCover] = useState(null);
    const [recentPlay, setRecentPlay] = useState(["1", "6", "42", "2", "12"]);
    const [draggedSong, setDraggedSong] = useState(null);
    const [targetPlaylist, setTargetPlaylist] = useState(null);

    const [playList, setPlayList] = useState([
        ["Favourite", "6", "8", "45", "32", "29"],
        ["Listen at night", "23", "3", "21"],
        ["For Assignment", "3", "9", "2", "1"]
    ]);

    const canAddToPlaylist = (playListName, musicId, currentPlayList) => {
        let success = false;
    
        currentPlayList.forEach(playlist => {
            if (playlist[0] === playListName && !playlist.includes(musicId)) {
                success = true;
            }
        });
    
        return success;
    };
    

    const addToPlayList = (playListName, musicId) => {
        let success = false;
        setPlayList(currentPlayList =>
            currentPlayList.map(playlist => {
                if (playlist[0] === playListName) {
                    if (!playlist.includes(musicId)) {
                        success = true;
                        return [...playlist, musicId];
                    }
                }
                return playlist;
            })
        );
        return success;
    };


    const createPlayList = (newPlayListName) => {
        if (newPlayListName !== "") {
            setPlayList(currentPlayList => [
                ...currentPlayList,
                [newPlayListName]
            ]);
        }

    }
    const handleDragStart = (event, songId, playlistName) => {
        setDraggedSong(songId);
        setTargetPlaylist(playlistName);
        event.dataTransfer.setData('text/plain', songId);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event, playlistName) => {
        event.preventDefault();
        const songId = event.dataTransfer.getData('text/plain');

        if (canAddToPlaylist(playlistName, songId, playList)) {
            addToPlayList(playlistName, songId);
            handleDelete(targetPlaylist, songId);
        }

        console.log(`Move song ${songId} to playlist ${playlistName}`);
    };


    const handlePlay = (music, cover, id) => {
        setCurrentPlay(music);
        setCurrentPlayCover(cover);
        console.log(music)
        console.log(cover)
        console.log(id)
        let updatedArray = [...recentPlay];
        if (!recentPlay.includes(id)) {
            updatedArray.unshift(id);
            updatedArray.pop();
            setRecentPlay(updatedArray);
            console.log(recentPlay.length)
        }
    };

    const handleDelete = (playListName, id) => {
        setPlayList(currentPlayList =>
            currentPlayList.map(playlist => {
                if (playlist[0] === playListName) {
                    return [playlist[0], ...playlist.slice(1).filter(musicId => musicId !== id)];
                }
                return playlist;
            })
        );
    };



    useEffect(() => {
    }, [currentPlay, recentPlay, playList]);


    return (
        <div className="homepage">
            <NavigationBar createPlayList={createPlayList} playList={playList}
                handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDrop={handleDrop}
                handlePlay={handlePlay} handleDelete={handleDelete} />
            <RecentlySong recentlyList={recentPlay} />
            <New onPlay={handlePlay} addToPlayList={addToPlayList} playList={playList} />
            <Category onPlay={handlePlay} addToPlayList={addToPlayList} playList={playList} />
            <div className="music-player">
                <PlayMusic file={currentPlay} cover={currentPlayCover} />
            </div>
        </div>
    );
};

export default HomePage;

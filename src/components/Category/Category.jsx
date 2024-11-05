import React, { useState } from 'react';
import CategoryCard from "./CategoryCard";
import MusicCard from "../MusicCard/MusicCard";

import './Category.css';
import musicMap from "../../musicMap.json";

const Category = ({ onPlay, addToPlayList, playList }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const categoryList = ["Afro", "Classical", "Comedy", "Focus", "Jazz", "Love", "Metal", "pop", "R&B", "Radar", "Rock", "Travel"];

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        console.log(category)
    };

    const handleBack =()=>{
        setSelectedCategory(null)
    }

    const filteredMusicCards = Object.values(musicMap).filter(item => item.Category === selectedCategory);

    return (
        <React.Fragment>
            <div className="Category-grid">
                <div className="Category-text-container">
                    <b className="category-text">Category</b>
                </div>
                {selectedCategory === null ? (
                    <div className="category-grib-container">
                        {categoryList.map((category, index) => (
                            <CategoryCard
                                key={index}
                                categoryCover={`/musicFile/CategoryCover/${category}.jpg`}
                                categoryName={category}
                                onClick={() => handleCategorySelect(category)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="category-grib-container">
                        <button className="back-button" onClick={handleBack}><span className="backlogo">🔙</span></button>
                        {filteredMusicCards.map(musicCard => (
                            <MusicCard
                                key={musicCard.id}
                                id={musicCard.id}
                                playList={playList}
                                addToPlayList={addToPlayList}
                                onPlay={onPlay}
                                data={musicCard}
                            />
                        ))}
                    </div>
                    )}
            </div>
        </React.Fragment>
    );
};

export default Category;
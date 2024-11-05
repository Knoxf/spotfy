import React from 'react';
import './CategoryCard.css';

const CategoryCard = ({ categoryCover, categoryName, onClick }) => {
    return (
        <div className="categoryCard" onClick={onClick}>
            <img className="category-img" src={process.env.PUBLIC_URL +categoryCover} alt={categoryName} />
            <h2 className="category-card-title">{categoryName}</h2>
        </div>
    );
};

export default CategoryCard;
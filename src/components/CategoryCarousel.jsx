import React from 'react';

const CategoryCarousel = ({ products, onSelectCategory }) => {
    const categories = ['Todo', ...new Set(products.map(p => p.category))];

    return (
        <nav className="menu-container">
        <div className="category-carousel-container">
        <div className="category-carousel">
        {categories.map((cat, idx) => {
            const iconName = cat === 'Todo' ? 'all' : cat.toLowerCase().replace(/\s+/g, '_');
            return (
                <div key={idx} className="category-item" onClick={() => onSelectCategory(cat === 'Todo' ? '__all' : cat)}>
                <img
                className="category-image"
                src={`/assets/img/icons/${iconName}.webp`}
                alt={cat}
                />
                <span className="category-name">{cat}</span>
                </div>
            );
        })}
        </div>
        </div>
        </nav>
    );
};

export default CategoryCarousel;

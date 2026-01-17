export const TAX_RATE = 0.19;

export const money = (v) => {
    const value = Math.floor(v);
    return value.toLocaleString('es-CO');
};

export const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export const calcTaxIncluded = (amount) => {
    return Math.round(amount - Math.round(amount / (1 + TAX_RATE)));
};

export const calcBaseFromIncluded = (amount) => {
    return Math.round(amount / (1 + TAX_RATE));
};
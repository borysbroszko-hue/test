// config.js
const appConfig = {
    brandName: "LiquidCloud",
    categories: ["Wszystkie", "Owocowe", "Deserowe", "Tytoniowe", "Chłodzące"],
    
    products: [
        {
            id: 1,
            name: "Mango Bongo",
            category: "Owocowe",
            price: 29.99,
            image: "assets/mango.jpg", // <-- Ścieżka do Twojego lokalnego pliku
            description: "Soczyste mango prosto z Filipin."
        },
        {
            id: 2,
            name: "Vanilla Custard",
            category: "Deserowe",
            price: 34.50,
            image: "assets/wanilia.png", // <-- Może być .jpg, .png, .webp itd.
            description: "Gęsty, waniliowy budyń babci."
        },
        // ... reszta produktów analogicznie
    ]
};
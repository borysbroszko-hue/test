// config.js
const appConfig = {
    brandName: "LiquidCloud",
    // DODANO "Bestsellery"
    categories: ["Wszystkie", "Bestsellery", "ELFLIQ", "VOZOL SALT", "HQD SALT", "VOZOL SALT PRIME"],
    
    products: [
        {
            id: 1,
            name: "Vozol | Berry Peach",
            category: "VOZOL SALT",
            price: 29.99,
            image: "assets/vozol.png",
            description: "Soczysta fuzja dojrzałych jagód leśnych i słodkiej brzoskwini. Idealny balans między słodyczą a owocowym orzeźwieniem.",
            bestseller: true // <--- TAK OZNACZASZ BESTSELLER
        },
        {
            id: 2,
            name: "ELFLIQ | Grape Raisin",
            category: "ELFLIQ",
            price: 34.50,
            image: "assets/elfliq.png", 
            description: "Intensywny i głęboki aromat ciemnych winogron z delikatnym, deserowym akcentem. Kultowy smak znany z urządzeń Elf Bar.",
            bestseller: false // lub po prostu nie dodawaj tego pola
        },
        {
            id: 3,
            name: "HQD | Lemon Lime",
            category: "HQD SALT",
            price: 29.99,
            image: "assets/hqd.png",
            description: "Cytrusowa eksplozja energii. Połączenie kwaśnej cytryny i aromatycznej limonki, które gwarantuje maksymalne orzeźwienie.",
            bestseller: true // <--- TAK OZNACZASZ BESTSELLER
        }
        // ... reszta Twoich produktów
    ]
};

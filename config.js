// config.js
const appConfig = {
    brandName: "LiquidCloud",
    
    // Lista wszystkich kategorii (kolejność ma znaczenie - tak wyświetlą się w menu)
    categories: [
        "Wszystkie", 
        "Bestsellery", 
        "ELFLIQ", 
        "HQD SALT", 
        "VOZOL SALT", 
        "Kartridże", 
        "Jednorazówki 10k", 
        "Jednorazówki 25k", 
        "Jednorazówki 50k"
    ],
    
    products: [
        // --- LIQUIDY ELFLIQ (Zdjęcie: assets/elfliq.png) ---
        {
            id: 1,
            name: "ELFLIQ | Watermelon",
            category: "ELFLIQ",
            price: 34.50,
            image: "assets/elfliq.png",
            description: "Klasyczny, niezwykle soczysty i słodki arbuz. Kultowy smak znany z jednorazówek Elf Bar w formie soli nikotynowej.",
            bestseller: true
        },
        {
            id: 2,
            name: "ELFLIQ | Blueberry Sour Raspberry",
            category: "ELFLIQ",
            price: 34.50,
            image: "assets/elfliq.png", 
            description: "Słodka borówka przełamana kwaśną maliną. Idealny balans dla fanów owocowych, orzeźwiających mieszanek.",
            bestseller: false
        },

        // --- LIQUIDY HQD (Zdjęcie: assets/hqd.png) ---
        {
            id: 3,
            name: "HQD | Lemon Lime",
            category: "HQD SALT",
            price: 29.99,
            image: "assets/hqd.png",
            description: "Cytrusowa eksplozja energii. Połączenie kwaśnej cytryny i aromatycznej limonki, które gwarantuje maksymalne orzeźwienie.",
            bestseller: true
        },
        {
            id: 4,
            name: "HQD | Grape Ice",
            category: "HQD SALT",
            price: 29.99,
            image: "assets/hqd.png",
            description: "Głęboki smak ciemnych winogron z solidnym uderzeniem chłodu. Idealny wybór na gorące dni.",
            bestseller: false
        },

        // --- LIQUIDY VOZOL (Zdjęcie: assets/vozol.png) ---
        {
            id: 5,
            name: "Vozol | Berry Peach",
            category: "VOZOL SALT",
            price: 29.99,
            image: "assets/vozol.png",
            description: "Soczysta fuzja dojrzałych jagód leśnych i słodkiej brzoskwini. Gładki i niesamowicie przyjemny smak.",
            bestseller: false
        },
        {
            id: 6,
            name: "Vozol | Strawberry Ice",
            category: "VOZOL SALT",
            price: 29.99,
            image: "assets/vozol.png",
            description: "Wyrazista, słodka truskawka przełamana arktycznym chłodem. Klasyk, który nigdy się nie nudzi.",
            bestseller: true
        },

        // --- KARTRIDŻE (Zdjęcie: assets/cartridge.png) ---
        {
            id: 7,
            name: "OXVA Xlim | 0.6Ω (V3)",
            category: "Kartridże",
            price: 15.00,
            image: "assets/cartridge.png",
            description: "Oryginalny kartridż OXVA Xlim V3 z górnym napełnianiem. Rezystancja 0.6 ohma, idealny do freebase i mocnych chmur.",
            bestseller: true
        },
        {
            id: 8,
            name: "Voopoo Argus | 0.7Ω",
            category: "Kartridże",
            price: 16.00,
            image: "assets/cartridge.png",
            description: "Zapasowy kartridż do serii Voopoo Argus Pod. Doskonałe oddawanie smaku i długa żywotność grzałki.",
            bestseller: false
        },

        // --- JEDNORAZÓWKI 10K (Zdjęcie: assets/vape10k.png) ---
        {
            id: 9,
            name: "Tornado | Peach Mango 10k",
            category: "Jednorazówki 10k",
            price: 65.00,
            image: "assets/vape10k.png",
            description: "Potężna jednorazówka oferująca aż 10 000 zaciągnięć. Smak soczystej brzoskwini i dojrzałego mango z możliwością ładowania.",
            bestseller: true
        },

        // --- JEDNORAZÓWKI 25K (Zdjęcie: assets/vape25k.png) ---
        {
            id: 10,
            name: "Waka SoPro | Cherry Cola 25k",
            category: "Jednorazówki 25k",
            price: 110.00,
            image: "assets/vape25k.png",
            description: "Monstrum wśród jednorazówek! 25 000 zaciągnięć z systemem Dual Mesh. Orzeźwiający smak wiśniowej coli.",
            bestseller: false
        },
        {
            id: 11,
            name: "Waka SoPro | Mint 25k",
            category: "Jednorazówki 25k",
            price: 110.00,
            image: "assets/vape25k.png",
            description: "Podwójna grzałka, ekran LED z poziomem liquidu i 25 000 buchów czystej, lodowatej mięty.",
            bestseller: true
        },

        // --- JEDNORAZÓWKI 50K (Zdjęcie: assets/vape50k.png) ---
        {
            id: 12,
            name: "Crown Bar | Watermelon Ice 50k",
            category: "Jednorazówki 50k",
            price: 180.00,
            image: "assets/vape50k.png",
            description: "Absolutny król pojemności. Niesamowite 50 000 zaciągnięć, wbudowany wyświetlacz i smak mrożonego arbuza. Sprzęt na tygodnie palenia.",
            bestseller: true
        }
    ]
};

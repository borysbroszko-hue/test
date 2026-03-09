// script.js
document.addEventListener('DOMContentLoaded', () => {
    
    // Ustawienie nazwy z configu
    document.getElementById('brand-title').textContent = appConfig.brandName;

    const categoriesContainer = document.getElementById('categories-container');
    const productsGrid = document.getElementById('products-grid');
    const searchInput = document.getElementById('search-input');

    let currentCategory = 'Wszystkie';
    let currentSearch = '';

    // 1. Inicjalizacja Kategorii
    function initCategories() {
        appConfig.categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = `category-btn ${category === 'Wszystkie' ? 'active' : ''}`;
            btn.textContent = category;
            
            btn.addEventListener('click', () => {
                // Reset aktywnych klas
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                currentCategory = category;
                renderProducts();
            });
            
            categoriesContainer.appendChild(btn);
        });
    }

    // 2. Renderowanie Produktów
    function renderProducts() {
        productsGrid.innerHTML = ''; // Czyszczenie grida

        // Filtrowanie logiki
        const filteredProducts = appConfig.products.filter(product => {
            const matchesCategory = currentCategory === 'Wszystkie' || product.category === currentCategory;
            const matchesSearch = product.name.toLowerCase().includes(currentSearch.toLowerCase()) || 
                                  product.description.toLowerCase().includes(currentSearch.toLowerCase());
            
            return matchesCategory && matchesSearch;
        });

        // Obsługa braku wyników
        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fa-solid fa-ghost" style="font-size: 40px; margin-bottom: 10px; color: rgba(255,255,255,0.2);"></i>
                    <p>Nie znaleziono żadnych liquidów.</p>
                </div>
            `;
            return;
        }

        // Generowanie HTML dla każdego produktu
        filteredProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            // Formatowanie ceny na PLN
            const pricePLN = parseFloat(product.price).toFixed(2) + ' zł';

            card.innerHTML = `
                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-bottom">
                        <span class="product-price">${pricePLN}</span>
                        <button class="add-btn"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(card);
        });
    }

    // 3. Obsługa wyszukiwarki na żywo
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderProducts();
    });

    // Start aplikacji
    initCategories();
    renderProducts();
});
/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SILNIK GWIAZD 3D (THREE.JS) ---
    function initStarfield() {
        const canvas = document.getElementById('starfield-canvas');
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Generowanie geometrii gwiazd
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = window.innerWidth < 768 ? 2500 : 5000;
        const posArray = new Float32Array(starsCount * 3);
        const colorsArray = new Float32Array(starsCount * 3);

        for(let i = 0; i < starsCount; i++) {
            posArray[i * 3] = (Math.random() - 0.5) * 20; 
            posArray[i * 3 + 1] = (Math.random() - 0.5) * 20;
            posArray[i * 3 + 2] = (Math.random() - 0.5) * 20;
            
            colorsArray[i * 3] = 0.8 + Math.random() * 0.2;
            colorsArray[i * 3 + 1] = 0.8 + Math.random() * 0.2;
            colorsArray[i * 3 + 2] = 0.9 + Math.random() * 0.1;
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        starsGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

        const starsMaterial = new THREE.PointsMaterial({
            size: 0.015,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const starField = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starField);

        // Obsługa interaktywnego ruchu (Myszka / Żyroskop)
        let mouseX = 0;
        let mouseY = 0;
        let gyroX = 0;
        let gyroY = 0;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = - (e.clientY / window.innerHeight) * 2 + 1;
        });

        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (event) => {
                gyroX = (event.gamma || 0) / 45;
                gyroY = (event.beta || 0) / 45;
            });
        }

        function animate() {
            requestAnimationFrame(animate);
            starField.rotation.y += 0.0003;

            const targetX = (mouseX * 0.4) + (gyroX * 0.6);
            const targetY = (mouseY * 0.2) + (gyroY * 0.3);

            camera.position.x += (targetX - camera.position.x) * 0.05;
            camera.position.y += (-targetY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // --- 2. LOGIKA INTERFEJSU KATALOGU ---
    const productsGrid = document.getElementById('products-grid');
    const searchInput = document.getElementById('search-input');
    const categoriesList = document.getElementById('categories-list');
    const categoriesPanel = document.getElementById('categories-panel');
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const brandLogo = document.getElementById('brand-logo');
    const overlay = document.getElementById('overlay');

    let currentCategory = 'Wszystkie';
    let currentSearch = '';

    // Funkcja zamykająca wszystkie otwarte elementy (menu i pop-out)
    function closeAllActive() {
        document.querySelectorAll('.product-card.expanded').forEach(card => {
            card.classList.remove('expanded');
        });
        overlay.classList.remove('active');
        categoriesPanel.classList.remove('open');
        document.body.style.overflow = ''; // Przywrócenie scrollowania tła
    }

    // Obsługa Menu i Overlay
    menuToggle?.addEventListener('click', () => categoriesPanel.classList.add('open'));
    menuClose?.addEventListener('click', closeAllActive);
    overlay?.addEventListener('click', closeAllActive);

    // Kliknięcie w Logo (Reset)
    brandLogo?.addEventListener('click', () => {
        currentCategory = 'Wszystkie';
        currentSearch = '';
        if (searchInput) searchInput.value = '';
        
        document.querySelectorAll('.category-list-item').forEach(btn => {
            btn.classList.toggle('active', btn.textContent === 'Wszystkie');
        });
        
        renderProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Inicjalizacja Kategorii
    function initCategories() {
        if (!categoriesList || !appConfig.categories) return;
        categoriesList.innerHTML = ''; 
        
        appConfig.categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = `category-list-item ${category === 'Wszystkie' ? 'active' : ''}`;
            btn.textContent = category;
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-list-item').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                currentCategory = category;
                renderProducts();
                closeAllActive();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            categoriesList.appendChild(btn);
        });
    }

    // Renderowanie Siatki Produktów
    function renderProducts() {
        if (!productsGrid) return;
        productsGrid.innerHTML = ''; 

        const filteredProducts = appConfig.products.filter(product => {
            const matchesCategory = currentCategory === 'Wszystkie' || product.category === currentCategory;
            const matchesSearch = product.name.toLowerCase().includes(currentSearch.toLowerCase()) || 
                                  product.description.toLowerCase().includes(currentSearch.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fa-solid fa-flask-vial"></i>
                    <p>Brak wyników w tej galaktyce.</p>
                </div>`;
            return;
        }

        filteredProducts.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.animationDelay = `${index * 0.02}s`;
            
            const pricePLN = parseFloat(product.price).toFixed(2) + ' zł';

            card.innerHTML = `
                <div class="product-image-wrapper">
                    <span class="product-badge">${product.category}</span>
                    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-bottom">
                        <span class="product-price">${pricePLN}</span>
                    </div>
                </div>
            `;

            // EVENT KLIKNIĘCIA - EFEKT POP-OUT
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (card.classList.contains('expanded')) {
                    closeAllActive();
                } else {
                    closeAllActive(); // Zamknij inne jeśli otwarte
                    card.classList.add('expanded');
                    overlay.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Blokada przewijania tła na iPhone
                }
            });

            productsGrid.appendChild(card);
        });
    }

    // Obsługa wyszukiwarki
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            renderProducts();
        });
    }

    // --- INICJALIZACJA STARTOWA ---
    initStarfield();
    initCategories();
    renderProducts();
});

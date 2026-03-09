/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SILNIK GWIAZD 3D + EFEKT ŻYROSKOPU (PARALAKSA) ---
    function initStarfield() {
        const canvas = document.getElementById('starfield-canvas');
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // --- GENEROWANIE GWIAZD ---
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = window.innerWidth < 768 ? 3000 : 6000;
        const posArray = new Float32Array(starsCount * 3);
        const colorsArray = new Float32Array(starsCount * 3);
        const sizesArray = new Float32Array(starsCount);

        for(let i = 0; i < starsCount; i++) {
            posArray[i * 3] = (Math.random() - 0.5) * 20; 
            posArray[i * 3 + 1] = (Math.random() - 0.5) * 20;
            posArray[i * 3 + 2] = (Math.random() - 0.5) * 20;
            
            colorsArray[i * 3] = 0.8 + Math.random() * 0.2;
            colorsArray[i * 3 + 1] = 0.8 + Math.random() * 0.2;
            colorsArray[i * 3 + 2] = 0.9 + Math.random() * 0.1;

            sizesArray[i] = Math.random() * 0.04;
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        starsGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
        starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizesArray, 1));

        const starsMaterial = new THREE.PointsMaterial({
            size: 0.015,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const starField = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starField);

        // --- DODATKOWY NEONOWY PYŁ (MGŁAWICA) ---
        const dustGeometry = new THREE.BufferGeometry();
        const dustCount = 1000;
        const dustPos = new Float32Array(dustCount * 3);
        for(let i = 0; i < dustCount * 3; i++) { 
            dustPos[i] = (Math.random() - 0.5) * 25; 
        }
        dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
        
        const dustMaterial = new THREE.PointsMaterial({ 
            size: 0.006, 
            color: 0xbc13fe, 
            transparent: true, 
            opacity: 0.4 
        });
        const dustField = new THREE.Points(dustGeometry, dustMaterial);
        scene.add(dustField);

        // --- OBSŁUGA RUCHU ---
        let mouseX = 0;
        let mouseY = 0;
        let gyroX = 0;
        let gyroY = 0;
        
        function onPointerMove(event) {
            let x = event.touches ? event.touches[0].clientX : event.clientX;
            let y = event.touches ? event.touches[0].clientY : event.clientY;
            mouseX = (x / window.innerWidth) * 2 - 1;
            mouseY = - (y / window.innerHeight) * 2 + 1;
        }
        window.addEventListener('mousemove', onPointerMove);
        window.addEventListener('touchmove', onPointerMove);

        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (event) => {
                gyroX = event.gamma / 45; 
                gyroY = event.beta / 45;  
            });
        }

        function animate() {
            requestAnimationFrame(animate);

            starField.rotation.y += 0.0002;
            dustField.rotation.x += 0.0001;

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

    let currentCategory = 'Wszystkie';
    let currentSearch = '';

    // Menu Toggle
    function toggleMenu() {
        categoriesPanel.classList.toggle('open');
    }
    menuToggle.addEventListener('click', toggleMenu);
    menuClose.addEventListener('click', toggleMenu);

    // Reset po kliknięciu w Logo
    if (brandLogo) {
        brandLogo.addEventListener('click', () => {
            currentCategory = 'Wszystkie';
            currentSearch = '';
            searchInput.value = '';
            
            document.querySelectorAll('.category-list-item').forEach(btn => {
                btn.classList.toggle('active', btn.textContent === 'Wszystkie');
            });
            
            renderProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Inicjalizacja Kategorii
    function initCategories() {
        if (!categoriesList) return;
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
                toggleMenu(); 
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

            // EVENT KLIKNIĘCIA - ROZWIJANIE OPISU
            card.addEventListener('click', () => {
                card.classList.toggle('expanded');
            });

            productsGrid.appendChild(card);
        });
    }

    // Listener wyszukiwarki
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            renderProducts();
        });
    }

    // --- START ---
    initStarfield();
    initCategories();
    renderProducts();
});

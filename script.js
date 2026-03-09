/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    
    // Tło 3D z gęstą galaktyką
    function initStars() {
        const canvas = document.getElementById('starfield-canvas');
        if(!canvas) return;
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const geo = new THREE.BufferGeometry();
        const starCount = 8000;
        const pos = new Float32Array(starCount * 3);
        for(let i=0; i < starCount * 3; i++) {
            pos[i] = (Math.random() - 0.5) * 30;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({ size: 0.012, color: 0xffffff, transparent: true, opacity: 0.5 });
        const points = new THREE.Points(geo, mat);
        scene.add(points);

        function anim() {
            requestAnimationFrame(anim);
            points.rotation.y += 0.0002;
            points.rotation.x += 0.00005;
            renderer.render(scene, camera);
        }
        anim();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    const grid = document.getElementById('products-grid');
    const overlay = document.getElementById('overlay');
    const search = document.getElementById('search-input');
    const drawer = document.getElementById('categories-panel');
    const logo = document.getElementById('brand-logo');
    
    let currentCat = 'Wszystkie';
    let query = '';

    function renderProducts() {
        grid.innerHTML = '';
        const filtered = appConfig.products.filter(p => {
            // LOGIKA KATEGORII I BESTSELLERÓW
            let matchCategory = false;
            if (currentCat === 'Wszystkie') {
                matchCategory = true;
            } else if (currentCat === 'Bestsellery') {
                matchCategory = p.bestseller === true;
            } else {
                matchCategory = p.category === currentCat;
            }

            const matchSearch = p.name.toLowerCase().includes(query.toLowerCase()) || 
                                p.description.toLowerCase().includes(query.toLowerCase());
            return matchCategory && matchSearch;
        });

        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            // GENEROWANIE ETYKIETY BESTSELLERA
            const bestsellerBadgeHTML = p.bestseller ? `<span class="bestseller-badge"><i class="fa-solid fa-fire"></i> Bestseller</span>` : '';

            card.innerHTML = `
                <div class="product-image-wrapper">
                    <span class="product-badge">${p.category}</span>
                    ${bestsellerBadgeHTML}
                    <img src="${p.image}" class="product-image">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${p.name}</h3>
                    <p class="product-desc">${p.description}</p>
                    <span class="product-price">${p.price.toFixed(2)} zł</span>
                </div>
            `;

            card.onclick = (e) => {
                e.stopPropagation();
                
                // Blokada otwierania karty, jeśli menu boczne jest otwarte
                if (drawer.classList.contains('open')) {
                    closeAll();
                    return; 
                }

                if(!card.classList.contains('expanded')) {
                    closeAll();
                    card.classList.add('expanded');
                    overlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                } else {
                    closeAll();
                }
            };
            grid.appendChild(card);
        });
    }

    function closeAll() {
        document.querySelectorAll('.product-card.expanded').forEach(c => c.classList.remove('expanded'));
        overlay.classList.remove('active');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
    }

    if(overlay) overlay.onclick = closeAll;
    
    if(search) {
        search.addEventListener('input', (e) => {
            query = e.target.value;
            renderProducts();
        });
    }

    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    if(menuToggle) menuToggle.onclick = () => drawer.classList.add('open');
    if(menuClose) menuClose.onclick = closeAll;

    const catList = document.getElementById('categories-list');
    if (catList && appConfig.categories) {
        appConfig.categories.forEach(c => {
            const btn = document.createElement('button');
            btn.className = `category-list-item ${c === currentCat ? 'active' : ''}`;
            
            // Dodatkowa ikonka dla Bestsellerów w samym menu
            if (c === 'Bestsellery') {
                btn.innerHTML = `<i class="fa-solid fa-fire" style="color: #f59e0b; margin-right: 8px;"></i>${c}`;
            } else {
                btn.textContent = c;
            }

            btn.onclick = () => {
                currentCat = c;
                document.querySelectorAll('.category-list-item').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderProducts();
                closeAll();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
            catList.appendChild(btn);
        });
    }

    if (logo) {
        logo.onclick = () => {
            currentCat = 'Wszystkie';
            query = '';
            if (search) search.value = '';
            
            document.querySelectorAll('.category-list-item').forEach(b => {
                if (b.textContent === 'Wszystkie') b.classList.add('active');
                else b.classList.remove('active');
            });
            
            closeAll();
            renderProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }

    initStars();
    renderProducts();
});

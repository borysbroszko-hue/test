document.addEventListener('DOMContentLoaded', () => {
    
    // Tło 3D z gwiazdami (czyste i płynne)
    function initStars() {
        const canvas = document.getElementById('starfield-canvas');
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(2000 * 3);
        for(let i=0; i<2000*3; i++) pos[i] = (Math.random()-0.5)*25;
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({ size: 0.015, color: 0xffffff, transparent: true, opacity: 0.4 });
        const points = new THREE.Points(geo, mat);
        scene.add(points);

        function anim() {
            requestAnimationFrame(anim);
            points.rotation.y += 0.0002;
            renderer.render(scene, camera);
        }
        anim();
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
            const mC = currentCat === 'Wszystkie' || p.category === currentCat;
            const mS = p.name.toLowerCase().includes(query.toLowerCase()) || 
                       p.description.toLowerCase().includes(query.toLowerCase());
            return mC && mS;
        });

        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image-wrapper">
                    <span class="product-badge">${p.category}</span>
                    <img src="${p.image}" class="product-image">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${p.name}</h3>
                    <p class="product-desc">${p.description}</p>
                    <span class="product-price">${p.price.toFixed(2)} zł</span>
                </div>
            `;

            // Otwieranie karty (Glassmorphism Modal)
            card.onclick = (e) => {
                e.stopPropagation();
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

    overlay.onclick = closeAll;
    
    if(search) {
        search.addEventListener('input', (e) => {
            query = e.target.value;
            renderProducts();
        });
    }

    // Obsługa bocznego menu
    document.getElementById('menu-toggle').onclick = () => drawer.classList.add('open');
    document.getElementById('menu-close').onclick = closeAll;

    // Generowanie Kategorii
    const catList = document.getElementById('categories-list');
    if (catList && appConfig.categories) {
        appConfig.categories.forEach(c => {
            const btn = document.createElement('button');
            btn.className = `category-list-item ${c === currentCat ? 'active' : ''}`;
            btn.textContent = c;
            btn.onclick = () => {
                currentCat = c;
                // Zmiana aktywnego podświetlenia
                document.querySelectorAll('.category-list-item').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderProducts();
                closeAll();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
            catList.appendChild(btn);
        });
    }

    // !!! KLIKNIĘCIE W LOGO - PEŁNY RESET !!!
    if (logo) {
        logo.onclick = () => {
            currentCat = 'Wszystkie';
            query = '';
            if (search) search.value = '';
            
            // Zresetuj przyciski kategorii, żeby "Wszystkie" znów było podświetlone
            document.querySelectorAll('.category-list-item').forEach(b => {
                if (b.textContent === 'Wszystkie') {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });
            
            closeAll();
            renderProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }

    initStars();
    renderProducts();
});

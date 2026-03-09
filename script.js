document.addEventListener('DOMContentLoaded', () => {
    
    function initStarfield() {
        const canvas = document.getElementById('starfield-canvas');
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(3000 * 3);
        for(let i=0; i<3000*3; i++) pos[i] = (Math.random()-0.5)*20;
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({ size: 0.015, color: 0xffffff, transparent: true, opacity: 0.5 });
        const points = new THREE.Points(geo, mat);
        scene.add(points);

        function anim() {
            requestAnimationFrame(anim);
            points.rotation.y += 0.0003;
            renderer.render(scene, camera);
        }
        anim();
    }

    const grid = document.getElementById('products-grid');
    const overlay = document.getElementById('overlay');
    const search = document.getElementById('search-input');
    const catPanel = document.getElementById('categories-panel');
    
    let currentCat = 'Wszystkie';
    let query = '';

    function render() {
        grid.innerHTML = '';
        const filtered = appConfig.products.filter(p => {
            const mC = currentCat === 'Wszystkie' || p.category === currentCat;
            const mS = p.name.toLowerCase().includes(query.toLowerCase());
            return mC && mS;
        });

        filtered.forEach((p, i) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.animationDelay = `${i * 0.02}s`;
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

            card.onclick = (e) => {
                e.stopPropagation();
                if(!card.classList.contains('expanded')) {
                    closeAll();
                    card.classList.add('expanded');
                    overlay.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Blokada scrolla tła
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
        document.body.style.overflow = '';
        catPanel.classList.remove('open');
    }

    overlay.onclick = closeAll;
    search.oninput = (e) => { query = e.target.value; render(); };

    document.getElementById('menu-toggle').onclick = () => catPanel.classList.add('open');
    document.getElementById('menu-close').onclick = closeAll;

    const catList = document.getElementById('categories-list');
    appConfig.categories.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'category-list-item';
        btn.textContent = c;
        btn.onclick = () => {
            currentCat = c;
            render();
            closeAll();
        };
        catList.appendChild(btn);
    });

    initStarfield();
    render();
});

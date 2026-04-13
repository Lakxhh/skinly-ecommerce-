const DOM = {
    nav: {
        home: document.getElementById('nav-home'),
        skin: document.getElementById('nav-skin'),
        hair: document.getElementById('nav-hair'),
        quiz: document.getElementById('nav-quiz'),
        profile: document.getElementById('nav-profile')
    },
    views: {
        landing: document.getElementById('landing-view'),
        nameCapture: document.getElementById('name-capture-view'),
        quizStart: document.getElementById('quiz-start-view'),
        quiz: document.getElementById('quiz-view'),
        loading: document.getElementById('loading-view'),
        catalog: document.getElementById('catalog-view'),
        profile: document.getElementById('profile-view')
    },
    catalog: {
        title: document.getElementById('catalog-title'),
        subtitle: document.getElementById('catalog-subtitle'),
        grid: document.getElementById('products-grid'),
        filterSelect: document.getElementById('filter-select'),
        resultsActions: document.getElementById('results-actions'),
        retakeBtn: document.getElementById('retake-btn'),
        historyCallout: document.getElementById('history-callout'),
        loadHistoryBtn: document.getElementById('load-history-btn')
    },
    mobile: {
        btn: document.getElementById('mobile-menu-btn'),
        drawer: document.getElementById('mobile-drawer'),
        overlay: document.getElementById('mobile-drawer-overlay'),
        closeWrapper: document.getElementById('close-mobile-btn'),
        navSkin: document.getElementById('mob-nav-skin'),
        navHair: document.getElementById('mob-nav-hair'),
        navProfile: document.getElementById('mob-nav-profile'),
        navQuiz: document.getElementById('mob-nav-quiz')
    },
    profile: {
        avatar: document.getElementById('profile-avatar'),
        greeting: document.getElementById('profile-greeting'),
        list: document.getElementById('history-list'),
        empty: document.getElementById('empty-history'),
        takeQuizLink: document.getElementById('profile-take-quiz-link')
    },
    nameCapture: {
        input: document.getElementById('user-name-input'),
        btn: document.getElementById('save-name-btn')
    },
    quizActions: {
        cards: document.querySelectorAll('.category-card'),
        startBanner: document.querySelector('#banner-quiz button'),
        startButtons: document.querySelectorAll('#quiz-start-view .large-outline-btn')
    },
    quiz: {
        categoryLabel: document.getElementById('quiz-category-label'),
        questionText: document.getElementById('question-text'),
        optionsContainer: document.getElementById('options-container'),
        progressBar: document.getElementById('progress-bar'),
        progressText: document.getElementById('progress-text'),
        prevBtn: document.getElementById('prev-btn'),
        quitBtn: document.getElementById('quit-btn')
    },
    modal: {
        overlay: document.getElementById('product-modal'),
        close: document.getElementById('close-modal'),
        img: document.getElementById('modal-img'),
        category: document.getElementById('modal-category'),
        rating: document.getElementById('modal-rating'),
        reviews: document.getElementById('modal-reviews'),
        name: document.getElementById('modal-name'),
        price: document.getElementById('modal-price'),
        desc: document.getElementById('modal-desc'),
        how: document.getElementById('modal-how'),
        ingredients: document.getElementById('modal-ingredients'),
        addBtn: document.getElementById('modal-add-to-bag')
    },
    cart: {
        btn: document.getElementById('nav-cart-btn'),
        badge: document.getElementById('cart-badge'),
        overlay: document.getElementById('cart-drawer-overlay'),
        drawer: document.getElementById('cart-drawer'),
        close: document.getElementById('close-cart-btn'),
        items: document.getElementById('cart-items'),
        subtotal: document.getElementById('cart-subtotal-price'),
        checkoutBtn: document.getElementById('checkout-btn')
    },
    infoModal: {
        overlay: document.getElementById('info-modal'),
        body: document.getElementById('info-modal-body'),
        close: document.getElementById('close-info-modal')
    },
    toastContainer: document.getElementById('toast-container')
};

let AppState = {
    mode: 'home', 
    catalogCategory: 'skin', 
    isQuizResult: false,
    quizCategory: null,
    currentQuestionIndex: 0,
    answers: {},
    selectedFilterType: 'All',
    renderedProducts: [],
    userName: null,
    pendingAction: null,
    cartItems: []
};

function init() {
    // Nav Binds
    if (DOM.nav.home) DOM.nav.home.addEventListener('click', () => setMode('home'));
    if (DOM.nav.skin) DOM.nav.skin.addEventListener('click', () => { setMode('catalog'); renderCatalog('skin'); closeMobileMenu(); });
    if (DOM.nav.hair) DOM.nav.hair.addEventListener('click', () => { setMode('catalog'); renderCatalog('hair'); closeMobileMenu(); });
    if (DOM.nav.quiz) DOM.nav.quiz.addEventListener('click', () => { attemptAction('quiz_select'); closeMobileMenu(); });
    if (DOM.nav.profile) DOM.nav.profile.addEventListener('click', () => { attemptAction('profile'); closeMobileMenu(); });

    // Mobile Hamburger Menu
    function openMobileMenu() {
        if (!DOM.mobile.overlay || !DOM.mobile.drawer) return;
        DOM.mobile.overlay.classList.remove('hidden');
        setTimeout(() => DOM.mobile.drawer.classList.add('show'), 10);
    }
    
    function closeMobileMenu() {
        if (!DOM.mobile.overlay || !DOM.mobile.drawer) return;
        DOM.mobile.drawer.classList.remove('show');
        setTimeout(() => DOM.mobile.overlay.classList.add('hidden'), 400);
    }

    if(DOM.mobile.btn) DOM.mobile.btn.addEventListener('click', openMobileMenu);
    if(DOM.mobile.closeWrapper) DOM.mobile.closeWrapper.addEventListener('click', closeMobileMenu);
    if(DOM.mobile.overlay) DOM.mobile.overlay.addEventListener('click', closeMobileMenu);

    if(DOM.mobile.navSkin) DOM.mobile.navSkin.addEventListener('click', () => { setMode('catalog'); renderCatalog('skin'); closeMobileMenu(); });
    if(DOM.mobile.navHair) DOM.mobile.navHair.addEventListener('click', () => { setMode('catalog'); renderCatalog('hair'); closeMobileMenu(); });
    if(DOM.mobile.navProfile) DOM.mobile.navProfile.addEventListener('click', () => { attemptAction('profile'); closeMobileMenu(); });
    if(DOM.mobile.navQuiz) DOM.mobile.navQuiz.addEventListener('click', () => { attemptAction('quiz_select'); closeMobileMenu(); });
    
    if(DOM.quizActions.startBanner) DOM.quizActions.startBanner.addEventListener('click', () => attemptAction('quiz_select'));
    if(DOM.profile.takeQuizLink) DOM.profile.takeQuizLink.addEventListener('click', (e) => { e.preventDefault(); attemptAction('quiz_select'); });
    if(DOM.catalog.loadHistoryBtn) DOM.catalog.loadHistoryBtn.addEventListener('click', () => loadHistoricalRoutine(AppState.catalogCategory));

    // Shop Home Cards
    DOM.quizActions.cards.forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.dataset.action.split('_')[1];
            setMode('catalog'); renderCatalog(cat);
        });
        const btn = card.querySelector('button');
        if(btn) btn.addEventListener('click', (e) => { 
            e.stopPropagation(); 
            const cat = card.dataset.action.split('_')[1]; 
            setMode('catalog'); renderCatalog(cat); 
        });
    });

    // Name Capture Binds
    DOM.nameCapture.btn.addEventListener('click', saveName);
    DOM.nameCapture.input.addEventListener('keypress', (e) => { if(e.key === 'Enter') saveName(); });

    // Quiz Binds
    DOM.quizActions.startButtons.forEach(btn => {
        btn.addEventListener('click', () => startQuiz(btn.dataset.quiz));
    });
    DOM.quiz.prevBtn.addEventListener('click', goBackQuiz);
    DOM.quiz.quitBtn.addEventListener('click', () => setMode('home'));
    DOM.catalog.retakeBtn.addEventListener('click', () => startQuiz(AppState.quizCategory));

    // Google Sign-In hook
    const googleBtn = document.getElementById('google-signin-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', handleGoogleSignIn);
    }

    // Catalog Filter
    if(DOM.catalog.filterSelect) {
        DOM.catalog.filterSelect.addEventListener('change', (e) => {
            AppState.selectedFilterType = e.target.value;
            filterAndRenderGrid();
        });
    }

    // Modal Binds
    if(DOM.modal.close) DOM.modal.close.addEventListener('click', closeModal);
    if(DOM.modal.overlay) DOM.modal.overlay.addEventListener('click', (e) => {
        if(e.target === DOM.modal.overlay) closeModal();
    });
    
    // Info Modal Binds
    if(DOM.infoModal.close) DOM.infoModal.close.addEventListener('click', closeInfoModal);
    if(DOM.infoModal.overlay) DOM.infoModal.overlay.addEventListener('click', (e) => {
        if(e.target === DOM.infoModal.overlay) closeInfoModal();
    });

    // Footer Listeners
    // Footer Listeners
    const fShip = document.getElementById('footer-shipping');
    const fCont = document.getElementById('footer-contact');
    const fFaq = document.getElementById('footer-faq');
    const fTerms = document.getElementById('footer-terms');
    const fPriv = document.getElementById('footer-privacy');

    if(fShip) fShip.addEventListener('click', (e) => { e.preventDefault(); showInfo('shipping'); });
    if(fCont) fCont.addEventListener('click', (e) => { e.preventDefault(); showInfo('contact'); });
    if(fFaq) fFaq.addEventListener('click', (e) => { e.preventDefault(); showInfo('faq'); });
    if(fTerms) fTerms.addEventListener('click', (e) => { e.preventDefault(); showInfo('terms'); });
    if(fPriv) fPriv.addEventListener('click', (e) => { e.preventDefault(); showInfo('privacy'); });

    // Newsletter subscription
    const newsletterBtn = document.querySelector('.newsletter-input button');
    const newsletterInput = document.querySelector('.newsletter-input input');
    if (newsletterBtn && newsletterInput) {
        newsletterBtn.addEventListener('click', async () => {
            const email = newsletterInput.value.trim();
            if (!email || !email.includes('@')) {
                showToast('Please enter a valid email address.');
                return;
            }
            const success = await saveNewsletterEmail(email);
            if (success) {
                showToast('🎉 Subscribed! 10% off coupon sent to your email.');
                newsletterInput.value = '';
            } else {
                showToast('Could not subscribe. Please try again.');
            }
        });
    }
    
    // Cart Binds
    DOM.cart.btn.addEventListener('click', openCart);
    DOM.cart.close.addEventListener('click', closeCart);
    DOM.cart.overlay.addEventListener('click', closeCart);
    DOM.cart.checkoutBtn.addEventListener('click', () => {
        alert('This is a simulated storefront. No payments will be taken!');
    });
    
    // Load state
    loadCloudState();
}

// --- Cloud & Identity Logic ---
async function loadCloudState() {
    // 1. Try to load local name first for instant feel
    const savedName = localStorage.getItem('Skinly_Name');
    if (savedName) AppState.userName = savedName;

    // 2. Try to connect to Firebase
    const uid = await handleCloudIdentity();
    if (uid) {
        // 2a. Try loading products from Firestore (overrides data.js if found)
        const cloudProducts = await loadProductsFromCloud();
        if (cloudProducts) {
            data.products = cloudProducts;
            console.log('✅ Products loaded from Firestore');
        }

        // 2b. Sync user profile from Cloud
        try {
            const userDoc = await db.collection('users').doc(uid).get();
            if (userDoc.exists) {
                const cloudData = userDoc.data();
                if (cloudData.name) {
                    AppState.userName = cloudData.name;
                    localStorage.setItem('Skinly_Name', cloudData.name);
                }
                if (cloudData.cart) {
                    AppState.cartItems = cloudData.cart;
                    renderCart();
                }
                console.log('✅ Skinly Cloud: Profile synced.');
                if (AppState.mode === 'profile') renderProfile();
            } else {
                // New cloud user — initialize doc (only if they set a name previously locally)
                if (AppState.userName) {
                    await db.collection('users').doc(uid).set({
                        name: AppState.userName,
                        history: [],
                        cart: [],
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            }
        } catch (e) {
            console.warn('⚠️ Firestore profile sync failed:', e.message);
        }
    }
}

async function handleGoogleSignIn() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        
        AppState.userName = user.displayName.split(' ')[0] || "User";
        localStorage.setItem('Skinly_Name', AppState.userName);
        
        // Ensure doc exists
        await db.collection('users').doc(user.uid).set({
            name: AppState.userName
        }, { merge: true });

        showToast("Signed in with Google!");
        
        // Trigger generic data reload
        await loadCloudState();
        
        if (AppState.pendingAction) {
            setMode(AppState.pendingAction);
            AppState.pendingAction = null;
        } else {
            setMode('home');
        }
    } catch (e) {
        showToast("Google Sign-in Failed: " + e.message);
        console.error(e);
    }
}

function attemptAction(mode) {
    if (!AppState.userName) {
        AppState.pendingAction = mode;
        setMode('name_capture');
    } else {
        setMode(mode);
    }
}

async function saveName() {
    const name = DOM.nameCapture.input.value.trim();
    if (name.length > 0) {
        AppState.userName = name;
        localStorage.setItem('Skinly_Name', name);
        
        // Sync to Firebase if possible
        if (auth.currentUser) {
            try {
                await db.collection('users').doc(auth.currentUser.uid).set({
                    name: name
                }, { merge: true });
                showToast("Profile synced to cloud");
            } catch (e) {
                console.warn("Cloud save failed:", e);
            }
        }

        if (AppState.pendingAction) {
            setMode(AppState.pendingAction);
            AppState.pendingAction = null;
        } else {
            setMode('home');
        }
    }
}

async function saveQuizResults(category, products) {
    // 1. Save to Local
    let history = JSON.parse(localStorage.getItem('Skinly_History') || '[]');
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const run = {
        id: 'run_' + Date.now(),
        date: dateStr,
        category: category,
        products: products
    };
    history.unshift(run);
    localStorage.setItem('Skinly_History', JSON.stringify(history));

    // 2. Save to Cloud
    if (auth.currentUser) {
        try {
            await db.collection('users').doc(auth.currentUser.uid).update({
                history: firebase.firestore.FieldValue.arrayUnion(run)
            });
            showToast("Results backed up to cloud");
        } catch (e) {
            // If the document doesn't exist yet, we might need a 'set' first.
            // But loadCloudState should have handled it.
            console.warn("Cloud history sync failed:", e);
        }
    }
}

function getLatestHistoryForCategory(category) {
    let history = JSON.parse(localStorage.getItem('Skinly_History') || '[]');
    return history.find(run => run.category === category); // finds first match since it is unshifted
}

// --- Routing & Views ---
function switchView(viewName) {
    const target = DOM.views[viewName];
    Object.values(DOM.views).forEach(v => {
        if (v !== target) {
            v.classList.remove('active');
            setTimeout(() => { if (!v.classList.contains('active')) v.classList.add('hidden'); }, 300);
        }
    });
    target.classList.remove('hidden');
    setTimeout(() => { target.classList.add('active'); }, 50);
}

function setMode(mode) {
    AppState.mode = mode;
    AppState.isQuizResult = false;
    
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('nav-highlight'));
    
    if (mode === 'home') {
        switchView('landing');
    } else if (mode === 'catalog') {
        if(AppState.catalogCategory === 'skin') DOM.nav.skin.classList.add('nav-highlight');
        else DOM.nav.hair.classList.add('nav-highlight');
        switchView('catalog');
    } else if (mode === 'quiz_select') {
        DOM.nav.quiz.classList.add('nav-highlight');
        switchView('quizStart');
    } else if (mode === 'quiz') {
        switchView('quiz');
    } else if (mode === 'name_capture') {
        switchView('nameCapture');
        setTimeout(() => DOM.nameCapture.input.focus(), 300);
    } else if (mode === 'profile') {
        DOM.nav.profile.classList.add('nav-highlight');
        renderProfile();
        switchView('profile');
    }
}

// --- Profile Rendering ---
async function renderProfile() {
    DOM.profile.greeting.innerText = `Welcome back, ${AppState.userName}!`;
    DOM.profile.avatar.innerText = AppState.userName.charAt(0).toUpperCase();
    
    // 1. Get Local History
    let history = JSON.parse(localStorage.getItem('Skinly_History') || '[]');

    // 2. If Cloud is active, we might want to prioritize it or merge.
    // For now, let's fetch cloud history to ensure we are up to date.
    if (auth.currentUser) {
        try {
            const userDoc = await db.collection('users').doc(auth.currentUser.uid).get();
            if (userDoc.exists && userDoc.data().history) {
                // Merge or replace - replacing is safer for cross-device consistency
                history = userDoc.data().history.sort((a,b) => b.id.split('_')[1] - a.id.split('_')[1]);
            }
        } catch (e) {
            console.warn("Could not fetch cloud history for profile.");
        }
    }
    
    DOM.profile.list.innerHTML = '';
    
    if (history.length === 0) {
        DOM.profile.empty.classList.remove('hidden');
    } else {
        DOM.profile.empty.classList.add('hidden');
        history.forEach((run, idx) => {
            const card = document.createElement('div');
            card.className = 'history-card';
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            card.style.transition = 'all 0.4s ease';
            
            const catDisplay = run.category === 'skin' ? 'Skin' : 'Hair';
            
            card.innerHTML = `
                <div class="history-info" style="flex:1;">
                    <h4>${catDisplay} Assessment</h4>
                    <p>${run.date} • ${run.products.length} Products Found</p>
                </div>
                <div class="history-action" style="display:flex; gap:10px; align-items:center;">
                    <span class="view-run-btn" style="cursor:pointer; font-weight:600;">View →</span>
                    <button class="delete-run-btn" style="background:transparent; border:1px solid #ff5252; color:#ff5252; padding:6px 10px; border-radius:6px; cursor:pointer;" title="Delete Quiz Run"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            const viewBtn = card.querySelector('.view-run-btn');
            const delBtn = card.querySelector('.delete-run-btn');
            
            viewBtn.onclick = (e) => {
                e.stopPropagation();
                AppState.quizCategory = run.category;
                AppState.renderedProducts = run.products;
                showCatalogAsResults(run.category, true); // true = loaded from history
            };

            delBtn.onclick = async (e) => {
                e.stopPropagation();
                if(confirm('Are you sure you want to delete this quiz history?')) {
                    history.splice(idx, 1);
                    localStorage.setItem('Skinly_History', JSON.stringify(history));
                    if (auth.currentUser) {
                        try {
                            await db.collection('users').doc(auth.currentUser.uid).update({ history: history });
                        } catch (err) { console.warn("Cloud delete sync failed", err); }
                    }
                    card.style.opacity = '0';
                    setTimeout(() => renderProfile(), 300);
                    showToast('Quiz history deleted.');
                }
            };
            
            DOM.profile.list.appendChild(card);
            setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 80 * idx);
        });
    }
}

// --- Catalog Rendering ---
function renderCatalog(category) {
    AppState.catalogCategory = category;
    AppState.isQuizResult = false;
    AppState.selectedFilterType = 'All';
    DOM.catalog.filterSelect.value = 'All';
    
    DOM.catalog.title.innerText = category === 'skin' ? 'Shop Skin Care' : 'Shop Hair Care';
    DOM.catalog.subtitle.innerText = 'Our complete range of clinical formulations.';
    DOM.catalog.resultsActions.classList.add('hidden');
    document.getElementById('catalog-filters').classList.remove('hidden');
    
    // Check if there is history for this branch
    const existingHistory = getLatestHistoryForCategory(category);
    if (existingHistory) {
        DOM.catalog.historyCallout.classList.remove('hidden');
    } else {
        DOM.catalog.historyCallout.classList.add('hidden');
    }

    const products = data.products[category];
    AppState.renderedProducts = products.map(p => ({...p, displayScore: null}));
    filterAndRenderGrid();
}

function filterAndRenderGrid() {
    let toRender = AppState.renderedProducts;
    if (AppState.selectedFilterType !== 'All') {
        toRender = toRender.filter(p => p.category === AppState.selectedFilterType || p.filterTarget === AppState.selectedFilterType);
    }
    
    DOM.catalog.grid.innerHTML = '';
    toRender.forEach((p, idx) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        card.onclick = () => openModal(p);
        
        let badgeHTML = '';
        if (AppState.isQuizResult && p.displayScore) {
            badgeHTML = `<span class="match-badge">${p.displayScore}% Match</span>`;
        }

        card.innerHTML = `
            <div class="product-image-wrap">
                ${badgeHTML}
                <img src="${p.image}" alt="${p.name}">
            </div>
            <div class="product-info">
                <span class="product-category">${p.category}</span>
                <h3 class="product-name">${p.name}</h3>
                <p class="product-desc">${p.desc}</p>
                <div class="product-footer">
                    <span class="product-price">${p.priceRange || `₹${p.price}`}</span>
                    <button class="buy-btn" data-pid="${p.id}">Add</button>
                </div>
            </div>
        `;
        
        // Setup Grid Add to cart button
        const addBtn = card.querySelector('.buy-btn');
        addBtn.onclick = (e) => {
            e.stopPropagation();
            addToCart(p);
        };
        
        DOM.catalog.grid.appendChild(card);
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 80 * idx);
    });
}

function loadHistoricalRoutine(category) {
    const historicalRun = getLatestHistoryForCategory(category);
    if (historicalRun) {
        AppState.quizCategory = category;
        AppState.renderedProducts = historicalRun.products;
        showCatalogAsResults(category, true);
    }
}

function showCatalogAsResults(category, fromHistory = false) {
    AppState.isQuizResult = true;
    AppState.catalogCategory = category;
    
    DOM.catalog.title.innerText = fromHistory ? 'Your Saved Routine' : 'Your Custom Routine';
    DOM.catalog.subtitle.innerText = 'Based on your profile, these are best suited for you.';
    DOM.catalog.resultsActions.classList.remove('hidden');
    document.getElementById('catalog-filters').classList.add('hidden');
    DOM.catalog.historyCallout.classList.add('hidden'); // Hide the callout since we are looking at the results!
    
    switchView('catalog');
    filterAndRenderGrid();
}

// --- Quiz Logic ---
function startQuiz(category) {
    AppState.quizCategory = category;
    AppState.currentQuestionIndex = 0;
    AppState.answers = {};
    AppState.selectedFilterType = 'All';
    setMode('quiz');
    
    DOM.quiz.categoryLabel.innerText = category === 'skin' ? 'Skin Assessment' : 'Hair Assessment';
    renderQuestion();
}

function goBackQuiz() {
    if (AppState.currentQuestionIndex > 0) {
        AppState.currentQuestionIndex--;
        renderQuestion();
    }
}

function renderQuestion() {
    const qIndex = AppState.currentQuestionIndex;
    const currentQuestions = data.questions[AppState.quizCategory];
    const q = currentQuestions[qIndex];
    
    const progressPerc = ((qIndex) / currentQuestions.length) * 100;
    DOM.quiz.progressBar.style.width = `${progressPerc}%`;
    DOM.quiz.progressText.innerText = `Step ${qIndex + 1} of ${currentQuestions.length}`;
    DOM.quiz.questionText.innerText = q.text;

    if (qIndex === 0) DOM.quiz.prevBtn.classList.add('hidden');
    else DOM.quiz.prevBtn.classList.remove('hidden');

    DOM.quiz.optionsContainer.innerHTML = '';
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt.label;
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(10px)';
        btn.style.transition = 'all 0.3s ease';
        btn.onclick = () => handleOptionSelect(opt);
        DOM.quiz.optionsContainer.appendChild(btn);
        setTimeout(() => { btn.style.opacity = '1'; btn.style.transform = 'translateY(0)'; }, 50 * idx);
    });
}

function handleOptionSelect(option) {
    const currentQuestions = data.questions[AppState.quizCategory];
    
    if (option.filterTarget) AppState.selectedFilterType = option.filterTarget;
    else if (option.points) {
        Object.entries(option.points).forEach(([trait, value]) => {
            AppState.answers[trait] = (AppState.answers[trait] || 0) + value;
        });
    }

    AppState.currentQuestionIndex++;

    if (AppState.currentQuestionIndex >= currentQuestions.length) finishQuiz();
    else renderQuestion();
}

function finishQuiz() {
    DOM.quiz.progressBar.style.width = '100%';
    switchView('loading');
    
    setTimeout(() => {
        calculateQuizResults();
        
        // Save the run to localStorage history permanently!
        saveQuizResults(AppState.quizCategory, AppState.renderedProducts);
        
        showCatalogAsResults(AppState.quizCategory, false);
    }, 1500); 
}

function calculateQuizResults() {
    const currentProducts = data.products[AppState.quizCategory];
    
    let scoredProducts = currentProducts.map(product => {
        let score = 0;
        product.traits.forEach(trait => {
            if (AppState.answers[trait] !== undefined) score += AppState.answers[trait];
            if (trait === 'all') score += 1;
        });
        let displayScore = 75 + (score * 4);
        if (displayScore > 99) displayScore = 99;
        if (displayScore < 65) displayScore = 65 + Math.floor(Math.random() * 15);
        return { ...product, rawScore: score, displayScore: displayScore };
    });

    scoredProducts.sort((a, b) => b.rawScore - a.rawScore);

    if (AppState.selectedFilterType !== 'All') {
        scoredProducts = scoredProducts.filter(p => p.category === AppState.selectedFilterType);
        if (scoredProducts.length === 0) {
            scoredProducts = currentProducts.slice(0, 3).map(p => ({...p, displayScore: 82}));
        }
    }

    AppState.renderedProducts = scoredProducts.slice(0, 6);
}

// --- Modal Logic ---
function openModal(product) {
    DOM.modal.img.src = product.image;
    DOM.modal.category.innerText = product.category;
    DOM.modal.name.innerText = product.name;
    DOM.modal.price.innerText = product.priceRange || `₹${product.price}`;
    DOM.modal.desc.innerText = product.desc;
    DOM.modal.how.innerText = product.howToUse || 'Apply as directed on packaging.';
    DOM.modal.rating.innerText = product.rating || '4.9';
    DOM.modal.reviews.innerText = product.reviews || '120';
    
    DOM.modal.ingredients.innerHTML = product.ingredients.map(ing => `<span class="ingredient-tag">${ing}</span>`).join('');
    
    // Set up modal add button
    DOM.modal.addBtn.onclick = () => {
        addToCart(product);
        closeModal();
    };
    
    DOM.modal.overlay.classList.remove('hidden');
    // timeout for display box to trigger transition
    setTimeout(() => {
        DOM.modal.overlay.classList.add('show');
    }, 10);
}

function closeModal() {
    DOM.modal.overlay.classList.remove('show');
    setTimeout(() => {
        DOM.modal.overlay.classList.add('hidden');
    }, 300);
}

// --- Cart & Toast Logic ---
async function addToCart(product) {
    AppState.cartItems.push(product);
    renderCart();
    showToast(`Added ${product.name} to your bag`);
    
    // Sync to Cloud
    if (auth.currentUser) {
        try {
            await db.collection('users').doc(auth.currentUser.uid).update({
                cart: AppState.cartItems
            });
        } catch (e) { console.warn("Cart cloud sync failed:", e); }
    }

    // Brief badge bump animation
    DOM.cart.badge.style.transform = 'scale(1.3)';
    setTimeout(() => { DOM.cart.badge.style.transform = 'scale(1)'; }, 200);
}

async function removeFromCart(index) {
    AppState.cartItems.splice(index, 1);
    renderCart();
    
    // Sync to Cloud
    if (auth.currentUser) {
        try {
            await db.collection('users').doc(auth.currentUser.uid).update({
                cart: AppState.cartItems
            });
        } catch (e) { console.warn("Cart cloud sync failed:", e); }
    }
}

function renderCart() {
    DOM.cart.items.innerHTML = '';
    let total = 0;
    
    if (AppState.cartItems.length === 0) {
        DOM.cart.items.innerHTML = '<div class="cart-empty-message">Your shopping bag is empty.</div>';
        DOM.cart.badge.classList.add('hidden');
    } else {
        DOM.cart.badge.classList.remove('hidden');
        DOM.cart.badge.innerText = AppState.cartItems.length;
        
        AppState.cartItems.forEach((item, idx) => {
            total += item.price;
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <img src="${item.image}" alt="">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
                    <button class="cart-item-remove" onclick="removeFromCart(${idx})">Remove</button>
                </div>
            `;
            DOM.cart.items.appendChild(el);
        });
    }
    
    DOM.cart.subtotal.innerText = `₹${total.toFixed(2)}`;
}

function openCart() {
    DOM.cart.overlay.classList.remove('hidden');
    setTimeout(() => { 
        DOM.cart.overlay.classList.add('show'); 
        DOM.cart.drawer.classList.add('show');
    }, 10);
}

function closeCart() {
    DOM.cart.overlay.classList.remove('show');
    DOM.cart.drawer.classList.remove('show');
    setTimeout(() => { DOM.cart.overlay.classList.add('hidden'); }, 400);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">✓</span> ${message}`;
    
    DOM.toastContainer.appendChild(toast);
    
    // trigger animation
    setTimeout(() => { toast.classList.add('show'); }, 10);
    
    // remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

function showInfo(type) {
    let content = '';
    const title = type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');

    if (type === 'shipping') {
        content = `
            <div class="info-content-header">
                <h2>Shipping & Returns</h2>
                <p>Fast, reliable delivery for your skin health.</p>
            </div>
            <div class="info-body-text">
                <h3>Shipping Policy</h3>
                <p>We offer free standard shipping on all orders over ₹4,000 within India. For orders below ₹4,000, a flat shipping fee of ₹150 applies.</p>
                <p>Orders are processed within 24 hours. Estimated delivery time is 3-5 business days depending on your location.</p>
                
                <h3>Returns & Exchanges</h3>
                <p>Your satisfaction is our priority. We accept returns of unopened and unused products within 7 days of delivery.</p>
                <p>To initiate a return, please contact our support team with your order number. Once the product is received and inspected, we will issue a full refund to your original payment method.</p>
            </div>
        `;
    } else if (type === 'contact') {
        content = `
            <div class="info-content-header">
                <h2>Contact Us</h2>
                <p>We're here to help you on your beauty journey.</p>
            </div>
            <div class="contact-card">
                <div class="contact-name">Kunal Choudhary</div>
                <div class="contact-role">Founder & CEO</div>
                <div class="contact-phone">
                    <a href="tel:+916367173596">PH: +91 6367173596</a>
                </div>
                <div class="social-links">
                    <a href="https://www.instagram.com/kunall_.27?igsh=MTE4anpmaGJiYjMzcg==" target="_blank" class="social-icon-btn instagram"><i class="fab fa-instagram"></i></a>
                    <a href="https://www.linkedin.com/in/kunal-choudhary-31861726a?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" class="social-icon-btn linkedin"><i class="fab fa-linkedin-in"></i></a>
                </div>
            </div>
            
            <div class="contact-card">
                <div class="contact-name">Laksh Choudhary</div>
                <div class="contact-role">Lead Developer & Co-Founder</div>
                <div class="contact-phone">
                    <a href="mailto:hello@skinly.com">Email Developer</a>
                </div>
                <div class="social-links">
                    <a href="https://www.instagram.com/lakshhh_._?igsh=MWJleThlc2gxa3h3cQ%3D%3D&utm_source=qr" target="_blank" class="social-icon-btn instagram"><i class="fab fa-instagram"></i></a>
                    <a href="https://www.linkedin.com/in/laksh-choudhary-9b463828b?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" class="social-icon-btn linkedin"><i class="fab fa-linkedin-in"></i></a>
                </div>
            </div>
            <div class="info-body-text" style="margin-top: 30px; text-align: center;">
                <p>Available Monday - Saturday: 10:00 AM - 7:00 PM IST</p>
                <p>General Inquiries: hello@skinly.com</p>
            </div>
        `;
    } else if (type === 'faq') {
        content = `
            <div class="info-content-header">
                <h2>Frequently Asked Questions</h2>
            </div>
            <div class="info-body-text">
                <h3>Are the products vegan?</h3>
                <p>Yes, all Skinly products are 100% vegan and cruelty-free.</p>
                <h3>How do I know my skin type?</h3>
                <p>Our personalized assessment quiz uses dermatological algorithms to analyze your responses and determine your skin profile.</p>
                <h3>Can I cancel my order?</h3>
                <p>Orders can be cancelled within 2 hours of placement before they are processed for shipping.</p>
            </div>
        `;
    } else {
        content = `
            <div class="info-content-header">
                <h2>${title}</h2>
            </div>
            <div class="info-body-text">
                <p>This page is currently being updated with our latest policies for 2026. Please check back shortly.</p>
                <p>For urgent inquiries, please contact our support team at hello@skinly.com.</p>
            </div>
        `;
    }

    DOM.infoModal.body.innerHTML = content;
    DOM.infoModal.overlay.classList.add('show');
}

function closeInfoModal() {
    DOM.infoModal.overlay.classList.remove('show');
}

// Start
init();

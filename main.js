document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. APP-LIKE UI EXPERIENCES (NEW LOGIC)
    // ==========================================

    // A. Smart Header (Hides on scroll down, shows on scroll up)
    let lastScroll = 0;
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 0) {
            header.classList.remove('hidden');
            return;
        }
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('hidden'); // Scrolling down
        } else {
            header.classList.remove('hidden'); // Scrolling up
        }
        lastScroll = currentScroll;
    });

    // B. Mobile Side Drawer Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.querySelector('.drawer-overlay');
    const closeDrawerBtn = document.querySelector('.close-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-links a');

    function toggleDrawer() {
        mobileDrawer.classList.toggle('active');
        drawerOverlay.classList.toggle('active');
        hamburger.classList.toggle('active');
    }

    if(hamburger) hamburger.addEventListener('click', toggleDrawer);
    if(closeDrawerBtn) closeDrawerBtn.addEventListener('click', toggleDrawer);
    if(drawerOverlay) drawerOverlay.addEventListener('click', toggleDrawer);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileDrawer.classList.remove('active');
            drawerOverlay.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // C. Mobile Bottom Nav Active State
    const bottomNavItems = document.querySelectorAll('.app-bottom-nav .nav-item:not(.fab-center)');
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function() {
            bottomNavItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ==========================================
    // 2. YOUR ORIGINAL LOGIC (MAINTAINED)
    // ==========================================

    // --- Interactive Search System ---
    const searchDatabase = [
        { title: "Food Division", url: "pages/food-division.html", category: "Trade Division", keywords: "food, orange, export, corridor, sharjah" },
        { title: "Hotel Supplies", url: "pages/hotel-supplies.html", category: "Trade Division", keywords: "hotel, premium, sheets, supplies, ports" },
        { title: "Chemicals & Cosmetics", url: "pages/chemicals-cosmetics.html", category: "Trade Division", keywords: "chemicals, cosmetics, safety, alexandria, reach" },
        { title: "OS&E Procurement", url: "pages/ose-procurement.html", category: "Trade Division", keywords: "ose, procurement, sourcing, cargo" },
        { title: "Office Furniture", url: "pages/office-furniture.html", category: "Trade Division", keywords: "office, furniture, hardwood, desk, chairs, damietta" },
        { title: "Banquet Furniture", url: "pages/banquet-furniture.html", category: "Trade Division", keywords: "banquet, furniture, hotel, luxury, stackable" },
        { title: "Metal Beds & Lockers", url: "pages/metal-beds-lockers.html", category: "Trade Division", keywords: "metal, bed, locker, rust, accommodation" },
        { title: "Staff Furniture", url: "pages/staff-furniture.html", category: "Trade Division", keywords: "staff, modular, desk, office" },
        { title: "Staff Sofa Sets", url: "pages/staff-sofa-sets.html", category: "Trade Division", keywords: "sofa, sets, modular, ergonomic" },
        { title: "Logistics & Supply Chain", url: "#services", category: "Service", keywords: "logistics, shipping, supply, cargo" },
        { title: "Freight Forwarding", url: "#services", category: "Service", keywords: "freight, forwarding, air, sea, transport" },
        { title: "Trade Facilitation", url: "#services", category: "Service", keywords: "trade, facilitation, business, entry, advisory" },
        { title: "Customs Clearance", url: "#services", category: "Service", keywords: "customs, clearance, tax, papers" },
        { title: "Transportation Services", url: "#services", category: "Service", keywords: "transport, trucks, shipping, terminal" },
        { title: "Warehousing Solutions", url: "#services", category: "Service", keywords: "warehouse, storage, inventory" },
        { title: "RFQ Desk & Contact", url: "#contact", category: "Support", keywords: "rfq, quote, contact, mail, phone" }
    ];

    const searchInput = document.getElementById('global-search-input');
    const resultsDropdown = document.getElementById('search-results-dropdown');

    if (searchInput && resultsDropdown) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            resultsDropdown.innerHTML = '';

            if (query.length < 2) {
                resultsDropdown.classList.add('hidden');
                return;
            }

            const filteredResults = searchDatabase.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.keywords.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );

            if (filteredResults.length === 0) {
                const emptyItem = document.createElement('div');
                emptyItem.className = 'search-result-item';
                emptyItem.innerHTML = `<span class="title">No matches found for "${e.target.value}"</span>`;
                resultsDropdown.appendChild(emptyItem);
            } else {
                filteredResults.forEach(item => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    resultItem.innerHTML = `
                        <span class="title">${item.title}</span>
                        <span class="category">${item.category}</span>
                    `;
                    resultItem.addEventListener('click', () => {
                        window.location.href = item.url;
                        resultsDropdown.classList.add('hidden');
                        searchInput.value = '';
                    });
                    resultsDropdown.appendChild(resultItem);
                });
            }
            resultsDropdown.classList.remove('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !resultsDropdown.contains(e.target)) {
                resultsDropdown.classList.add('hidden');
            }
        });
    }

    // --- Interactive Divisions Filtering ---
    const filterButtons = document.querySelectorAll('.filter-tab-btn');
    const productCards = document.querySelectorAll('.b2b-product-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hidden-card');
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.classList.add('hidden-card');
                        card.style.display = 'none';
                    }, 400); 
                }
            });
        });
    });

    // --- Custom Interactive Cursor ---
    const cursor = document.getElementById('tech-cursor');
    const follower = document.getElementById('tech-cursor-follower');

    if (cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 50);
        });
    }

    // --- Window Scroll Progress Indicator ---
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });

    // --- Dynamic Automatic Calendar Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- FAQ Accordeon Slide mechanic ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const parent = question.parentElement;
            parent.classList.toggle('active');
        });
    });

    // --- Init AOS (Animate On Scroll) ---
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100 // Reduced slightly for better mobile triggering
        });
    }

    // --- Init Swiper Testimonials Slider ---
    if (typeof Swiper !== 'undefined') {
        new Swiper('.testimonial-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                }
            }
        });
    }

    // --- Init Vanilla Tilt for Dashboard consoles ---
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.2
        });
    }

    // --- Quick Sourcing Selection Auto-fill ---
    window.setRFQCategory = function(categoryName) {
        const rfqInput = document.getElementById('rfq-division-subject');
        const contactSection = document.getElementById('contact');
        if (rfqInput) {
            rfqInput.value = `Sourcing inquiry regarding: ${categoryName}`;
        }
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

});

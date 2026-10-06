document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. SMART APP UI LOGIC (HEADER & DRAWERS)
    // ==========================================

    // Smart Header (Hides on scroll down, shows on scroll up)
    let lastScroll = 0;
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        // Top of page
        if (currentScroll <= 0) {
            header.classList.remove('hidden');
            header.style.boxShadow = "none";
            return;
        }
        
        // Add shadow when scrolled
        header.style.boxShadow = "0 10px 30px rgba(4, 77, 161, 0.08)";

        // Hide/Show Logic
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('hidden'); // Scrolling down
        } else {
            header.classList.remove('hidden'); // Scrolling up
        }
        lastScroll = currentScroll;
    });

    // Mobile Side Drawer Toggle
    const menuToggles = document.querySelectorAll('.menu-toggle');
    const sideDrawer = document.getElementById('side-drawer');
    const drawerOverlay = document.querySelector('.drawer-overlay');
    const drawerLinks = document.querySelectorAll('.drawer-links a');

    function toggleDrawer(e) {
        if(e) e.preventDefault();
        sideDrawer.classList.toggle('active');
        drawerOverlay.classList.toggle('active');
    }

    menuToggles.forEach(btn => btn.addEventListener('click', toggleDrawer));
    if(drawerOverlay) drawerOverlay.addEventListener('click', toggleDrawer);
    
    // Close drawer when a link is clicked
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            sideDrawer.classList.remove('active');
            drawerOverlay.classList.remove('active');
        });
    });

    // Mobile Bottom Nav Active States
    const bottomNavItems = document.querySelectorAll('.app-bottom-nav .nav-item:not(.fab-center)');
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function() {
            bottomNavItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Language Dropdown
    const langTrigger = document.getElementById('lang-trigger');
    const langMenu = document.getElementById('lang-menu');
    if (langTrigger && langMenu) {
        langTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('active');
        });
        document.addEventListener('click', () => {
            langMenu.classList.remove('active');
        });
    }

    // Chat Widget Toggle
    const chatToggle = document.getElementById('chat-toggle');
    const chatContainer = document.getElementById('chat-box');
    const chatClose = document.getElementById('chat-close');
    
    if (chatToggle && chatContainer && chatClose) {
        chatToggle.addEventListener('click', () => {
            chatContainer.classList.toggle('active');
        });
        chatClose.addEventListener('click', () => {
            chatContainer.classList.remove('active');
        });
    }

    // ==========================================
    // 2. YOUR ORIGINAL LOGIC (SEARCH & FILTERS)
    // ==========================================

    // Interactive Search System
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

    // Interactive Divisions Filtering
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
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.classList.add('hidden-card');
                    }, 400); 
                }
            });
        });
    });

    // Custom Interactive Cursor
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

    // Scroll Progress Indicator
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });

    // Dynamic Calendar Year
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // FAQ Accordeon 
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const parent = question.parentElement;
            parent.classList.toggle('active');
        });
    });

    // Init AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 900,
            once: true,
            offset: 80 
        });
    }

    // Init Swiper Testimonials Slider
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
                768: { slidesPerView: 2 }
            }
        });
    }

    // Init Vanilla Tilt
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.2
        });
    }

    // Quick Sourcing Selection Auto-fill
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

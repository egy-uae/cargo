/* ==========================================================================
   AL MASSRIYA AL EMARATIYA - CARGO PLATFORM LOGIC
   ========================================================================== */

// Global state for multilingual processing
let currentLanguage = "en";

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Animations & Interactions
    initializeThemeControls();
    initializeCursorTracking();
    initializeAOSAndTilt();
    initializeHeaderActions();
    initializeFAQBehavior();
    initializeSupportChat();
});

/* ==========================================================================
   1. REAL-TIME CARGO TRACKING SYSTEM (Connected to shipments.json API)
   ========================================================================== */
async function triggerMainTracking(inputId) {
    const inputField = document.getElementById(inputId);
    if (!inputField) return;

    const cargoId = inputField.value.trim().toUpperCase();
    if (!cargoId) {
        alert(currentLanguage === "ar" ? "الرجاء إدخال رقم الشحنة." : "Please provide a valid Shipment ID.");
        return;
    }

    const trackingCard = document.getElementById("tracking-response-card");
    const idleCard = document.getElementById("tracking-idle-card");
    const respId = document.getElementById("resp-cargo-id");
    const respStatus = document.getElementById("resp-status");
    const respMeta = document.getElementById("resp-metadata");
    const respTimeline = document.getElementById("resp-timeline");

    // Scroll to tracker
    document.getElementById("tracking-console").scrollIntoView({ behavior: "smooth", block: "center" });

    try {
        // Fetch Real-time JSON data from your repository
        // Note: Replace './shipments.json' with Google Sheet URL if using Google Sheets API (Explained Below)
        const response = await fetch("./shipments.json");
        if (!response.ok) throw new Error("Could not load shipments file.");
        
        const shipmentsDb = await response.json();
        const shipment = shipmentsDb[cargoId];

        if (shipment) {
            // Hide the placeholder and show the response console
            idleCard.style.display = "none";
            trackingCard.style.display = "block";

            respId.textContent = cargoId;
            respStatus.textContent = currentLanguage === "ar" ? shipment.statusAr : shipment.statusEn;
            
            // Format dynamic status badge
            if (shipment.statusEn.toUpperCase().includes("DELIVERED") || shipment.statusAr.includes("مستلمة")) {
                respStatus.style.background = "rgba(16, 185, 129, 0.15)";
                respStatus.style.color = "#10b981";
                respStatus.style.borderColor = "#10b981";
            } else {
                respStatus.style.background = "rgba(236, 28, 36, 0.15)";
                respStatus.style.color = "#ec1c24";
                respStatus.style.borderColor = "#ec1c24";
            }

            // Populate Metadata
            respMeta.innerHTML = `
                <p style="margin-bottom:8px;"><strong>${currentLanguage === 'ar' ? 'الخط الملاحي:' : 'Route Corridor:'}</strong> ${currentLanguage === 'ar' ? shipment.routeAr : shipment.routeEn}</p>
                <p><strong>${currentLanguage === 'ar' ? 'تاريخ الوصول التقديري:' : 'Estimated ETA:'}</strong> ${currentLanguage === 'ar' ? shipment.etaAr : shipment.etaEn}</p>
            `;

            // Populate Dynamic chronological Timeline
            respTimeline.innerHTML = '';
            shipment.steps.forEach(step => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'faq-item active';
                timelineItem.style.borderBottom = "1px solid var(--border)";
                timelineItem.innerHTML = `
                    <div style="padding:15px 0;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <h4 style="font-size:0.95rem; font-weight:700; color:var(--primary);">
                                <i class="fas fa-circle-check" style="color:#10b981; margin-right:8px;"></i> 
                                ${currentLanguage === 'ar' ? step.titleAr : step.titleEn}
                            </h4>
                            <span style="font-size:0.75rem; color:var(--text-muted);">${step.date}</span>
                        </div>
                        <p class="text-muted" style="font-size:0.8rem; margin-top:8px;">
                            ${currentLanguage === 'ar' ? step.descAr : step.descEn}
                        </p>
                    </div>
                `;
                respTimeline.appendChild(timelineItem);
            });

        } else {
            // Shipment not found fallback
            idleCard.style.display = "none";
            trackingCard.style.display = "block";
            respId.textContent = cargoId;
            respStatus.textContent = currentLanguage === "ar" ? "غير مسجلة" : "UNREGISTERED";
            respStatus.style.background = "rgba(120, 120, 120, 0.15)";
            respStatus.style.color = "#5e6678";
            respStatus.style.borderColor = "#5e6678";

            respMeta.innerHTML = `<p>${currentLanguage === 'ar' ? 'لا توجد شحنة مسجلة حالياً بهذا الرمز. يرجى التأكد من الرمز والمحاولة لاحقاً.' : 'No cargo unit matches this identification code in our current dispatch manifest.'}</p>`;
            respTimeline.innerHTML = '';
        }

    } catch (error) {
        console.error("Tracking API Fetch Error:", error);
        alert(currentLanguage === "ar" ? "عذراً، حدث خطأ في موازنة خادم التتبع." : "Service temporary unavailable. Please check back shortly.");
    }
}

/* ==========================================================================
   2. SHIPPERS CUBIC WEIGHT CALCULATOR (Density Check)
   ========================================================================== */
function handleCubicCalculation(event) {
    event.preventDefault();
    const len = parseFloat(document.getElementById("dim-l").value);
    const wid = parseFloat(document.getElementById("dim-w").value);
    const hei = parseFloat(document.getElementById("dim-h").value);
    const act = parseFloat(document.getElementById("dim-actual").value);
    const resultBox = document.getElementById("calc-result-panel");

    if (isNaN(len) || isNaN(wid) || isNaN(hei) || isNaN(act)) return;

    // Air freight scale: L * W * H (in cm) / 5000
    const volumetricResult = (len * wid * hei) / 5000;
    const chargeableWeight = Math.max(volumetricResult, act).toFixed(2);

    resultBox.style.display = "block";
    if (currentLanguage === "ar") {
        resultBox.innerHTML = `
            <h4 style="color:var(--primary); margin-bottom:8px;"><i class="fas fa-check-circle"></i> الوزن الحجمي المعتمد جمركياً:</h4>
            <p>الوزن القياسي بالحجم: <strong>${volumetricResult.toFixed(2)} كجم</strong></p>
            <p>الوزن الفعلي للميزان: <strong>${act} كجم</strong></p>
            <hr style="border:0; border-top:1px solid var(--border); margin:10px 0;">
            <p style="color:var(--accent); font-weight:800;">الوزن القابل للفوترة والشحن: ${chargeableWeight} كجم</p>
        `;
    } else {
        resultBox.innerHTML = `
            <h4 style="color:var(--primary); margin-bottom:8px;"><i class="fas fa-check-circle"></i> Chargeable Specs:</h4>
            <p>Volumetric Cargo Weight: <strong>${volumetricResult.toFixed(2)} kg</strong></p>
            <p>Actual Scale Weight: <strong>${act} kg</strong></p>
            <hr style="border:0; border-top:1px solid var(--border); margin:10px 0;">
            <p style="color:var(--accent); font-weight:800;">Billable Payload Weight: ${chargeableWeight} kg</p>
        `;
    }
}

/* ==========================================================================
   3. LANGUAGE TRANSLATION PROTOCOLS (en <-> ar)
   ========================================================================== */
const langTrigger = document.getElementById("lang-trigger");
const langMenu = document.getElementById("lang-menu");

if (langTrigger) {
    langTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        langMenu.classList.toggle("active");
    });
}

document.addEventListener("click", () => {
    if (langMenu) langMenu.classList.remove("active");
});

function setSystemLanguage(lang) {
    currentLanguage = lang;
    const htmlEl = document.documentElement;

    htmlEl.setAttribute("lang", lang);
    htmlEl.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    // Update Dropdown Trigger label
    const labelSpan = langTrigger.querySelector("span");
    labelSpan.innerHTML = lang === "ar" ? '<i class="fas fa-globe"></i> العربية' : '<i class="fas fa-globe"></i> English';

    document.getElementById("btn-en").classList.toggle("active-lang", lang === "en");
    document.getElementById("btn-ar").classList.toggle("active-lang", lang === "ar");

    // Process Translation Elements
    const allTranslatables = document.querySelectorAll("[data-en]");
    allTranslatables.forEach(el => {
        el.innerHTML = lang === "ar" ? el.getAttribute("data-ar") : el.getAttribute("data-en");
    });

    // Update Inputs placeholders
    const searchInputs = ["header-track-input", "main-console-input"];
    searchInputs.forEach(id => {
        const inp = document.getElementById(id);
        if (inp) {
            inp.placeholder = lang === "ar" ? "رقم الشحنة e.g. EGYUAE-1001" : "e.g., EGYUAE-1001";
        }
    });

    if (langMenu) langMenu.classList.remove("active");
}

/* ==========================================================================
   4. COMPONENT INITIALIZATION PLUGINS (AOS, CURSOR, SWIPER)
   ========================================================================== */
function initializeThemeControls() {
    window.addEventListener("scroll", () => {
        const header = document.getElementById("header");
        const progressBar = document.getElementById("progress-bar");
        
        // Scroll header backdrop styling
        if (window.scrollY > 50) {
            header.classList.add("header-scrolled");
        } else {
            header.classList.remove("header-scrolled");
        }

        // Progress bar rendering
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progressPercentage = (window.pageYOffset / totalHeight) * 100;
        if (progressBar) progressBar.style.width = `${progressPercentage}%`;
    });
}

function initializeCursorTracking() {
    const cursor = document.getElementById("tech-cursor");
    const follower = document.getElementById("tech-cursor-follower");

    if (cursor && follower) {
        document.addEventListener("mousemove", (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            
            setTimeout(() => {
                follower.style.left = `${e.clientX}px`;
                follower.style.top = `${e.clientY}px`;
            }, 50);
        });
    }
}

function initializeAOSAndTilt() {
    // Fire Animate on Scroll (AOS)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-quad',
            once: true
        });
    }
    
    // Fire Vanilla-Tilt
    if (typeof VanillaTilt !== 'undefined') {
        const tiltCards = document.querySelectorAll(".tilt-card");
        VanillaTilt.init(tiltCards);
    }
}

function initializeHeaderActions() {
    const hamburger = document.querySelector(".hamburger");
    const mobileNav = document.querySelector(".mobile-nav");

    if (hamburger) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            mobileNav.classList.toggle("active");
        });
    }
}

function initializeFAQBehavior() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            item.classList.toggle('active');
            
            const answer = item.querySelector('.faq-answer');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = "0px";
            }
        });
    });
}

function initializeSupportChat() {
    const chatToggle = document.getElementById("chat-toggle");
    const chatBox = document.getElementById("chat-box");
    const chatClose = document.getElementById("chat-close");
    const chatInput = document.getElementById("chat-input");
    const chatSend = document.getElementById("chat-send");
    const chatBody = document.getElementById("chat-body");

    if (chatToggle) {
        chatToggle.addEventListener("click", () => chatBox.classList.toggle("active"));
        chatClose.addEventListener("click", () => chatBox.classList.remove("active"));

        const triggerSend = () => {
            const msgText = chatInput.value.trim();
            if (!msgText) return;

            // Render Outgoing Message bubble
            const outDiv = document.createElement("div");
            outDiv.className = "message outgoing";
            outDiv.innerHTML = `<p>${msgText}</p>`;
            chatBody.appendChild(outDiv);

            chatInput.value = "";
            chatBody.scrollTop = chatBody.scrollHeight;

            // Simulated Agent Response
            setTimeout(() => {
                const inDiv = document.createElement("div");
                inDiv.className = "message incoming";
                if (currentLanguage === "ar") {
                    inDiv.innerHTML = `<p>شكراً للتواصل مع مكتب الشحن للمصرية الإماراتية. تم تحويل استفسارك لقسم التسعير وخطوط السير وسنتواصل معك.</p>`;
                } else {
                    inDiv.innerHTML = `<p>Logistics desk connection verified. Your message has been forwarded directly to our cargo coordinators.</p>`;
                }
                chatBody.appendChild(inDiv);
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 1000);
        };

        chatSend.addEventListener("click", triggerSend);
        chatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") triggerSend();
        });
    }
}

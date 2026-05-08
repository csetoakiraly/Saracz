document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Egyedi Kurzor Kezelése
    const cursor = document.getElementById('custom-cursor');
    const links = document.querySelectorAll('a, button, .gallery-item, .m-item, .faq-question');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        link.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // 2. Sticky Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Scroll Animációk (Intersection Observer)
    const faders = document.querySelectorAll('.fade-in-up, .image-reveal');
    const appearOptions = {
        threshold: 0.05,
        rootMargin: "0px 0px -20px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            appearOnScroll.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // 4. Parallax Hatás Görgetésnél
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Parallax képek (pl. about-craft-grid)
        const parallaxImgs = document.querySelectorAll('.parallax-img');
        parallaxImgs.forEach(img => {
            const speed = img.getAttribute('data-speed') || 0.05;
            const rect = img.parentElement.getBoundingClientRect();
            const centerOffset = (window.innerHeight / 2) - (rect.top + rect.height / 2);
            const yPos = -(centerOffset * speed);
            img.style.transform = `scale(1.15) translateY(${yPos}px)`;
        });

        // Masonry parallax (m-item)
        const mItems = document.querySelectorAll('.m-item[data-parallax]');
        mItems.forEach(item => {
            const speed = item.getAttribute('data-parallax');
            const rect = item.getBoundingClientRect();
            const centerOffset = (window.innerHeight / 2) - (rect.top + rect.height / 2);
            const yPos = -(centerOffset * speed);
            item.querySelector('img').style.transform = `scale(1.15) translateY(${yPos}px)`;
        });

        // Hero háttérszöveg parallax
        const heroBgText = document.querySelector('.hero-bg-text');
        if (heroBgText) {
            heroBgText.style.transform = `translateY(${-50 + scrolled * 0.05}%) translateX(${scrolled * 0.1}px)`;
        }
    });

    // 5. GYIK Accordion
    const faqItems = document.querySelectorAll('.faq-item-craft');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-q');
        const answer = item.querySelector('.faq-a');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-a').style.maxHeight = null;
            });
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // 6. Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');
    const galleryItems = document.querySelectorAll('.m-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) closeLightbox();
    });

    // 7. Kapcsolati Űrlap Kezelése
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = 'KÜLDÉS...';
            submitBtn.style.opacity = '0.7';

            setTimeout(() => {
                formStatus.innerText = 'ÜZENET ELKÜLDVE. HAMAROSAN KERESSÜK.';
                formStatus.style.display = 'block';
                formStatus.style.color = '#8C5A35';
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.style.opacity = '1';

                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            }, 1500);
        });
    }

    // 6. Mobil Menü (Hamburger)
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.desktop-nav');
    const navLinksList = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
        hamburger.classList.toggle('toggle');
        
        // Háttér görgetésének megakadályozása, ha a menü nyitva van (iOS és más mobilok miatt .no-scroll osztállyal)
        if (nav.classList.contains('active')) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    });

    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                hamburger.classList.remove('toggle');
                document.body.classList.remove('no-scroll');
            }
        });
    });
});

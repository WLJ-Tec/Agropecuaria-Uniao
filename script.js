document.addEventListener('DOMContentLoaded', () => {
    // ========================
    // MOBILE MENU
    // ========================
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link =>
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        })
    );

    // ========================
    // SMOOTH SCROLL
    // ========================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;

            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        });
    });

    // ========================
    // HEADER SCROLL EFFECT
    // ========================
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        header.style.background =
            scrollTop > 100 ? 'rgba(255, 255, 255, 0.95)' : '#fff';
        header.style.backdropFilter = scrollTop > 100 ? 'blur(10px)' : 'none';
    });

    // ========================
    // HEADER WAVES ANIMATION
    // ========================
    const wave1 = document.querySelector('.wave-1 path');
    const wave2 = document.querySelector('.wave-2 path');
    const wave3 = document.querySelector('.wave-3 path');
    let step = 0;

    const drawWave = (amplitude, wavelength, offset) => {
        let points = [];
        for (let x = 0; x <= 1440; x += 20) {
            let y = 160 + Math.sin((x / wavelength) + step + offset) * amplitude;
            points.push(`${x},${y}`);
        }
        return `M0,320 L${points.join(" ")} L1440,320 Z`;
    };

    const animateWaves = () => {
        step += 0.002;
        if (wave1) wave1.setAttribute("d", drawWave(20, 180, 0)); // verde
        if (wave2) wave2.setAttribute("d", drawWave(15, 220, 2)); // dourado
        if (wave3) wave3.setAttribute("d", drawWave(0, 200, 0));  // fixa
        requestAnimationFrame(animateWaves);
    };
    animateWaves();

    // ========================
    // ELEMENTS ANIMATION (IntersectionObserver)
    // ========================
    const observerOptions = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 };

    const animateObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                entry.target.classList.remove('animate-hidden');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .stat-item, .contact-item').forEach(el => {
        el.classList.add('animate-hidden');
        animateObserver.observe(el);
    });

    // ========================
    // FORM HANDLING
    // ========================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;

            setTimeout(() => {
                showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }

    // ========================
    // NOTIFICATION SYSTEM
    // ========================
    function showNotification(message, type = 'info') {
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3',
            color: '#fff',
            padding: '15px 20px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10000',
            maxWidth: '400px',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        document.body.appendChild(notification);

        setTimeout(() => (notification.style.transform = 'translateX(0)'), 100);
        notification.querySelector('.notification-close').onclick = () => notification.remove();
        setTimeout(() => notification.remove(), 5000);
    }

    // ========================
    // COUNTER ANIMATION
    // ========================
    const animateCounters = () => {
        document.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const suffix = counter.textContent.replace(/\d/g, '');
            let current = 0;
            const increment = target / 100;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + suffix;
                }
            }, 20);
        });
    };

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                animateCounters();
                statsObserver.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }


    // ========================
    // SERVICE CARDS HOVER
    // ========================
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ========================
    // FORM VALIDATION
    // ========================
    const validateField = field => {
        const value = field.value.trim();
        let errorMessage = '';

        if (field.required && !value) {
            errorMessage = 'Este campo é obrigatório.';
        } else if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errorMessage = 'Por favor, insira um e-mail válido.';
        } else if (field.type === 'tel' && value && (!/^[\d\s\-\(\)\+]+$/.test(value) || value.length < 10)) {
            errorMessage = 'Por favor, insira um telefone válido.';
        }

        field.classList.remove('error');
        field.parentNode.querySelector('.error-message')?.remove();

        if (errorMessage) {
            field.classList.add('error');
            const errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;
            Object.assign(errorElement.style, {
                color: '#f44336',
                fontSize: '0.8rem',
                marginTop: '5px',
                display: 'block'
            });
            field.parentNode.appendChild(errorElement);
        }
    };

    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) validateField(input);
        });
    });

    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #f44336 !important;
            box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2);
        }
    `;
    document.head.appendChild(style);

    // ========================
    // PAGE LOADING ANIMATION
    // ========================
    document.body.style.opacity = '0';
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.3s ease';
    });

    // ========================
    // KEYBOARD ESC CLOSE MENU
    // ========================
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    console.log('Vidroflex Landing Page - JavaScript carregado com sucesso!');
});

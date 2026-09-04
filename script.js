/* =========================================================
   Українське кіно — script.js
   Загальний файл для index.html, about.html, projeckts.html.
   Кожен блок сам перевіряє, чи є потрібні елементи на сторінці,
   тож файл можна безпечно підключати всюди.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    highlightActiveNavLink();
    initMovieModal();
    initSubscriptionForm();
    initProjectFilters();
    initStatsCounter();
    initScrollReveal();
    initBackToTopButton();
});

/* ---------------------------------------------------------
   1. Підсвічування активного пункту меню
   --------------------------------------------------------- */
function highlightActiveNavLink() {
    const links = document.querySelectorAll('.nav-link');
    if (!links.length) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

/* ---------------------------------------------------------
   2. Модальне вікно з деталями фільму (index.html)
   Кнопки "Детальніше" ведуть в нікуди (href=""), тож замість
   переходу відкриваємо картку з описом фільму.
   --------------------------------------------------------- */
function initMovieModal() {
    const buttons = document.querySelectorAll('.article-but');
    if (!buttons.length) return;

    const movieInfo = {
        'Земля': {
            year: '1930',
            info: 'Німий фільм режисера Олександра Довженка про життя українського села та зміни, які приносить колективізація. Вважається однією з вершин світового німого кіно.'
        },
        'Тіні забутих предків': {
            year: '1965',
            info: 'Фільм Сергія Параджанова за мотивами повісті Михайла Коцюбинського. Яскрава екранізація гуцульських звичаїв і легенд, відзначена численними міжнародними нагородами.'
        },
        'Пропала грамота': {
            year: '1972',
            info: 'Комедійна стрічка Бориса Івченка за мотивами гоголівських повістей — про козака, який мандрує до пекла й назад, щоб повернути важливий лист.'
        },
        'Білий птах з чорною ознакою': {
            year: '1971',
            info: 'Драма Юрія Іллєнка про долю карпатської родини на тлі історичних потрясінь першої половини XX століття. Гран-прі Московського міжнародного кінофестивалю.'
        }
    };

    const modal = document.createElement('div');
    modal.className = 'movie-modal';
    modal.innerHTML = `
        <div class="movie-modal-content">
            <button class="movie-modal-close" aria-label="Закрити">&times;</button>
            <img class="movie-modal-img" src="" alt="">
            <h2 class="movie-modal-title"></h2>
            <p class="movie-modal-year"></p>
            <p class="movie-modal-text"></p>
        </div>
    `;
    document.body.appendChild(modal);
    injectModalStyles();

    const modalImg = modal.querySelector('.movie-modal-img');
    const modalTitle = modal.querySelector('.movie-modal-title');
    const modalYear = modal.querySelector('.movie-modal-year');
    const modalText = modal.querySelector('.movie-modal-text');
    const closeBtn = modal.querySelector('.movie-modal-close');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const article = btn.closest('article');
            if (!article) return;

            const img = article.querySelector('img');
            const titleRaw = article.querySelector('h2')?.textContent.trim()
                || article.querySelector('p')?.textContent.replace(/["«»]/g, '').trim()
                || 'Фільм';
            const tagline = article.querySelector('p')?.textContent.trim() || '';
            const data = movieInfo[titleRaw];

            modalImg.src = img ? img.src : '';
            modalImg.alt = titleRaw;
            modalTitle.textContent = titleRaw;
            modalYear.textContent = data ? `Рік випуску: ${data.year}` : '';
            modalText.textContent = data ? data.info : (tagline || 'Детальний опис цього фільму скоро з’явиться на сайті.');

            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
}

function injectModalStyles() {
    if (document.getElementById('movie-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'movie-modal-styles';
    style.textContent = `
        .movie-modal {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(5, 5, 10, 0.8);
            backdrop-filter: blur(3px);
            z-index: 1000;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .movie-modal.open {
            display: flex;
        }
        .movie-modal-content {
            background: #16162a;
            border: 1px solid rgba(201, 162, 75, 0.3);
            border-radius: 14px;
            max-width: 520px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            padding: 32px;
            position: relative;
            color: #f2ede0;
            box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6);
            animation: modalPop 0.3s ease;
            font-family: 'Work Sans', 'Segoe UI', sans-serif;
        }
        @keyframes modalPop {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .movie-modal-img {
            width: 100%;
            max-height: 300px;
            object-fit: cover;
            border-radius: 10px;
            margin-bottom: 22px;
            filter: saturate(0.9);
        }
        .movie-modal-title {
            font-family: 'Fraunces', Georgia, serif;
            font-weight: 600;
            font-size: 26px;
            margin-bottom: 8px;
            color: #e3c37e;
        }
        .movie-modal-year {
            font-weight: 600;
            font-size: 13px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: #a9a6c0;
            margin-bottom: 16px;
        }
        .movie-modal-text {
            font-size: 16px;
            line-height: 1.65;
            color: #d8d4e6;
        }
        .movie-modal-close {
            position: absolute;
            top: 16px;
            right: 16px;
            background: rgba(255, 255, 255, 0.06);
            color: #e3c37e;
            border: 1px solid rgba(201, 162, 75, 0.3);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            font-size: 20px;
            line-height: 1;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .movie-modal-close:hover {
            background: #c9a24b;
            color: #0b0b14;
            transform: rotate(90deg);
        }
    `;
    document.head.appendChild(style);
}

/* ---------------------------------------------------------
   3. Форма підписки на розсилку (index.html)
   --------------------------------------------------------- */
function initSubscriptionForm() {
    const form = document.querySelector('.subscription-form');
    if (!form) return;

    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();

        if (!emailPattern.test(email)) {
            showFormMessage(form, 'Будь ласка, введіть коректну email адресу.', false);
            emailInput.focus();
            return;
        }

        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Відправляємо...';

        setTimeout(() => {
            showFormMessage(form, `Дякуємо! Промокод надіслано на ${email} 🎉`, true);
            emailInput.value = '';
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 900);
    });

    emailInput.addEventListener('input', () => {
        const msg = form.querySelector('.form-message');
        if (msg) msg.remove();
    });
}

function showFormMessage(form, text, success) {
    let msg = form.querySelector('.form-message');
    if (!msg) {
        msg = document.createElement('p');
        msg.className = 'form-message';
        msg.style.marginTop = '15px';
        msg.style.fontWeight = '600';
        form.appendChild(msg);
    }
    msg.textContent = text;
    msg.style.color = success ? '#0f4c81' : '#c0392b';
}

/* ---------------------------------------------------------
   4. Фільтр проєктів за категоріями (projeckts.html)
   --------------------------------------------------------- */
function initProjectFilters() {
    const buttons = document.querySelectorAll('.category-btn');
    const cards = document.querySelectorAll('.project-card');
    if (!buttons.length || !cards.length) return;

    buttons[0].classList.add('active');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.textContent.trim();

            cards.forEach(card => {
                const badge = card.querySelector('.project-badge')?.textContent || '';
                const matches = category === 'Всі проєкти' || badge.includes(category);

                if (matches) {
                    card.style.display = '';
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => { card.style.display = 'none'; }, 250);
                }
            });
        });
    });
}

/* ---------------------------------------------------------
   5. Анімація лічильників статистики (about.html)
   "500+" -> плавний підрахунок від 0 до 500 при появі на екрані
   --------------------------------------------------------- */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(el) {
    const originalText = el.textContent.trim();
    const suffix = originalText.replace(/[0-9]/g, '');
    const targetNumber = parseInt(originalText.replace(/\D/g, ''), 10);

    if (isNaN(targetNumber)) return;

    const duration = 1500;
    const startTime = performance.now();

    function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(targetNumber * eased);

        el.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = originalText;
        }
    }

    requestAnimationFrame(tick);
}

/* ---------------------------------------------------------
   6. Плавна поява елементів при скролі
   (info-card, article, project-card, .about li)
   --------------------------------------------------------- */
function initScrollReveal() {
    const targets = document.querySelectorAll(
        '.info-card, article, .project-card, .about li, .stat-item'
    );
    if (!targets.length) return;

    targets.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 80);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.15 });

    targets.forEach(el => observer.observe(el));
}

/* ---------------------------------------------------------
   7. Кнопка "Нагору"
   --------------------------------------------------------- */
function initBackToTopButton() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Прокрутити нагору');
    btn.textContent = '↑';
    document.body.appendChild(btn);

    const style = document.createElement('style');
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 1.5px solid #c9a24b;
            background: #16162a;
            color: #e3c37e;
            font-size: 22px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        .back-to-top:hover {
            background: #c9a24b;
            color: #0b0b14;
            transform: translateY(-5px) scale(1.1);
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
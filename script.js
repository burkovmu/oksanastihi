// Плавный скролл по якорям
const navLinks = document.querySelectorAll('.navbar a');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Анимация появления секций при прокрутке
const sections = document.querySelectorAll('.section');
const showSection = (section) => {
  section.classList.add('visible');
};

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      showSection(entry.target);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

sections.forEach(section => {
  section.classList.add('hidden');
  observer.observe(section);
});

// --- Меню: плавающая подсветка и активный пункт ---
const navbar = document.querySelector('.navbar ul');
const highlight = document.createElement('div');
highlight.className = 'menu-highlight';
document.querySelector('.navbar ul').appendChild(highlight);

function moveHighlightTo(link) {
  const rect = link.getBoundingClientRect();
  const navRect = navbar.getBoundingClientRect();
  highlight.style.width = rect.width + 'px';
  highlight.style.left = (rect.left - navRect.left) + 'px';
  highlight.style.top = (rect.top - navRect.top) + 'px';
  highlight.style.opacity = 1;
}

function clearHighlight() {
  highlight.style.opacity = 0;
}

const navLinksArr = Array.from(navLinks);
navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => moveHighlightTo(link));
  link.addEventListener('mouseleave', () => {
    // Если есть активный, подсветить его
    const active = document.querySelector('.navbar a.active');
    if (active) moveHighlightTo(active); else clearHighlight();
  });
});

// Подсвечивать активный пункт при скролле
const sectionIds = navLinksArr.map(link => link.getAttribute('href')).filter(href => href.startsWith('#'));
window.addEventListener('scroll', () => {
  let current = sectionIds[0];
  for (const id of sectionIds) {
    const section = document.querySelector(id);
    if (section && window.scrollY + 80 >= section.offsetTop) {
      current = id;
    }
  }
  navLinksArr.forEach(link => link.classList.remove('active'));
  const activeLink = navLinksArr.find(link => link.getAttribute('href') === current);
  if (activeLink) {
    activeLink.classList.add('active');
    moveHighlightTo(activeLink);
  } else {
    clearHighlight();
  }
});
// При загрузке — подсветить первый пункт
window.dispatchEvent(new Event('scroll'));

// --- Модальное окно для просмотра изображений ---
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeBtn = document.querySelector('.close');

// Открытие модального окна при клике на изображение
document.querySelectorAll('.portfolio-card img').forEach(img => {
  img.addEventListener('click', function() {
    modal.style.display = 'block';
    modalImg.src = this.src;
    document.body.style.overflow = 'hidden'; // Блокируем скролл
  });
});

// Открытие модального окна при клике на публикации
document.querySelectorAll('.publication-card img').forEach(img => {
  img.addEventListener('click', function() {
    modal.style.display = 'block';
    modalImg.src = this.src;
    document.body.style.overflow = 'hidden'; // Блокируем скролл
  });
});

// Открытие модального окна при клике на отзывы (обновлено для слайдера)
document.querySelectorAll('.slide img').forEach(img => {
  img.addEventListener('click', function() {
    modal.style.display = 'block';
    modalImg.src = this.src;
    document.body.style.overflow = 'hidden'; // Блокируем скролл
  });
});

// Закрытие модального окна
closeBtn.addEventListener('click', function() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto'; // Возвращаем скролл
});

// Закрытие при клике вне изображения
modal.addEventListener('click', function(e) {
  if (e.target === modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Закрытие по клавише Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && modal.style.display === 'block') {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// --- Портфолио: показать больше примеров ---
const showMoreBtn = document.getElementById('showMoreBtn');
const hiddenItems = document.querySelectorAll('.portfolio-card.hidden');
let isExpanded = false;

showMoreBtn.addEventListener('click', function() {
  if (!isExpanded) {
    // Показываем скрытые элементы с задержкой
    hiddenItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('show');
      }, index * 100);
    });
    
    // Меняем текст кнопки
    this.textContent = 'Скрыть примеры';
    isExpanded = true;
  } else {
    // Скрываем элементы
    hiddenItems.forEach(item => {
      item.classList.remove('show');
    });
    
    // Меняем текст кнопки обратно
    this.textContent = 'Показать больше примеров';
    isExpanded = false;
  }
});

// --- Отзывы: слайдер ---
const sliderTrack = document.querySelector('.slider-track');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentSlide = 0;
const totalSlides = slides.length;

// Функция для определения количества видимых слайдов
function getSlidesPerView() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 768) return 2;
  return 3;
}

// Функция для перехода к слайду
function goToSlide(slideIndex) {
  const slidesPerView = getSlidesPerView();
  const maxSlides = Math.max(0, totalSlides - slidesPerView);
  
  if (slideIndex < 0) slideIndex = 0;
  if (slideIndex > maxSlides) slideIndex = maxSlides;
  
  currentSlide = slideIndex;
  const translateX = -(currentSlide * (100 / slidesPerView));
  sliderTrack.style.transform = `translateX(${translateX}%)`;
  
  // Обновляем активную точку
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
  
  // Обновляем состояние кнопок
  if (prevBtn && nextBtn) {
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === maxSlides;
  }
}

// Обработчики для кнопок
if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
}

// Обработчики для точек
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => goToSlide(index));
});

// Автоматическое переключение слайдов
let autoSlideInterval = setInterval(() => {
  const slidesPerView = getSlidesPerView();
  const maxSlides = Math.max(0, totalSlides - slidesPerView);
  
  if (currentSlide >= maxSlides) {
    goToSlide(0); // Возвращаемся к началу
  } else {
    goToSlide(currentSlide + 1);
  }
}, 4000);

// Останавливаем автопереключение при наведении
const sliderContainer = document.querySelector('.slider-container');
if (sliderContainer) {
  sliderContainer.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
  });
  
  sliderContainer.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(() => {
      const slidesPerView = getSlidesPerView();
      const maxSlides = Math.max(0, totalSlides - slidesPerView);
      
      if (currentSlide >= maxSlides) {
        goToSlide(0);
      } else {
        goToSlide(currentSlide + 1);
      }
    }, 4000);
  });
}

// Обработчики для слайдов (открытие в модальном окне)
slides.forEach(slide => {
  slide.addEventListener('click', function() {
    const img = this.querySelector('img');
    modal.style.display = 'block';
    modalImg.src = img.src;
    document.body.style.overflow = 'hidden';
  });
});

// Обработчик изменения размера окна
window.addEventListener('resize', () => {
  goToSlide(currentSlide); // Пересчитываем позицию при изменении размера
});

// Инициализация состояния кнопок
if (prevBtn && nextBtn) {
  prevBtn.disabled = true; // Начинаем с первого слайда
}

// --- Мобильное бургер-меню ---
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle && navMenu) {
  mobileMenuToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
  });
  
  // Закрываем меню при клике на пункт меню
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
    });
  });
  
  // Закрываем меню при клике вне его
  document.addEventListener('click', function(e) {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !mobileMenuToggle.contains(e.target)) {
      navMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
    }
  });
} 
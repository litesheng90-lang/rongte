(function () {
  const heroCarousel = document.querySelector('.hero-carousel');
  const dotsContainer = document.querySelector('.hero-dots');

  if (heroCarousel && dotsContainer) {
    const slides = Array.from(heroCarousel.querySelectorAll('.hero-slide'));
    const interval = Number(heroCarousel.dataset.interval) || 7000;
    let current = 0;
    let timer;

    function activateSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === index);
        slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
      });

      const dots = Array.from(dotsContainer.children);
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });

      current = index;
    }

    function startTimer() {
      stopTimer();
      timer = setInterval(() => {
        const next = (current + 1) % slides.length;
        activateSlide(next);
      }, interval);
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    slides.forEach((slide, index) => {
      const dot = document.createElement('button');
      dot.className = 'hero-dot' + (index === 0 ? ' is-active' : '');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-controls', `hero-slide-${index}`);
      dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => {
        activateSlide(index);
        startTimer();
      });
      dot.addEventListener('mouseenter', stopTimer);
      dot.addEventListener('mouseleave', startTimer);
      dotsContainer.appendChild(dot);
      slide.id = `hero-slide-${index}`;
    });

    heroCarousel.addEventListener('mouseenter', stopTimer);
    heroCarousel.addEventListener('mouseleave', startTimer);

    activateSlide(0);
    startTimer();
  }

  const tabButtons = document.querySelectorAll('.tab-button');
  const panels = document.querySelectorAll('.category-panel');
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.target;
      tabButtons.forEach((btn) => {
        const isActive = btn === button;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      panels.forEach((panel) => {
        const isTarget = panel.id === targetId;
        panel.classList.toggle('is-active', isTarget);
        panel.toggleAttribute('hidden', !isTarget);
      });
    });
  });

  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach((card, index) => {
    const media = card.querySelector('.product-media');
    const images = media ? Array.from(media.querySelectorAll('img')) : [];
    if (!media || images.length <= 1) {
      if (images[0]) {
        images[0].classList.add('is-visible');
      }
      return;
    }

    images.forEach((img, i) => {
      img.classList.toggle('is-visible', i === 0);
      img.loading = 'lazy';
    });

    let current = 0;
    const interval = Number(card.dataset.interval) || 5000;

    function rotate() {
      images[current].classList.remove('is-visible');
      current = (current + 1) % images.length;
      images[current].classList.add('is-visible');
    }

    let timer = setInterval(rotate, interval);

    media.addEventListener('mouseenter', () => clearInterval(timer));
    media.addEventListener('mouseleave', () => {
      timer = setInterval(rotate, interval);
    });

    media.setAttribute('role', 'group');
    media.setAttribute('aria-roledescription', '产品图片轮播');
    media.setAttribute('aria-live', index === 0 ? 'polite' : 'off');
  });

  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

})();

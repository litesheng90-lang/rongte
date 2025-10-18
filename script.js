(function () {
  const heroCarousel = document.querySelector('.hero-carousel');
  if (heroCarousel) {
    const slides = Array.from(heroCarousel.querySelectorAll('.hero-slide'));
    const dotsContainer = document.querySelector('.hero-dots');
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

    slides.forEach((_, index) => {
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
      slides[index].id = `hero-slide-${index}`;
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
        btn.classList.toggle('is-active', btn === button);
        btn.setAttribute('aria-selected', btn === button ? 'true' : 'false');
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

  const editToggle = document.getElementById('editToggle');
  if (editToggle) {
    const editableNodes = Array.from(document.querySelectorAll('[data-editable]'));

    function applyEditableAttributes(node) {
      if (node.matches('a')) {
        node.setAttribute('role', 'link');
      }
      node.setAttribute('spellcheck', 'false');
    }

    editableNodes.forEach(applyEditableAttributes);

    function setEditingMode(isEditing) {
      document.body.classList.toggle('is-editing', isEditing);
      editableNodes.forEach((node) => {
        node.setAttribute('contenteditable', isEditing ? 'true' : 'false');
        if (!isEditing) {
          node.blur();
        }
      });
      editToggle.setAttribute('aria-pressed', isEditing ? 'true' : 'false');
      editToggle.textContent = isEditing ? '退出编辑模式' : '开启编辑模式';
    }

    let editing = false;
    editToggle.addEventListener('click', () => {
      editing = !editing;
      setEditingMode(editing);
    });

    setEditingMode(editing);
  }
})();

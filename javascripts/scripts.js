const menu = document.querySelector('.main_menu');

let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY > 100 && currentScrollY > lastScrollY) {
    menu.classList.add('hidden');
  } else {
    menu.classList.remove('hidden');
  }
  lastScrollY = currentScrollY;
});

const s1 = document.querySelector('.s_1');

const cursorImages = [
  './images/s1_1.png',
  './images/s1_2.png',
  './images/s1_3.png',
  './images/s1_4.png',
  './images/s1_5.png',
  './images/s1_6.png',
  './images/s1_7.png',
  './images/s1_8.png',
  './images/s1_9.png'
];

let lastImageTime = 0;
let currentImageIndex = 0;

if (s1) {
  s1.addEventListener('mousemove', (event) => {
    const currentTime = Date.now();

    if (currentTime - lastImageTime < 250) {
      return;
    }

    lastImageTime = currentTime;

    const s1Rect = s1.getBoundingClientRect();

    const x = event.clientX - s1Rect.left;
    const y = event.clientY - s1Rect.top;

    const img = document.createElement('img');

    img.src = cursorImages[currentImageIndex];

    currentImageIndex++;

    if (currentImageIndex >= cursorImages.length) {
      currentImageIndex = 0;
    }

    img.classList.add('cursor-img');

    img.style.left = `${x}px`;
    img.style.top = `${y}px`;

    s1.appendChild(img);

    setTimeout(() => {
      img.remove();
    }, 4000);
  });
}

const runningLines = document.querySelectorAll('.running_line');

runningLines.forEach((runningLine) => {
  const originalContent = runningLine.innerHTML;

  function makeRunningLineInfinite() {
    runningLine.innerHTML = originalContent;

    while (runningLine.scrollWidth < window.innerWidth * 2) {
      runningLine.innerHTML += originalContent;
    }

    runningLine.innerHTML += runningLine.innerHTML;
  }

  makeRunningLineInfinite();

  window.addEventListener('resize', () => {
    makeRunningLineInfinite();
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.s_3');
  const gallery = document.querySelector('.gallery_images');
  const track = document.querySelector('.image_track');

  if (!section || !gallery || !track) {
    return;
  }

  const originalImages = Array.from(track.querySelectorAll('img'));
  const totalSteps = originalImages.length;

  let currentStep = 0;
  let isAnimating = false;
  let wheelDelta = 0;

  const startCenterIndex = 2;
  const wheelThreshold = 260;

  const mobileMedia = window.matchMedia('(max-width: 393px)');

  originalImages.forEach((img) => {
    const clone = img.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  function isMobile() {
    return mobileMedia.matches;
  }

  function getCenterImageIndex(step) {
    return startCenterIndex + step;
  }

  function updateImageSizes(step) {
    const allImages = Array.from(track.querySelectorAll('img'));
    const centerImageIndex = getCenterImageIndex(step);

    allImages.forEach((img) => {
      img.classList.remove('is-center-position');
    });

    if (allImages[centerImageIndex]) {
      allImages[centerImageIndex].classList.add('is-center-position');
    }
  }

  function getOffset() {
    const centerImageIndex = getCenterImageIndex(currentStep);
    const centerImage = track.querySelectorAll('img')[centerImageIndex];

    if (!centerImage) return 0;

    if (isMobile()) {
      const galleryWidth = gallery.getBoundingClientRect().width;
      const imageCenter = centerImage.offsetLeft + centerImage.offsetWidth / 2;

      return galleryWidth / 2 - imageCenter;
    }

    const galleryHeight = gallery.getBoundingClientRect().height;
    const imageCenter = centerImage.offsetTop + centerImage.offsetHeight / 2;

    return galleryHeight / 2 - imageCenter;
  }

  function moveTrack(withTransition = true) {
    updateImageSizes(currentStep);

    if (!withTransition) {
      track.classList.add('no_transition');
    } else {
      track.classList.remove('no_transition');
    }

    track.offsetHeight;

    const offset = getOffset();

    if (isMobile()) {
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
    } else {
      track.style.transform = `translate3d(0, ${offset}px, 0)`;
    }

    if (!withTransition) {
      track.offsetHeight;
      track.classList.remove('no_transition');
    }
  }

  function goToStep(step) {
    isAnimating = true;
    wheelDelta = 0;
    currentStep = step;
    moveTrack(true);
  }

  moveTrack(false);

  track.addEventListener('transitionend', (event) => {
    if (event.propertyName !== 'transform') return;

    isAnimating = false;

    if (currentStep === totalSteps) {
      currentStep = 0;
      moveTrack(false);
    }
  });

  gallery.addEventListener(
    'wheel',
    (event) => {
      const scrollValue =
        Math.abs(event.deltaY) > Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;

      const direction = Math.sign(scrollValue);

      if (direction <= 0) {
        return;
      }

      event.preventDefault();

      if (isAnimating) {
        return;
      }

      wheelDelta += Math.abs(scrollValue);

      if (wheelDelta < wheelThreshold) {
        return;
      }

      wheelDelta = 0;

      if (currentStep < totalSteps) {
        goToStep(currentStep + 1);
      }
    },
    { passive: false }
  );

  window.addEventListener('resize', () => {
    moveTrack(false);
  });

  mobileMedia.addEventListener('change', () => {
    moveTrack(false);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          currentStep = 0;
          isAnimating = false;
          wheelDelta = 0;
          moveTrack(false);
        }
      });
    },
    {
      threshold: 0
    }
  );

  observer.observe(section);
});

document.addEventListener('DOMContentLoaded', () => {
  const catalogSection = document.querySelector('.c_s_2');
  const shoppingBag = document.querySelector('.shopping_bag');

  const defaultAddIcon = './images/add_icon.svg';
  const activeAddIcon = './images/add_icon_active.svg';

  const defaultBagIcon = './images/shopping_bag.svg';
  const activeBagIcon = './images/shopping_bag_active.svg';

  function animateShoppingBagChange(isActive) {
    if (!shoppingBag) return;

    shoppingBag.classList.add('is-changing');

    setTimeout(() => {
      shoppingBag.src = isActive ? activeBagIcon : defaultBagIcon;
      shoppingBag.classList.remove('is-changing');
    }, 200);
  }

  function setShoppingBagWithoutAnimation() {
    if (!shoppingBag) return;

    const cartHasItems = localStorage.getItem('cartHasItems') === 'true';
    shoppingBag.src = cartHasItems ? activeBagIcon : defaultBagIcon;
  }

  setShoppingBagWithoutAnimation();

  if (!catalogSection) {
    return;
  }

  catalogSection.addEventListener('click', (event) => {
    const icon = event.target.closest('.add_icon');

    if (!icon) {
      return;
    }

    const activeIconsBefore = catalogSection.querySelectorAll(
      '.add_icon.is-active'
    ).length;

    const isActive = icon.classList.contains('is-active');

    if (isActive) {
      icon.src = defaultAddIcon;
      icon.classList.remove('is-active');
    } else {
      icon.src = activeAddIcon;
      icon.classList.add('is-active');
    }

    const activeIconsAfter = catalogSection.querySelectorAll(
      '.add_icon.is-active'
    ).length;

    const cartWasEmpty = activeIconsBefore === 0;
    const cartBecameNotEmpty = activeIconsAfter > 0;

    const cartWasNotEmpty = activeIconsBefore > 0;
    const cartBecameEmpty = activeIconsAfter === 0;

    if (cartWasEmpty && cartBecameNotEmpty) {
      localStorage.setItem('cartHasItems', 'true');
      animateShoppingBagChange(true);
    }

    if (cartWasNotEmpty && cartBecameEmpty) {
      localStorage.setItem('cartHasItems', 'false');
      animateShoppingBagChange(false);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#emailForm');
  const input = form.querySelector('.email_input');
  const button = form.querySelector('.email_button');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!input.value.trim()) {
      return;
    }

    form.classList.add('is-sent');

    button.textContent =
      'отлично! следите за нашими обновлениями у себя на почте!';
    button.classList.add('is-sent');

    input.blur();
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const catalogSection = document.querySelector('.c_s_2');

  if (!catalogSection) {
    return;
  }

  const allFilter = document.querySelector('.filter_all');
  const soapFilter = document.querySelector('.filter_soap');
  const filmFilter = document.querySelector('.filter_film');
  const accessoriesFilter = document.querySelector('.filter_accessories');
  const merchFilter = document.querySelector('.filter_merch');

  const filterButtons = document.querySelectorAll('.filter_button');

  const catalogLines = Array.from(
    catalogSection.querySelectorAll('.catalog_line')
  );

  const productCards = Array.from(
    catalogSection.querySelectorAll('.product_card')
  );

  if (
    !allFilter ||
    !soapFilter ||
    !filmFilter ||
    !accessoriesFilter ||
    !merchFilter ||
    catalogLines.length === 0
  ) {
    return;
  }

  const originalStructure = catalogLines.map((line) => {
    return Array.from(line.querySelectorAll('.product_card'));
  });

  let activeFilter = 'all';

  function removeActiveButtons() {
    filterButtons.forEach((button) => {
      button.classList.remove('is-active');
    });
  }

  function resetCatalog() {
    activeFilter = 'all';

    removeActiveButtons();
    allFilter.classList.add('is-active');

    catalogLines.forEach((line, index) => {
      line.replaceChildren(...originalStructure[index]);

      line.classList.remove('is-hidden');
      line.classList.remove('is-filtered');
    });

    productCards.forEach((card) => {
      card.classList.remove('is-hidden');
    });
  }

  function clearCatalog() {
    catalogLines.forEach((line) => {
      line.replaceChildren();
      line.classList.add('is-hidden');
      line.classList.remove('is-filtered');
    });

    productCards.forEach((card) => {
      card.classList.add('is-hidden');
    });

    removeActiveButtons();
  }

  function showSoapProducts() {
    clearCatalog();

    activeFilter = 'soap';
    soapFilter.classList.add('is-active');

    const neededCards = [
      productCards[0],
      productCards[2],
      productCards[3],
      productCards[4],
      productCards[5]
    ];

    neededCards.forEach((card) => {
      card.classList.remove('is-hidden');
    });

    catalogLines[0].append(neededCards[0], neededCards[1], neededCards[2]);

    catalogLines[1].append(neededCards[3], neededCards[4]);

    catalogLines[0].classList.remove('is-hidden');
    catalogLines[1].classList.remove('is-hidden');

    catalogLines[0].classList.add('is-filtered');
    catalogLines[1].classList.add('is-filtered');
  }

  function showFilmProducts() {
    clearCatalog();

    activeFilter = 'film';
    filmFilter.classList.add('is-active');

    const neededCard = productCards[1];

    neededCard.classList.remove('is-hidden');

    catalogLines[0].append(neededCard);

    catalogLines[0].classList.remove('is-hidden');
    catalogLines[0].classList.add('is-filtered');
  }

  function showAccessoriesProducts() {
    clearCatalog();

    activeFilter = 'accessories';
    accessoriesFilter.classList.add('is-active');

    const neededCards = [productCards[7], productCards[9]];

    neededCards.forEach((card) => {
      card.classList.remove('is-hidden');
    });

    catalogLines[0].append(neededCards[0], neededCards[1]);

    catalogLines[0].classList.remove('is-hidden');
    catalogLines[0].classList.add('is-filtered');
  }

  function showMerchProducts() {
    clearCatalog();

    activeFilter = 'merch';
    merchFilter.classList.add('is-active');

    const neededCards = [productCards[6], productCards[8], productCards[10]];

    neededCards.forEach((card) => {
      card.classList.remove('is-hidden');
    });

    catalogLines[0].append(neededCards[0], neededCards[1], neededCards[2]);

    catalogLines[0].classList.remove('is-hidden');
    catalogLines[0].classList.add('is-filtered');
  }

  allFilter.addEventListener('click', () => {
    resetCatalog();
  });

  soapFilter.addEventListener('click', () => {
    if (activeFilter === 'soap') {
      resetCatalog();
    } else {
      showSoapProducts();
    }
  });

  filmFilter.addEventListener('click', () => {
    if (activeFilter === 'film') {
      resetCatalog();
    } else {
      showFilmProducts();
    }
  });

  accessoriesFilter.addEventListener('click', () => {
    if (activeFilter === 'accessories') {
      resetCatalog();
    } else {
      showAccessoriesProducts();
    }
  });

  merchFilter.addEventListener('click', () => {
    if (activeFilter === 'merch') {
      resetCatalog();
    } else {
      showMerchProducts();
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const section404 = document.querySelector('.s_404');
  const images404 = Array.from(document.querySelectorAll('.img_404'));

  if (!section404 || images404.length === 0) {
    return;
  }

  const visibleCount = 4;

  function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function getZones() {
    const sectionWidth = section404.clientWidth;
    const sectionHeight = section404.clientHeight;

    return [
      {
        xMin: 0,
        xMax: sectionWidth / 2,
        yMin: 0,
        yMax: sectionHeight / 2
      },
      {
        xMin: sectionWidth / 2,
        xMax: sectionWidth,
        yMin: 0,
        yMax: sectionHeight / 2
      },
      {
        xMin: 0,
        xMax: sectionWidth / 2,
        yMin: sectionHeight / 2,
        yMax: sectionHeight
      },
      {
        xMin: sectionWidth / 2,
        xMax: sectionWidth,
        yMin: sectionHeight / 2,
        yMax: sectionHeight
      }
    ];
  }

  function showRandom404Images() {
    images404.forEach((img) => {
      img.classList.remove('is-visible');
    });

    const selectedImages = shuffleArray(images404).slice(0, visibleCount);
    const zones = shuffleArray(getZones());

    selectedImages.forEach((img, index) => {
      const zone = zones[index];

      const imgWidth = img.offsetWidth || window.innerWidth * 0.1;
      const imgHeight = img.offsetHeight || window.innerWidth * 0.06;

      const padding = window.innerWidth * 0.0265;

      const randomX = getRandomNumber(
        zone.xMin + padding,
        zone.xMax - imgWidth - padding
      );

      const randomY = getRandomNumber(
        zone.yMin + padding,
        zone.yMax - imgHeight - padding
      );

      img.style.left = `${randomX}px`;
      img.style.top = `${randomY}px`;

      img.classList.add('is-visible');
    });
  }

  showRandom404Images();

  setInterval(() => {
    showRandom404Images();
  }, 1500);
});
document.addEventListener('DOMContentLoaded', () => {
  const photos = document.querySelectorAll('.insp_photo');
  const popup = document.querySelector('#inspPopup');

  if (!photos.length || !popup) {
    return;
  }

  const popupTitle = popup.querySelector('.insp_popup_title');
  const popupDescription = popup.querySelector('.insp_popup_description');
  const popupImage = popup.querySelector('.insp_popup_image');
  const popupLink = popup.querySelector('.insp_popup_link');
  const closeButton = popup.querySelector('.insp_popup_close');

  photos.forEach((photo) => {
    photo.addEventListener('click', () => {
      const title = photo.getAttribute('data-title');
      const text = photo.getAttribute('data-text');
      const link = photo.getAttribute('data-link');

      popupTitle.textContent = title || '';
      popupDescription.textContent = text || '';
      popupImage.src = photo.src;
      popupLink.href = link || './catalog.html';

      popup.classList.add('is-open');
    });
  });

  closeButton.addEventListener('click', () => {
    popup.classList.remove('is-open');
  });

  popup.addEventListener('click', (event) => {
    if (event.target === popup) {
      popup.classList.remove('is-open');
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const mainMenu = document.querySelector('.main_menu');
  const burgerButton = document.querySelector('.burger_button');
  const mobileMenuBack = document.querySelector('.mobile_menu_back');

  if (!mainMenu || !burgerButton || !mobileMenuBack) {
    return;
  }

  burgerButton.addEventListener('click', () => {
    mainMenu.classList.add('is-open');
  });

  mobileMenuBack.addEventListener('click', () => {
    mainMenu.classList.remove('is-open');
  });
});

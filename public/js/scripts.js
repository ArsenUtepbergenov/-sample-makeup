document.addEventListener('DOMContentLoaded', () => {

  window.onscroll = () => showButtonToUpSite();

  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  context.lineWidth = 1;
  context.lineCap = 'round';
  const header = document.querySelector('.header');
  let width = canvas.width = header.offsetWidth;
  let height = canvas.height = header.offsetHeight;
  let particles = initRainEffect(width, height);

  window.addEventListener('resize', () => {
    width = canvas.width = header.offsetWidth;
    height = canvas.height = header.offsetHeight;
    particles = initRainEffect(width, height);

    initCarousel();
  });

  const defaultTab = document.getElementsByName('gallery')[0];
  addStyle(defaultTab, 'active');
  showTabContent(defaultTab.name);
  initArticlesWithPagination();

  const maxParticles = particles.length;

  function draw() {
    context.clearRect(0, 0, width, height);

    for (let i = 0; i < maxParticles; i++) {
      const temp = particles[i];
      context.beginPath();
      context.moveTo(temp.x, temp.y);
      context.lineTo(temp.x + temp.l * temp.xs, temp.y + temp.l * temp.ys);
      context.strokeStyle = 'rgba(236, 237, 225, 0.7)';
      context.stroke();
    }

    moveParticles(particles, width, height);

    requestAnimationFrame(draw);
  }

  draw();
});

// Rain effect (header)
function initRainEffect(width, height) {
  const maxParticles = 1000;

  let particles = [];

  for (let i = 0; i < maxParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      l: Math.random() * 1,
      xs: -4 + Math.random() * 4 + 2,
      ys: Math.random() * 10 + 10
    });
  }

  return particles;
}

function moveParticles(particles, width, height) {
  const maxParticles = particles.length;

  for (let i = 0; i < maxParticles; i++) {
    let temp = particles[i];
    temp.x += temp.xs;
    temp.y += temp.ys;
    if (temp.x > width || temp.y > height) {
      temp.x = Math.random() * width;
      temp.y = -20;
    }
  }
}

// Filter(search) arts
function searchArt() {
  const input = document.getElementById('search-art');
  const filter = input.value.toUpperCase();

  const cards = document.querySelectorAll('.card-art');
  const titles = document.querySelectorAll('.card-title');

  const length = titles.length;

  for (let i = 0; i < length; i++) {
    let tempTitle = titles[i];
    if (tempTitle.innerText.toUpperCase().indexOf(filter) > -1)
      cards[i].style.display = "";
    else
      cards[i].style.display = "none";
  }
}

// Pagination
const initArticlesWithPagination = async () => {
  const articles = await fetchArticles();
  const numberPages = articles.length;
  const numbersPages = createNumbersPagesPagination(numberPages, 'pagination-item');

  let articleTitle = document.querySelector('#articles .article-title');
  let articleText = document.querySelector('#articles .article-text');
  let currentArticle = 0;

  const paginationArticles = document.getElementById('pagination-articles');

  paginationArticles.addEventListener('click', e => {
    const target = e.target;

    if (target.tagName != 'A' || target.childNodes.length > 1)
      return;

    currentArticle = parseInt(target.innerText) - 1;
    changeArticle(currentArticle);
  });

  dLeft = createArrowPagination('pagination-item', 'fas fa-angle-double-left');
  dRight = createArrowPagination('pagination-item', 'fas fa-angle-double-right');
  left = createArrowPagination('pagination-item', 'fas fa-angle-left');
  right = createArrowPagination('pagination-item', 'fas fa-angle-right');

  dLeft.addEventListener('click', () => {
    changeArticle(0);
  });

  dRight.addEventListener('click', () => {
    changeArticle(numberPages - 1);
  });

  left.addEventListener('click', () => {
    if (currentArticle < 1)
      currentArticle = 0;
    else
      currentArticle -= 1;
    changeArticle(currentArticle);
  });

  right.addEventListener('click', () => {
    if (currentArticle >= numberPages - 1)
      currentArticle = numberPages - 1;
    else
      currentArticle += 1;
    changeArticle(currentArticle);
  });

  paginationArticles.appendChild(dLeft);
  paginationArticles.appendChild(left);

  for (let i = 0; i < numberPages; i++)
    paginationArticles.appendChild(numbersPages[i]);

  paginationArticles.appendChild(right);
  paginationArticles.appendChild(dRight);

  function changeArticle(currentArticle) {
    articleTitle.innerText = articles[currentArticle].title;
    articleText.innerText = articles[currentArticle].text;

    resetStylePaginationItem('pagination-item-active');
    addStyle(numbersPages[currentArticle], 'pagination-item-active');
  }

  changeArticle(currentArticle);
}

function createNumbersPagesPagination(numberPages, classA) {
  let numbersPages = [];
  for (let i = 1; i <= numberPages; i++) {
    let a = document.createElement('a');
    a.className = classA;
    a.innerText = i;
    numbersPages.push(a);
  }

  return numbersPages;
}

function createArrowPagination(classA, classI) {
  let a = document.createElement('a');
  a.className = classA;
  let i = document.createElement('i');
  i.className = classI;
  a.appendChild(i);
  return a;
}

const fetchArticles = async () => {
  try {
    const data = await fetch('./js/articles.json').then(response => response.json());
    return data;
  } catch (error) {
    console.error(error);
    return new Error('Failed fetch articles');
  }
}

function resetStylePaginationItem(style) {
  const items = document.querySelectorAll('#pagination-articles .pagination-item');
  resetStyle(items, style);
}

// Carousel
let z, deg, numberItems = 0, move = 0;

function rotate(direction) {
  move += direction;

  for (let i = 0; i < numberItems; i++)
    items[i].style.transform = "rotateY("+deg*(i+move)+"deg) translateZ("+z+"px)";
}

function initCarousel() {
  items = document.querySelectorAll('.carousel .carousel-item');
  numberItems = items.length;

  deg = 360 / numberItems;
  z = (items[0].offsetWidth / 2) / Math.tan((deg / 2) * (Math.PI / 180));

  for (let i = 0; i < numberItems; i++)
    items[i].style.transform = "rotateY("+(deg*i)+"deg) translateZ("+z+"px)";
}

// Button to up site
function showButtonToUpSite() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200)
    document.querySelector('.button-to-up').style.display = "block";
  else
    document.querySelector('.button-to-up').style.display = "none";
}

function toUpSite() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Show image modal
function showImageModal(e) {
  const target = e.target;

  if (target.tagName != 'IMG')
    return;

  const modalImage = document.getElementById('modal-image');
  const modalCaption = document.getElementById('modal-caption');

  toggleImageModal();
  modalImage.src = target.src;
  modalCaption.innerHTML = target.alt;
}

function toggleImageModal() {
  toggleStyle(document.getElementById('modal'), 'show');
}

// Tabs
function showTab(e) {
  const target = e.target;

  if (target.tagName != 'BUTTON')
    return;

  resetStyleTab('active');
  addStyle(target, 'active');

  resetStyleTabContent('show');
  showTabContent(target.name);
}

function showTabContent(name) {
  const items = document.querySelectorAll('.tabs-content-item');
  for (item of items) {
    if (name === item.id) {
      addStyle(item, 'show');
      if (name === 'slideshow')
        initCarousel();
    }
  }
}

function resetStyleTab(style) {
  const tabs = document.querySelectorAll('.tab');
  resetStyle(tabs, style);
}

function resetStyleTabContent(style) {
  const items = document.querySelectorAll('.tabs-content-item');
  resetStyle(items, style);
}

// Control css
function resetStyle(elements, style) {
  for (element of elements) {
    if (element.classList.contains(style))
      removeStyle(element, style);
  }
}

function removeStyle(element, style) {
  element.classList.remove(style);
}

function addStyle(element, style) {
  element.classList.add(style);
}

function toggleStyle(element, style) {
  element.classList.toggle(style);
}

// Navbar
function toggleNavbar() {
  toggleStyle(document.querySelector('.nav'), 'show');
  document.querySelector('.header-nav-bars').classList.toggle('active');
}

// Google map
function initMap() {
  const myLatLng = {lat: -25.363, lng: 131.044};

  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: myLatLng,
    disableDefaultUI: true
  });

  const marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Hello World!'
  });
}

let z, deg, numberItems = 0, move = 0;

document.addEventListener('DOMContentLoaded', () => {
  window.onscroll = () => showButtonToUpSite();
});

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

function toggleNavbar() {
  toggleStyle(document.querySelector('.nav'), 'show');
  document.querySelector('.header-nav-bars').classList.toggle('active');
}

function toggleImageModal() {
  toggleStyle(document.getElementById('modal'), 'show');
}

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

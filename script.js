/* Travel Gallery — JS */
/* Data: list of photos (unsplash sample URLs). Replace with local files if you prefer. */
const PHOTOS = [
  {src:'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop', title:'Golden Hills', tags:['nature','landscape','sunset']},
  {src:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop', title:'City Skyline', tags:['city','skyline','urban']},
  {src:'https://images.unsplash.com/photo-1504198458649-3128b932f49b?q=80&w=1600&auto=format&fit=crop', title:'Forest Path', tags:['nature','forest']},
  {src:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop', title:'Sunny Coast', tags:['beach','coast']},
  {src:'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop', title:'Vintage Market', tags:['market','travel','people']},
  {src:'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=1600&auto=format&fit=crop', title:'Desert Road', tags:['desert','road','landscape']},
  {src:'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1600&auto=format&fit=crop', title:'Blue Mountains', tags:['mountains','nature']},
  {src:'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop', title:'Cafe Corner', tags:['city','food']},
  {src:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1600&auto=format&fit=crop', title:'Night Street', tags:['city','night']},
  {src:'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop', title:'Fog Valley', tags:['landscape','fog']},
  {src:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop', title:'Harbor View', tags:['harbor','coast']},
  {src:'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=1600&auto=format&fit=crop', title:'Ancient Alley', tags:['architecture','history']},
];

/* DOM refs */
const grid = document.getElementById('grid');
const filtersEl = document.getElementById('filters');
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
const lbTitle = document.getElementById('lbTitle');
const lbTags = document.getElementById('lbTags');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const year = document.getElementById('year');

/* state */
let currentFilter = 'all';
let filtered = PHOTOS.slice();
let lbIndex = 0;

/* build filters (tags) */
function buildFilters(){
  const tagSet = new Set();
  PHOTOS.forEach(p => p.tags.forEach(t => tagSet.add(t)));
  const tags = ['all', ...Array.from(tagSet)];
  filtersEl.innerHTML = '';
  tags.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'filter' + (t==='all' ? ' active' : '');
    btn.textContent = t === 'all' ? 'All' : capitalize(t);
    btn.dataset.tag = t;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(t);
    });
    filtersEl.appendChild(btn);
  });
}

/* render grid */
function renderGrid(list){
  grid.innerHTML = '';
  list.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.tabIndex = 0;

    const img = document.createElement('img');
    img.src = p.src;
    img.alt = p.title;
    img.loading = 'lazy';

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = p.title;

    card.appendChild(img);
    card.appendChild(meta);
    grid.appendChild(card);

    // events
    card.addEventListener('click', () => openLightbox(idx));
    card.addEventListener('keydown', e => {
      if(e.key === 'Enter') openLightbox(idx);
    });
  });
}

/* apply filter */
function applyFilter(tag){
  currentFilter = tag;
  if(tag === 'all') filtered = PHOTOS.slice();
  else filtered = PHOTOS.filter(p => p.tags.includes(tag));
  renderGrid(filtered);
}

/* Lightbox functions */
function openLightbox(idx){
  lbIndex = idx;
  const p = filtered[lbIndex];
  lbImage.src = p.src;
  lbTitle.textContent = p.title;
  lbTags.textContent = p.tags.join(' • ');
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
}
function closeLightbox(){ lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden','true'); }
function lbNextFn(){ lbIndex = (lbIndex + 1) % filtered.length; updateLB(); }
function lbPrevFn(){ lbIndex = (lbIndex - 1 + filtered.length) % filtered.length; updateLB(); }
function updateLB(){ const p = filtered[lbIndex]; lbImage.src = p.src; lbTitle.textContent = p.title; lbTags.textContent = p.tags.join(' • '); }

/* events */
lbClose.addEventListener('click', closeLightbox);
lbNext.addEventListener('click', lbNextFn);
lbPrev.addEventListener('click', lbPrevFn);
lightbox.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });
window.addEventListener('keydown', e => {
  if(lightbox.classList.contains('open')){
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowRight') lbNextFn();
    if(e.key === 'ArrowLeft') lbPrevFn();
  }
});

/* testimonials simple carousel (JS) */
const testimonials = [
  {text:'Best photo tour I ever took — sunrise by the cliffs was magical.', who:'Aditi R.'},
  {text:'Guide was so patient and shared local hidden spots for photos.', who:'Samir K.'},
  {text:'Amazing itinerary and small groups. Perfect for photographers.', who:'Lara M.'}
];
const testiTrack = document.getElementById('testiTrack');
function buildTestimonials(){
  testiTrack.innerHTML = '';
  testimonials.forEach(t => {
    const el = document.createElement('div');
    el.className = 'testi';
    el.innerHTML = `<strong>${t.who}</strong><p>${t.text}</p>`;
    testiTrack.appendChild(el);
  });
}
let testiIndex = 0;
function testiNext(){ testiIndex = (testiIndex + 1) % testimonials.length; updateTesti(); }
function testiPrev(){ testiIndex = (testiIndex - 1 + testimonials.length) % testimonials.length; updateTesti(); }
function updateTesti(){ testiTrack.scrollTo({left: testiIndex * (testiTrack.children[0].offsetWidth + 12), behavior:'smooth'}); }
document.getElementById('tNext').addEventListener('click', testiNext);
document.getElementById('tPrev').addEventListener('click', testiPrev);

/* contact form (front-end only) */
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(contactForm);
  // simple validation
  if(!data.get('name') || !data.get('email') || !data.get('message')){
    alert('Please fill all fields.');
    return;
  }
  // show friendly message (no backend)
  alert('Thanks! Your message was sent (demo).');
  contactForm.reset();
});

/* small nav toggle for mobile */
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');
menuToggle.addEventListener('click', ()=> {
  if(nav.style.display === 'flex') nav.style.display = '';
  else nav.style.display = 'flex';
});

/* init */
function capitalize(s){ return s[0].toUpperCase() + s.slice(1); }
function init(){
  buildFilters();
  applyFilter('all'); // renders grid and uses filtered array
  buildTestimonials();
  year.textContent = new Date().getFullYear();
}
init();

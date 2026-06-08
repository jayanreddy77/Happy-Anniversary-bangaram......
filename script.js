const allMedia = [
  { type: 'image', src: 'IMG_3104.jpg' },
  { type: 'image', src: 'IMG_0175.jpg' },
  { type: 'image', src: 'IMG_5058.jpg' },
  { type: 'image', src: 'IMG_2962.jpg' },
  { type: 'image', src: 'IMG_6691.jpg' },
  { type: 'image', src: 'IMG_2940.jpg' },
  { type: 'image', src: 'IMG_5888.jpg' },
  { type: 'video', src: 'IMG_2964.mov' },
  { type: 'video', src: 'IMG_0177.mov' }
];

const total = allMedia.length;
let musicPlaying = false;
const music = document.getElementById('music');

function toggleMusic() {
  if (musicPlaying) {
    music.pause(); musicPlaying = false;
    document.getElementById('music-label').textContent = 'Play Music';
    document.getElementById('wave').classList.add('paused');
  } else {
    music.play().catch(() => {});
    musicPlaying = true;
    document.getElementById('music-label').textContent = 'Pause Music';
    document.getElementById('wave').classList.remove('paused');
  }
}

window.addEventListener('click', () => {
  if (!musicPlaying) {
    music.play().then(() => {
      musicPlaying = true;
      document.getElementById('music-label').textContent = 'Pause Music';
      document.getElementById('wave').classList.remove('paused');
    }).catch(() => {});
  }
}, { once: true });

const imageOnlyAssets = allMedia.filter(m => m.type === 'image');
let bgIdx = 0;
setInterval(() => {
  bgIdx = (bgIdx + 1) % imageOnlyAssets.length;
  const bgSlide = document.getElementById('bg-slideshow');
  bgSlide.style.opacity = 0;
  setTimeout(() => { bgSlide.src = imageOnlyAssets[bgIdx].src; bgSlide.style.opacity = 1; }, 400);
}, 4000);

let mainIdx = 0;
let slideshowPlaying = true;
let slideshowTimer = null;
const SLIDE_DURATION = 3500;
const slideshowContainer = document.getElementById('slideshow-container');
const progressBar = document.getElementById('progress-bar');

function animateProgress() {
  progressBar.style.transition = 'none';
  progressBar.style.width = '0%';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      progressBar.style.transition = `width ${SLIDE_DURATION}ms linear`;
      progressBar.style.width = '100%';
    });
  });
}

function goToSlide(idx) {
  mainIdx = (idx + total) % total;
  slideshowContainer.style.opacity = 0;
  setTimeout(() => {
    slideshowContainer.innerHTML = '';
    const current = allMedia[mainIdx];
    const counter = document.createElement('div');
    counter.className = 'slide-counter';
    counter.textContent = `${mainIdx + 1} / ${total}`;
    slideshowContainer.appendChild(counter);

    if (current.type === 'image') {
      const img = document.createElement('img');
      img.src = current.src;
      slideshowContainer.appendChild(img);
    } else {
      const vid = document.createElement('video');
      vid.src = current.src; vid.autoplay = true; vid.muted = true; vid.loop = true; vid.playsInline = true;
      slideshowContainer.appendChild(vid);
    }
    slideshowContainer.style.opacity = 1;
  }, 300);
  if (slideshowPlaying) animateProgress();
}

function nextSlide() { goToSlide(mainIdx + 1); }
function prevSlide() { goToSlide(mainIdx - 1); }
function startTimer() { clearInterval(slideshowTimer); slideshowTimer = setInterval(nextSlide, SLIDE_DURATION); }

function toggleSlideshow() {
  slideshowPlaying = !slideshowPlaying;
  const btn = document.getElementById('play-btn');
  if (slideshowPlaying) { startTimer(); animateProgress(); btn.textContent = '⏸ Pause'; }
  else { clearInterval(slideshowTimer); progressBar.style.width = '0%'; btn.textContent = '▶ Play'; }
}

const grid = document.getElementById('gallery-grid');
allMedia.forEach((media, i) => {
  const item = document.createElement('div');
  item.className = 'gallery-item';
  if (media.type === 'image') {
    item.innerHTML = `<img src="${media.src}" alt="Memory" loading="lazy">`;
  } else {
    item.innerHTML = `<video src="${media.src}" muted loop playsinline></video><div class="video-badge">▶ Video</div>`;
    item.addEventListener('mouseenter', () => item.querySelector('video').play().catch(() => {}));
    item.addEventListener('mouseleave', () => item.querySelector('video').pause());
  }
  item.onclick = () => openLightbox(i);
  grid.appendChild(item);
});

let currentLightboxIdx = 0;
const lightboxContent = document.getElementById('lightbox-content');
function openLightbox(idx) {
  currentLightboxIdx = idx;
  const media = allMedia[idx];
  lightboxContent.innerHTML = '';
  if (media.type === 'image') {
    const img = document.createElement('img'); img.src = media.src; lightboxContent.appendChild(img);
  } else {
    const vid = document.createElement('video'); vid.src = media.src; vid.controls = true; vid.autoplay = true; lightboxContent.appendChild(vid);
  }
  document.getElementById('lightbox').classList.add('active');
}

function closeLightbox() { document.getElementById('lightbox').classList.remove('active'); lightboxContent.innerHTML = ''; }
document.getElementById('lightbox-close').onclick = closeLightbox;
document.getElementById('lightbox-prev').onclick = () => { currentLightboxIdx = (currentLightboxIdx - 1 + total) % total; openLightbox(currentLightboxIdx); };
document.getElementById('lightbox-next').onclick = () => { currentLightboxIdx = (currentLightboxIdx + 1) % total; openLightbox(currentLightboxIdx); };

const defaultWishes = [
  { from: 'Your Future Husband', msg: 'To my gorgeous future wife, Nainitha—thank you for making every day feel like a celebration. I look forward to spending all my tomorrows loving you.', color: '#ff4d79', quote: '💖' },
  { from: 'The Journey Ahead', msg: 'Every single step we take brings us closer to a lifetime together. Happy anniversary to the girl who stole my heart and holds my future.', color: '#9d4edd', quote: '💍' },
  { from: 'Our Promise', msg: 'Through the laughs, the late-night talks, and every memory yet to come—I promise to choose you, stand by you, and cherish you forever.', color: '#ffd700', quote: '✨' },
];

const wishesGrid = document.getElementById('wishes-grid');
defaultWishes.forEach(({ from, msg, color, quote }) => {
  const card = document.createElement('div');
  card.className = 'wish-card';
  card.innerHTML = `<div class="quote">${quote}</div><p class="message">${msg}</p><div class="from">— ${from}</div>`;
  wishesGrid.appendChild(card);
});

function shootConfetti() {
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}

window.onload = () => { goToSlide(0); startTimer(); shootConfetti(); };

const emojis = ['💖','💍','✨','❤️','💕'];
setInterval(() => {
  const el = document.createElement('div'); el.className = 'floater';
  el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  el.style.left = Math.random() * 95 + 'vw';
  el.style.animationDuration = (4 + Math.random() * 4) + 's';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 8000);
}, 2000);

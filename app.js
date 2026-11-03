// Dekha — prototype app.js
const state = {
  view: 'splash', // splash | discover | profile | match | chat | settings
  currentCardIndex: 0,
  heartHistory: [],     // cards user liked
  matches: [],          // { id, name, avatar, status, loc }
  currentChatId: null,
  cardDeck: [],
  stats: { likes: 0, nope: 0, matches: 0 },
};

const profileDeck = [
  {
    id: 'rafi', name: 'Rafi', bengali: 'রাফি', loc: 'Dhanmondi, Dhaka', locShort: 'ঢাকা',
    age: 24, goal: 'Serious', points: 98, distanceKm: 2,
    photo: 'https://picsum.photos/seed/rafi/400/600?auto=format&fit=crop&w=400&q=60',
    photos: [
      'https://picsum.photos/seed/rafi/400/600?auto=format&fit=crop&w=400&q=60',
      'https://picsum.photos/seed/rafi/400/600?auto=format&fit=crop&w=400&q=60',
      'https://picsum.photos/seed/rafi/400/600?auto=format&fit=crop&w=400&q=60',
    ],
    bio: 'Frontend engineer. I\'d rather share biryani than screens. Looking for something steady.',
    tags: ['Cocoa', 'Coffee', 'Photography', 'Rust'],
    status: 'Online · 18 min ago',
  },
  {
    id: 'nadia', name: 'Nadia', bengali: 'নাদিয়া', loc: 'Khulnar, Chittagong', locShort: 'চট্টগ্রাম',
    age: 26, goal: 'Serious', points: 95, distanceKm: 45,
    photo: 'https://picsum.photos/seed/nadia/400/600?auto=format&fit=crop&w=400&q=60',
    photos: [
      'https://picsum.photos/seed/nadia/400/600?auto=format&fit=crop&w=400&q=60',
      'https://picsum.photos/seed/nadia/400/600?auto=format&fit=crop&w=400&q=60',
      'https://picsum.photos/seed/nadia/400/600?auto=format&fit=crop&w=400&q=60',
    ],
    bio: 'Southbank Engineering. Bengali tea, slow reads, and a good walk. Let\'s talk real.',
    tags: ['Tea', 'Travel', 'Books', 'Nature'],
    status: 'Online · 2m',
  },
  {
    id: 'tom', name: 'Tom', bengali: 'টম', loc: 'Gulshan, Dhaka', locShort: 'ঢাকা',
    age: 27, goal: 'Casual', points: 72, distanceKm: 1.5,
    photo: 'https://picsum.photos/seed/tom/400/600?auto=format&fit=crop&w=400&q=60',
    photos: [
      'https://picsum.photos/seed/tom/400/600?auto=format&fit=crop&w=400&q=60',
      'https://picsum.photos/seed/tom/400/600?auto=format&fit=crop&w=400&q=60',
      'https://picsum.photos/seed/tom/400/600?auto=format&fit=crop&w=400&q=60',
    ],
    bio: 'Music maker, food lover. I\'ll buy the first drink — but I\'d rather build something real.',
    tags: ['Music', 'Food', 'Hiking', 'Karaoke'],
    status: 'Online',
  },
  {
    id: 'minha', name: 'Minha', bengali: 'মিনহা', loc: 'Pulpito, Rajshahi', locShort: 'রাজশাহী',
    age: 23, goal: 'Serious', points: 88, distanceKm: 180,
    photo: 'https://picsum.photos/seed/minha/400/600?auto=format&fit=crop&w=400&q=60',
    photos: [
      'https://picsum.photos/seed/minha/400/600?auto=format&fit=crop&w=400&q=60',
      'https://picsum.photos/seed/minha/400/600?auto=format&fit=crop&w=400&q=60',
      'https://picsum.photos/seed/minha/400/600?auto=format&fit=crop&w=400&q=60',
    ],
    bio: 'Architect. I design homes for a living — and hope to live in one that feels like a calm place.',
    tags: ['Architecture', 'Bengali poetry', 'Tea houses', 'Travel'],
    status: 'Offline',
  },
  {
    id: 'arif', name: 'Arif', bengali: 'আরিফ', loc: 'Banani, Dhaka', locShort: 'ঢাকা',
    age: 29, goal: 'Casual', points: 78, distanceKm: 3,
    photo: 'https://picsum.photos/seed/arif/400/600?auto=format&fit=crop&w=400&q=60',
    photos: [
      'https://picsum.photos/seed/arif/400/600?auto=format&fit=crop&w=400&q=60',
      'https://picsum.photos/seed/arif/400/600?auto=format&fit=crop&w=400&q=60',
      'https://picsum.photos/seed/arif/400/600?auto=format&fit=crop&w=400&q=60',
    ],
    bio: 'Data person. I like clean code and sharper conversations. Let\'s see where it goes.',
    tags: ['Code', 'Chess', 'Roasts', 'Steam'],
    status: 'Online · 5m',
  },
];

const initialDeck = profileDeck.map((p, i) => ({ ...p, likes: 0, matches: 0 }));

function seedDeck() {
  state.cardDeck = initialDeck.map((p) => ({ ...p, likes: 0, matches: 0 }));
  // reshuffle lightly: put first card on top
  state.cardDeck = [state.cardDeck.pop(), ...state.cardDeck];
  renderCards();
}

let intendedMatch = null;
let hearted = new Set();
let matched = new Set();
let nextTop = 0;

function go(view) {
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  state.view = view;
  if (view === 'match') renderMatch();
}

function setActiveCard() {
  const stack = document.getElementById('card-stack');
  const cards = stack.querySelectorAll('.card');
  cards.forEach((c, i) => c.classList.toggle('active', i === state.currentCardIndex));
}

function renderSummary() {
  const el = document.getElementById('summary');
  const d = state.cardDeck[state.currentCardIndex] || state.cardDeck[0];
  el.innerHTML = `
    <div class="headline">${d.bengali ? d.bengali : d.name} <span class="spot">· ${d.locShort}</span></div>
    <div class="sub">${d.age} · ${d.goal} · ${d.distanceKm} km away · <b style="color:var(--teal)">${d.points} points</b></div>
    <div style="margin-top:8px; font-size:13px; color:var(--ink-faint)">${d.tags.slice(0,2).map(t=>`<span class="tag" style="background:var(--bg);color:var(--ink-soft);padding:2px 8px;border-radius:12px">${d.tags[0]}</span>`).join('') || 'No tags'}</div>
  `;
}

function renderLikeButtons() {
  const like = document.getElementById('btn-like');
  const nope = document.getElementById('btn-nope');
  const superBtn = document.getElementById('btn-super');
  const canLike = nextTop < state.cardDeck.length;
  like.style.display = canLike ? 'flex' : 'none';
  nope.style.display = canLike ? 'flex' : 'none';
}
function renderMatch() {
  const p = profileDeck.find(x => x.id === state.matchedId);
  if (!p) return;
  const name = p.bengali ? p.bengali : p.name;
  const el = document.getElementById('match-name');
  if (el) el.textContent = name;
  const copy = document.getElementById('match-copy');
  if (copy) copy.innerHTML = 'You and <strong>' + name + '</strong> both liked each other. Say hi — it\'s free.';
}


// ---------- your profile (user) ----------
const userProfile = {
  name: 'Rafi',
  phone: '+880 1799 000000',
  location: 'Dhaka, Bangladesh',
  goal: 'Serious',
  distance: 'Up to 10 km',
  verified: 'Verified',
};

function renderUserProfile() {
  document.getElementById('pu-name').textContent = userProfile.name;
  document.getElementById('pu-phone').textContent = userProfile.phone;
  document.getElementById('pu-loc').textContent = userProfile.location;
  document.getElementById('pu-goal').textContent = userProfile.goal;
  document.getElementById('pu-dist').textContent = userProfile.distance;
  document.getElementById('pu-ver').textContent = userProfile.verified;
  document.getElementById('pu-name-input').value = userProfile.name;
  document.getElementById('pu-phone-input').value = userProfile.phone;
  document.getElementById('pu-loc-input').value = userProfile.location;
  document.getElementById('pu-goal-input').value = userProfile.goal;
  document.getElementById('pu-dist-input').value = userProfile.distance;
}

function saveUserProfile() {
  userProfile.name = document.getElementById('pu-name-input').value.trim() || userProfile.name;
  userProfile.phone = document.getElementById('pu-phone-input').value.trim() || userProfile.phone;
  userProfile.location = document.getElementById('pu-loc-input').value.trim() || userProfile.location;
  userProfile.goal = document.getElementById('pu-goal-input').value;
  userProfile.distance = document.getElementById('pu-dist-input').value;
  userProfile.verified = 'Verified';
  renderUserProfile();
}
function renderProfileBody() {
  const card = state.cardDeck[state.currentCardIndex];
  if (!card) return;
  const p = profileDeck.find(x => x.id === card.id);
  const el = document.getElementById('profile-body');
  el.innerHTML = `<div class="top"><div class="name">${p.bengali ? p.bengali : p.name} <span class="loc" style="color:var(--ink-soft)">${p.locShort} · ${p.age}</span></div><div class="goal" style="font-size:13px;font-weight:700">${p.goal} · ${p.points} points</div></div><div class="rel" style="margin-top:6px">${p.bio}</div><div class="tag-row" style="margin-top:12px">${p.tags.map(t=>`<span class="tag" style="background:var(--bg);color:var(--ink-soft);padding:3px 9px;border-radius:20px">${t}</span>`).join('')}</div><div style="margin-top:14px;display:flex;gap:12px;flex-wrap:wrap"><button class="btn like" id="profile-like"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.83 4.89 7.33 18.09C6.38 19.42 5 18.34 5 17l0 0c0-3.01 1.57-4.9 3.63-4.9 1.47 0 2.56.68 3.63 1.78 1.08-1.09 2.16-1.78 3.63-1.78 2.07 0 3.64 1.9 3.64 4.9l0 0c0 3.01-1.45 4.9-3.63 4.9-1.47 0-2.56-.68-3.63-1.78C20.26 18.09 20.83 17.09 20.83 14.09v-9.2z"/></svg>Like</button><button class="btn nope" id="profile-nope"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 18 18 6M6 6l12 12"/></svg>Nope</button><button class="btn super" id="profile-super">Super like</button></div>`;
  document.getElementById('profile-like').addEventListener('click', () => swipe('like'));
  document.getElementById('profile-nope').addEventListener('click', () => swipe('nope'));
}
function openProfile() {
  const card = state.cardDeck[state.currentCardIndex];
  if (!card) return;
  const p = profileDeck.find(x => x.id === card.id);
  const slider = document.getElementById('profile-slider');
  slider.innerHTML = p.photos.slice(0, 3).map((src, i) => `<img class="thumb" src="${src}" alt="${p.bengali || p.name}" style="${i === 0 ? 'display:block' : ''}" onerror="this.parentElement.classList.add('pic-bad')"/>`).join('');
  renderProfileBody();
  go('profile');
}

// ---------- main card loop ----------
function renderCards() {
  const stack = document.getElementById('card-stack');
  stack.innerHTML = state.cardDeck.map((card, i) => `
    <div class="card${i === state.currentCardIndex ? ' active' : ''}">
      <img class="thumb" src="${card.photo}" alt="${card.bengali || card.name}" onerror="this.parentElement.classList.add('pic-bad')"/>
      <div class="body">
        <div class="top"><span class="points">${card.points} pts</span><span class="loc">${card.locShort}</span></div>
        <div class="name">${card.bengali ? card.bengali : card.name}</div>
        <div class="rel">${card.age} · ${card.goal}</div>
        <div class="loc">${card.loc} · ${card.distanceKm} km</div>
        <div class="tag-row">${card.tags.map(t => `<span class="tag primary">${t}</span>`).join('')}</div>
      </div>
    </div>
  `).join('');
}

function nextCard() {
  if (state.currentCardIndex >= state.cardDeck.length - 1) { return; }
  state.currentCardIndex++;
  nextTop = state.currentCardIndex;
  setActiveCard();
  renderSummary();
  if (state.currentCardIndex >= state.cardDeck.length) { renderSummaryEnd(); }
  renderLikeButtons();
}

function renderSummaryEnd() {
  const el = document.getElementById('summary');
  el.innerHTML = `<div class="headline">সব বন্ধু পাওয়া গেল</div>
    <div class="sub">${state.stats.likes} লাইক, ${state.stats.nope} নেপ, ${state.stats.matches} ম্যাচ।
    <br>এখন চ্যাটে ঢুকো।</div>`;
}

// ---------- actions ----------
function swipe(dir) {
  if (state.view !== 'discover') return;
  const card = state.cardDeck[state.currentCardIndex];
  if (!card) return;

  document.getElementById('slider').style.transform = `translateY(${(state.currentCardIndex+1)*-160}px)`;
  setTimeout(() => {
    document.getElementById('slider').style.transform = 'translateY(0)';
  }, 350);

  if (dir === 'like') {
    state.stats.likes++;
    hearted.add(card.id);
    card.likes++;
    if (state.intendedMatch === card.id) {
      state.matchedId = card.id;
      state.intendedMatch = null;
      matched.add(card.id);
      state.stats.matches++;
      setTimeout(() => { go('match'); }, 300);
    }
  } else if (dir === 'nope') {
    state.stats.nope++;
  } else if (dir === 'super') {
    // place at bottom of queue with high priority
  }
  // next card
  setTimeout(nextCard, 350);
}

// ---------- matching ----------
function attemptMatch(cardIndex) {
  const a = state.cardDeck[cardIndex];
  if (!a || hearted.has(a.id)) return;
  // simple simulation: user liked; if another profile has liked this, it's a match
  const b = profileDeck.find(p => p.id === a.id);
  if (b && b !== a && a.id === 'rafi') { matched.add(a.id); state.stats.matches++; }
}

// ---------- chat ----------
function openChat(id) {
  const p = profileDeck.find(x => x.id === id);
  if (!p) return;
  go('chat');
  document.getElementById('chat-name').textContent = p.bengali ? p.bengali : p.name;
  document.getElementById('chat-avatar').style.background = p.id === 'rafi' ? 'linear-gradient(135deg,#FF5A3C,#FFA54C)' :
    p.id === 'nadia' ? 'linear-gradient(135deg,#0F766E,#2DD4BF)' : 'linear-gradient(135deg,#FF5A3C,#FF6B3C)';
  document.getElementById('chat-status').textContent = p.status;
  document.getElementById('chat-avatar').textContent = p.bengali ? p.bengali[0] : p.name[0];
  document.getElementById('chat-avatar').title = p.loc;
  const box = document.getElementById('messages');
  box.innerHTML = '';
  const msgs = [
    { from: 'bot', text: `Hello ${p.name}! Welcome to Dekha. 🙏` },
    { from: 'me', text: `Hey! Nice to meet you. I've been in Dhaka a few months.` },
    { from: 'bot', text: `I'm from Chittagong actually. How do you know Dhaka so well?` },
    { from: 'me', text: `Work took me here. I miss the hills sometimes.` },
  ];
  msgs.forEach(m => bubble(m.from, m.text));
  box.scrollTop = box.scrollHeight;
}

function bubble(from, text) {
  const box = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg ' + (from === 'me' ? 'out' : 'in');
  div.innerHTML = `<div class="who">${from === 'me' ? 'You' : (document.getElementById('chat-name').textContent)}</div><div class="bubble">${text}</div>`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

// ---------- wiring ----------
document.getElementById('splash-get-started').addEventListener('click', () => { go('onboard'); });
document.getElementById('btn-nope').addEventListener('click', () => swipe('nope'));
document.getElementById('btn-like').addEventListener('click', () => swipe('like'));
document.getElementById('btn-super').addEventListener('click', () => {
  if (state.view === 'discover') {
    const idx = state.currentCardIndex;
    if (idx < state.cardDeck.length) {
      const c = state.cardDeck[idx];
      // "I've already met this person" -> super-like = match
      state.intendedMatch = c.id;
      setTimeout(() => { swipe('like'); }, 300);
    }
  }
});
document.getElementById('btn-top-search').addEventListener('click', () => { go('profile-user'); });
document.getElementById('btn-top-image').addEventListener('click', () => { go('profile-user'); });

document.getElementById('onboard-continue').addEventListener('click', () => {
  go('discover');
  seedDeck();
  renderSummary();
  renderLikeButtons();
});

document.getElementById('pu-save').addEventListener('click', saveUserProfile);
document.getElementById('pu-back').addEventListener('click', () => { go('discover'); });
document.getElementById('pu-manage').addEventListener('click', () => { go('settings'); });

document.getElementById('match-chat').addEventListener('click', () => {
  openChat('rafi');
});

document.getElementById('chat-send').addEventListener('click', () => {
  const input = document.getElementById('chat-input');
  if (!input.value.trim()) return;
  bubble('me', input.value.trim());
  input.value = '';
  setTimeout(() => {
    bubble('bot', 'That sounds great. Want to grab chai together this weekend?');
  }, 1200);
  input.focus();
});

document.getElementById('btn-block-key').addEventListener('click', () => {
  alert('Blocked & reported. Your evidence is secured on-device.');
});
document.getElementById('btn-reset').addEventListener('click', () => {
  if (confirm('Reset your account? This clears your matches, photos and settings.')) go('splash');
});
// ---- card click opens profile ----
document.getElementById('card-stack').addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (card) {
    const idx = Array.prototype.indexOf.call(card.parentElement.children, card);
    if (idx >= 0) {
      state.currentCardIndex = idx;
      setActiveCard();
      renderSummary();
      openProfile();
    }
  }
});

// keyboard
window.addEventListener('keydown', (e) => {
  if (state.view !== 'discover') return;
  if (e.key === 'ArrowLeft' || e.key === 'n' || e.key === 'N') swipe('nope');
  else if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'l' || e.key === 'L') swipe('like');
});

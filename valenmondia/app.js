'use strict';

const STORAGE_KEYS = { stories: 'veloda_stories_v1', saved: 'veloda_saved_v1', profile: 'veloda_profile_v1' };
const seedStories = [
  {id:'moon-between-us', title:'The Moon Between Us', genre:'Romance', tags:['Romance','Fantasy','Drama'], author:'Valenmondia Studio', summary:'A secret between two worlds. A heart caught in the middle. When their paths collide, nothing will ever be the same again.', body:'The first time Amara heard the moon whisper her name, she thought the night was playing tricks on her.\n\nIt happened just after midnight, as the village slept beneath a silver sky. The voice was soft, almost like a memory she had forgotten she owned.\n\n“Find the boy beneath the falling stars.”\n\nBy morning, a stranger stood at the edge of her garden. He carried a map with no roads on it, and when he looked up at the sky, every star disappeared.', rating:4.9, reviews:24, reads:2400, cover:'moon', mark:'☾', featured:true, createdAt:1},
  {id:'crimson-diary', title:'The Crimson Diary', genre:'Horror', tags:['Horror','Mystery'], author:'Nia Writes', summary:'A diary appears in a locked room. Every page describes something that has not happened yet.', body:'The diary was waiting on the windowsill, although the window had been locked for years. Its cover was the colour of dried roses. On the first page, in handwriting that looked exactly like hers, were six words: Do not turn around tonight.', rating:4.8, reviews:18, reads:1680, cover:'horror', mark:'☠', createdAt:2},
  {id:'campus-laughs', title:'Campus Laughs', genre:'Comedy', tags:['Comedy','Campus'], author:'Tobi A.', summary:'One group project, five personalities, and a deadline that refuses to move.', body:'The lecturer said “group of five” and pointed at the class register. Somehow, I ended up with the class comedian, the serious one, the person who never came to class, and a guy who thought a PowerPoint was a kind of vitamin.', rating:4.6, reviews:31, reads:1940, cover:'comedy', mark:'☻', createdAt:3},
  {id:'love-in-tokyo', title:'Love in Tokyo', genre:'Romance', tags:['Romance','Drama'], author:'Mika Moon', summary:'Two strangers miss the same train every day. One rainy evening, they finally say hello.', body:'Tokyo looked like a painting through the rain-streaked station glass. Hana had missed the 7:14 again. Across the platform, the same boy with the blue umbrella was smiling at the timetable like it had told him a joke.', rating:4.7, reviews:42, reads:3200, cover:'romance', mark:'♡', createdAt:4},
  {id:'last-frontier', title:'The Last Frontier', genre:'Sci-Fi', tags:['Sci-Fi','Adventure'], author:'Orion Quill', summary:'Earth’s final signal reaches a quiet ship at the edge of the known universe.', body:'Captain Imani had been asleep for 186 days when the signal arrived. It was only three seconds long, but the computer translated it into one impossible sentence: We remember you.', rating:4.5, reviews:12, reads:860, cover:'scifi', mark:'✧', createdAt:5},
  {id:'almost-forever', title:'Almost Forever', genre:'Romance', tags:['Romance','Drama'], author:'Lola B.', summary:'Two old friends. One new beginning. And a question neither has been brave enough to ask.', body:'They made a rule at seventeen: no matter what happened, they would always tell each other the truth. At twenty-six, standing in the kitchen of the house they had bought together as friends, that rule felt like the hardest thing in the world.', rating:4.8, reviews:15, reads:1270, cover:'fantasy', mark:'♡', createdAt:6},
  {id:'oops-again', title:'Oops! Again', genre:'Rom-Com', tags:['Rom-Com','Comedy'], author:'Dee Creates', summary:'One plan, twelve disasters, and a fake date who might be getting a little too real.', body:'The plan was simple: show up, pretend to be in love, survive dinner, go home. The problem began when my fake boyfriend brought my mother flowers and called her ma.', rating:4.9, reviews:28, reads:2100, cover:'comedy', mark:'☀', createdAt:7},
  {id:'glass-garden', title:'The Glass Garden', genre:'Fantasy', tags:['Fantasy','Adventure'], author:'E. Rowan', summary:'A gardener discovers a greenhouse where forgotten wishes grow into living things.', body:'Behind the abandoned library, Mara found a door made of green glass. It opened into a garden growing beneath a sky with no sun. Every flower whispered a name. One of them whispered hers.', rating:4.7, reviews:9, reads:670, cover:'fantasy', mark:'✧', createdAt:8}
];
seedStories.push(...(window.VALENMONDIA_EXTRA_STORIES || []).map(row=>{const [id,title,genre,length,chapterCount,summary,author,rating,cover,mark,createdAt]=row;return {id,title,genre,length,chapterCount,summary,author,rating,cover,mark,createdAt,tags:[genre],reviews:3+(createdAt%27),reads:250+(createdAt*173)%6400,demo:true};}));
seedStories.forEach((story,index)=>{ story.length = story.length || (index % 2 === 1 ? 'Long' : 'Short'); story.chapterCount = Number(story.chapterCount || (story.length === 'Long' ? 8 : 1)); });
const coverThemes = {
  moon: {bg:'radial-gradient(circle at 75% 23%,#ffdfb6 0 9%,transparent 10%),linear-gradient(145deg,#101b3a,#596893 55%,#10182a)', title:'THE MOON', em:'BETWEEN US', mark:'☾'},
  horror: {bg:'radial-gradient(circle at 50% 20%,#d92c2b 0 9%,transparent 10%),linear-gradient(145deg,#6e171c,#180c19 75%)', title:'THE CRIMSON', em:'DIARY', mark:'☠'},
  comedy: {bg:'radial-gradient(circle at 70% 18%,#ffdfa5 0 14%,transparent 15%),linear-gradient(130deg,#92c5b6,#e8ab70 48%,#566777)', title:'CAMPUS', em:'LAUGHS', mark:'☻'},
  romance: {bg:'radial-gradient(circle at 70% 19%,#ffdcab 0 13%,transparent 14%),linear-gradient(130deg,#f6b2b2,#935986 55%,#251c45)', title:'LOVE IN', em:'TOKYO', mark:'♡'},
  scifi: {bg:'radial-gradient(circle at 70% 20%,#b8e9ff 0 7%,transparent 8%),linear-gradient(145deg,#123d65,#162442 54%,#040b1d)', title:'THE LAST', em:'FRONTIER', mark:'✧'},
  fantasy: {bg:'radial-gradient(circle at 73% 18%,#d0ffdd 0 8%,transparent 9%),linear-gradient(145deg,#285c57,#584d92 60%,#10172d)', title:'THE GLASS', em:'GARDEN', mark:'✦'},
  custom: {bg:'linear-gradient(140deg,#0c574a,#131b38 65%,#292052)', title:'A NEW', em:'STORY', mark:'✦'}
};
let stories = loadStories();
let savedIds = readStorage(STORAGE_KEYS.saved, []);
let profile = readStorage(STORAGE_KEYS.profile, {name:'Reader', email:'', bio:'A reader today, a storyteller tomorrow.', loggedIn:false});
let activeStoryId = null;
let activeRating = 0;
let authMode = 'signup';
let selectedGenre = 'All';
let selectedLength = 'All';
let searchQuery = '';
let toastTimer;

function readStorage(key, fallback) { try { const data = localStorage.getItem(key); return data ? JSON.parse(data) : fallback; } catch { return fallback; } }
function writeStorage(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (error) { showToast('Browser storage is full. Try a smaller cover image.'); return false; } }
function loadStories() {
  const stored = readStorage(STORAGE_KEYS.stories, null);
  if (!Array.isArray(stored)) return seedStories.map(s => ({...s, comments:[], ratingEntries:[]}));
  const storedById = new Map(stored.map(s => [s.id, s]));
  const base = seedStories.map(seed => ({...seed, ...(storedById.get(seed.id) || {}), comments:Array.isArray(storedById.get(seed.id)?.comments) ? storedById.get(seed.id).comments : [], ratingEntries:Array.isArray(storedById.get(seed.id)?.ratingEntries) ? storedById.get(seed.id).ratingEntries : []}));
  const extras = stored.filter(s => !seedStories.some(seed => seed.id === s.id));
  return [...base, ...extras];
}
function allStories() { return stories; }
function persistStories() { return writeStorage(STORAGE_KEYS.stories, stories); }
function escapeHTML(value='') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function slugId() { return 'story-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,7); }
function safeGenre(genre) { return ['Horror','Comedy','Romance','Sci-Fi','Rom-Com','Fantasy','Drama','Mystery','Adventure','Poetry','Slice of Life','Other'].includes(genre) ? genre : 'Other'; }
function themeFor(story) { return coverThemes[story.cover] || coverThemes.custom; }
function storyCover(story, extraClass='') {
  if (story.coverData) return `<div class="story-cover ${extraClass}" style="--cover-bg:url('${story.coverData}') center/cover"><span class="story-cover-top">VALENMONDIA COMMUNITY</span><span class="story-cover-mark">${escapeHTML(story.mark || '✦')}</span><span class="story-cover-title">${escapeHTML(story.title)}</span><span class="story-cover-bottom">BY ${escapeHTML(story.author || 'A VALENMONDIA AUTHOR')}</span></div>`;
  const theme = themeFor(story);
  return `<div class="story-cover ${extraClass}" style="--cover-bg:${theme.bg}"><span class="story-cover-top">${escapeHTML(story.genre || 'STORY').toUpperCase()} · VALENMONDIA</span><span class="story-cover-mark">${escapeHTML(story.mark || theme.mark)}</span><span class="story-cover-title">${escapeHTML(story.coverTitle || theme.title)}<em>${escapeHTML(story.coverSubtitle || theme.em)}</em></span><span class="story-cover-bottom">BY ${escapeHTML(story.author || 'A VALENMONDIA AUTHOR')}</span></div>`;
}
function storyCard(story) {
  const saved = savedIds.includes(story.id);
  return `<article class="story-card" data-story-id="${escapeHTML(story.id)}">${storyCover(story)}<div class="story-card-body"><div class="story-card-meta">${escapeHTML(story.genre)} · ${escapeHTML(story.length || 'Short')} read · ${Number(story.chapterCount || 1)} ch.</div><h3>${escapeHTML(story.title)}</h3><p>${escapeHTML(story.summary)}</p><div class="story-card-foot"><span>★ ${averageRating(story).toFixed(1)}</span><button data-open-story="${escapeHTML(story.id)}">Read story →</button></div></div></article>`;
}
function miniStory(story) {
  const theme = themeFor(story);
  const bg = story.coverData ? `url('${story.coverData}') center/cover` : theme.bg;
  const saved = savedIds.includes(story.id);
  return `<article class="mini-story"><button class="mini-cover" data-open-story="${escapeHTML(story.id)}" style="background:${bg}" aria-label="Open ${escapeHTML(story.title)}"><span>${escapeHTML(story.title)}</span></button><div class="mini-story-info"><b>${escapeHTML(story.title)}</b><small>${escapeHTML(story.genre)}</small><div class="mini-bottom"><span>★ ${averageRating(story).toFixed(1)}</span><button data-save-story="${escapeHTML(story.id)}" aria-label="${saved?'Remove from':'Add to'} library" title="${saved?'Remove from':'Add to'} library">${saved?'♥':'♡'}</button></div></div></article>`;
}
function averageRating(story) {
  const vals = (story.ratingEntries || []).map(r => Number(r.value)).filter(n => n >= 1 && n <= 5);
  if (vals.length) return vals.reduce((a,b)=>a+b,0)/vals.length;
  return Number(story.rating || 0);
}
function showToast(message) { const el = document.getElementById('toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),2600); }
function saveIds() { writeStorage(STORAGE_KEYS.saved, savedIds); }
function getStory(id) { return stories.find(s => s.id === id); }
function refreshAll() { renderTrending(); renderStoryGrid(); renderDiscover(); renderLibrary(); renderProfile(); renderHomeShelves(); updateFeatureSaveButton(); }
function renderTrending() {
  const featured = getStory('moon-between-us') || stories[0];
  if (!featured) return;
  document.getElementById('featuredTitle').textContent = featured.title;
  document.getElementById('featuredSummary').textContent = featured.summary;
  document.getElementById('featuredRating').textContent = averageRating(featured).toFixed(1);
  const cover = document.querySelector('.featured-cover');
  const theme = themeFor(featured);
  cover.style.background = featured.coverData ? `linear-gradient(0deg,#030910dd,transparent),url('${featured.coverData}') center/cover` : theme.bg;
  cover.querySelector('.cover-words').innerHTML = `${escapeHTML(featured.coverTitle || theme.title)}<br><em>${escapeHTML(featured.coverSubtitle || theme.em)}</em>`;
  cover.querySelector('.cover-kicker').textContent = `${featured.author === 'Valenmondia Studio' ? 'A VALENMONDIA ORIGINAL' : 'COMMUNITY SPOTLIGHT'}`;
  document.getElementById('miniStoryTrack').innerHTML = stories.filter(s=>s.id!==featured.id).slice(0,4).map(miniStory).join('');
}
function matches(story, genre=selectedGenre, query=searchQuery) {
  const genreMatch = genre === 'All' || story.genre === genre;
  const q = query.trim().toLowerCase();
  const queryMatch = !q || [story.title,story.author,story.genre,story.summary,...(story.tags||[])].join(' ').toLowerCase().includes(q);
  const lengthMatch = selectedLength === 'All' || (story.length || 'Short') === selectedLength;
  return genreMatch && queryMatch && lengthMatch;
}
function syncLengthFilters() { document.querySelectorAll('[data-length]').forEach(btn => btn.classList.toggle('active', btn.dataset.length === selectedLength)); }
function renderStoryGrid() {
  const list = stories.filter(s=>matches(s));
  document.getElementById('storyGrid').innerHTML = list.map(storyCard).join('');
  document.getElementById('emptyState').hidden = list.length > 0;
  document.getElementById('shelfLabel').textContent = `${list.length} ${list.length===1?'story':'stories'}${selectedGenre!=='All'?' · '+selectedGenre:''}${selectedLength!=='All'?' · '+selectedLength+' reads':''}`;
  syncLengthFilters();
}
function renderHomeShelves() {
  const shortStories = stories.filter(s => (s.length || 'Short') === 'Short').slice(0,4);
  const longStories = stories.filter(s => (s.length || 'Short') === 'Long').slice(0,4);
  const preferredGenres = ['Romance','Horror','Fantasy','Comedy','Sci-Fi','Mystery'];
  const categoryStories = preferredGenres.map(g => stories.find(s => s.genre === g)).filter(Boolean).slice(0,4);
  document.getElementById('shortReadsGrid').innerHTML = shortStories.map(storyCard).join('');
  document.getElementById('longReadsGrid').innerHTML = longStories.map(storyCard).join('');
  document.getElementById('categoryPicksGrid').innerHTML = categoryStories.map(storyCard).join('');
}
function renderDiscover() {
  const list = stories.filter(s=>matches(s,selectedGenre,searchQuery));
  document.getElementById('discoverGrid').innerHTML = list.map(storyCard).join('');
  document.getElementById('discoverEmpty').hidden = list.length > 0;
  document.querySelectorAll('#discoverFilters .filter-chip').forEach(btn=>btn.classList.toggle('active',btn.dataset.genre===selectedGenre));
  syncLengthFilters();
}
function renderLibrary() {
  const list = stories.filter(s=>savedIds.includes(s.id));
  document.getElementById('libraryGrid').innerHTML = list.map(storyCard).join('');
  document.getElementById('libraryEmpty').hidden = list.length > 0;
}
function renderProfile() {
  document.getElementById('profileName').textContent = profile.name || 'Reader';
  document.getElementById('profileEmail').textContent = profile.bio || (profile.email ? profile.email : 'A reader today, a storyteller tomorrow.');
  document.getElementById('profileAvatar').textContent = (profile.name || 'R').trim().charAt(0).toUpperCase();
  document.getElementById('profileSavedCount').textContent = savedIds.length;
  const owned = stories.filter(s=>s.ownerEmail && s.ownerEmail === profile.email);
  document.getElementById('profileStoryCount').textContent = owned.length;
  document.getElementById('profileStories').innerHTML = owned.map(storyCard).join('');
  document.getElementById('profileStoriesEmpty').hidden = owned.length > 0;
  let reviewCount = 0;
  stories.forEach(s => { reviewCount += (s.ratingEntries||[]).filter(r=>r.email===profile.email).length; });
  document.getElementById('profileReviewCount').textContent = reviewCount;
}
function updateFeatureSaveButton() {
  const saved = savedIds.includes('moon-between-us');
  document.getElementById('featuredSave').innerHTML = saved ? '♥ Saved to library' : '♡ Add to library';
  document.getElementById('featuredSave').classList.toggle('is-saved',saved);
}
function setView(view) {
  const ids = {home:'homeView',discover:'discoverView',library:'libraryView',profile:'profileView'};
  Object.entries(ids).forEach(([key,id])=>{ document.getElementById(id).hidden = key!==view; });
  document.querySelectorAll('[data-view]').forEach(btn=>btn.classList.toggle('active',btn.dataset.view===view));
  window.scrollTo({top:0,behavior:'smooth'});
  if (view==='discover') renderDiscover();
  if (view==='library') renderLibrary();
  if (view==='profile') renderProfile();
}
function scrollToSection(id) { document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'}); }
function openModal(id) { const el=document.getElementById(id); if (el && !el.open) el.showModal(); }
function closeModal(id) { const el=document.getElementById(id); if (el?.open) el.close(); }
function openAuth(mode) {
  authMode = mode;
  const signup = mode==='signup';
  document.getElementById('authTitle').textContent = signup ? 'Join the story.' : 'Welcome back.';
  document.getElementById('authDescription').textContent = signup ? 'Create your reader profile and keep your favourite stories close.' : 'Enter the details for the profile saved in this browser.';
  document.getElementById('authNameLabel').hidden = !signup;
  document.getElementById('authName').hidden = !signup;
  document.getElementById('authName').required = signup;
  document.getElementById('authPassword').autocomplete = signup ? 'new-password' : 'current-password';
  document.getElementById('authSubmit').textContent = signup ? 'Create account →' : 'Log in →';
  document.getElementById('authSwitch').textContent = signup ? 'Already have a profile? Log in' : 'New to Valenmondia? Create a profile';
  openModal('authModal');
}
function toggleSaved(id) {
  if (savedIds.includes(id)) { savedIds=savedIds.filter(x=>x!==id); showToast('Removed from your library.'); }
  else { savedIds.push(id); showToast('Saved to your library.'); }
  saveIds(); refreshAll();
  if (activeStoryId) renderStoryModal(activeStoryId);
}
function openStory(id) { const story=getStory(id); if (!story) return; activeStoryId=id; activeRating=0; renderStoryModal(id); openModal('storyModal'); }
function renderStoryModal(id) {
  const story=getStory(id); if (!story) return;
  const theme=themeFor(story); const saved=savedIds.includes(id);
  const coverHtml=story.coverData ? `<div class="detail-cover" style="--cover-bg:url('${story.coverData}') center/cover"><b>${escapeHTML(story.title)}</b></div>` : `<div class="detail-cover" style="--cover-bg:${theme.bg}"><b>${escapeHTML(story.coverTitle||theme.title)}<br>${escapeHTML(story.coverSubtitle||theme.em)}</b></div>`;
  const comments=(story.comments||[]).slice().reverse();
  document.getElementById('storyModalContent').innerHTML = `
    <div class="story-modal-head">${coverHtml}<div><div class="eyebrow">${escapeHTML(story.genre.toUpperCase())} · COMMUNITY STORY</div><h2>${escapeHTML(story.title)}</h2><p>By <strong>${escapeHTML(story.author||'Valenmondia Reader')}</strong></p><div class="detail-tags">${(story.tags||[story.genre]).map(t=>`<span>${escapeHTML(t)}</span>`).join('')}</div><div class="detail-action-row"><button class="btn btn-green" data-read-story="${escapeHTML(id)}">Read story →</button><button class="btn btn-outline" data-save-story="${escapeHTML(id)}">${saved?'♥ Saved':'♡ Save story'}</button></div></div></div>
    <section class="story-detail-section"><h3>About this story</h3><p>${escapeHTML(story.summary)}</p><div class="story-stats"><span>★ ${averageRating(story).toFixed(1)} average rating</span><span>${(story.comments||[]).length} comments</span><span>${Number(story.reads||0).toLocaleString()} reads</span></div></section>
    <section class="story-detail-section" id="reviewsSection"><h3>Reviews & ratings</h3><div class="review-summary"><div class="review-big">${averageRating(story).toFixed(1)}<small>out of 5</small></div><div><div class="stars" id="ratingStars" aria-label="Choose a rating">${[1,2,3,4,5].map(n=>`<button class="star-button ${activeRating>=n?'chosen':''}" data-rating="${n}" aria-label="Rate ${n} stars">★</button>`).join('')}</div><small>Tap a star to rate this story</small></div></div><div class="comment-form"><textarea id="commentInput" rows="2" placeholder="Share your thoughts or write a review…" aria-label="Write a review or comment"></textarea><button class="btn btn-green" id="postComment">Post</button></div><div class="comment-list" id="commentList">${comments.length?comments.map(c=>`<article class="comment-item"><div class="comment-head"><b>${escapeHTML(c.author||'Reader')}${c.rating?` <span style="color:#ffcb59">${'★'.repeat(c.rating)}</span>`:''}</b><time>${escapeHTML(c.date||'Just now')}</time></div><p>${escapeHTML(c.text)}</p></article>`).join(''):'<div class="no-comments">No comments yet. Be the first to start the conversation.</div>'}</div></section>`;
}
function rateStory(id, rating) {
  const story=getStory(id); if (!story) return;
  if (!profile.email) { showToast('Create a local reader profile before leaving a rating.'); closeModal('storyModal'); openAuth('signup'); return; }
  story.ratingEntries=story.ratingEntries||[];
  const existing=story.ratingEntries.find(r=>r.email===profile.email);
  if (existing) existing.value=rating; else story.ratingEntries.push({email:profile.email,value:rating});
  activeRating=rating; persistStories(); renderStoryModal(id); refreshAll(); showToast(`You rated this story ${rating} star${rating===1?'':'s'}.`);
}
function addComment(id) {
  const story=getStory(id); const field=document.getElementById('commentInput'); const content=field.value.trim();
  if (!content) { showToast('Write a comment first.'); return; }
  if (!profile.email) { showToast('Create a local reader profile before commenting.'); closeModal('storyModal'); openAuth('signup'); return; }
  story.comments=story.comments||[];
  story.comments.push({id:slugId(),author:profile.name||'Reader',email:profile.email,text:content,date:new Date().toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}),rating:activeRating||0});
  if (activeRating) { story.ratingEntries=story.ratingEntries||[]; const prior=story.ratingEntries.find(r=>r.email===profile.email); if(prior)prior.value=activeRating;else story.ratingEntries.push({email:profile.email,value:activeRating}); }
  persistStories(); renderStoryModal(id); refreshAll(); showToast('Your comment has been added on this browser.');
}
function openReader(id) {
  const story=getStory(id); if (!story) return;
  document.getElementById('readerTitle').textContent=story.title;
  document.getElementById('readerMeta').textContent=`By ${story.author||'Valenmondia Reader'} · Chapter 1 · ${story.genre} · ${story.length||'Short'} read · ${Number(story.chapterCount||1)} planned chapters`;
  const demoOpenings={Horror:'A sound came from the one place the character had promised not to look. The room felt smaller, and the next choice would uncover another part of the mystery.',Comedy:'The plan seemed perfectly reasonable when it was made. Before the day was over, a simple misunderstanding had become the funniest disaster anyone in the room had witnessed.',Romance:'For a moment, all the small details became important: a familiar smile, a half-finished sentence, and the hope that neither person would leave just yet.','Sci-Fi':'A new signal appeared on the display. Its pattern matched a record that should not exist, and the crew had only one chance to respond.', 'Rom-Com':'The timing was dreadful, the excuse was even worse, and the smile gave away what neither person was ready to say.',Fantasy:'A faint light appeared where the map promised there was nothing. The choice made before sunrise would change the road ahead.',Mystery:'One detail did not fit the official explanation. Looking closer revealed a clue that everyone else had overlooked.',Adventure:'They checked the map one final time and crossed the line nobody had dared to cross. Beyond it, the trail led into unfamiliar country.',Drama:'No one spoke for a while. The truth had arrived quietly, bringing memories and a decision that could no longer be postponed.',Poetry:'Outside, the world kept moving. Inside, one small moment stayed still long enough to be understood.', 'Slice of Life':'Someone offered a chair and a warm drink. Nothing was solved at once, but nobody had to face the day alone.',Other:'An ordinary envelope arrived with an unexpected clue. The day had begun normally, but the next choice promised something new.'};
  document.getElementById('readerText').textContent=story.body||`Chapter 1 — ${story.title}\n\n${story.summary}\n\n${demoOpenings[story.genre]||demoOpenings.Other}${story.length==='Long'?`\n\nDemo preview: this long-read concept is planned for ${Number(story.chapterCount||8)} chapters; only the sample opening is included.`:''}`;
  document.getElementById('readerDiscuss').dataset.discussStory=id;
  story.reads=Number(story.reads||0)+1;
  persistStories();
  closeModal('storyModal'); openModal('readerModal');
}
async function makeCoverData(file) {
  if (!file) return '';
  if (file.size > 1024*1024) throw new Error('Please choose a cover image under 1 MB for this prototype.');
  return await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('Could not read that image.'));reader.readAsDataURL(file);});
}

// Global interactions: delegated for cards regenerated during rendering.
document.addEventListener('click', event => {
  const viewBtn=event.target.closest('[data-view]'); if(viewBtn){setView(viewBtn.dataset.view);return;}
  const scroller=event.target.closest('[data-scroll]'); if(scroller){scrollToSection(scroller.dataset.scroll);return;}
  const openBtn=event.target.closest('[data-open-story]'); if(openBtn){openStory(openBtn.dataset.openStory);return;}
  const saveBtn=event.target.closest('[data-save-story]'); if(saveBtn){toggleSaved(saveBtn.dataset.saveStory);return;}
  const closeBtn=event.target.closest('[data-close]'); if(closeBtn){closeModal(closeBtn.dataset.close);return;}
  const readBtn=event.target.closest('[data-read-story]'); if(readBtn){openReader(readBtn.dataset.readStory);return;}
  const ratingBtn=event.target.closest('[data-rating]'); if(ratingBtn && activeStoryId){rateStory(activeStoryId,Number(ratingBtn.dataset.rating));return;}
  const lengthBtn=event.target.closest('[data-length]'); if(lengthBtn){selectedLength=lengthBtn.dataset.length;renderStoryGrid();renderDiscover();return;}
  const genreBtn=event.target.closest('[data-genre]'); if(genreBtn){selectedGenre=genreBtn.dataset.genre; document.querySelectorAll('[data-genre]').forEach(b=>b.classList.toggle('selected',b.classList.contains('genre-card')&&b.dataset.genre===selectedGenre)); renderStoryGrid();renderDiscover();setView('discover');return;}
});
document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click',()=>closeModal(btn.dataset.close)));
document.getElementById('loginButton').addEventListener('click',()=>openAuth('login'));
document.getElementById('signupButton').addEventListener('click',()=>openAuth('signup'));
document.getElementById('authSwitch').addEventListener('click',()=>openAuth(authMode==='signup'?'login':'signup'));
document.getElementById('authForm').addEventListener('submit',event=>{
  event.preventDefault(); const email=document.getElementById('authEmail').value.trim().toLowerCase(); const password=document.getElementById('authPassword').value;
  if(password.length<8){showToast('Password must have at least 8 characters.');return;}
  if(authMode==='signup'){
    const name=document.getElementById('authName').value.trim(); if(!name){showToast('Please enter your name.');return;}
    profile={...profile,name,email,bio:profile.bio||'A reader today, a storyteller tomorrow.',loggedIn:true};
    writeStorage(STORAGE_KEYS.profile,profile); closeModal('authModal'); refreshAll(); setView('profile'); showToast(`Welcome to VALENMONDIA, ${name}! This is a local demo profile.`);
  }else{
    if(profile.email!==email){showToast('No saved local profile matches that email. Try creating a profile.');return;}
    profile.loggedIn=true; writeStorage(STORAGE_KEYS.profile,profile); closeModal('authModal'); refreshAll(); setView('profile'); showToast(`Welcome back, ${profile.name}!`);
  }
  document.getElementById('authForm').reset();
});
function openUpload() {
  if(!profile.email){showToast('Create a reader profile before publishing a story.');openAuth('signup');return;}
  document.getElementById('uploadForm').reset();openModal('uploadModal');
}
['uploadOpen','bannerUpload','profileUpload','footerUpload'].forEach(id=>document.getElementById(id).addEventListener('click',openUpload));
document.getElementById('uploadForm').addEventListener('submit',async event=>{
  event.preventDefault();
  const title=document.getElementById('storyTitleInput').value.trim(); const genre=safeGenre(document.getElementById('storyGenreInput').value); const summary=document.getElementById('storySummaryInput').value.trim(); const body=document.getElementById('storyBodyInput').value.trim(); const file=document.getElementById('storyCoverInput').files[0];
  if(!title||!summary||!body){showToast('Please complete the title, summary, and first chapter.');return;}
  let coverData='';try{coverData=await makeCoverData(file);}catch(error){showToast(error.message);return;}
  const length=document.getElementById('storyLengthInput').value; let chapterCount=Number(document.getElementById('storyChapterCountInput').value); chapterCount=length==='Short'?Math.min(chapterCount,3):Math.max(chapterCount,5);
  const newStory={id:slugId(),title,genre,tags:[genre],author:profile.name||'Valenmondia Reader',ownerEmail:profile.email,summary,body,cover:coverData?'custom':(genre==='Horror'?'horror':genre==='Comedy'||genre==='Rom-Com'?'comedy':genre==='Romance'?'romance':genre==='Sci-Fi'?'scifi':genre==='Mystery'?'horror':genre==='Adventure'||genre==='Poetry'?'scifi':'fantasy'),coverData,mark:genre==='Horror'?'☠':genre==='Romance'?'♡':'✦',length,chapterCount,rating:0,reviews:0,reads:0,comments:[],ratingEntries:[],createdAt:Date.now()};
  stories.unshift(newStory); if(!persistStories()){stories=stories.filter(s=>s.id!==newStory.id);return;} closeModal('uploadModal');refreshAll();setView('profile');showToast('Your story was published in this browser prototype!');
});
document.querySelectorAll('[data-length-jump]').forEach(button=>button.addEventListener('click',()=>{
  selectedGenre='All'; selectedLength=button.dataset.lengthJump; searchQuery='';
  document.getElementById('searchInput').value='';
  renderDiscover(); setView('discover');
}));
document.getElementById('featuredRead').addEventListener('click',()=>openStory('moon-between-us'));
document.getElementById('featuredSave').addEventListener('click',()=>toggleSaved('moon-between-us'));
document.getElementById('storyPrev').addEventListener('click',()=>{const track=document.getElementById('miniStoryTrack');track.scrollBy({left:-200,behavior:'smooth'});});
document.getElementById('storyNext').addEventListener('click',()=>{const track=document.getElementById('miniStoryTrack');track.scrollBy({left:200,behavior:'smooth'});});
document.getElementById('centralClick').addEventListener('click',()=>{setView('discover');showToast('Choose a world. Start a story.');});
document.getElementById('searchInput').addEventListener('input',event=>{searchQuery=event.target.value;renderStoryGrid();renderDiscover();if(searchQuery.trim())setView('discover');});
document.getElementById('clearFilters').addEventListener('click',()=>{selectedGenre='All';selectedLength='All';searchQuery='';document.getElementById('searchInput').value='';renderStoryGrid();renderDiscover();});
document.getElementById('postComment').addEventListener('click',()=>{if(activeStoryId)addComment(activeStoryId);});
document.getElementById('readerDiscuss').addEventListener('click',()=>{const id=document.getElementById('readerDiscuss').dataset.discussStory;closeModal('readerModal');openStory(id);setTimeout(()=>document.getElementById('reviewsSection')?.scrollIntoView({behavior:'smooth',block:'start'}),80);});
document.getElementById('editProfile').addEventListener('click',()=>{document.getElementById('profileNameInput').value=profile.name||'Reader';document.getElementById('profileBioInput').value=profile.bio||'';openModal('editProfileModal');});
document.getElementById('profileForm').addEventListener('submit',event=>{event.preventDefault();profile.name=document.getElementById('profileNameInput').value.trim()||'Reader';profile.bio=document.getElementById('profileBioInput').value.trim();writeStorage(STORAGE_KEYS.profile,profile);closeModal('editProfileModal');refreshAll();showToast('Profile updated on this browser.');});
document.addEventListener('keydown',event=>{if(event.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){event.preventDefault();document.getElementById('searchInput').focus();}if(event.key==='Escape'){document.querySelectorAll('dialog[open]').forEach(d=>d.close());}});

// Ensure every seeded story has independent comment/rating arrays without mutating the templates.
stories = stories.map(s=>({...s,comments:Array.isArray(s.comments)?s.comments:[],ratingEntries:Array.isArray(s.ratingEntries)?s.ratingEntries:[]}));
refreshAll();

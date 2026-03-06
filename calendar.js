
const calendarGrid = document.getElementById('calendarGrid');
const monthLabel = document.getElementById('monthLabel');
const prevPeriod = document.getElementById('prevPeriod');
const nextPeriod = document.getElementById('nextPeriod');
const monthViewBtn = document.getElementById('monthViewBtn');
const weekViewBtn = document.getElementById('weekViewBtn');
const eventFilter = document.getElementById('eventFilter');
const modal = document.getElementById('eventModal');
const modalBackdrop = document.getElementById('eventModalBackdrop');
const closeModalBtn = document.getElementById('closeModal');

let currentDate = new Date(2026, 2, 1);
let currentView = 'month';
let events = {};

async function loadEvents() {
  try {
    const response = await fetch('events.json');
    events = await response.json();
  } catch (e) {
    console.error('Failed to load events.json', e);
    events = {};
  }
  renderCalendar();
}

function formatKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function getFilteredItems(key) {
  const selected = eventFilter.value;
  const items = events[key] || [];
  if (selected === 'all') return items;
  return items.filter(item => item.category === selected);
}

function clearCalendar() {
  calendarGrid.innerHTML = '';
}

function renderWeekdayHeaders() {
  ['MON','TUE','WED','THU','FRI','SAT','SUN'].forEach(day => {
    const el = document.createElement('div');
    el.className = 'weekday';
    el.textContent = day;
    calendarGrid.appendChild(el);
  });
}

function openModal(item, dateObj) {
  document.getElementById('modalCategory').textContent = item.category || 'Event';
  document.getElementById('modalTitle').textContent = item.title || 'Event';
  document.getElementById('modalDate').textContent = formatDisplayDate(dateObj);
  document.getElementById('modalTime').textContent = item.time || 'TBA';
  document.getElementById('modalLocation').textContent = item.location || 'TBA';
  document.getElementById('modalLeader').textContent = item.leader || 'TBA';
  document.getElementById('modalNotes').textContent = item.notes || 'No notes provided.';
  modal.classList.remove('hidden');
  modalBackdrop.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.classList.add('hidden');
  modalBackdrop.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function addEvents(listEl, items, dateObj, maxVisible = 3) {
  const visibleItems = items.slice(0, maxVisible);
  visibleItems.forEach(item => {
    const eventBtn = document.createElement('button');
    eventBtn.className = 'event';
    eventBtn.type = 'button';
    eventBtn.innerHTML = `<span class="dot ${item.color || 'blue'}"></span><span class="event-text">${item.time ? `${item.time} ` : ''}${item.title}</span>`;
    eventBtn.addEventListener('click', () => openModal(item, dateObj));
    listEl.appendChild(eventBtn);
  });
  if (items.length > maxVisible) {
    const more = document.createElement('div');
    more.className = 'day-more';
    more.textContent = `+${items.length - maxVisible} more`;
    listEl.appendChild(more);
  }
}

function renderMonthView() {
  monthLabel.textContent = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  renderWeekdayHeaders();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - startOffset);
  const todayKey = formatKey(new Date());

  for (let i = 0; i < 42; i++) {
    const dayDate = new Date(gridStart);
    dayDate.setDate(gridStart.getDate() + i);
    const key = formatKey(dayDate);
    const items = getFilteredItems(key);
    const outside = dayDate.getMonth() !== month;
    const isToday = key === todayKey;

    const cell = document.createElement('div');
    cell.className = `day${outside ? ' outside' : ''}${isToday ? ' today' : ''}`;
    const dateLabel = document.createElement('div');
    dateLabel.className = 'date-label';
    dateLabel.textContent = dayDate.getDate();
    cell.appendChild(dateLabel);
    const list = document.createElement('div');
    list.className = 'events';
    addEvents(list, items, dayDate, 3);
    cell.appendChild(list);
    calendarGrid.appendChild(cell);
  }
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d;
}

function renderWeekView() {
  const start = startOfWeek(currentDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  monthLabel.textContent = `${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  renderWeekdayHeaders();
  const todayKey = formatKey(new Date());

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + i);
    const key = formatKey(dayDate);
    const items = getFilteredItems(key);
    const isToday = key === todayKey;
    const cell = document.createElement('div');
    cell.className = `week-day${isToday ? ' today' : ''}`;
    const dateLabel = document.createElement('div');
    dateLabel.className = 'date-label';
    dateLabel.textContent = dayDate.getDate();
    const subtitle = document.createElement('div');
    subtitle.className = 'date-subtitle';
    subtitle.textContent = dayDate.toLocaleDateString('en-US', { month: 'short' });
    cell.appendChild(dateLabel);
    cell.appendChild(subtitle);
    const list = document.createElement('div');
    list.className = 'events';
    addEvents(list, items, dayDate, 8);
    cell.appendChild(list);
    calendarGrid.appendChild(cell);
  }
}

function renderCalendar() {
  calendarGrid.style.opacity = '0';
  clearCalendar();
  if (currentView === 'month') renderMonthView();
  else renderWeekView();
  requestAnimationFrame(() => { calendarGrid.style.opacity = '1'; });
}

prevPeriod.addEventListener('click', () => {
  if (currentView === 'month') currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  else currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
  renderCalendar();
});
nextPeriod.addEventListener('click', () => {
  if (currentView === 'month') currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  else currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);
  renderCalendar();
});
monthViewBtn.addEventListener('click', () => {
  currentView = 'month';
  monthViewBtn.classList.add('active');
  weekViewBtn.classList.remove('active');
  renderCalendar();
});
weekViewBtn.addEventListener('click', () => {
  currentView = 'week';
  weekViewBtn.classList.add('active');
  monthViewBtn.classList.remove('active');
  renderCalendar();
});
eventFilter.addEventListener('change', renderCalendar);
closeModalBtn.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

loadEvents();

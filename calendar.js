const calendarGrid = document.getElementById('calendarGrid');
const monthLabel = document.getElementById('monthLabel');
const prevPeriod = document.getElementById('prevPeriod');
const nextPeriod = document.getElementById('nextPeriod');
const eventFilter = document.getElementById('eventFilter');
const monthViewBtn = document.getElementById('monthViewBtn');
const weekViewBtn = document.getElementById('weekViewBtn');
const modal = document.getElementById('eventModal');
const modalBackdrop = document.getElementById('eventModalBackdrop');
const closeModalBtn = document.getElementById('closeModal');

const weekdayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
let currentDate = new Date();
currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
let currentView = 'month';
let selectedFilter = 'all';
let events = {};

function formatKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getTodayKey() {
  return formatKey(new Date());
}

function normalizeData(data) {
  return data && typeof data === 'object' ? data : {};
}

async function loadEvents() {
  try {
    const response = await fetch('events.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to load events.json');
    events = normalizeData(await response.json());
  } catch (error) {
    console.error(error);
    events = {};
  }
  renderCalendar();
}

function getFilteredItems(dateKey) {
  const items = Array.isArray(events[dateKey]) ? events[dateKey] : [];
  if (selectedFilter === 'all') return items;
  return items.filter((item) => item.category === selectedFilter);
}

function createWeekdayHeaders() {
  weekdayLabels.forEach((label) => {
    const el = document.createElement('div');
    el.className = 'weekday';
    el.textContent = label;
    calendarGrid.appendChild(el);
  });
}

function fadeGrid(callback) {
  calendarGrid.style.opacity = 0;
  window.setTimeout(() => {
    callback();
    calendarGrid.style.opacity = 1;
  }, 80);
}

function openModal(item, dateKey) {
  document.getElementById('modalCategory').textContent = item.category ? item.category.toUpperCase() : 'EVENT';
  document.getElementById('modalTitle').textContent = item.title || 'Untitled Event';
  document.getElementById('modalDate').textContent = formatDisplayDate(new Date(`${dateKey}T12:00:00`));
  document.getElementById('modalTime').textContent = item.time || 'TBA';
  document.getElementById('modalLocation').textContent = item.location || 'TBA';
  document.getElementById('modalLeader').textContent = item.leader || 'TBA';
  document.getElementById('modalNotes').textContent = item.notes || 'No additional notes.';
  modal.classList.remove('hidden');
  modalBackdrop.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.classList.add('hidden');
  modalBackdrop.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function buildEventButton(item, dateKey) {
  const event = document.createElement('button');
  event.className = 'event';
  event.type = 'button';
  event.innerHTML = `
    <span class="dot ${item.color || 'blue'}"></span>
    <span class="event-text">${item.time ? `${item.time} ` : ''}${item.title || ''}</span>
  `;
  event.addEventListener('click', () => openModal(item, dateKey));
  return event;
}

function renderMonthView() {
  monthLabel.textContent = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  calendarGrid.innerHTML = '';
  createWeekdayHeaders();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - startOffset);
  const todayKey = getTodayKey();

  for (let i = 0; i < 42; i += 1) {
    const dayDate = new Date(gridStart);
    dayDate.setDate(gridStart.getDate() + i);
    const key = formatKey(dayDate);
    const items = getFilteredItems(key);
    const outside = dayDate.getMonth() !== month;
    const isTodayBubble = key === todayKey;

    const cell = document.createElement('div');
    cell.className = `day${outside ? ' outside' : ''}${isTodayBubble ? ' today' : ''}`;

    const dateLabel = document.createElement('div');
    dateLabel.className = 'date-label';
    dateLabel.textContent = dayDate.getDate();
    cell.appendChild(dateLabel);

    const list = document.createElement('div');
    list.className = 'events';

    items.slice(0, 3).forEach((item) => {
      if (!item.title) return;
      list.appendChild(buildEventButton(item, key));
    });

    if (items.length > 3) {
      const more = document.createElement('div');
      more.className = 'day-more';
      more.textContent = `+${items.length - 3} more`;
      list.appendChild(more);
    }

    cell.appendChild(list);
    calendarGrid.appendChild(cell);
  }
}

function getWeekStart(date) {
  const source = new Date(date);
  const start = new Date(source);
  const day = (source.getDay() + 6) % 7;
  start.setDate(source.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return start;
}

function renderWeekView() {
  const weekStart = getWeekStart(currentDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  monthLabel.textContent = `${weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – ${weekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  calendarGrid.innerHTML = '';
  createWeekdayHeaders();

  const todayKey = getTodayKey();

  for (let i = 0; i < 7; i += 1) {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + i);
    const key = formatKey(dayDate);
    const items = getFilteredItems(key);
    const isTodayBubble = key === todayKey;

    const cell = document.createElement('div');
    cell.className = `week-day${isTodayBubble ? ' today' : ''}`;

    const dateLabel = document.createElement('div');
    dateLabel.className = 'date-label';
    dateLabel.textContent = dayDate.getDate();
    cell.appendChild(dateLabel);

    const subtitle = document.createElement('div');
    subtitle.className = 'date-subtitle';
    subtitle.textContent = dayDate.toLocaleDateString('en-US', { month: 'short' });
    cell.appendChild(subtitle);

    const list = document.createElement('div');
    list.className = 'events';

    if (items.length) {
      items.forEach((item) => {
        if (!item.title) return;
        list.appendChild(buildEventButton(item, key));
      });
    } else {
      const empty = document.createElement('div');
      empty.className = 'day-more';
      empty.textContent = 'No events';
      list.appendChild(empty);
    }

    cell.appendChild(list);
    calendarGrid.appendChild(cell);
  }
}

function renderCalendar() {
  if (currentView === 'month') {
    renderMonthView();
  } else {
    renderWeekView();
  }
}

function changePeriod(direction) {
  if (currentView === 'month') {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1);
  } else {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (direction * 7));
  }
  fadeGrid(renderCalendar);
}

prevPeriod.addEventListener('click', () => changePeriod(-1));
nextPeriod.addEventListener('click', () => changePeriod(1));

eventFilter.addEventListener('change', (event) => {
  selectedFilter = event.target.value;
  fadeGrid(renderCalendar);
});

monthViewBtn.addEventListener('click', () => {
  currentView = 'month';
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  monthViewBtn.classList.add('active');
  weekViewBtn.classList.remove('active');
  fadeGrid(renderCalendar);
});

weekViewBtn.addEventListener('click', () => {
  currentView = 'week';
  weekViewBtn.classList.add('active');
  monthViewBtn.classList.remove('active');
  fadeGrid(renderCalendar);
});

closeModalBtn.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

loadEvents();

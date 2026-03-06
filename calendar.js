const calendarGrid = document.getElementById('calendarGrid');
const monthLabel = document.getElementById('monthLabel');
const prevMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth');

let currentDate = new Date(2026, 2, 1); // March 2026

const events = {
  '2026-02-26': [{ time: '16:59', title: 'Platoon Report Due Date', color: 'purple' }],
  '2026-02-28': [
    { time: '09:00', title: 'Promotion Board', color: 'yellow' },
    { time: '14:00', title: 'Squad Drills', color: 'green' }
  ],
  '2026-03-01': [{ time: '14:00', title: 'Field Training Exercise (FTX)', color: 'red' }],
  '2026-03-06': [{ time: '', title: '', color: '' }],
  '2026-03-07': [{ time: '14:00', title: 'Squad Drills', color: 'green' }],
  '2026-03-08': [
    { time: '10:00', title: 'FG Q2 Meeting', color: 'yellow' },
    { time: '12:00', title: 'Unit Award Ceremony', color: 'blue' },
    { time: '14:00', title: 'Field Training Exercise (FTX)', color: 'red' }
  ],
  '2026-03-14': [
    { time: '10:00', title: 'Warrior Leadership Course 26-01', color: 'yellow' },
    { time: '14:00', title: 'Squad Drills', color: 'green' }
  ],
  '2026-03-15': [{ time: '14:00', title: 'Field Training Exercise (FTX)', color: 'red' }],
  '2026-03-21': [
    { time: '12:00', title: 'NCO Meeting', color: 'yellow' },
    { time: '14:00', title: 'Squad Drills', color: 'green' }
  ],
  '2026-03-22': [{ time: '14:00', title: 'Field Training Exercise (FTX)', color: 'red' }],
  '2026-03-26': [{ time: '17:59', title: 'Platoon Report Due Date', color: 'purple' }],
  '2026-03-28': [
    { time: '10:00', title: 'Promotion Board', color: 'yellow' },
    { time: '14:00', title: 'Squad Drills', color: 'green' }
  ],
  '2026-03-29': [{ time: '14:00', title: 'Field Training Exercise (FTX)', color: 'red' }],
  '2026-04-04': [{ time: '14:00', title: 'Squad Drills', color: 'green' }],
  '2026-04-05': [
    { time: '12:00', title: 'Unit Award Ceremony', color: 'blue' },
    { time: '14:00', title: 'Field Training Exercise (FTX)', color: 'red' }
  ]
};

function formatKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function renderCalendar(date) {
  monthLabel.textContent = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  calendarGrid.querySelectorAll('.day').forEach(el => el.remove());

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday first
  const gridStart = new Date(year, month, 1 - startOffset);

  for (let i = 0; i < 42; i++) {
    const dayDate = new Date(gridStart);
    dayDate.setDate(gridStart.getDate() + i);
    const key = formatKey(dayDate);
    const items = events[key] || [];
    const outside = dayDate.getMonth() !== month;
    const isTodayBubble = key === '2026-03-06';

    const cell = document.createElement('div');
    cell.className = `day${outside ? ' outside' : ''}${isTodayBubble ? ' today' : ''}`;

    const dateLabel = document.createElement('div');
    dateLabel.className = 'date-label';
    dateLabel.textContent = dayDate.getDate();
    cell.appendChild(dateLabel);

    const list = document.createElement('div');
    list.className = 'events';

    items.forEach(item => {
      if (!item.title) return;
      const event = document.createElement('div');
      event.className = 'event';
      event.innerHTML = `
        <span class="dot ${item.color}"></span>
        <span>${item.time ? `${item.time} ` : ''}${item.title}</span>
      `;
      list.appendChild(event);
    });

    cell.appendChild(list);
    calendarGrid.appendChild(cell);
  }
}

prevMonth.addEventListener('click', () => {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  renderCalendar(currentDate);
});

nextMonth.addEventListener('click', () => {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  renderCalendar(currentDate);
});

renderCalendar(currentDate);

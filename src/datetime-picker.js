import './styles.css';

export function openPicker(event) {
  const picker = document.getElementById('datetime-picker');
  picker.classList.remove('hidden');
  event.target.setAttribute('aria-expanded', 'true');
}

export function closePicker() {
  const picker = document.getElementById('datetime-picker');
  picker.classList.add('hidden');
}

export function setDateTime(dateTime) {
  const input = document.querySelector('[data-datetime-input]');
  input.value = dateTime;
  closePicker();
}

export function renderCalendar() {
  const calendar = document.getElementById('calendar');
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  let firstDay = new Date(currentYear, currentMonth, 1);
  let lastDay = new Date(currentYear, currentMonth + 1, 0);
  
  const daysInMonth = lastDay.getDate();
  const calendarRows = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDay = new Date(currentYear, currentMonth, day);
    const formattedDate = `${currentYear}-${currentMonth + 1}-${day}`;
    
    calendarRows.push(`
      <button type="button" class="text-sm p-2" onclick="setDateTime('${formattedDate}')">
        ${day}
      </button>
    `);
  }
  
  calendar.innerHTML = calendarRows.join('');
}

export function initYearMonthInput() {
  const input = document.getElementById('year-month-input');
  input.value = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
}

export function renderTimeOptions() {
  const timeSelector = document.getElementById('time-selector');
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = ['00', '15', '30', '45'];

  const timeOptions = hours.map(hour => {
    return minutes.map(minute => {
      const time = `${hour}:${minute}`;
      return `<button type="button" class="p-2" onclick="setDateTime('${time}')">${time}</button>`;
    }).join('');
  }).join('');

  timeSelector.innerHTML = timeOptions;
}



import DateTimePicker from 'big-datetime-picker';

const picker = new DateTimePicker({
  element: '#my-datepicker',
  format: 'YYYY-MM-DD HH:mm',
});

picker.init();

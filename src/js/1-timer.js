import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputRef = document.querySelector('#datetime-picker');

const buttonStartRef = document.querySelector('[data-start]');
buttonStartRef.disabled = true;

const daysRef = document.querySelector('[data-days]');
const hoursRef = document.querySelector('[data-hours]');
const minutesRef = document.querySelector('[data-minutes]');
const secondsRef = document.querySelector('[data-seconds]');

let userSelectedDate = 0;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    valideDate(selectedDates[0]);
  },
};
flatpickr('#datetime-picker', options);
function valideDate(selectedDate) {
  const currentDate = Date.now();

  if (selectedDate < currentDate) {
    buttonStartRef.disabled = true;
    return iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      position: 'topRight',
      color: 'red',
    });
  } else {
    userSelectedDate = selectedDate;
    buttonStartRef.disabled = false;
  }
}

buttonStartRef.addEventListener('click', () => {
  const intervalId = setInterval(() => {
    const currentTime = Date.now();
    const diff = userSelectedDate - currentTime;
    const time = convertMs(diff);

    daysRef.textContent = time.days.toString().padStart(2, '0');
    hoursRef.textContent = time.hours.toString().padStart(2, '0');
    minutesRef.textContent = time.minutes.toString().padStart(2, '0');
    secondsRef.textContent = time.seconds.toString().padStart(2, '0');

    inputRef.disabled = true;
    buttonStartRef.disabled = true;

    if (diff < 1000) clearInterval(intervalId);
  }, 1000);
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

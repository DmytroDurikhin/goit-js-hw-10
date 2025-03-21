

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css"; 
// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

const refs = {
    input: document.querySelector("#datetime-picker"),
    btn: document.querySelector("[data-start]"),
    days: document.querySelector("[data-days]"),
  hours: document.querySelector("[data-hours]"),
  minutes: document.querySelector("[data-minutes]"),
  seconds: document.querySelector("[data-seconds]"),
};

// Timer

refs.btn.disabled = true;
let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  altInput: true,
  altFormat: "F j, Y",
  dateFormat: "Y-m-d",
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    
    if (selectedDate < new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        // position: 'topRight',
      });
      refs.btn.disabled = true; 
      return;
    }

    
    refs.btn.disabled = false;
    userSelectedDate = selectedDate; 
  },
};


flatpickr(refs.input, options);


refs.btn.addEventListener("click", onClick);

function onClick() {
  refs.btn.disabled = true;
  refs.input.disabled = true; 

  const timerId = setInterval(() => {
    const diff = userSelectedDate - Date.now(); 
    if (diff <= 0) {
      clearInterval(timerId); 
      updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(diff);
    updateTimer({ days, hours, minutes, seconds });
  }, 1000); 
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimer({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

// function addLeadingZero(value) {
//   return String(value).padStart(2, '0');
// }

function addLeadingZero(value) {
  if (value < 10) {
    return "0" + value;
  } else {
    return String(value);
  }
}
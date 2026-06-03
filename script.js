const timeZone = "Asia/Taipei";
const digitCards = Array.from(document.querySelectorAll(".digit-card"));
const clockTime = document.querySelector("#clock-time");
const rocDate = document.querySelector("#roc-date");
const westernDate = document.querySelector("#western-date");
const weekdayFormatter = new Intl.DateTimeFormat("zh-TW", {
  timeZone,
  weekday: "long",
});

let lastDigits = "";

function getTaipeiParts(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    hourCycle: "h23",
  }).formatToParts(date);

  return Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
}

function updateClock() {
  const now = new Date();
  const parts = getTaipeiParts(now);
  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);
  const rocYear = year - 1911;
  const weekday = weekdayFormatter.format(now);
  const digits = `${parts.hour}${parts.minute}${parts.second}`;
  const machineTime = `${parts.hour}:${parts.minute}:${parts.second}`;

  digitCards.forEach((card, index) => {
    const nextDigit = digits[index];

    if (card.textContent !== nextDigit) {
      card.textContent = nextDigit;
      card.classList.remove("is-changing");
      void card.offsetWidth;
      card.classList.add("is-changing");
    }
  });

  if (digits !== lastDigits) {
    clockTime.setAttribute("datetime", machineTime);
    clockTime.setAttribute("aria-label", `目前台北時間 ${machineTime}`);
    lastDigits = digits;
  }

  rocDate.textContent = `中華民國 ${rocYear} 年 ${month} 月 ${day} 日 ${weekday}`;
  westernDate.textContent = `西元 ${year} 年 ${month} 月 ${day} 日 ${weekday} · 24 小時制`;
}

updateClock();
setInterval(updateClock, 250);

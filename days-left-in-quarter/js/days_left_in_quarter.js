function updateCountdown() {
  var now = new Date();
  var quarterEnd = new Date(
    now.getFullYear(),
    Math.floor(now.getMonth() / 3) * 3 + 3,
    0
  );
  var now = new Date().getTime();
  const difference = quarterEnd - now;

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
  const seconds = Math.floor((difference % (1000 * 60)) / 1000).toString().padStart(2, '0');
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = quarterEnd.toLocaleDateString("en-US", options);

  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = minutes;
  document.getElementById("seconds").innerText = seconds;
  document.getElementById("eventDate").innerText = formattedDate;
}

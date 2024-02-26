function updateTime(show_weekday) {
    const now = new Date();
    const date = {
        month: 'long', // "November"
        day: 'numeric', // "19"
        year: 'numeric' // "2023"
    };

    if (show_weekday == true) {
        date.weekday = 'long'; // "Monday"
    }

    const dayOfWeek = {
        weekday: 'long', // "Monday"
    };
    const time = {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true // Use 12-hour format
    };

    // Use toLocaleDateString for the day of the week part
    const dayOfWeekString = now.toLocaleDateString('en-US', dayOfWeek);

    // Use toLocaleDateString for the date part
    const dateString = now.toLocaleDateString('en-US', date);

    // Use toLocaleTimeString for the time part, specifying 12-hour format
    const timeString = now.toLocaleTimeString('en-US', time);

    // Update the DOM elements
    document.querySelectorAll('#dayofweek').forEach(function(date) {
        date.innerText = dayOfWeekString;
    });
    document.querySelectorAll('#date').forEach(function(date) {
        date.innerText = dateString;
    });
    document.querySelectorAll('#time').forEach(function(time) {
        time.innerText = timeString;
    });

    // Schedule the next update
    setTimeout(function() {
        updateTime(show_weekday)
    }, 100);
}


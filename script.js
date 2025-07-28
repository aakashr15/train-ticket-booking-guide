function calculateBookingDate() {
    const journeyInput = document.getElementById('journeyDate').value;
    const resultDiv = document.getElementById('result');

    if (!journeyInput) {
        resultDiv.textContent = 'Please select a journey date.';
        return;
    }

    const journeyDate = new Date(journeyInput);
    const bookingOpenDate = new Date(journeyDate);
    bookingOpenDate.setDate(journeyDate.getDate() - 60); // ARP = 60 days

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight for comparison

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Add one day to today

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = bookingOpenDate.toLocaleDateString(undefined, options);

    if (bookingOpenDate.toDateString() === today.toDateString()) {
        resultDiv.textContent = `Booking opens today (${formattedDate})`;
        resultDiv.style.color = 'green';
    } else if (bookingOpenDate.toDateString() === tomorrow.toDateString()) { // Tomorrow
        resultDiv.textContent = `Booking opens tomorrow (${formattedDate})`;
        resultDiv.style.color = 'blue';
    } else if (bookingOpenDate < today) {
        resultDiv.textContent = `You missed it! Booking opened on ${formattedDate}`;
        resultDiv.style.color = 'red';
    } else {
        resultDiv.textContent = `Booking opens on: ${formattedDate}`;
        resultDiv.style.color = 'green';
    }
}

function populateBookingTable() {
    const tableBody = document.getElementById('bookingTableBody');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dayOptions = { weekday: 'long' };

    let rows = '';

    for (let i = 0; i < 5; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        const bookingDate = new Date(currentDate);
        bookingDate.setDate(currentDate.getDate() + 60); // Add 60 days to the current date

        const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : currentDate.toLocaleDateString(undefined, dayOptions);

        rows += `<tr><td>${label}</td><td>${bookingDate.toLocaleDateString(undefined, options)} (${bookingDate.toLocaleDateString(undefined, dayOptions)})</td></tr>`;
    }

    tableBody.innerHTML = rows;
}

// Call the function to populate the table on page load
populateBookingTable();

function setReminder() {
    const searchDateInput = document.getElementById('searchDate').value;
    const reminderMessage = document.getElementById('reminderMessage');

    if (!searchDateInput) {
        displayMessage(reminderMessage, 'Please enter a booking opening date.', 'red');
        return;
    }

    const searchDate = new Date(searchDateInput);
    const reminderDate = new Date(searchDate);
    reminderDate.setDate(searchDate.getDate() - 1); // Set reminder for a day before

    if (reminderDate < new Date()) {
        displayMessage(reminderMessage, 'The reminder date has already passed.', 'red');
        return;
    }

    displayMessage(reminderMessage, `Reminder set for ${formatDate(reminderDate)}.`, 'green');

    // Example: Using Notification API (requires user permission)
    scheduleNotification(reminderDate, searchDate);
}

function displayMessage(element, message, color) {
    element.textContent = message;
    element.style.color = color;
}

function formatDate(date) {
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function scheduleNotification(reminderDate, searchDate) {
    const timeUntilReminder = reminderDate.getTime() - new Date().getTime();

    if (Notification.permission === 'granted') {
        setTimeout(() => {
            new Notification('Reminder', {
                body: `Booking opens tomorrow (${formatDate(searchDate)}).`,
            });
        }, timeUntilReminder);
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                setTimeout(() => {
                    new Notification('Reminder', {
                        body: `Booking opens tomorrow (${formatDate(searchDate)}).`,
                    });
                }, timeUntilReminder);
            }
        });
    }
}

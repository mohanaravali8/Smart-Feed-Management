// LOGIN FUNCTION

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('message').innerText = 'Invalid Login';
    }
}
// REGISTER FUNCTION

async function register() {

    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    const response = await fetch('/register', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            username,
            password
        })

    });

    const data = await response.json();

    const message = document.getElementById('registerMessage');

    if (data.success) {

        message.innerText = 'Registration Successful';

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

    } else {

        message.innerText = 'Registration Failed';

    }

}

// SAVE FEED DATA

async function saveFeedData() {
    const fish_type = document.getElementById('fishType').value;
    const quantity = document.getElementById('quantity').value;
    const feed_amount = document.getElementById('feedAmount').value;

    const response = await fetch('/feed', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fish_type,
            quantity,
            feed_amount
        })
    });

    const data = await response.json();

    if (data.success) {
        alert('Feed data saved successfully');
    }
}

// CHART

window.onload = function () {

    const chartCanvas = document.getElementById('feedChart');

    if (chartCanvas) {

        const ctx = chartCanvas.getContext('2d');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
                datasets: [{
                    label: 'Feed Consumption',
                    data: [10, 20, 35, 50, 70],
                    borderColor: 'green',
                    fill: false
                }]
            },
            options: {
                responsive: true
            }
        });
    }
};
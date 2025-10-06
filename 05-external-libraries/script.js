const ctx = document.getElementById('popularityChart').getContext('2d');

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['French Fries', 'Mashed Potatoes', 'Tater Tots'],
        datasets: [{
            label: 'Estimated Orders',
            data: [150, 100, 75],
            backgroundColor: [
                'rgba(255, 165, 0, 0.8)',
                'rgba(255, 223, 186, 0.8)',
                'rgba(255, 200, 100, 0.8)'
            ],
            borderRadius: 5,
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 50
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});
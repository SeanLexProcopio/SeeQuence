let sequence = [];
let coins = 100;
let chart = null;

function generatePattern() {
  const type = Math.random();
  const start = Math.floor(Math.random() * 10) + 1;

  sequence = [];

  if (type < 0.4) {
    const diff = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < 4; i++) {
      sequence.push(start + i * diff);
    }
    sequence.patternType = 'arithmetic';
    sequence.diff = diff;
  } else if (type < 0.8) {
    const ratio = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < 4; i++) {
      sequence.push(start * Math.pow(ratio, i));
    }
    sequence.patternType = 'geometric';
    sequence.ratio = ratio;
  } else {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = a + Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < 4; i++) {
      sequence.push(i % 2 === 0 ? a : b);
    }
    sequence.patternType = 'alternating';
    sequence.altA = a;
    sequence.altB = b;
  }
}

function displaySequence() {
  document.getElementById("sequence").textContent = sequence.join(", ");
  drawChart();
}

function predictNext() {
  const last = sequence[sequence.length - 1];
  switch (sequence.patternType) {
    case 'arithmetic':
      return last + sequence.diff;
    case 'geometric':
      return last * sequence.ratio;
    case 'alternating':
      return sequence.length % 2 === 0 ? sequence.altA : sequence.altB;
    default:
      return last + 1;
  }
}

function makeGuess() {
  const bet = parseInt(document.getElementById("bet").value);
  const userGuess = parseInt(document.getElementById("guess").value);

  if (bet > coins || bet <= 0 || isNaN(userGuess)) {
    alert("Invalid bet or guess.");
    return;
  }

  const actualNext = predictNext();
  const result = document.getElementById("result");

  if (userGuess === actualNext) {
    coins += bet;
    result.textContent = `✅ Correct! The next number was ${actualNext}. You earned ${bet} coins.`;
    result.style.color = "lightgreen";
  } else {
    coins -= bet;
    result.textContent = `❌ Wrong. The correct number was ${actualNext}. You lost ${bet} coins.`;
    result.style.color = "tomato";
  }

  if (coins <= 0) {
    alert("You're out of coins! Restarting with 100 coins.");
    coins = 100;
  }

  document.getElementById("coins").textContent = coins;

  generatePattern();
  displaySequence();
  document.getElementById("guess").value = '';
  document.getElementById("bet").value = '';
}

function drawChart() {
  const ctx = document.getElementById("sequenceChart").getContext("2d");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: sequence.map((_, i) => `#${i + 1}`),
      datasets: [{
        label: 'Clue Sequence',
        data: sequence,
        borderColor: 'gold',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: 'gold',
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Index'
          }
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Value'
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
}

// Initialize
generatePattern();
displaySequence();

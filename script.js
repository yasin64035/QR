// Load BMI data from local storage
function loadBMI() {
  const bmiValues = JSON.parse(localStorage.getItem('bmiValues')) || [];
  updateChart(bmiValues);
}

// Save BMI data to local storage
function saveBMI(bmiValues) {
  localStorage.setItem('bmiValues', JSON.stringify(bmiValues));
}


// Update the chart with the given BMI values
function updateChart(bmiValues) {
  const chartElement = document.getElementById('chart');
  const existingChart = Chart.getChart(chartElement);

  if (existingChart) {
    existingChart.destroy();
  }

  const chart = new Chart(chartElement, {
    type: 'line',
    data: {
      labels: bmiValues.map((value, index) => `Measurement ${index + 1}`),
      datasets: [{
        label: 'BMI',
        data: bmiValues,
        backgroundColor: 'rgba(0, 119, 204, 0.2)',
        borderColor: 'rgba(0, 119, 204, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

// Calculate BMI and update the result and chart
function calculateBMI() {
  const units = document.querySelector('input[name="units"]:checked').value;
  const height = parseFloat(document.querySelector('input[name="height"]').value);
  const weight = parseFloat(document.querySelector('input[name="weight"]').value);
  const date = new Date().toLocaleDateString();

  let bmi;

  if (units === 'metric') {
    bmi = weight / ((height / 100) ** 2);
  } else {
    bmi = (weight / (height ** 2)) * 703;
  }

  const weightClass = getWeightClass(bmi);
  const healthyWeightRange = getHealthyWeightRange(height, units);

  const resultElement = document.getElementById('result');
  resultElement.innerHTML = `
    Your BMI is ${bmi.toFixed(1)} (${weightClass}).
    Your healthy weight range is ${healthyWeightRange}.
  `;

  // Load BMI data from local storage, add the current BMI value, and save to local storage
  const bmiValues = JSON.parse(localStorage.getItem('bmiValues')) || [];
  bmiValues.push({ bmi, date });
  saveBMI(bmiValues);

  // Update the chart with the new BMI values
  updateChart(bmiValues.map(value => value.bmi));
}

// Get the weight class based on the given BMI value
function getWeightClass(bmi) {
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi < 25) {
    return 'Normal weight';
  } else if (bmi < 30) {
    return 'Overweight';
  } else {
    return 'Obese';
  }
}





// Get the healthy weight range based on the given height and units
function getHealthyWeightRange(height, units) {
  let minWeight;
  let maxWeight;

  if (units === 'metric') {
    minWeight = 18.5 * ((height / 100) ** 2);
    maxWeight = 24.9 * ((height / 100) ** 2);
  } else {
    minWeight = 18.5 * (height ** 2) / 703;
    maxWeight = 24.9 * (height ** 2) / 703;
  }

  return `${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)} ${units === 'metric' ? 'kg' : 'lbs'}`;
}

// Add event listeners to the form and load button
document.getElementById('bmi-form').addEventListener('submit', event => {
  event.preventDefault();
  calculateBMI();
});

document.getElementById('load-button').addEventListener('click', loadBMI);

// Load BMI data on page load
loadBMI();

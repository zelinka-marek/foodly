import Chart from "chart.js/auto";

let chartInstance = null;

export function renderChart({ carbs, protein, fat }) {
  chartInstance?.destroy();

  let canvas = document.querySelector("#chart");

  chartInstance = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: ["Carbs", "Protein", "Fat"],
      datasets: [
        {
          label: "Macronutrients",
          data: [carbs, protein, fat],
          backgroundColor: ["#3b82f6", "#eab308", "#22c55e"],
        },
      ],
    },
  });
}

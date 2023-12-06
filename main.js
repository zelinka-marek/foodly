import App from "./app.js";
import "./style.css";
import { FetchWrapper, calculateCalories, capitalize } from "./utils.js";
// import "chart.js";

let client = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/jsdemo-3f387/databases/(default)/documents/mzelinka17",
);

let app = new App();

let list = document.querySelector("#food-list");
let form = document.querySelector("#create-form");
let name = document.querySelector("#name");
let carbs = document.querySelector("#carbs");
let protein = document.querySelector("#protein");
let fat = document.querySelector("#fat");
// let totalCalories = document.querySelector("#total-calories");

function displayEntry(name, carbs, protein, fat) {
  app.addFood(carbs, protein, fat);

  //   totalCalories.textContent = app.getTotalCalories();

  list.insertAdjacentHTML(
    "beforeend",
    `<li
    class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
  >
    <div class="flex flex-1 flex-col p-6">
      <h3 class="text-base/6 font-semibold text-gray-900">
      ${capitalize(name)}
      </h3>
      <p class="mt-2 text-sm text-gray-500">${calculateCalories(
        carbs,
        protein,
        fat,
      )} calories</p>
    </div>
    <dl class="flex divide-x divide-gray-200">
      <div
        class="flex w-0 flex-1 flex-col items-center justify-center py-4"
      >
        <dd
          class="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500"
        >
          <svg
            viewBox="0 0 6 6"
            class="h-1.5 w-1.5 fill-blue-500"
            aria-hidden="true"
          >
            <circle cx="3" cy="3" r="3" />
          </svg>
          Carbs
        </dd>
        <dt class="mt-1 text-sm text-gray-500">${carbs}g</dt>
      </div>
      <div
        class="flex w-0 flex-1 flex-col items-center justify-center py-4"
      >
        <dd
          class="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500"
        >
          <svg
            viewBox="0 0 6 6"
            class="h-1.5 w-1.5 fill-yellow-500"
            aria-hidden="true"
          >
            <circle cx="3" cy="3" r="3" />
          </svg>
          Protein
        </dd>
        <dt class="mt-1 text-sm text-gray-500">${protein}g</dt>
      </div>
      <div
        class="flex w-0 flex-1 flex-col items-center justify-center py-4"
      >
        <dd
          class="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500"
        >
          <svg
            viewBox="0 0 6 6"
            class="h-1.5 w-1.5 fill-green-500"
            aria-hidden="true"
          >
            <circle cx="3" cy="3" r="3" />
          </svg>
          Fat
        </dd>
        <dt class="mt-1 text-sm text-gray-500">${fat}g</dt>
      </div>
    </dl>
  </li>`,
  );
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  let data = await client.post("/", {
    fields: {
      name: { stringValue: name.value },
      carbs: { integerValue: carbs.value },
      protein: { integerValue: protein.value },
      fat: { integerValue: fat.value },
    },
  });
  if (data.error) {
    return alert("Some data is missing.");
  }

  alert("Food added successfully.");

  displayEntry(name.value, carbs.value, protein.value, fat.value);
  //   renderChart();

  name.value = "";
  carbs.value = "";
  protein.value = "";
  fat.value = "";
});

async function init() {
  let data = await client.get("/?pageSize=100");
  data.documents?.forEach((doc) => {
    const fields = doc.fields;

    displayEntry(
      fields.name.stringValue,
      fields.carbs.integerValue,
      fields.protein.integerValue,
      fields.fat.integerValue,
    );
  });
  //   renderChart();
}

// let chartInstance = null;
// const renderChart = () => {
//   chartInstance?.destroy();
//   const context = document.querySelector("#app-chart").getContext("2d");

//   chartInstance = new Chart(context, {
//     type: "bar",
//     data: {
//       labels: ["Carbs", "Protein", "Fat"],
//       datasets: [
//         {
//           label: "Macronutrients",
//           data: [app.getTotalCarbs(), app.getTotalProtein(), app.getTotalFat()],
//           backgroundColor: ["#25AEEE", "#FECD52", "#57D269"],
//           borderWidth: 3, // example of other customization
//         },
//       ],
//     },
//     options: {
//       scales: {
//         yAxes: [
//           {
//             ticks: {
//               beginAtZero: true,
//             },
//           },
//         ],
//       },
//     },
//   });
// };

init();

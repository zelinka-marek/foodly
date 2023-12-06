import App from "./app.js";
import "./style.css";
import { FetchWrapper, calculateCalories, capitalize } from "./utils.js";
import { renderChart } from "./chart.js";

let client = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/jsdemo-3f387/databases/(default)/documents/mzelinka17",
);

let app = new App();

let list = document.querySelector("#food-list");
let form = document.querySelector("#create-form");

function displayEntry(name, carbs, protein, fat) {
  app.addFood(carbs, protein, fat);

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

  let formData = new FormData(event.target);
  let name = formData.get("name");
  let carbs = formData.get("carbs");
  let protein = formData.get("protein");
  let fat = formData.get("fat");

  let data = await client.post("/", {
    fields: {
      name: { stringValue: name },
      carbs: { integerValue: carbs },
      protein: { integerValue: protein },
      fat: { integerValue: fat },
    },
  });
  if (data.error) {
    return alert("Some data is missing.");
  }

  alert("Food added successfully.");
  displayEntry(name, carbs, protein, fat);

  renderChart({
    carbs: app.getTotalCarbs(),
    protein: app.getTotalProtein(),
    fat: app.getTotalFat(),
  });

  event.target.reset();
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

  renderChart({
    carbs: app.getTotalCarbs(),
    protein: app.getTotalProtein(),
    fat: app.getTotalFat(),
  });
}

init();

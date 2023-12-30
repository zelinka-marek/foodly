import App from "./app.js";
import { renderChart } from "./chart.js";
import "./style.css";
import {
  FetchWrapper,
  calculateCalories,
  capitalize,
  formatDecimal,
} from "./utils.js";

const client = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/jsdemo-3f387/databases/(default)/documents/mzelinka17",
);

const app = new App();

const list = document.querySelector("#food-list");
const form = document.querySelector("#create-form");

function displayEntry(name, carbs, protein, fat) {
  app.addFood(carbs, protein, fat);

  const totalCalories = calculateCalories(carbs, protein, fat);

  list.insertAdjacentHTML(
    "beforeend",
    `<li class="snap-start px-4 py-5 sm:px-6">
  <div class="flex justify-between">
    <p class="text-sm/6 font-semibold text-gray-900">${capitalize(name)}</p>
    <p class="text-sm/6 text-gray-900">${formatDecimal(
      totalCalories,
    )} calories</p>
  </div>
  <div
    class="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500"
  >
    <p class="whitespace-nowrap">${formatDecimal(carbs)}g carbs</p>
    <svg viewBox="0 0 2 2" class="size-0.5 fill-current">
      <circle cx="1" cy="1" r="1" />
    </svg>
    <p class="whitespace-nowrap">${formatDecimal(protein)}g protein</p>
    <svg viewBox="0 0 2 2" class="size-0.5 fill-current">
      <circle cx="1" cy="1" r="1" />
    </svg>
    <p class="whitespace-nowrap">${formatDecimal(fat)}g fat</p>
  </div>
</li>`,
  );
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const name = formData.get("name");
  const carbs = formData.get("carbs");
  const protein = formData.get("protein");
  const fat = formData.get("fat");

  const data = await client.post("/", {
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
  const data = await client.get("/?pageSize=100");
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

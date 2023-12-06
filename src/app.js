import { calculateCalories } from "./utils.js";

export default class App {
  constructor() {
    this.food = [];
  }

  addFood(carbs, protein, fat) {
    this.food.push({
      carbs: Number.parseInt(carbs, 10),
      protein: Number.parseInt(protein, 10),
      fat: Number.parseInt(fat, 10),
    });
  }

  getTotalCarbs() {
    return this.food.reduce((total, item) => total + item.carbs, 0);
  }

  getTotalProtein() {
    return this.food.reduce((total, item) => total + item.protein, 0);
  }

  getTotalFat() {
    return this.food.reduce((total, item) => total + item.fat, 0);
  }

  getTotalCalories() {
    return calculateCalories(
      this.getTotalCarbs(),
      this.getTotalProtein(),
      this.getTotalFat(),
    );
  }
}

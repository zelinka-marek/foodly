export function capitalize(word) {
  return word[0].toUpperCase() + word.substring(1).toLowerCase();
}

export function calculateCalories(carbs = 0, protein = 0, fat = 0) {
  return carbs * 4 + protein * 4 + fat * 9;
}

export class FetchWrapper {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get(endpoint) {
    const response = await fetch(this.baseURL + endpoint);

    return response.json();
  }

  put(endpoint, body) {
    return this._send("put", endpoint, body);
  }

  post(endpoint, body) {
    return this._send("post", endpoint, body);
  }

  patch(endpoint, body) {
    return this._send("patch", endpoint, body);
  }

  delete(endpoint, body) {
    return this._send("delete", endpoint, body);
  }

  async _send(method, endpoint, body) {
    const response = await fetch(this.baseURL + endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return response.json();
  }
}

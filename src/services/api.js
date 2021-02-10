import config from "../../config.json";

export default class api {
  static get(url) {
    return fetch(config.base + url, { credentials: "include" }).then((resp) =>
      resp.json()
    );
  }

  static sendData(url, data, method) {
    return fetch(config.base + url, {
      credentials: "include",
      method,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    }).then((resp) => {
      if (resp.ok) {
        return resp.json();
      }
      throw new Error("HTTP Request error");
    });
  }

  static sendCSV(url, data, method) {
    return fetch(config.base + url, {
      credentials: "include",
      method,
      headers: {
        "Content-Type": "text/plain; charset=UTF-8",
      },
      body: data,
    }).then((resp) => {
      if (resp.ok) {
        return resp.json();
      }
      throw new Error("HTTP Request error");
    });
  }

  static sendMap(map) {
    return fetch(config.externalMappingLocationURL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(map),
    }).then((resp) => {
      if (resp.ok) {
        return resp.json();
      }
      throw new Error("HTTP Request error");
    });
  }

  static post(url, data) {
    return this.sendData(url, data, "POST");
  }

  static postCSV(url, data) {
    return this.sendCSV(url, data, "POST");
  }

  static put(url, data) {
    return this.sendData(url, data, "PUT");
  }

  static delete(url, callbackFunction) {
    return fetch(config.base + url, {
      method: "DELETE",
    }).then((resp) => {
      if (resp.ok) {
        callbackFunction();
      } else {
        throw new Error("HTTP Request error");
      }
    });
  }
}

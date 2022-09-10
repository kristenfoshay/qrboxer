import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class QRBoxerApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${QRBoxerApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }



  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

 

  static async getMoves(location) {
    let res = await this.request("moves", { location });
    return res.moves;
  }

 

  static async getMove(id) {
    let res = await this.request(`moves/${id}`);
    return res.move;
  }



  static async getBoxes(room) {
    let res = await this.request("boxes", {room});
    return res.boxes;
  }

  static async getBox(id) {
    let res = await this.request(`boxes/${id}`);
    return res.box;
  }

  static async getItems(description) {
    let res = await this.request("items", {description});
    return res.items;
  }

  static async getItem(id) {
    let res = await this.request(`items/${id}`);
    return res.item;
  }

  /** Get token for login from username, password. */

  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  /** Signup for site. */

  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  /** Save user profile page. */

  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }
}




export default QRBoxerApi;
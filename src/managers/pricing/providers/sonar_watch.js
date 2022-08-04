import axios from "axios";
import {PricingProvider} from "./provider";

export class SonarWatch extends PricingProvider {

  client


  constructor() {
    super()

    this.client = axios.create({
      baseURL: "https://api.sonar.watch"
    })
  }

  /**
   * Returns the price of a given token address
   */
  getPrice(tokenAddr) {

  }

  /**
   * Returns a list of token prices
   */
  async getPrices() {
    const {data} = await this.client.get("/latest/prices")
    const prices = {};
    const obk = Object.keys(data)

    for (let i = 0; i < obk.length; i++) {
      const k = obk[i]
      prices[k] = data[k].value
    }

    return prices
  }


  // "5Hh6uuLsPA8NHDudy9XGZ7SbiMoeF9XKq1sQzgejc3rn": {
  //   "_id": "62ec19cc6ec0fb4c0e7d7381",
  //   "address": "5Hh6uuLsPA8NHDudy9XGZ7SbiMoeF9XKq1sQzgejc3rn",
  //   "type": "token",
  //   "symbol": "eFTT",
  //   "value": 29.12887566442356,
  //   "supply": 862.74367531,
  //   "decimals": 8,
  //   "createdAt": "2022-08-04T19:11:08.616Z"
  // }
}

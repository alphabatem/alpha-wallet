import {SonarWatch} from "./providers/sonar_watch";
import {Manager} from "../manager";

export class PriceManager extends Manager {

  provider

  priceCache = null
  lastFetch = null

  constructor(store) {
    super(store)
    this.provider = new SonarWatch()
  }

  id() {
    return PRICE_MANAGER
  }

  /**
   * Returns a k/v object of tokenAddrr -> price
   *
   * @returns {{}|*}
   */
  async getPrices() {
    if (this.priceCache && this.lastFetch) {
      //Keep price cache for 5 mins
      if (this.lastFetch < (new Date().getTime() - (5 * 60 * 60 * 1000))) {
        return this.priceCache
      }
    }

    this.lastFetch = new Date().getTime()
    this.priceCache = await this.provider.getPrices()
    return this.priceCache
  }

  /**
   * Returns the price of a given token
   *
   * @param tokenAddr
   */
  getPrice(tokenAddr) {
    return this.provider.getPrice(tokenAddr)
  }

}

export const PRICE_MANAGER = "price_mgr"

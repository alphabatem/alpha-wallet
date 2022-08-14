import {SonarWatch} from "./providers/sonar_watch";
import {AbstractManager} from "../abstractManager";

export class PriceManager extends AbstractManager {

  provider

  priceCache = null
  lastFetch = null

  cacheTimeout = 5 * 60 * 1000

  constructor() {
    super()
    this.provider = new SonarWatch()
  }


  /**
   * Context ID
   *
   * @returns {string}
   */
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
      if (this.lastFetch > (new Date().getTime() - this.cacheTimeout)) {
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
  async getPrice(tokenAddr) {
    console.log("Getting token price", tokenAddr, this.lastFetch > (new Date().getTime() - this.cacheTimeout))
    if (this.priceCache && this.lastFetch) {
      //Keep price cache for 5 mins
      if (this.lastFetch > (new Date().getTime() - this.cacheTimeout)) {
        return this.priceCache[tokenAddr]
      }
    }

    console.log("Getting token price from provider", tokenAddr, this.priceCache)
    return this.provider.getPrice(tokenAddr)
  }

}

export const PRICE_MANAGER = "price_mgr"

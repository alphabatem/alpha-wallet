import {AbstractManager} from "../abstractManager";

export class EventManager extends AbstractManager {

  events = {}

  subKey = 0;

  id() {
    return EVENT_MGR
  }

  registerEvent(event) {
    if (this.hasEvent(event))
      return false

    this.events[event] = []
    return true
  }

  subscribe(event, handler) {
    if (!this.hasEvent(event))
      return false

    this.subKey++

    this.events[event].push({
      key: this.subKey,
      handler: handler
    })
    return true
  }

  unsubscribe(event, subKey) {
    for (let i = 0; this.events[event].length; i++) {
      if (this.events[event][i].key === subKey) {
        delete this.events[event][i]
        return
      }
    }
  }

  hasEvent(event) {
    return Boolean(this.events[event])
  }


  /**
   * Calls all subscribers for event
   * @param event
   * @param data
   */
  onEvent(event, data = {}) {
    if (!this.hasEvent(event))
      return

    for (let i = 0; this.events[event].length; i++) {
      this.events[event][i].handler(data)
    }

  }
}

export const EVENT_MGR = "event_manager"

export const EVENTS = new class {
  onLock = "locked"
  onUnlock = "unlocked"
  onConfig = "config_update"
}

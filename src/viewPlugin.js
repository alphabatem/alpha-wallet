import AbstractView from "./view";

export default class PluginView extends AbstractView {


  constructor(router, wallet, data = {}) {
    console.log("Plugin view", router, wallet, data)
    super(router, wallet, data = {})
  }

  // constructor() {
  //   super();
  // }

}

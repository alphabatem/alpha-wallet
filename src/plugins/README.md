# Plugins

## Structure & API still a WIP

* Pluggable components providing new functionality to the wallet
* All components can be turned on/off by the user


## TODO
* Move to running in secure context rather than at current core context
  * Will most likely use a manifest in plugins to manage permissions here



## Structure

```
/{plugin_name}
  - settings.js
  - view.js
  - view.css
```

#### index.js
Responsible for registering into the shared context

### view.js
View controller for the plugin

### view.css
Css for the view controller

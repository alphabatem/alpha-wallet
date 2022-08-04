# Managers

Pluggable managers for views within the wallet


Responsibilities:
* View caching
* Dynamic requests (price feeds etc)
* Custom views
* Event listeners

Managers can communicate via the shared context using `getManager({id})`

Basic manager
```js
import {Manager} from "./manager";

export class ExampleManager extends Manager {

  id() {
    return EXAMPLE_MANAGER
  }
  
  //Custom logic...
}

const EXAMPLE_MANAGER = "example_manager" //Global so can be used by other managers

```

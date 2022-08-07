# Storage


## Storage Driver
Responsible for the core calls to underlying storage API

* getPlain()
* setPlain()
* getEncrypted()
* setEncrypted()

* getSession()
* setSession()

## Wallet Storage
Responsible for single wallet data storage. Namespaced per wallet

```
/namespaces
  /{wallet_1}
  /{wallet_2}
  /{wallet_3}
```

### Namespaces
Namespaces are partitioned storage areas containing the following schema for data storage
```
/private
  /{key_1}
  /{key_2}
  /{key_3}
/plain
  /{key_1}
  /{key_2}
  /{key_3}
```


## Private Storage
Namespaced area for non-wallet private data

## Key Storage
Namespaced area for only encrypted key storage

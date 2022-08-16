# Alpha Wallet

Open source solana wallet with a focus on simplicity & extensibility.

![Scam NFTs](https://github.com/babilu-online/alpha-wallet/blob/main/docs/screenshots/wallet_overview.gif?raw=true)

# UNDER ACTIVE DEVELOPMENT - v0.001!

### Features
* Minimal dependencies for reduced attack vectors
* Fully encrypted with AES & SHA3
* 0 External servers
  * Your keys & access stays with you at all times
  * your activity is not monitored from what you do in the wallet
* BlockChain Support
  * Solana
  * EVM (Via Plugin) - _Coming soon_
* Token View
* NFT View
* Plugin system - Builders can easily add their own plugin to the wallet
* Fully configurable - User has full control of all plugin runtime & settings


### Key Features
For a full breakdown of all the features Alpha Wallet has to offer, visit [`docs/README.md`](https://github.com/babilu-online/alpha-wallet/blob/main/docs/README.md).

#### Scam & Tracker NFT Detection
Protect your privacy & reduce the risk of interacting with scam NFT's through Alpha Wallets protective NFT layer. 

NFT's suspected of being a scam or tracking wallets IP & activity will be restricted from being autoloaded when visting your collections.

![Scam NFTs](https://github.com/babilu-online/alpha-wallet/blob/main/docs/screenshots/wallet_nft_view.gif?raw=true)

#### Custom Plugins
Custom plugins allow users & communities to extend the functionality of Alpha Wallet. This could be through showing the users active SHDW drives, or showing the users staked NFT's or rewards.

![Plugins](https://github.com/babilu-online/alpha-wallet/blob/main/docs/screenshots/wallet_plugins.gif?raw=true)

#### Informative Trusted Sites
Enhanced information is provided on trusted sites authorization to allow users to make a more informed choice on what sites to connect with, limiting wallet drainer scams etc.

Users are able to set token filters & max spend notifications to further notify them when a transaction from a site may be dangerous.

![Trusted Sites](https://github.com/babilu-online/alpha-wallet/blob/main/docs/screenshots/wallet_trusted_sites.gif?raw=true)

#### Bulk NFT Sending
Users can quickly and easily send or burn multiple NFT's from the comfort of their wallet. Simply select the NFT's to send, the recipient to send to and off they go!

![Bulk NFT Sending](https://github.com/babilu-online/alpha-wallet/blob/main/docs/screenshots/wallet_bulk_nft_send.gif?raw=true)


### Completed Plugins
* Token
* NFT
* Storage
* Settings
* Solana
* Browser Messages
* Token Pricing

### Completed
* [X] Wallet Private Key Import & Export
* [X] Mnemonic Key Import & Export
* [X] Encrypted Wallet generation & Storage
* [X] Encrypted PIN between unlocks
* [X] Trusted sites
* [X] Bulk NFT Send & Burn
* [X] Auto TXN Timeout
* [X] Scam NFT Checks
* [X] Tracker NFT Checks (Protect your IP & Activity!)
* [x] Token Pricing
* [X] Custom Framework & Plugins
* [X] Complete wallet interface for `@solana/wallet-adapter`
  * PR: `https://github.com/solana-labs/wallet-adapter/pull/518`

### TODO
* [ ] Ledger plugin - remote signing (0 key storage on extension)
* [ ] EVM Plugin Interface
* [ ] Finish up settings & plugin settings binding
* [ ] Add internal views for Staking & Sending/Recieving SOL


### Plugins Roadmap
* [ ] Jupiter AG
* [ ] AlphaBatem plugin - view metaverses
* [ ] GenGo plugin - view drives
* [ ] 2FA
* [ ] Enhanced txn approval (more detail than currently provided)
* [ ] EVM Apps (ETH etc)


### Connection Utils
- https://shdw-drive.genesysgo.net/BUEx7mtGafrw4xB3py37HKiYwess63X5FvndfRBRqe6M/scratch_23.html

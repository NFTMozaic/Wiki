---
id: nft-sdks 
title: NFT SDKs
sidebar_label: NFT SDKs
sidebar_position: 1
---

### What is SDK

A blockchain SDK (Software Development Kit) is a middleware layer providing developers with a set of tools, libraries, and documentation to build NFT applications on top of the Polkadot ecosystem. 

Faster onboarding – Learning takes hours instead of weeks, and a basic minter can be built in a day.
Faster development - less complex and many scenarios are pre-built
Future-proofing – SDKs manage Polkadot runtime changes automatically, reducing maintenance efforts.
Improved performance – REST APIs enable efficient transactions, optimizing dApp speed and reducing overhead.

### Applications

- **NFT Marketplaces** – Simplifies minting, trading, and metadata management.
- **Wallet Interfaces** – Provides standardized API for seamless NFT transfers and updates.
- **Gaming Apps** – Enables batch minting, asset management, and in-game NFT transactions.
- **Other dApp Asset Pages** – Ensures reliable NFT data retrieval and custom transaction execution without manual blockchain integration.

## List
<div style={{ fontSize: "0.85rem" }}>

|  | PAPI | Unique Network | Apillon | Polkadot.js | Dedot |
| --- | --- | --- | --- | --- | --- |
| Docs | [Link](https://papi.how/getting-started) | [Link](https://docs.unique.network/build/sdk/getting-started.html) | [Link](https://sdk-docs.apillon.io/) | [Link](https://polkadot.js.org/docs/) | [Dedot](https://docs.dedot.dev/) |
| GitHub | [Link](https://github.com/polkadot-api/polkadot-api) | Private | [Link](https://github.com/Apillon/sdk) | [Link](https://github.com/polkadot-js/docs) | [Link](https://github.com/dedotdev/dedot) |
| Indexes NFT pallet | General indexing only | Unique Network, Pallet NFTs, Pallet Uniques | Unique Network | General indexing only | General indexing only |
| Platforms | Web/TS | Web/TS | Web/JS | Web/JS | Web/JS |
</div>

### Polkadot API (PAPI)

PAPI is a TypeScript-based light API client developed to offer a browser-friendly alternative to Polkadot.js. PAPI is recommended when working on dApps that may benefit from long-term ecosystem alignment or require decentralized connectivity options. Originally backed by Parity, PAPI benefited from early ecosystem support and alignment with official tooling standards.

Developers must manually maintain runtime changes. See the full feature list [here](https://github.com/polkadot-api/polkadot-api#features).

- Light client first – Built-in Smoldot integration supports fully decentralized use in browsers without RPC nodes.
- Bundle size – For WebSocket mode: `643 kB` parsed / `194 kB` gzip.
For light client mode: `5584 kB` parsed / `2993 kB` gzip.
In practice, the full bundle size in an [example NFT minting application](https://github.com/NFTMozaic/api-tools-review) was larger than expected.
- Strong documentation – The official site includes clear guides, usage patterns, and real-world project references.
- A summary of capabilities of PAPI and Dedot is available in the [PAPI vs Dedot APIs for NFT dApps](https://docs.google.com/document/d/1vnx35lNV87IrM6KOEd-L7HjCfWZ8QS0O2Evwy-uTkEA/edit?usp=sharing) report.


### Unique Network SDK

Unique Network SDK facilitates seamless integration of AssetHub's and Unique Network's capabilities into the Web3 application, bypassing the need for direct low-level API interaction. It enables you to effortlessly mint collections and tokens, manage account balances, and more. Developers do not need to maintain runtime changes - the remote procedure server is always up-to-date. The quick-start is [here](https://docs.unique.network/build/sdk/v2/quick-start.html).


### Apillon SDK
Apillon also provides a way to deploy contracts and mint NFTs but via a Web3 drag-and-drop interface on Moonbeam, Astar, Asset Hub and Unique Network. As a general purpose SDK, the [Apillon API](https://wiki.apillon.io/build/1-apillon-api.html) provides all the elements necessary to access the underlying processes making it a viable albeit somewhat different approach.



### Dedot SDK

Dedot is a lightweight JavaScript/TypeScript API client designed for quick onboarding and efficient use in browser-based NFT apps. While smaller and community-driven, it provides a surprisingly complete feature set and an intuitive API familiar to developers coming from Polkadot.js. See the full feature list [here](https://github.com/dedotdev/dedot#features).

- Flexible connectivity – Supports both RPC and Smoldot (light client) with manual configuration.
- Bundle size  – For WebSocket mode: `160 kB` parsed / `50 kB` gzip.
For light client mode: `2866 kB` parsed / `2157 kB` gzip.
These measurements are based on an example [NFT minting application](https://github.com/NFTMozaic/api-tools-review).
- Quick setup – For supported chains, no code generation is needed. Otherwise, CLI generation is similar to PAPI.
- Docs and community – strong documentation, migration guides, and a responsive core developer. Also includes a live playground.
- A summary of capabilities of PAPI and Dedot is available in the [PAPI vs Dedot APIs for NFT dApps](https://docs.google.com/document/d/1vnx35lNV87IrM6KOEd-L7HjCfWZ8QS0O2Evwy-uTkEA/edit?usp=sharing) report.


### Polkadot.JS

[Polkadot\{.js\}](https://polkadot.js.org/docs/api/) is the legacy API tool for interacting with Polkadot. It provides direct access to blockchain functionality, making it essential for low-level integrations and complex dApp architectures. However, working with raw extrinsics and runtime upgrades requires deep Polkadot knowledge and significant development effort.

- Powerful but complex – Best suited for advanced developers familiar with Substrate and Polkadot internals.
- Takes time to master – Learning curve spans weeks, and building even a simple minter can take a week or more.
- Requires continuous maintenance – Developers must manually handle Polkadot runtime changes and network upgrades.





## Conclusions

- Polkadot\{.js\} remains as a legacy platform. A complex development environment, challenging to work with but very universal. 
- PAPI provides an updated, more streamlined approach to building dApps and minting NFTs than it's predecessor.
- Unique Network SDK is optimised for fast NFT dApp development for both the native chain and AssetHub, and can be extended to any other Rollup (parachain).
- Apillon SDK provides a very convenient approach as it follows the user-friendly web building process.
- Dedot offers a similar experience but puts emphasis on code size and performance optimisation.


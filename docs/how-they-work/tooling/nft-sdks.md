---
id: nft-sdks 
title: NFT SDKs
sidebar_label: NFT SDKs
sidebar_position: 2
---

_An overview of the Rollup NFT capable SDKs._

# NFT SDKs in Polkadot Ecosystem

Although Polkadot does not provide an NFT-specific SDK their legacy SDK, the [Polkadot\{.js\}](https://polkadot.js.org/docs/api/) 
has been utilised to this effect. Recently, however, focus has shifted toward their API, the [Polkadot API (PAPI)](https://papi.how/) that provides a more convenient way to develop dApps and mint NFTs. In a similar approach [Dedot](https://github.com/dedotdev/dedot) provides a lightweight SDK that attempts to optimise code bulk and speed. [Unique Network's SDK](https://docs.unique.network/build/sdk/v2/quick-start.html) allows fast and easy development with their approach applied to both Asset Hub and their native pallets unifying the NFT experience across chains. Apillon also provides a way to deploy contracts and mint NFTs but via a Web3 drag-and-drop interface on Moonbeam, Astar, Asset Hub and Unique Network. Although it is not an SDK per se, the [Apillon API](https://wiki.apillon.io/build/1-apillon-api.html) provides all the elements necessary to access the underlying processes making it a viable albeit somwhat different approach.


## NFT SDK

The Role of the NFT SDK

A blockchain SDK (Software Development Kit) is a middleware layer providing developers with a set of tools, libraries, and documentation to build NFT applications on top of the Polkadot ecosystem.
Why NFT SDKs Are Needed
Faster onboarding – Learning takes hours instead of weeks, and a basic minter can be built in a day.
Faster development - less complex and many scenarios are pre-built
Future-proofing – SDKs manage Polkadot runtime changes automatically, reducing maintenance efforts.
Improved performance – REST APIs enable efficient transactions, optimizing dApp speed and reducing overhead.
Specific dApp value
NFT Marketplaces – Simplifies minting, trading, and metadata management.
Wallet Interfaces – Provides standardized API for seamless NFT transfers and updates.
Gaming Apps – Enables batch minting, asset management, and in-game NFT transactions.
Other dApp Asset Pages – Ensures reliable NFT data retrieval and custom transaction execution without manual blockchain integration.


## Polkadot.JS: The Core API Tool

[Polkadot\{.js\}](https://polkadot.js.org/docs/api/)  is the legacy API tool for interacting with Polkadot. It provides direct access to blockchain functionality, making it essential for low-level integrations and complex dApp architectures. However, working with raw extrinsics and runtime upgrades requires deep Polkadot knowledge and significant development effort.

- Powerful but complex – Best suited for advanced developers familiar with Substrate and Polkadot internals.
- Takes time to master – Learning curve spans weeks, and building even a simple minter can take a week or more.
- Requires continuous maintenance – Developers must manually handle Polkadot runtime changes and network upgrades.

## Polkadot API (PAPI)

PAPI is a light client Typescript API to interact with Polkadot chains. Developers must manually maintain runtime changes. See full feature list [here](https://github.com/polkadot-api/polkadot-api#features).

## Dedot SDK

Dedot is a light client Javascript API for Polkadot and Polkadot-SDK based chains. See full feature list [here](https://github.com/dedotdev/dedot#features).

## Unique Network SDK

The SDK facilitates seamless integration of Unique Network's capabilities into the Web3 application, bypassing the need for direct low-level API interaction. It enables you to effortlessly mint collections and tokens, manage account balances, and more. Developers do not need to maintain runtime changes - the remote procedure server is always up-to-date. The quick-start is [here](https://docs.unique.network/build/sdk/v2/quick-start.html).

## Existing NFT SDKs List

|  | Polksdot\{.js\} | PAPI | Dedot | Apillon | Unique Network |
| --- | --- | --- | --- | --- | --- |
| Docs |[Polkadot\{.js\}](https://polkadot.js.org/docs/)|[PAPI](https://papi.how/getting-started)|[Dedot](https://docs.dedot.dev/)| [Unique Network SDK](https://sdk-docs.apillon.io/) | [Documentation](https://docs.unique.network/build/sdk/getting-started.html) |
| GitHub |[Public](https://github.com/polkadot-js/docs)|[Public](https://github.com/polkadot-api/polkadot-api)|[Public](https://github.com/dedotdev/dedot)| [Public](https://github.com/Apillon/sdk) | Private |
| Indexes NFT pallet |basic (Subscan)|basic (Subscan)|basic (Subscan)| UniqueNetwork Pallet Can be extended | UniqueNetwork Pallet Pallet NFTs (MVP) Pallet Uniques (MVP) |
| Platforms | Web/JS | Web/TS | Web/JS | Web/JS | Web/TS |

## Conclusions

Polkadot\{.js\} remains as a legacy platform. A complex development environment, challenging to work with but very universal. 
PAPI provides an updated, more streamlined approach to building dApps and minting NFTs than it's predecessor.
Dedot offers a similar experience but puts emphasis on code size and performance optimisation.
Apillon SDK provides a very convenient approach as it follows the user-friendly web building process.
Unique Network SDK is optimised for fast NFT dApp development for both the native chain and the Asset Hub.
An open call to the community for a greenfield NFT SDK should be made, but any new solution is likely to be expensive.

## Plans

Publish the call for proposals for the NFT SDK and plan further actions based on the response.

Proposed Specification for an ideal “to be”  SDK.


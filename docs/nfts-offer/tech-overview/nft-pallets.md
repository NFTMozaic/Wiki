---
id: nft-pallets
title: Overview
sidebar_position: 1
---

# Polkadot NFT Pallets

:::tip [Definition]

Pallets are modules in Substrate development environment that provide runtime logic for building and customizing blockchains.
:::

### Overview

Polkadot offers multiple pallets as ways to create and manage NFTs. 
Pallets are stable code, changes are made only to accommodate Polkadot runtime upgrades. However, rollups may decide to use one of the above pallets and customize them for their purposes. 

This article explains the main characteristics of each and their optimal usage.

<h3 style={{ color: '#6a0dad' }}>Live data</h3>

<p style={{ color: '#6a0dad' }}>
The table linked below shows how assets are currently distributed, how they're being used, and who is contributing to development. It’s updated monthly to reflect changes in the ecosystem.
</p>

**[NFT Pallets in the Polkadot Ecosystem](https://docs.google.com/spreadsheets/d/1BhlmF9BUw0z6B5qBAqC3j_NMZ0dbhenvgFNFIo4oPhQ/edit?usp=sharing)**




## About each pallet
### NFTs Pallet

- A powerful NFT engine covering most scenarios, supported by Parity, used by the largest NFT project in the ecosystem.
- Supported by the Fellowship.
- Available on AssetHub.
- Flexible permission system for collection (class) ownership.
- Flexible permission system for storing on-chain metadata.
- Delegation capability for updating on-chain metadata to a third-party user.
- Built-in on-chain marketplace.
- Used by AssetHub and Mythos, ideal for dApps.
- [GitHub repo](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/nfts#readme)

### Uniques Pallet

- Extensive experience with integration in the community, has existed since 2021, supported by Parity.
- Supported by the Fellowship.
- Available on AssetHub.
- Flexible permission system for storing on-chain metadata.
- Built-in on-chain marketplace.
- Simplest to deploy in a parachain, used by most parachains (>10).
- [GitHub repo](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/uniques)

### Unique Network Pallet

- A parachain with an advanced NFT engine for highly flexible configurations and seamless integration of native tokens within the EVM.
- Ideal for advanced dApps due to native support of Nesting, Dynamic NFTs, and other innovative capabilities.
- High performance.
- On-chain gas fee sponsoring of transactions with collections and tokens.
- Flexible permission system for storing on-chain metadata.
- Easy dApps development with EVM and full Substrate interoperability.
- Highly developed dev tools (SDK).
- Substantially lower cost.
- [Quick start](https://docs.unique.network/build/sdk/v2/quick-start.html)
- [Tutorials](https://docs.unique.network/tutorials)

### Other Pallets

- **Aventus**: Parachain with its own NFT concept and a bridge to Ethereum.
  - No concept of collections (classes).
  - Built-in on-chain marketplace.
  - Bridge with Ethereum.
  
- **ORML NFT**: An easily embeddable NFT engine for basic native NFT implementations, supplied with the ORML toolkit.
  - Small codebase.
  - Part of ORML (a powerful toolkit that simplifies XCM and other functionalities).
  - Easy integration.
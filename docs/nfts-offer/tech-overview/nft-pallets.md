---
id: nft-pallets
title: NFT Pallets
sidebar_position: 1
---

# NFT Pallets in the Polkadot Ecosystem

:::tip [Definition]

Pallets are modules in Substrate development environment that provide runtime logic for building and customizing blockchains

:::

## Overview

As indicated in previous sections, Polkadot offers multiple pallets as ways to create and manage NFTs. Pallets are stable code, changes are made only to accommodate Polkadot runtime upgrades. However, rollups may decide to use one of the above pallets and customize them for their purposes. For source data used for this overview, see [NFT Pallets in Polkadot](#).

This article explains the main characteristics of each and their optimal usage.

## Uniques Pallet

- Extensive experience with integration in the community, has existed since 2021, supported by Parity.
- Supported by the Fellowship.
- Available on AssetHub.
- Flexible permission system for storing on-chain metadata.
- Built-in on-chain marketplace.
- Simplest to deploy in a parachain, used by most parachains (>10).

## NFTs Pallet

- A powerful NFT engine covering most scenarios, supported by Parity, used by the largest NFT project in the ecosystem.
- Supported by the Fellowship.
- Available on AssetHub.
- Flexible permission system for collection (class) ownership.
- Flexible permission system for storing on-chain metadata.
- Delegation capability for updating on-chain metadata to a third-party user.
- Built-in on-chain marketplace.
- Used by AssetHub and Mythos, ideal for dApps.

## Unique Network Pallets

- A parachain with an advanced NFT engine for highly flexible configurations and seamless integration of native tokens within the EVM.
- Ideal for advanced dApps due to native support of Nesting, Dynamic NFTs, and other innovative capabilities.
- High performance.
- On-chain gas fee sponsoring of transactions with collections and tokens.
- Flexible permission system for storing on-chain metadata.
- Easy dApps development with EVM and full Substrate interoperability.
- Highly developed dev tools (SDK).
- Substantially lower cost.

## Other Pallets

- **Aventus**: Parachain with its own NFT concept and a bridge to Ethereum.
  - No concept of collections (classes).
  - Built-in on-chain marketplace.
  - Bridge with Ethereum.
- **ORML NFT**: An easily embeddable NFT engine for basic native NFT implementations, supplied with the ORML toolkit.
  - Small codebase.
  - Part of ORML (a powerful toolkit that simplifies XCM and other functionalities).
  - Easy integration.

## The “Official” Pallet of the Asset Hub

- NFTs Pallet on AssetHub is the default proposed option for new dApps.
- Uniques pallet is the default proposed option for new parachains.
- Unique Network is proposed for advanced dApp needs.
- Other pallets serve as examples of a custom NFT implementation only.

Support for NFTs and Uniques pallets is done by the Fellowship. No functionality changes are planned, since the code base for pallets has to be very stable. NFTMozaic will attempt to:

- Evaluate what “future proof guarantees” can be provided on NFTs/AssetHub in discussions with Fellowship members and on its own best practices.
- Formalize the upgrade policy for these two pallets in discussions with Fellowship.

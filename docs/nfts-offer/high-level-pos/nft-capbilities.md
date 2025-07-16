---
id: NFT-Capabilities
title: Polkadot NFT Capabilities
sidebar_label: NFT capabilities
sidebar_position: 3
---

## Executive Summary

Polkadot’s NFT ecosystem spans a spectrum of technologies, from basic native pallets to advanced “NFTs 2.0” pallets, EVM/Solidity smart contracts, and its native Rust-based Ink! Smart contracts. These technologies are available on multiple parachains, where dApps can be built. Variety of tooling options is available for each of them.

## Polkadot NFT Pallets & Core Technologies

### 1 Pallets Overview

Substrate-based pallets offer native NFT logic—mint, transfer, burn and metadata without relying on external smart contracts. This ensures direct chain-level security and performance, aligning with Polkadot’s shared security model. It is a significantly more efficient way to create and manage Non Fungible Assets then Smart Contracts.

### 2 Main Pallet Variants

#### Uniques Pallet
- Minimal NFT approach, widely used by new roll ups (parachains) for specific dApps.
- Built-in on-chain marketplace, flexible permissions.

#### NFTs Pallet
- Enhanced engine with collection permissioning, delegated metadata updates, marketplace logic.
- Used by Asset Hub and Mythos.

#### Unique Network
- Native support for NFT 2.0 (dynamic, nested, composable).
- Easy dApps development with full EVM-Substrate interoperability.
- Sponsor-based fees, robust dev toolkits (SDK).

### 3 Usage & Statistics

The report in the link below provides an insight into the current distribution of assets, the usage statistics and the contribution details pertaining to the develper activity. This table is live and is updated monthly to reflect changes in the ecosystem.

[NFT Pallets in the Polkadot Ecosystem](https://docs.google.com/spreadsheets/d/1BhlmF9BUw0z6B5qBAqC3j_NMZ0dbhenvgFNFIo4oPhQ/edit?usp=sharing)


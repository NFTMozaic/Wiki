---
sidebar_position: 3 
hide_table_of_contents: false
toc_min_heading_level: 2
toc_max_heading_level: 4
---

# Unique Network 

## Pallet and chain

[Unique Network](https://unique.network) is a Substrate-based parachain in the Polkadot ecosystem that provides advanced NFT functionality and developer tooling. It does **not use** the standard `pallet_uniques` or `pallet_nfts`. Instead, it has its own custom-built NFT logic on-chain, designed to support **advanced NFT features**.

[Official documentation](https://docs.unique.network)

## Key Features

- **Nested and Customizable NFTs** allowing parent-child relationships
- **Dynamic metadata** and real-time updatable tokens
- **Multimedia NFTs** with multiple files per token
- **Flexible ownership roles** and access control
- **Sponsored transactions** and more

[About Unique Network NFTs](https://docs.unique.network/about/approach.html)

## Development Stack

Unique Network supports two programming models:

### 1. **Substrate-native SDK (v2)**
- Built for interacting directly with the Unique runtime modules
- Type-safe, fully-featured JavaScript API
- Handles collections, tokens, metadata, and sponsored transactions

[Getting Started with SDK](https://docs.unique.network/build/sdk/v2/quick-start.html)

### 2. **EVM Support**
- Contracts can be deployed using Solidity
- MetaMask, Hardhat, Remix, and other Ethereum tooling supported

[Getting Started with EVM](https://docs.unique.network/build/evm/)
---
id: NFT dApp
title: NFT dApp
sidebar_label: NFT dApp
sidebar_position: 2
---

# NFT dApp templates

`create-nft-app` is a set of NFT-specific templates created by NFTMozaic team. 

- [GitHub](https://github.com/paritytech/create-polkadot-dapp)
- [npm](https://www.npmjs.com/package/create-nft-app)

### PVM (Solidity) {#pvm-solidity}

**What you’ll have up and running in five minutes:**

1. Seamless Polkadot smart‑contract setup
   * Environment fully configured for creating, compiling to PVM bytecode, and deploying your smart contracts.
2. Working front‑end demo
   * Connect any wallet and view its balance.
   * Browse every ERC‑721 collection on the network and link into the connected Blockscout indexer.
   * Mint an ERC‑721 token into the preconfigured collection.
3. Working code samples & README
   * Step‑by‑step guide to creating your own NFT collection (or deploying any other contract).
   * Examples of how to call your contract in several ways.
   * Instructions for targeting different environments (production or testnets).
   * Tips on repurposing the connected indexer for use cases beyond NFTs.

**Key Features:**

- Next.js
- Wagmi for Ethereum wallet integration and React hooks
- [Reown AppKit](https://reown.com/appkit) (former WalletConnect) for seamless Polkadot wallet connectivity
- [Foundry-Polkadot](https://github.com/paritytech/foundry-polkadot) for smart contract development, configured for `resolc` compiler
- [BlockScout API](https://blockscout-passet-hub.parity-testnet.parity.io/api-docs) for indexer data querying
- Built-in NFT collection viewing and minting functionality

**Usage:**

```sh
npm create nft-app@latest my-app
```

This template bridges Ethereum development experience with Polkadot's ecosystem, providing developers with familiar tools (Foundry, Wagmi) and built-in configuration and examples on NFT minting and querying both off-chain and on-chain.

### PAPI (NFTs pallet) {#papi-nfts-pallet}

**What you’ll have up and running in five minutes:**

1. Fully configured Asset Hub integration
   * All libraries you need to interact with Substrate Asset Hub pallets (including NFTs pallet).
2. Working front‑end demo
   * Connect any wallet and view its balance.
   * Mint an NFT into the preconfigured collection.
3. Working code samples & README
   * Easy-to-use methods for creating and managing native NFTs
   * Instructions for deploying to different networks (production or testnets).
   * Examples of interacting with any Substrate pallet on your chosen chain.

**Usage:**
Coming soon.
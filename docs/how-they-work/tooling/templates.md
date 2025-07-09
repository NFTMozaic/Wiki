---
id: templates
title: Dapp templates
sidebar_label: Dapp templates
sidebar_position: 5
---

# Dapp Templates

Building apps on Polkadot is relatively easy, but getting started can be challenging. Templates help you get up and running quickly by providing pre-configured environments and tools. This saves hours of setup time and is perfect for developers who learn by doing.

Below are templates for both PVM (Solidity) and native Substrate implementations.

## create-nft-app

NFT-specific templates by NFTMozaic.

- [GitHub](https://github.com/paritytech/create-polkadot-dapp)
- [npm](https://www.npmjs.com/package/create-nft-app)

### PVM (Solidity)

A full-stack NFT dApp template built with Next.js, Wagmi, and Foundry for Polkadot. This template provides a complete solution for creating, minting, and viewing NFTs on PolkaVM using Ethereum-compatible tooling.

**Key Features:**
- Next.js
- Wagmi for Ethereum wallet integration and React hooks
- [Reown AppKit](https://reown.com/appkit) (former WalletConnect) for seamless Polkadot wallet connectivity
- [Foundry-Polkadot](https://github.com/paritytech/foundry-polkadot) for smart contract development, configured for `resolc` compiler
- [BlockScout API](https://blockscout-passet-hub.parity-testnet.parity.io/api-docs) for indexer data quering 
- Built-in NFT collection viewing and minting functionality

**Usage:**
```sh
npm create nft-app@latest my-app
```

This template bridges Ethereum development experience with Polkadot's ecosystem, providing developers with familiar tools (Foundry, Wagmi) and built-in configuration and examples on NFT minting and querying both off-chain and on-chain.

### PAPI (NFTs pallet) & Unique SDK templates

Coming soon.

## create-polkadot-dapp

General-purpose templates by Parity.

- [GitHub](https://github.com/paritytech/create-polkadot-dapp)
- [npm](https://www.npmjs.com/package/create-polkadot-dapp)

### PVM (Solidity)

A monorepo template for developing Solidity smart contracts on Asset Hub with a React frontend. This template enables Ethereum-compatible smart contract development on Polkadot using PolkaVM.

**Key Features:**
- React frontend with Tailwind CSS for styling
- MetaMask integration for wallet management
- Ethers.js for blockchain interactions

**Usage:**
```sh
npx create-polkadot-dapp
# Select the react-solidity template
```

This template provides a seamless migration path for Ethereum developers to build on Polkadot while maintaining familiar tooling and development patterns.

### PAPI (NFTs pallet)

A React frontend template using PAPI with ReactiveDOT and dotconnect for chain and wallet interactions. This template is good for applications focused on Polkadot pallets, including the NFTs pallet.

**Key Features:**
- React frontend with Tailwind CSS for styling
- Vite for development tooling
- [ReactiveDOT](https://reactivedot.dev/) as a convenient layer over PAPI
- [DOTConnect](https://dotconnect.dev/) as a wallet connector

**Usage:**
```sh
npx create-polkadot-dapp
```

The template connects to multiple chains simultaneously and provides a solid foundation for building applications using [Polkadot pallets](../../nfts-offer/tech-overview/nft-pallets.md), including any application requiring NFT functionality on Polkadot.


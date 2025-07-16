---
id: Generic dApp
title: Generic dApp
sidebar_label: Generic dApp
sidebar_position: 3
---

`create-polkadot-dapp` is a general-purpose templates by Parity.

- [GitHub](https://github.com/paritytech/create-polkadot-dapp)
- [npm](https://www.npmjs.com/package/create-polkadot-dapp)

### PVM (Solidity) {#create-polkadot-dapp-pvm-solidity}

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

This template provides a seamless development experience for Ethereum developers to build on Polkadot while maintaining familiar tooling and development patterns.

### PAPI (Substrate) {#create-polkadot-dapp-papi-substrate}

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

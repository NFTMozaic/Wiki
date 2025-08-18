---
id: pvm-tools
title: PVM NFT Tools Compatibility
sidebar_label: PVM NFT Tools Compatibility
sidebar_position: 10
---

# PVM NFT Tools Compatibility

We gathered the selected tools into the [`create-nft-app`](../quick-start/nft%20dapp.md) template, providing a quick start for PVM NFT development.

The template includes:

- Wagmi for wallet integration and React hooks
- Reown AppKit (formerly WalletConnect) for onboarding
- Foundry-Polkadot for contract development
- OpenZeppelin contracts for NFT minting
- BlockScout API for indexing

**Wallets**

We evaluated the most popular wallets for PVM compatibility such as `MetaMask` and `Coinbase` wallets. While NFTs are not natively displayed within these wallets by design, this does not affect overall dApp functionality.

**Indexers and BlockExplorers**

[`BlockScout`](https://blockscout-passet-hub.parity-testnet.parity.io/) block explorer and its indexer API were tested against standard NFT use cases. Both performed reliably.

**Minting libraries**

We successfully deployed and tested `ERC-721` and `ERC-1155` contracts from `OpenZeppelin`, using both the [`hardhat-polkadot`](https://github.com/paritytech/hardhat-polkadot) and [foundry-polkadot](https://github.com/paritytech/foundry-polkadot) frameworks. Contract deployment, minting, and transfer flows worked without issues.

**Onboarding tools**

Mainstream onboarding and wallet connection solutions are tested and compatible without any known issues:
- `@wagmi/connectors`
- `Reown App Kit` (former WalletConnect)
- `RainbowKit` 

**SDKs**

Currently, the major NFT-focused SDKs are not immediately compatible with PVM:

- `Rarible` and `OpenSea` protocols rely on contracts that cannot be deployed due to unsupported opcodes and the large bytecode size produced by the revive compiler.
- `Moralis SDK`, `Alchemy NFT API`, `QuickNode NFT API`, and `thirdweb` require vendor-side support to enable compatibility with PVM.

However, general-purpose libraries such as `hardhat`, `viem`, and `wagmi` work seamlessly with PVM and can be used for building NFT applications today.

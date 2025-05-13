---
id: indexers
title: NFT indexers in the Polkadot ecosystem
sidebar_label: NFT Indexers
sidebar_position: 4 
---

_An overview of the indexers available in Polkadot._

# NFT indexers in Polkadot ecosystem


## What is an indexer?

An NFT indexer is a tool that reads, processes, and organizes blockchain data, making NFT metadata, ownership, and transaction history easily accessible for applications without directly scanning the blockchain.

### Applications that depend on NFT indexing

- **dApps & Marketplaces** – Need fast and structured access to NFT data for seamless user experiences.
- **Wallet Interfaces & Block Explorers** – Require standardized metadata retrieval to display NFTs properly.
- **Analytics Platforms** – Depend on reliable transaction history and ownership tracking.
- **Developers** – Need indexing APIs to avoid manually querying blockchain data.

## NFT Indexers List

|             | Subscan                          | KodaDot                          | Unique Network           |
|-------------|----------------------------------|----------------------------------|--------------------------|
| GitHub      | [Subscan](https://github.com/subscan-explorer) | [KodaDot](https://github.com/kodadot/stick) | Private                  |
| Interface   | REST                             | REST, GraphQL, [TypeScript client](https://github.com/kodadot/uniquery)                     | REST, [SDK](https://www.npmjs.com/package/@unique-nft/sdk)                 |
| NFT Pallet  | Pallet NFTs, Pallet Uniques (partially), Unique Network | Pallet NFTs                      | Unique Network (can be extended) |
| Type        | SaaS                             | SaaS, Self-hosted                | SaaS, Self-hosted        |
| Examples    | - | [sample code](https://wiki.nftmozaic.com/docs/how-they-work/kodadot-indexer-integration) | - |

## NFT indexers challenges

### Chain and Pallet-specific indexing gaps

Each Polkadot parachain has its own NFT standards, storage methods, and event structures, making it impossible to apply a single indexing approach across the ecosystem. Without modular solutions, maintaining consistent cross-chain NFT visibility becomes increasingly complex.

### Inconsistent metadata formats

NFT metadata is stored in various formats such as IPFS, JSON, Substrate storage, and Base64. This inconsistency leads to broken or incomplete NFT displays, requiring dApps to implement custom logic for each chain.

### Lack of developer-friendly SDKs & documentation

Most existing indexers lack well-documented SDKs and plug-and-play integrations, forcing developers to build custom solutions from scratch.

## Proposed roadmap

Complete critical upgrades/development to:

- **Kodadot NFT Indexer**: To cover dApp needs for AssetHub and other parachains using Uniques and NFTs pallets.
- **Subscan**: No critical upgrades.
- **Unique Network Indexer**: Coverage of NFTs pallet could serve as a backup/alternative solution.

Proposed Specification for an ideal “to be” Indexer.

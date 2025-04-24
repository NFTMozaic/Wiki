---
id: NFT-Capabilities
title: NFT Capabilities in the Polkadot Ecosystem
sidebar_label: NFT Capabilities
sidebar_position: 3
---




## Executive Summary


Polkadot’s NFT ecosystem spans a spectrum of technologies, from basic native pallets to advanced “NFTs 2.0” pallets, EVM/Solidity smart contracts, and its native Rust-based Ink! Smart contracts. These technologies are available on multiple parachains, where dApps can be built. Variety of tooling options is available for each of them.


This article covers:


- Core NFT pallets (Uniques, NFTs, Unique Network).
- Implementation & tooling (indexers, SDKs, wallet solutions).
- Leading chains/projects (Asset Hub, Moonbeam, Mythical and Unique Network).
- Key challenges and outlook as Polkadot matures.


## 1. Polkadot NFT Pallets & Core Technologies


### 1.1 Pallets Overview


Substrate-based pallets offer native NFT logic—mint, transfer, burn and metadata without relying on external smart contracts. This ensures direct chain-level security and performance, aligning with Polkadot’s shared security model. It is a significantly more efficient way to create and manage Non Fungible Assets then Smart Contracts.


### 1.2 Main Pallet Variants


#### Uniques Pallet


- Minimal NFT approach, widely used by new roll ups (parachains) for specific dApps.
- Built-in on-chain marketplace, flexible permissions.


#### NFTs


- Enhanced engine with collection permissioning, delegated metadata updates, marketplace logic.
- Used by Asset Hub and Mythos.


#### Unique Network


- Native support for NFT 2.0 (dynamic, nested, composable).
- Easy dApps development with full EVM-Substrate interoperability.
- Sponsor-based fees, robust dev toolkits (SDK).


#### Custom NFT Pallet Implementations


- **ORML NFT (used by Acala)** 
 Minimal approach from the ORML toolkit for custom chain developers needing basic NFT logic.
- **Aventus** 
 - No concept of collections.
 - Built-in on-chain marketplace.
 - Bridge with Ethereum.


### 1.3 Usage & Statistics

-

The report in the link below provides an insight into the current distribution of assets, the usage statistics and the contribution details pertaining to the develper activity. This table is live and is updated monthly to reflect changes in the ecosystem.

[NFT Pallets in the Polkadot Ecosystem](https://docs.google.com/spreadsheets/d/1BhlmF9BUw0z6B5qBAqC3j_NMZ0dbhenvgFNFIo4oPhQ/edit?usp=sharing)



## 2. NFT Tooling & SDKs


### 2.1 Pallet vs. EVM vs. Hybrid


- **Substrate Pallets (Uniques, NFTs)**: Efficient, chain-level integration.
- **PVM (AssetHub) and EVM (Moonbeam)**: Familiar for Ethereum devs (ERC-721/1155).
- **Hybrid (Unique Network)**: Merges advanced Substrate logic with optional EVM-based development. Easy dApps development with EVM and full Substrate interoperability.


### 2.2 Indexers


- **KodaDot Indexer**: Open-source, tracks pallet-level NFTs across Polkadot.
- **Unique Network Indexer**: Specialized for dynamic NFT data.
- **Subscan**: Block explorer indexer with API.


### 2.3 Wallet & User Interface Layers


- **Browser Extensions**: Polkadot.js extension, SubWallet, Talisman, as signers.
- **Wallet Interfaces**: Potential for aggregated NFT displays across parachains, but current solutions are chain-specific.
- **dApp Asset Pages**: Could unify user holdings, bridging multiple networks if integrated with robust indexers.




## 3. Leading Projects & Approaches


### 3.1 Asset Hub


- DOT-based.
- Could become a prime anchor in Polkadot’s future “Hub” approach for straightforward mint and transfer dApps (vast majority).
- **KodaDot**: NFT marketplace leveraging Asset Hub’s native capabilities


### 3.2 Moonbeam


- **EVM-Based**: Deploy ERC-721/1155 smart contracts via familiar Ethereum tooling.
- **Use Cases**: 
 - Rarible x Moonbeam art campaigns and marketplace with profit-sharing tokens.
 - Moonbeam has over 27 NFT-based projects in their ecosystem across arts and gaming.
- **Cross-Chain Prospects**: Potential bridging of advanced Substrate NFT features once NFT XCM matures.


### 3.3 Unique Network


- **NFT 2.0**: Dynamic, nested, composable tokens, sponsor-based transaction fees.
- **Use Cases**: 
 - TapNation integrated Unique Network into 2 of its biggest games engaging tens of thousands of players with NFT and UNQ rewards.
 - Dozens of innovative case studies like Kooupon Kraft (loyalty), Online Chess game, IP Creation apps, etc.
 - Conor Daly’s Fan Pass, Sovereign Nature Initiative (DOTphins), DED MINE Arcade (300k NFTs minted).
- **NFT XCM**: Pioneered cross-chain NFT infrastructure


### 3.4 Mythical


- **Focus**: AAA gaming and large IP collaborations (FIFA Rivals).
- **Value Add**: Minted millions of NFTs using Uniques Pallet, proving Polkadot can handle high-volume gaming NFTs at scale.
- **Strength**: High-profile brand partnerships, robust funding—underscoring Polkadot’s capacity to onboard large user bases.


Polkadot has a number of other roll ups that may be used for launching NFT dApps.



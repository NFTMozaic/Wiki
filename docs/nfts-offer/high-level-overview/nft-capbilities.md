---
id: NFT-Capabilities
title: NFT Capabilities in the Polkadot Ecosystem
sidebar_label: NFT Capabilities
sidebar_position: 3 
---


## Executive Summary

Polkadot’s NFT ecosystem spans a spectrum of technologies, from basic native pallets to advanced “NFTs 2.0” pallets, EVM/Solidity smart contracts, and its native Rust-based Ink! Smart contracts. These technologies are available on multiple parachains, where dApps can be built. Variety of tooling options is available for each of them. 

This document covers:

- Core NFT pallets (Uniques, NFTs, Unique Network).
- Implementation & tooling (indexers, SDKs, wallet solutions).
- Leading chains/projects (Asset Hub, Moonbeam, Mythical, and Unique Network).
- Key challenges and outlook as Polkadot matures.

## 1. Polkadot NFT Pallets & Core Technologies

### 1.1 Pallets Overview

Substrate-based pallets offer native NFT logic—mint, transfer, burn, metadata—without relying on external smart contracts. This ensures direct chain-level security and performance, aligning with Polkadot’s shared security model. It is a significantly more efficient way to create and manage Non Fungible Assets then Smart Contracts.

### 1.2 Main Pallet Variants

#### Uniques Pallet

- Minimal NFT approach, widely used by new parachains.
- Built-in on-chain marketplace, flexible permissions.

#### NFTs

- Enhanced engine with collection permissioning, delegated metadata updates, marketplace logic.
- Used by Asset Hub and Mythos.

#### Unique Network

- Native support for NFT 2.0 (dynamic, nested, composable).
- Easy dApps development with EVM and full Substrate interoperability.
- Sponsor-based fees, robust dev toolkits (SDK).

#### Custom NFT Pallet Implementations

- **ORML NFT (used by Acala)**  
  Minimal approach from the ORML toolkit for custom chain developers needing basic NFT logic.
- **Aventus**  
  - No concept of collections.
  - Built-in on-chain marketplace.
  - Bridge with Ethereum.

### 1.3 Usage & Statistics

Pallet usage across Polkadot and Kusama shows varied adoption:

| Pallet         | Polkadot Coll. | Kusama Coll. | Polkadot NFTs | Kusama NFTs |
|----------------|----------------|--------------|---------------|-------------|
| Uniques        | 18,782         | 5,696        | 134,570       | 135,020     |
| NFTs           | 3,208          | 291          | 11,229,910    | 9,387       |
| Unique Network | 871            | 655          | 601,588       | 124,166     |

Uniques leads in total collections, while NFTs handles massive token volumes—over 11 million on Polkadot. Unique’s advanced runtime serves fewer but feature-rich collections.

## 2. NFT Tooling & SDKs

### 2.1 Pallet vs. EVM vs. Hybrid

- **Substrate Pallets (Uniques, NFTs)**: Efficient, chain-level integration.
- **EVM (Moonbeam)**: Familiar for Ethereum devs (ERC-721/1155).
- **Hybrid (Unique Network)**: Merges advanced Substrate logic with optional EVM-based development. Easy dApps development with EVM and full Substrate interoperability.

### 2.2 Indexers

- **KodaDot Indexer**: Open-source, tracks pallet-level NFTs across Polkadot.
- **Unique Network Indexer**: Specialized for dynamic NFT data.
- **Subscan**: Block explorer indexer with API.

### 2.3 Wallet & User Interface Layers

- **Browser Extensions**: Polkadot.js extension, SubWallet, Talisman, as signers.
- **Wallet Interfaces**: Potential for aggregated NFT displays across parachains, but current solutions are chain-specific.
- **dApp Asset Pages**: Could unify user holdings, bridging multiple networks if integrated with robust indexers.

#### Challenges

- **NFT Pallets & Standards**  
  - No unified standard for Substrate, EVM, and Ink!
  - Unclear upgrade policies for Uniques/NFTs pallets.
  - Minimal best-practice guides for new parachains.
- **Wallet Interfaces**  
  - Fragmented cross-chain NFT visibility.
  - Limited chain-specific management (transfer/burn).
  - Complexity grows with NFT XCM.
- **dApp Asset Pages**  
  - Sparse docs and templates.
  - Indexing/API gaps force custom solutions.
  - Inconsistent user experiences.
- **Block Explorers**  
  - Mixed NFT standards = incomplete displays.
  - No single multi-chain overview.
  - Indexing/metadata parsing gaps hinder full NFT tracking.

## 3. Leading Projects & Approaches

### 3.1 Asset Hub

- DOT-based.
- Could become a prime anchor in Polkadot’s future “Hub” approach for straightforward mint and transfer dApps (vast majority).
- **KodaDot**: The only live dApp on AssetHub, a marketplace leveraging Asset Hub’s minimal logic, open-source indexer plans for cross-chain integration.

### 3.2 Moonbeam

- **EVM-Based**: Deploy ERC-721/1155 smart contracts via familiar Ethereum tooling.
- **Use Cases**:  
  - Rarible x Moonbeam (art campaigns) and Moonbeans marketplace with profit-sharing tokens.
  - Moonbeam has almost 27 NFT-based projects in their ecosystem across arts and gaming.
- **Cross-Chain Prospects**: Potential bridging of advanced Substrate NFT features once NFT XCM matures.

### 3.3 Unique Network

- **NFT 2.0**: Dynamic, nested, composable tokens, sponsor-based transaction fees.
- **Use Cases**:  
  - TapNation (with 50M users on one of their mobile games) integrated Unique Network via SDKs - their user base is now exploring crypto rewards in game.
  - Unique Network funded dozens of small MVPs innovative case studies like Kooupon Kraft (loyalty), Online Chess game, IP Creation apps, and more.
  - Conor Daly’s Fan Pass, Sovereign Nature Initiative (DOTphins), DED MINE Arcade (300k NFTs minted).
- **NFT XCM**: Pioneered bridging with Asset Hub; synergy for cross-chain NFT usage.

### 3.4 Mythical

- **Focus**: AAA gaming and large IP collaborations (FIFA Rivals).
- **Value Add**: Minted millions of NFTs using Uniques Pallet, proving Polkadot can handle high-volume gaming NFTs at scale.
- **Strength**: High-profile brand partnerships, robust funding—underscoring Polkadot’s capacity to onboard large user bases.

## 4. Challenges & Outlook

- **Lack of Trading Activity**  
  Despite ongoing creator interest and numerous art initiatives, active NFT trading and liquidity for NFTs in Polkadot’s ecosystem remain low, hindering broader market appeal and user engagement. Examples include Beatport and Wolf of Wall Street Marketplaces, DigitalArt4Climate, various creators on art marketplaces.
- **Complex Cross-Chain NFT Workflow**  
  Polkadot’s NFT XCM is nascent; without cohesive UI/UX, bridging may feel cumbersome rather than empowering.
- **Developer Onboarding**  
  Polkadot.JS can be steep to learn; advanced SDKs (Unique, ORML) help but may involve licensing or subscription. Indexers (KodaDot, Unique) remain vital for analytics, dynamic NFT data, and smoother dev experiences.
- **Evolving “Hub + Cloud” Model**  
  As Polkadot invests in integrated EVM, stablecoins, and governance on the Hub, specialized chains must clarify their unique selling points. Asset Hub’s minimal approach might unify simpler NFT operations, while advanced feature sets (Unique’s dynamic NFTs) cater to specialized dApps.
- **Fragmented NFT Visibility**  
  Users jump among chain-specific dApps; no universal aggregator for on-chain NFTs. NFTMozaic seeks improved wallet interfaces and dApp asset pages to unify user experiences.

## 5. Conclusion

The Polkadot NFT ecosystem offers a wide range of solutions—from minimal on-chain pallets (Asset Hub) to advanced “NFT 2.0” networks (Unique) and EVM expansions (Moonbeam). Major gaming IP partners like Mythical have already minted millions of NFTs, demonstrating Polkadot’s scalability for mainstream adoption. However, universal wallet interfaces, cross-chain indexing, and user-friendly bridging remain the key gaps. As Polkadot’s “Hub + Cloud” continues to unfold—and solutions like NFT XCM mature—projects like Asset Hub, Unique Network, and Moonbeam can evolve into an integrated ecosystem that empowers developers, enterprises, and end-users to seamlessly harness the full potential of next-generation NFTs.

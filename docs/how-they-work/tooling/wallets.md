---
id: wallets
title: NFT Wallets 
sidebar_label: NFT Wallets
sidebar_position: 3 
---

# NFT Wallets 

### What is Wallet

When we say “wallet”, we don’t always mean the same thing. The term can refer to very different components — from the low-level tools that hold private keys, to full-featured interfaces for interacting with NFTs and staking. This distinction matters, especially given the current fragmentation of tooling and standards. Here's how we break it down:

**Core Wallets:** 
 Software or hardware tools that store private keys and enable sending, receiving, and managing assets.

**Browser Extension Signers:** 
 Lightweight, browser-based tools used to connect and sign transactions on dApps.

**Wallet Interfaces:** 
 Applications that integrate core wallets to provide a full user interface for managing tokens, staking, and DeFi.

**dApp Asset Pages:**
 Pages within dApps that display user holdings, transactions, and staking positions without storing assets.
 Unlike more mature ecosystems, Polkadot lacks a standardized set of indexing and API tools for easily fetching and displaying asset data. Developers must rely on custom solutions or scattered third-party services, leading to inconsistencies and increased maintenance overhead.


In our article we focus on **Wallet Interfaces** for Pallet NFTs & Pallet Uniques on Polkadot AssetHub, preliminary.


## List

<div style={{ fontSize: "0.85rem" }}>

|                                | Nova Wallet | SubWallet | Talisman | Fearless Wallet |
|-------------------------------|-------------|-----------|----------|------------------|
| Website                       | [Link](https://novawallet.io/) | [Link](https://www.subwallet.app/) | [Link](https://talisman.xyz) | [Link](https://fearlesswallet.io/) |
| GitHub                        | [Link](https://github.com/novasamatech/) | [Link](https://github.com/Koniverse) | [Link](https://github.com/talismansociety) | [Link](https://github.com/soramitsu) |
| Type                          | Mobile | Mobile, Web | Web | Mobile |
| Show NFT image                | Pallet NFTs | Pallet NFTs, Pallet Uniques | Pallet NFTs | <span style={{ color: "red" }}>No</span> |
| Show full NFT metadata and attributes | <span style={{ color: "red" }}>No</span> | Pallet NFTs, Pallet Uniques | <span style={{ color: "red" }}>No</span> | <span style={{ color: "red" }}>No</span> |
| Show NFT transactions history | <span style={{ color: "red" }}>No</span> | <span style={{ color: "red" }}>No</span> | <span style={{ color: "red" }}>No</span> | <span style={{ color: "red" }}>No</span> |
| Transfer NFT                  | <span style={{ color: "red" }}>No</span> | Pallet NFTs, Pallet Uniques | <span style={{ color: "red" }}>No</span> | <span style={{ color: "red" }}>No</span> |
| Burn NFT                      | <span style={{ color: "red" }}>No</span> | <span style={{ color: "red" }}>No</span> | <span style={{ color: "red" }}>No</span> | <span style={{ color: "red" }}>No</span> |
| Other NFT-related features    | Applications can be opened in the mobile browser. | Applications can be opened in the mobile browser. | Supports Unique Network pallet also. Link to KodaDot Marketplace from NFT details. | <span style={{ color: "red" }}>No</span> |

</div>

### Wallet Interfaces Challenges

**Poor NFT Coverage**

Currently only SubWallet supports NFTs functionality at a decent level. Talisman shows them to the users and directs to Kodadot for any further functionality. Other wallets do not support NFTs at all. 

**Fragmented NFT Visibility**

Current wallets support NFTs from select networks and pallets, but there’s no way for users to view all their NFTs in one place. Finding a specific NFT often requires navigating to a particular network, meaning users must remember where it was minted—far from a seamless experience. Unlike coins, there’s no unified interface that displays all NFTs across Polkadot networks on a single screen.

**Limited NFT Management Options**

Tools for transferring or burning NFTs are largely chain-specific and inconsistent. Users face a patchwork of dApps, often lacking in functionality or ease of use, making basic NFT management unnecessarily complex.

**NFT XCM Foundational Barrier**

Without addressing visibility and management challenges, cross-chain transfers risk adding complexity rather than unlocking interoperability and utility for users.

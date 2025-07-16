---
id: unique-network-sdk-react
title: On-chain gaming with Unique Network EVM
sidebar_label: On-chain gaming with Unique Network EVM
sidebar_position: 3
---

# Building on-chain gaming experiences with Unique Network EVM

A step-by-step guide teaching you how to create Unique Network native NFTs and mutate their attributes using Solidity smart contracts, the Unique SDK, and the unique-contracts packages.

This tutorial focuses on how the EVM can be used to extend the core functionality provided by the Unique SDK and integrate the Solidity contracts in the Unique SDK.

This is a very interesting application case for two specific reasons:

- Unique Network NFTs are Substrate-based entities (i.e they are stored on the Unique Network's substrate chain) which differ quite substantially from the ERC-721 style NFTs.

- A contract is not at all needed to create NFTs with very advanced features.

So what role does an EVM Solidity contract play in the Unique Network ecosystem? It provides a mechanism to extend the existing feature set with specialized application scenarios tailored to meet the needs of custom implemetations. All in all, if you can concieve it as a contract, you can attach it to the NFT without sacrificing the fast-paced development that the Unique SDK provides you with. 

[Unique Network EVM Workshop](https://github.com/UniqueNetwork/unique-react-template/tree/workshop-evm)


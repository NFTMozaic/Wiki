---
sidebar_position: 1
hide_table_of_contents: false
toc_min_heading_level: 2
toc_max_heading_level: 4
---

# Polkadot Unique Assets Standards

## Abstract

This repository establishes standards for Unique Assets in the Polkadot ecosystem, representing NFT-like objects of any meaning and purpose. The standards define a Unique Asset, how it can be identified throughout the ecosystem, how it can be inspected on any chain, and how it can be modified in a standard way.

## Motivation

The Polkadot ecosystem has the crucial advantage of interoperability between its participants in a secure and decentralized manner. Specialized blockchains (the parachains) participate in the shared Polkadot consensus while maintaining their sovereignty. Each parachain isn't restricted to what service it provides and how it should be built, which opens more possibilities for innovation.

This approach leads to fragmentation of implementations and duplication of ideas. The different implementations have their strengths, but the fragmentation of the API and understanding of similar notions is causing friction to build the products for the end-users. This is what happened with the Unique Assets (NFTs, CoreTime regions, and other unique objects like exchange pools) in the ecosystem.

Standards are needed to prevent this. The interactions between chains are standardized via XCM, which already provides a common language for expressing NFT transfers. The [Fellowship RFC 125 "XCM Asset Metadata"](https://polkadot-fellows.github.io/RFCs/approved/0125-xcm-asset-metadata.html) paves the way for data communication between chains. With these tools, parachains are capable of interacting with each other. Unfortunately, this doesn't cover the client side.

This document aims to solve the client-side problem through standardization. It defines what a Unique Asset can be and what generic APIs should be exposed by a compliant parachain.

The described standards are designed after analyzing the existing NFT solutions in the ecosystem and are flexible enough to account for all known existing solutions.

## Unique Asset Definition

A Unique Asset is any unique object existing on-chain. The nature of such an asset should be defined purely by what it can do.

For instance, Unique Assets can be represented by:

- regular NFTs
- NFT collections
- fungible collections
- CoreTime regions
- exchange pools

All the objects above can be uniquely identified and have some data attached. These properties are attributed to all Unique Assets.

All Unique Assets have a privileged set of operations that can only be done by a special user. This user is considered an asset owner. The owner can be a user account or a chain's system account (like Treasury).

The common properties of Unique Assets form the main parts of the standards, which are mandatory for all compliant parachains.

- The Unique Assets must have a standard identification. See the [Identification Standard](./identification.md).
- The Unique Assets' attached data must be inspectable by a client. See the [Inspection Standard](./inspection.md).
- The Unique Assets can be modified. The modification operations are subject to authorization and may be rejected by the given chain according to its internal rules. See the [Modification Standard](./modification/modification.md).

The Modification Standard describes the mandatory operations like changing the asset's owner or data. Also, it esteblishes the way of adding standard extensions that can be optionally supported by parachains.

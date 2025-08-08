---
id: pallet-nfts-update-guidelines
title: Update Guidelines for pallet-nfts
sidebar_label: Update Guidelines for pallet-nfts
sidebar_position: 1
---

# Update Guidelines for pallet-nfts

![DRAFT](https://img.shields.io/badge/status-DRAFT-blue?style=flat-square)

This document specifies how to change the pallet-nfts in the Polkadot SDK. It classifies the changes by their impact on the clients (i.e., dApps) and the pallet's dependents (i.e., parachain runtimes that host it), outlining the corresponding recommendations of each change class.

The guideline shields the pallet from drastic changes since the pallet-nfts is a general Polkadot NFT solution
and should be stable enough to be usable across chains without significant maintenance burden on the pallet's users.

Also, the guideline enforces the stability of the pallet's client interface. Breaking dApps is forbidden.
This prohibits any changes of the existing business logic.

The only exception to the rules defending dApps from API-breaking changes is when a security flaw is found in the present pallet implementation and cannot be fixed without breaking the pallet's public interface.

## Table of Contents

- [Modifying the pallet](#modifying-the-pallet)
  - [Extrinsics, Events, and Errors](#extrinsics-events-and-errors)
  - [Storages](#storages)
  - [Implementing new Rust traits](#implementing-new-rust-traits)
  - [Config changes](#config-changes)
  - [Pallet instance changes](#pallet-instance-changes)
- [Extending Runtime API](#extending-runtime-api)

## Modifying the pallet

### Extrinsics, Events, and Errors

Changes to the existing public client-facing interface, including extrinsics, events, and errors, are prohibited
unless the change affects the Rust side only and it is transparent to the client.

Adding new extrinsics, events, and errors is allowed.

### Storages

1. Changes to the existing storages are forbidden since some clients rely on their API.
    - The exception to this is the storages that provide data for the existing Runtime API,
and it is known that clients use the Runtime API instead of relying on the storages in question. A proper migration must accompany any change to storages.
2. Adding new storages is allowed.

### Implementing new Rust traits

1. There are no restrictions on what Rust traits the pallet implements.
2. When changing the existing traits' implementations, one must do this in a backward-compatible way: the change must not break the compilation of the existing pallet dependents that use the traits in question.
The business logic should always remain the same unless there is a security issue and the business logic is discovered to be flawed.

### Config changes

1. It is allowed to change the pallet's config contents, such as adding or removing an associated type or some trait bounds.
2. It is recommended to lighten the config requirements, so removing unnecessary trait bounds is desirable.
3. It is recommended to avoid adding or removing an associated type in the config to prevent the compilation of the pallet dependents from breaking.

### Pallet instance changes

Parachains with a developed dApps ecosystem around them, such as AssetHub, must not change the publicly visible types of their pallet-nfts instance because changing types (such as `ItemConfig`) leads to an API-breaking change. Changes to the pallet instance's config must be transparent to the client.

Changing the pallet instance's config values (such as `CollectionDeposit`) is allowed.

## Extending Runtime API

1. The existing Runtime APIs must not be modified.
2. New Runtime APIs could be added. They are recommended to reflect a certain category of the pallet's functionality, e.g., NFT market information.
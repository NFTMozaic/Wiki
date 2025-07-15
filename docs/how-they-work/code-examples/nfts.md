---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# An Applied Guide to NFTs Pallet

:::warning Work In Progress
This guide is work in progress
:::

:::info Prerequisites
This guide assumes you have basic knowledge of Polkadot, understand the basic terminology such as pallets and extrinsics

All coding examples are written with Polkadot-API (PAPI). However, this guide does not cover the basics such as how to initialize PAPI or create a signer. You can start by reading the official [PAPI documentation](https://papi.how/), or if you prefer to learn by doing, you can debug all the [provided code examples](https://github.com/NFTMozaic/papi-nfts) or start with one of the [available templates](../tooling/templates.md).
:::

The NFTs pallet is the primary method for creating all types of NFTs on Polkadot. This guide explores it's capabilities in depth. Learn about other available options in the [overview section](../../nfts-offer/tech-overview/nft-pallets.md).

## 1. Collections

On Polkadot, NFTs begin with a collection, which is a container for future tokens. Every collection has a unique numeric ID that increments each time a new collection is created.

### Creating a Collection

When creating a collection, you need to specify:

- **`admin`**: the collection's administrator who has rights to manage the collection. Read about [collection roles](#collection-roles).
- **collection `config`**: a set of rules and configurations for the collection.

Creating a collection with PAPI looks like this:

```ts title="Creating a basic collection"
const createCollectionTx = await api.tx.Nfts.create({
  admin: MultiAddress.Id(alice.address),
  config: {
    max_supply: 1000,
    mint_settings: {
      default_item_settings: 0n,
      mint_type: { type: "Issuer", value: undefined },
      price: undefined,
      start_block: undefined,
      end_block: undefined,
    },
    settings: 0n,
  },
}).signAndSubmit(alice);
```

### Collection Configuration

A set of rules and configurations for a collection. This configuration is set during creation and can be modified later by the [collection team](#collection-roles).

1. `max_supply`: the maximum number of tokens that can be minted. This can be omitted if the collection does not have a supply limit. This value can be overwritten if it is not locked by collection settings.

2. collection `settings`: can be specified in bitflag format for a collection. They define the locked status of:
   - NFT transfers: Controls whether items can be transferred between accounts. When set, items become non-transferable. You can still mint tokens though.
   - Collection metadata: When set, metadata becomes permanently locked and cannot be set or changed. This setting applies only to collection metadata; token metadata mutability is defined differently.
   - Collection attributes: When set, the collection attributes become permanently locked. This setting applies only to collection attributes; token attributes mutability is defined differently.
   - Collection max supply: When set, the max supply becomes permanently fixed.

Examples:

- `0` (0000): All settings unlocked
- `15` (1111): All settings locked
- `9` (1001): Locked max supply and tokens are non-transferable

Collection settings can be locked but never unlocked. You may want to leave them mutable (`0`) and lock them later, for example when all NFTs are minted.

3. `mint_settings`: the rules related to token minting
   1. `mint_type`: who can mint tokens.
      - `Issuer`: Only the collection owner or issuer can mint
      - `Public`: Everyone can mint
      - `HolderOf`: Only holders of NFTs in the specified collection can mint
   2. `price`: The price of token minting that will be paid to the collection owner. This can be useful for `Public` minting.
   3. `start_block` and `end_block`: allows you to specify a timeframe when minting is allowed
   4. `default_item_settings`: the default settings that define whether future items can be transferred and whether item attributes and metadata are mutable. Here are all possible bitflags for item settings:

| Value | Binary | Mutable attributes | Mutable metadata | Transferable |
| ----- | ------ | ------------------ | ---------------- | ------------ |
| 0     | 000    | ✅ Yes             | ✅ Yes           | ✅ Yes       |
| 1     | 001    | ✅ Yes             | ✅ Yes           | 🔒 No        |
| 2     | 010    | ✅ Yes             | 🔒 No            | ✅ Yes       |
| 3     | 011    | ✅ Yes             | 🔒 No            | 🔒 No        |
| 4     | 100    | 🔒 No              | ✅ Yes           | ✅ Yes       |
| 5     | 101    | 🔒 No              | ✅ Yes           | 🔒 No        |
| 6     | 110    | 🔒 No              | 🔒 No            | ✅ Yes       |
| 7     | 111    | 🔒 No              | 🔒 No            | 🔒 No        |

Once metadata or attributes are locked, it will not be possible to unlock them. By default, you may want to set `default_item_settings` to `0` and modify them later.

### Collection Roles

There are four roles that exist for a collection.

#### Owner

The collection creator becomes the owner of the collection. The owner can:

- Set team: change the collection's `Issuer`, `Admin`, and `Freezer`. Be careful—after setting a role to None, it cannot be set again.
- Destroy collection: only if there are no items in the collection.
- Set collection max supply: set the maximum number of items for a collection.
- Redeposit: re-evaluate the deposit on some items.
- Change collection settings: make NFTs non-transferable, set collection max supply, and lock metadata and attributes.

The collection owner can set the other roles:

```ts
const setTeamTx = await api.tx.Nfts.set_team({
  collection: collectionId,
  admin: MultiAddress.Id(charlie.address),
  issuer: MultiAddress.Id(dave.address),
  freezer: MultiAddress.Id(eve.address),
}).signAndSubmit(alice);
```

The roles are set as a bitflag and can be queried for an account:

```ts
const roles = await api.query.Nfts.CollectionRoleOf.getValue(
  collectionId,
  account.address
);
// roles is a bitflag
```

The following bit flags can be set:

| Value | Binary | Admin  | Freezer | Issuer |
| ----- | ------ | ------ | ------- | ------ |
| 1     | 001    | 🔒 No  | 🔒 No   | ✅ Yes |
| 2     | 010    | 🔒 No  | ✅ Yes  | 🔒 No  |
| 3     | 011    | 🔒 No  | ✅ Yes  | ✅ Yes |
| 4     | 100    | ✅ Yes | 🔒 No   | 🔒 No  |
| 5     | 101    | ✅ Yes | 🔒 No   | ✅ Yes |
| 6     | 110    | ✅ Yes | ✅ Yes  | 🔒 No  |
| 7     | 111    | ✅ Yes | ✅ Yes  | ✅ Yes |

Ownership can be transferred in two steps:

1. The future receiver should accept ownership:

```ts
const receiveTx = await api.tx.Nfts.set_accept_ownership({
  maybe_collection: collectionId,
}).signAndSubmit(receiver);
expect(receiveTx.ok).toBe(true);
```

2. After that, the collection owner can transfer:

```ts
const transferTx = await api.tx.Nfts.transfer_ownership({
  collection: collectionId,
  new_owner: MultiAddress.Id(charlie.address),
}).signAndSubmit(owner);
```

#### Admin

A collection `Admin` is the only role set during collection creation. Until other roles are set after collection creation, an `Admin` receives `Issuer` and `Freezer` roles as well.

Admin can:

- Set collection attributes and metadata
- Clear collection metadata
- Set collection item attributes and metadata
- Lock item properties (metadata and attributes)

#### Freezer

Freezer can:

- Lock item transfers
- Unlock item transfers

#### Issuer

Issuer can:

- Mint, force mint, and mint pre-signed
- Update mint settings

## 2. Items (NFTs)



## Deposits

To prevent spam, a deposit must be paid for certain actions. This deposit will be locked and refunded to the collection creator if the collection or related item is destroyed.

The deposit amount for collection and item creation is fixed (but can be changed in the future). The deposit amounts can be queried as constants using PAPI:

- `api.constants.Nfts.CollectionDeposit()`
- `api.constants.Nfts.ItemDeposit()`
- `api.constants.Nfts.MetadataDepositBase()`
- `api.constants.Nfts.AttributeDepositBase()`
- `api.constants.Nfts.DepositPerByte()`

Current deposits are:

- Collection creation: basic amount of `0.2013` DOT
- Item creation: basic amount of `0.005041` DOT
- Setting metadata for a collection/item: basic amount of `0.020129` DOT, plus an additional amount of `0.00001` DOT per byte
- Setting attributes for a collection/item: basic amount of `0.02` DOT, plus an additional amount of `0.00001` DOT per byte
---
title: An applied guide to NFTs Pallet
sidebar_label: An applied guide to NFTs Pallet
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# An applied guide to NFTs Pallet

:::warning Work In Progress
This guide is a work in progress.
:::

:::info Prerequisites
This guide assumes you have basic knowledge of Polkadot and understand basic terminology such as pallets and extrinsics.

All coding examples are written with Polkadot-API (PAPI). However, this guide does not cover the basics such as how to initialize PAPI or create a signer. You can start by reading the official [PAPI documentation](https://papi.how/), or if you prefer to learn by doing, you can explore all the [provided code examples](https://github.com/NFTMozaic/papi-nfts) or start with one of the [available templates](../quick-start/comparison.md).
:::

The NFTs pallet is the primary method for creating all types of NFTs on Polkadot. This guide explores its capabilities in depth. Learn about other available options in the [overview section](../../nfts-offer/tech-overview/nft-pallets.md).

## 1. Collections

On Polkadot, NFTs begin with a collection, which is a container for future tokens. Every collection has a unique numeric ID that increments each time a new collection is created.

### Creating a collection

:::info
Creating a collection requires making a [deposit](#deposits).
:::

When creating a collection, you need to specify:

- **`admin`**: the collection's administrator who has the rights to manage the collection. Read about [collection roles](#collection-roles).
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
}).signAndSubmit(collectionOwner);
```

When the collection is created, you can get its ID from the emitted events.

```ts
...

const event = createCollectionTx.events.find(
  (e) => e.type === "Nfts" && e.value.type === "Created"
);

const collectionId = event.collection as number;
```

Let's also consider what the `max_supply`, `mint_settings`, and `settings` fields mean.

### Collection configuration

During collection creation, you need to specify a set of rules and configurations for the collection. This configuration is set during creation and can be modified later by the [collection team](#collection-roles) if not [locked](#collection-settings-and-locks).

#### Maximum collection supply

`max_supply` is the maximum number of tokens that can be minted. This setting can be omitted if the collection does not have a supply limit.

```ts title="Setting max supply during collection creation"
const createCollectionTx = await api.tx.Nfts.create({
  admin: MultiAddress.Id(alice.address),
  config: {
    // highlight-next-line
    max_supply: 1000,
    ...
  },
}).signAndSubmit(collectionOwner);
```

The [collection owner](#owner) can modify the maximum collection supply if it is not locked by [collection settings](#collection-settings-and-locks).

```ts
const setMaxSupplyTx = await api.tx.Nfts.set_collection_max_supply({
  max_supply: 500,
  collection: collectionId,
}).signAndSubmit(collectionOwner);
```

#### Collection settings and locks

Collection `settings` can be specified in bitflag format for a collection. They define the locked status of:

- NFT transfers: Controls whether items can be transferred between accounts. When set, items become non-transferable (soulbound). You can still mint tokens, however.
- Collection metadata: When set, metadata becomes permanently locked and cannot be set or changed. This setting applies only to collection metadata; token metadata mutability is defined separately.
- Collection attributes: When set, the collection attributes become permanently locked. This setting applies only to collection attributes; token attribute mutability is defined separately.
- Collection max supply: When set, the max supply becomes permanently fixed.

```ts title="Collection settings can be specified during collection creation"
const createCollectionTx = await api.tx.Nfts.create({
  admin: MultiAddress.Id(alice.address),
  config: {
    ...
    // highlight-next-line
    settings: 0n,
  },
}).signAndSubmit(collectionOwner);
```

Examples:

- `0` (0000): All settings unlocked
- `15` (1111): All settings locked
- `9` (1001): Locked max supply and tokens are non-transferable

:::warning
Collection settings can be locked but never unlocked. You may want to leave them mutable (`0`) and lock them later, for example, when all NFTs are minted.
:::

<details>
  <summary>Click to see the full list of collection settings bitflags</summary>

| Value | Binary | Transferable NFTs | Mutable Collection Metadata | Mutable Collection Attributes | Mutable Max Supply |
| ----- | ------ | ----------------- | --------------------------- | ----------------------------- | ------------------ |
| 0     | 0000   | ✅ Yes            | ✅ Yes                      | ✅ Yes                        | ✅ Yes             |
| 1     | 0001   | 🔒 No             | ✅ Yes                      | ✅ Yes                        | ✅ Yes             |
| 2     | 0010   | ✅ Yes            | 🔒 No                       | ✅ Yes                        | ✅ Yes             |
| 3     | 0011   | 🔒 No             | 🔒 No                       | ✅ Yes                        | ✅ Yes             |
| 4     | 0100   | ✅ Yes            | ✅ Yes                      | 🔒 No                         | ✅ Yes             |
| 5     | 0101   | 🔒 No             | ✅ Yes                      | 🔒 No                         | ✅ Yes             |
| 6     | 0110   | ✅ Yes            | 🔒 No                       | 🔒 No                         | ✅ Yes             |
| 7     | 0111   | 🔒 No             | 🔒 No                       | 🔒 No                         | ✅ Yes             |
| 8     | 1000   | ✅ Yes            | ✅ Yes                      | ✅ Yes                        | 🔒 No              |
| 9     | 1001   | 🔒 No             | ✅ Yes                      | ✅ Yes                        | 🔒 No              |
| 10    | 1010   | ✅ Yes            | 🔒 No                       | ✅ Yes                        | 🔒 No              |
| 11    | 1011   | 🔒 No             | 🔒 No                       | ✅ Yes                        | 🔒 No              |
| 12    | 1100   | ✅ Yes            | ✅ Yes                      | 🔒 No                         | 🔒 No              |
| 13    | 1101   | 🔒 No             | ✅ Yes                      | 🔒 No                         | 🔒 No              |
| 14    | 1110   | ✅ Yes            | 🔒 No                       | 🔒 No                         | 🔒 No              |
| 15    | 1111   | 🔒 No             | 🔒 No                       | 🔒 No                         | 🔒 No              |

</details>

The [collection owner](#owner) can change these settings by locking them. Once again – this operation cannot be undone – a locked setting is locked forever.

```ts title="Collection owner locks everything"
await api.tx.Nfts.lock_collection({
  collection: collectionId,
  lock_settings: 15n,
}).signAndSubmit(collectionOwner);
```

#### NFT minting settings

The rules related to [token minting](#) include:

1. `mint_type`: who can mint tokens.

- `Issuer`: Only the collection issuer can mint
- `Public`: Everyone can mint
- `HolderOf`: Only holders of NFTs in the specified collection can mint

2. `price`: The price of token minting that will be paid to the collection owner. This can be useful for `Public` minting.
3. `start_block` and `end_block`: allow you to specify a timeframe when minting is allowed
4. `default_item_settings`: the default settings that define whether future items can be transferred and whether item attributes and metadata are mutable.

:::warning
Once metadata, attributes, or transfers are locked, it will not be possible to unlock them. By default, you may want to set `default_item_settings` to `0` and modify them later.
:::

<details>
  <summary>Click to see the full list of item settings bitflags</summary>

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

</details>

### Collection metadata

:::info
Setting collection metadata requires making a [deposit](#deposits).
:::

Collection-level metadata can be added to or removed from a collection by the collection admin if it is not locked at the collection level. While there are no enforced formatting rules, you'll most likely want to use it similarly to how `contractURI` is used in Ethereum. You can set a link to IPFS or any other off-chain storage, or store this metadata on-chain.

```json title="The possible collection metadata format"
{
  "name": "My collection name",
  "description": "This is my cool collection",
  "image": "https://some-external-storage.com/image.png"
}
```

Collection metadata can be set after the collection is created.

```ts title="The collection admin can set collection metadata"
await api.tx.Nfts.set_collection_metadata({
  collection: collectionId,
  data: Binary.fromText("https://some-external-storage.com/metadata.json"),
}).signAndSubmit(collectionAdmin);
```

The collection admin can clear metadata:

```ts
await api.tx.Nfts.clear_collection_metadata({
  collection: collectionId,
}).signAndSubmit(collectionAdmin);
```

There is a separate method to query collection metadata:

```ts
collectionMetadata = await api.query.Nfts.CollectionMetadataOf.getValue(
  collectionId
);
```

### Collection attributes

:::info
Setting collection attributes requires making a [deposit](#deposits).
:::

Collection attributes are on-chain key-value pairs of arbitrary data. The collection [admin](#admin) can set or remove attributes of a collection if the collection is not [locked](#collection-settings-and-locks).

```ts
await api.tx.Nfts.set_attribute({
  collection: collectionId,
  key: Binary.fromText("Key"),
  value: Binary.fromText("Attribute value"),
  namespace: { type: "CollectionOwner", value: undefined },
  maybe_item: undefined,
}).signAndSubmit(owner);
```

You can query a collection attribute:

```ts
let collectionAttribute = await api.query.Nfts.Attribute.getValue(
  collectionId,
  undefined,
  { type: "CollectionOwner", value: undefined },
  Binary.fromText("Key")
);
```

The collection admin can clear a collection attribute if attributes are not locked.

```ts
await api.tx.Nfts.clear_attribute({
  collection: collectionId,
  key: Binary.fromText("test"),
  namespace: { type: "Key", value: undefined },
  maybe_item: undefined,
}).signAndSubmit(collectionAdmin);
```

### Destroying a collection

The [collection owner](#owner) can destroy a collection if there are no items. If the collection has attributes or item metadata set, their amounts should be provided in the witness:

```ts
await api.tx.Nfts.destroy({
  collection: collectionId,
  witness: {
    attributes: 2,
    item_configs: 1,
    item_metadatas: 1,
  },
}).signAndSubmit(owner);
```

You can query witness data before destroying a collection:

```ts
const witness = await api.query.Nfts.Collection.getValue(collectionId);
```

### Collection Roles

There are four roles that exist for a collection.

#### Owner

The collection creator becomes the owner of the collection. The owner can:

- Set team: change the collection's `Issuer`, `Admin`, and `Freezer`. Be careful—after setting a role to None, it cannot be set again.
- Destroy collection: only if there are no items in the collection.
- Set collection max supply: set the maximum number of items for a collection.
- Redeposit: re-evaluate the deposit on some items.
- Change collection settings: make NFTs non-transferable, lock metadata and attributes.

The collection owner can set the other roles:

```ts
const setTeamTx = await api.tx.Nfts.set_team({
  collection: collectionId,
  admin: MultiAddress.Id(charlie.address),
  issuer: MultiAddress.Id(dave.address),
  freezer: MultiAddress.Id(eve.address),
}).signAndSubmit(collectionOwner);
```

The roles are stored as a bitflag and can be queried for an account:

```ts
const roles = await api.query.Nfts.CollectionRoleOf.getValue(
  collectionId,
  account.address
);
// roles is a bitflag
```

The following bitflags can be set:

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

1. The future recipient should accept ownership:

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

:::info
The [deposit](#deposits) associated with the collection will be transferred to the new owner.
:::

#### Admin

A collection `Admin` is the only role set during collection creation. Until other roles are set after collection creation, an `Admin` receives `Issuer` and `Freezer` roles as well.

The Admin can:

- Set collection attributes and metadata
- Clear collection metadata
- Set collection item attributes and metadata
- Lock item properties (metadata and attributes)

#### Freezer

The Freezer can:

- Lock item transfers
- Unlock item transfers

#### Issuer

The Issuer can:

- Mint, force mint, and mint pre-signed
- Update mint settings

## 2. Items (NFTs)

### NFT minting

:::info
NFT minting requires making a [deposit](#deposits).
:::

Collection items (NFTs) can be created depending on [minting settings](#nft-minting-settings):

- `Issuer`: Only the collection issuer can mint
- `Public`: Everyone can mint
- `HolderOf`: Only holders of NFTs in the specified collection can mint

The account eligible for minting needs to provide a unique item ID. Additionally, witness data should be provided in the following cases:

1. Mint types set to `HolderOf`, then item ID of specified collection should be provided
2. Mint `price` is set – then the price of minting should be provided.

```ts
const mintTx = await api.tx.Nfts.mint({
  collection: collectionId,
  item: 1,
  mint_to: MultiAddress.Id(bob.address),
  witness_data: {
    mint_price: 5n * 10n ** 10n, // If the mint price is 5 DOT
    owned_item: 2,
  },
}).signAndSubmit(alice);
```

Check that the transaction has been successful or search for a special event to make sure the NFT has been minted successfully.

```ts
const event = mintTx.events.find(
  (e) => e.type === "Nfts" && e.value.type === "Issued"
);
```

#### Presigned minting

Presigned minting allows collection issuers to create off-chain mint authorizations that others can execute on-chain. This is particularly useful for:

- Whitelisted NFT drops where specific users get guaranteed minting rights
- Marketplace integrations where third parties mint on behalf of creators
- Time-limited campaigns with automatic expiration
- Decentralized claiming where users mint when convenient rather than receiving airdrops

To create a presigned mint authorization, the issuer prepares mint data and signs it off-chain:

```ts
import { getTypedCodecs } from "polkadot-api";

// Get codecs for encoding mint data
const codecs = await getTypedCodecs(dot);
const mintDataCodec = codecs.tx.Nfts.mint_pre_signed.inner.mint_data;

// Prepare mint data
const mintData = {
  collection: collectionId,
  item: 1,
  attributes: [
    [Binary.fromText("tier"), Binary.fromText("gold")],
    [Binary.fromText("whitelist"), Binary.fromText("true")],
  ] as FixedSizeArray<2, Binary>[],
  metadata: Binary.fromText("Presigned NFT #1"),
  only_account: bob.address, // Optional: restrict to specific account
  deadline: 10_000_000, // Block number when authorization expires
  mint_price: undefined, // Optional: set price requirements
};

// Encode and sign the data
const encodedData = mintDataCodec.enc(mintData);
const signature = await issuer.signBytes(encodedData);
```

The authorized user can then execute the mint:

```ts
const mintTx = await api.tx.Nfts.mint_pre_signed({
  mint_data: mintData,
  signature: MultiSignature.Sr25519(FixedSizeBinary.fromBytes(signature)),
  signer: issuer.address,
}).signAndSubmit(bob);
```

Key parameters for presigned minting:

- `only_account`: Restricts who can use the authorization. If undefined, anyone can use it.
- `deadline`: Block number after which the authorization expires
- `mint_price`: Optional payment required from the minter
- `attributes`: Attributes to set during minting

### NFT metadata

<!-- TODO -->
<!-- TODO: approve -->

:::info
Setting item metadata requires making a [deposit](#deposits).
:::

### NFT attributes

<!-- TODO -->
<!-- TODO: approve -->
<!-- TODO: set presigned -->

:::info
Setting item attributes requires making a [deposit](#deposits).
:::

### NFT transfer

<!-- TODO -->

### NFT burn

<!-- TODO: deposits will be released. But somehow magically, some of them will some won't -->
The item owner can `burn` an NFT.

```ts
await api.tx.Nfts.burn({
  collection: collectionId,
  item: itemId,
}).signAndSubmit(itemOwner);
```

## Trading

### Settings price

### Buy

### Swap

## Deposits

To prevent blockchain bloat, a deposit must be paid for certain actions. This deposit will be reserved and can be recovered if the associated storage is cleared or ownership is transferred.

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

## Batching

:::info
WIP
:::
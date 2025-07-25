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
This guide assumes you have basic knowledge of Polkadot and understand fundamental terminology such as pallets and extrinsics.

All coding examples use Polkadot-API (PAPI). However, this guide doesn't cover the basics like initializing PAPI or creating a signer. You can start by reading the official [PAPI documentation](https://papi.how/), or if you prefer learning by doing, explore the [provided code examples](https://github.com/NFTMozaic/papi-nfts) or start with one of the [available templates](../quick-start/comparison.md).
:::

The NFTs pallet is the primary method for creating all types of NFTs on Polkadot. This guide explores its capabilities in depth. Learn about other available options in the [overview section](../../nfts-offer/tech-overview/nft-pallets.md).

## 1. Collections

On Polkadot, NFTs begin with a collection, which serves as a container for future tokens. Every collection has a unique numeric ID that increments each time a new collection is created.

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

When the collection is created, you can get its ID from the emitted events:

```ts
...

const event = createCollectionTx.events.find(
  (e) => e.type === "Nfts" && e.value.type === "Created"
);

const collectionId = event.collection as number;
```

Let's also examine what the `max_supply`, `mint_settings`, and `settings` fields mean.

### Collection configuration

During collection creation, you need to specify a set of rules and configurations for the collection. This configuration is set during creation and can be modified later by the [collection team](#collection-roles) if not [locked](#collection-settings-and-locks).

#### Maximum collection supply

`max_supply` is the maximum number of tokens that can be minted. This setting can be omitted if the collection doesn't have a supply limit.

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

The [collection owner](#owner) can modify the maximum collection supply if it's not locked by [collection settings](#collection-settings-and-locks).

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
- Collection attributes: When set, collection attributes become permanently locked. This setting applies only to collection attributes; token attribute mutability is defined separately.
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
Collection settings can be locked but never unlocked. You may want to leave them mutable (`0`) and lock them later, for example, after all NFTs are minted.
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

The [collection owner](#owner) can change these settings by locking them. Remember – this operation cannot be undone – a locked setting remains locked forever.

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
Once metadata, attributes, or transfers are locked, it's not possible to unlock them. By default, you may want to set `default_item_settings` to `0` and modify them later.
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

Collection-level metadata can be added to or removed from a collection by the collection [admin](#admin) if it's not locked. While there are no enforced formatting rules, you'll most likely want to use it similarly to how `contractURI` is used in Ethereum NFT standards. You can set a link to IPFS or any other off-chain storage, or store this metadata on-chain.

```json title="The possible collection metadata format"
{
  "name": "My collection name",
  "description": "This is my cool collection",
  "image": "https://some-external-storage.com/image.png"
}
```

Collection metadata can be set after the collection is created:

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

There's a separate method to query collection metadata:

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

The collection admin can clear a collection attribute if attributes are not locked:

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

<!-- TODO: add some intro what will be covered -->

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

Check that the transaction has been successful or search for a special event to make sure the NFT has been minted successfully:

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
import { MultiSignature, dot } from "@polkadot-api/descriptors";
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

:::info
Setting item metadata requires making a [deposit](#deposits).
:::

The collection [Admin](#admin) can set or remove an item's metadata if it's not [locked](#locking-nft). Most likely you'll want to use metadata the same way as `tokenURI` in the ERC-721 metadata extension. You can set a link to IPFS or any other off-chain storage.

```json title="The possible NFT metadata format"
{
  "name": "My NFT",
  "description": "The description here",
  "image": "https://some-external-storage.com/image.png",
  "attributes": [
    {
      "trait_type": "Color",
      "value": "Red"
    },
    {
      "trait_type": "Size",
      "value": "M"
    }
  ]
}
```

Once your metadata is uploaded, the collection admin can attach the link to the item:

```ts
const setMetadataTx = await api.tx.Nfts.set_metadata({
  collection: collectionId,
  data: Binary.fromText("https://external-storage.com/metadata.json"),
  item: 1,
}).signAndSubmit(collectionAdmin);
```

You can then query the item's metadata and the amount of deposit:

```ts
const metadataTx = await api.query.Nfts.ItemMetadataOf.getValue(
  collectionId,
  1
);
const metadata = metadata?.data.asText(); // "https://example.com"
const deposit = metadata?.deposit; // {account: ..., amount: ...}
```

There's a dedicated method to clear item metadata. The [deposit](#deposits) associated with metadata will be released:

```ts
const clearMetadataTx = await api.tx.Nfts.clear_metadata({
  collection: collectionId,
  data: Binary.fromText("https://external-storage.com/metadata.json"),
  item: 1,
}).signAndSubmit(collectionAdmin);
```

### NFT attributes

:::info
Setting item attributes requires making a [deposit](#deposits).
:::

NFT attributes are on-chain key-value pairs of arbitrary data. This is particularly useful when some characteristics should be mutable, for example in gaming applications.

The collection [admin](#admin) or item owner can set or remove attributes of an item if the item is not [locked](#locking-nft). To specify who can modify attributes, you need to set a namespace:

```ts
const collectionOwnerAttribute = await api.tx.Nfts.set_attribute({
  collection: collectionId,
  maybe_item: 1,
  // highlight-next-line
  namespace: { type: "CollectionOwner", value: undefined },
  key: Binary.fromText("Experience"),
  value: Binary.fromText("300"),
}).signAndSubmit(collectionAdmin);

const itemOwnerAttributeTx = await api.tx.Nfts.set_attribute({
  collection: collectionId,
  maybe_item: 1,
  // highlight-next-line
  namespace: { type: "ItemOwner", value: undefined },
  key: Binary.fromText("Owner"),
  value: Binary.fromText("Bob"),
}).signAndSubmit(itemOwner);
```

You can then query item attributes and deposits:

```ts
// Get all attributes
const attributes = await api.query.Nfts.Attribute.getEntries(
  collectionId,
  itemId
);

// Or just a single attribute
const attribute = await api.query.Nfts.Attribute.getValue(
  collectionId,
  1,
  { type: "CollectionOwner", value: undefined },
  Binary.fromText("Experience")
);
```

To clear an unlocked attribute, any signer that conforms to the namespace ruleset can execute the dedicated method. The deposit associated with the attribute will be released:

```ts
const clearAttributeTx = await api.tx.Nfts.clear_attribute({
  collection: collectionId,
  maybe_item: 1,
  key: Binary.fromText("Experience"),
  namespace: { type: "CollectionOwner", value: undefined },
}).signAndSubmit(alice);
```

#### Setting presigned attributes

Presigned attributes enable authorized parties to create off-chain attribute authorizations that item owners can apply on-chain. This is particularly useful for scenarios like reveals and delayed attribute applications.

To create a presigned attribute authorization, an authorized signer (collection admin for CollectionOwner namespace) prepares attribute data and signs it off-chain:

```ts
import { MultiSignature, dot } from "@polkadot-api/descriptors";
import { getTypedCodecs, FixedSizeArray, Binary } from "polkadot-api";

// Get codecs for encoding attribute data
const codecs = await getTypedCodecs(dot);
const attributeDataCodec = codecs.tx.Nfts.set_attributes_pre_signed.inner.data;

// Prepare attribute data
const attributeData = {
  collection: collectionId,
  item: 1,
  deadline: 10_000_000, // Block number when authorization expires
  namespace: { type: "CollectionOwner", value: undefined },
  attributes: [
    [Binary.fromText("Experience"), Binary.fromText("300")],
    [Binary.fromText("Power"), Binary.fromText("200")],
  ] as FixedSizeArray<2, Binary>[],
};

// Encode and sign the data
const encodedData = attributeDataCodec.enc(attributeData);
const signature = await collectionAdmin.signBytes(encodedData);
```

The item owner can then apply the presigned attributes:

```ts
const setAttributesPresignedTx = await api.tx.Nfts.set_attributes_pre_signed({
  data: attributeData,
  signature: MultiSignature.Sr25519(FixedSizeBinary.fromBytes(signature)),
  signer: collectionAdmin.address,
}).signAndSubmit(itemOwner);
```

Key parameters for presigned attributes:

- `deadline`: Block number after which the authorization expires
- `namespace`: Only `CollectionOwner` and `Account` namespaces are supported
- `attributes`: Up to 10 key-value pairs can be set in a single transaction
- `signer`: Must be authorized for the specified namespace (collection admin for `CollectionOwner`)

The transaction will fail if the deadline has passed, the signer lacks proper authorization, or the maximum attribute limit is exceeded.

#### Approving attribute modifications

Item owners can approve other accounts to set attributes in the `Account` namespace for their NFTs. This is particularly useful for scenarios where you want to allow trusted third parties to modify certain attributes on your behalf, such as in gaming applications where game servers need to update player stats.

Multiple accounts can be approved for the same item:

```ts
// Approve first delegate
await api.tx.Nfts.approve_item_attributes({
  collection: collectionId,
  item: 1,
  delegate: MultiAddress.Id(charlie.address),
}).signAndSubmit(itemOwner);

// Approve second delegate
await api.tx.Nfts.approve_item_attributes({
  collection: collectionId,
  item: 1,
  delegate: MultiAddress.Id(dave.address),
}).signAndSubmit(itemOwner);
```

You can check which accounts are approved to set attributes for an item:

```ts
const approvals = await api.query.Nfts.ItemAttributesApprovalsOf.getValue(
  collectionId,
  itemId
);
// Returns an array of approved account addresses
```

Once approved, the delegate can set attributes using the `Account` namespace:

```ts
const setAttributeTx = await api.tx.Nfts.set_attribute({
  collection: collectionId,
  maybe_item: 1,
  namespace: { type: "Account", value: delegate.address },
  key: Binary.fromText("GameScore"),
  value: Binary.fromText("1500"),
}).signAndSubmit(delegate);
```

:::info
Only the `Account` namespace is supported. Attributes in different namespaces cannot be modified by approved accounts.
:::

Item owners can revoke approval at any time. The witness parameter should match or exceed the actual number of attributes set by the delegate to avoid transaction failure.

:::warning
When canceling approval, all attributes set by the delegate in the `Account` namespace will be permanently removed.
:::

```ts
const cancelApprovalTx = await api.tx.Nfts.cancel_item_attributes_approval({
  collection: collectionId,
  item: 1,
  delegate: MultiAddress.Id(delegate.address),
  witness: 2, // Number of attributes set by this delegate
}).signAndSubmit(itemOwner);
```

### NFT transfer

NFT owners can transfer their tokens to other accounts either directly or through an approval system that allows designated delegates to execute transfers on their behalf.

#### Direct transfer

The NFT owner can directly transfer their token to any account:

```ts
const transferTx = await api.tx.Nfts.transfer({
  collection: collectionId,
  item: 1,
  dest: MultiAddress.Id(charlie.address),
}).signAndSubmit(currentOwner);
```

After a successful transfer, you can verify the new ownership:

```ts
const itemData = await api.query.Nfts.Item.getValue(collectionId, 1);
const newOwner = itemData?.owner; // charlie.address
```

#### Approved transfers

NFT owners can approve multiple accounts to transfer their tokens on their behalf. This is useful for marketplaces, escrow services, or allowing trusted parties to manage transfers.

Multiple accounts can be approved for the same NFT:

```ts
// Approve first delegate
await api.tx.Nfts.approve_transfer({
  collection: collectionId,
  item: 1,
  delegate: MultiAddress.Id(charlie.address),
  maybe_deadline: undefined,
}).signAndSubmit(nftOwner);

// Approve second delegate
await api.tx.Nfts.approve_transfer({
  collection: collectionId,
  item: 1,
  delegate: MultiAddress.Id(dave.address),
  maybe_deadline: undefined,
}).signAndSubmit(nftOwner);
```

You can check the current approvals for an NFT:

```ts
const itemData = await api.query.Nfts.Item.getValue(collectionId, 1);
const approvals = itemData?.approvals; // Array of approved delegates
```

Once approved, any delegate can execute the transfer using the same `transfer` method:

```ts
const delegatedTransferTx = await api.tx.Nfts.transfer({
  collection: collectionId,
  item: 1,
  dest: MultiAddress.Id(newOwner.address),
}).signAndSubmit(approvedDelegate);
```

:::info
When a transfer is executed (either direct or approved), all existing transfer approvals for that NFT are automatically cleared.
:::

#### Managing transfer approvals

NFT owners can cancel specific approvals:

```ts
const cancelApprovalTx = await api.tx.Nfts.cancel_approval({
  collection: collectionId,
  item: 1,
  delegate: MultiAddress.Id(delegate.address),
}).signAndSubmit(nftOwner);
```

Or clear all transfer approvals at once:

```ts
const clearAllApprovalsTx = await api.tx.Nfts.clear_all_transfer_approvals({
  collection: collectionId,
  item: 1,
}).signAndSubmit(nftOwner);
```

#### Transfer restrictions

NFT transfers can be restricted at the collection level through [collection settings](#collection-settings-and-locks) or [token level](#locking-nfts). When transfers are locked, NFTs become non-transferable (soulbound) and cannot be moved between accounts, though they can still be minted and burned.

### NFT burn

<!-- TODO, there is a bug, non transferrable NFTs should be unburnable, but they don't -->
The item owner can `burn` an NFT:

```ts
await api.tx.Nfts.burn({
  collection: collectionId,
  item: itemId,
}).signAndSubmit(itemOwner);
```

### Locking NFTs

NFTs can be locked to restrict certain behaviors and ensure immutability. The following properties can be locked:

- **Transferability**: Prevents NFTs from being transferred between accounts (making them soulbound)
- **Metadata mutability**: Permanently prevents changes to NFT metadata
- **Attributes mutability**: Permanently prevents changes to NFT attributes

When minting NFTs, the `default_item_settings` from the collection's [mint settings](#nft-minting-settings) will be applied to each newly created item. 

You can check an item's current lock status:

```ts
const itemSettings = await api.query.Nfts.ItemConfigOf.getValue(collectionId, 1);
// itemSettings is a bitflag representing the lock status
```

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

#### Locking transfers

Transfer restrictions can be applied at both collection and item levels:

**Collection-level transfer locks** can be set by the [collection owner](#owner). This affects all items in the collection and is permanent—it cannot be undone.

**Item-level transfer locks** can be managed by the [collection freezer](#freezer) and can be both locked and unlocked as needed.

```ts title="Freezer can lock and unlock transfers for specific NFTs"
// Lock transfers for a specific NFT
await api.tx.Nfts.lock_item_transfer({
  collection: collectionId,
  item: itemId,
}).signAndSubmit(freezer);

// Unlock transfers for a specific NFT
await api.tx.Nfts.unlock_item_transfer({
  collection: collectionId,
  item: itemId,
}).signAndSubmit(freezer);
```

#### Locking metadata and attributes

Item metadata and attributes can be permanently locked by the [collection admin](#admin). Once locked, these properties become immutable and cannot be changed.

:::warning
This operation is irreversible. Once metadata or attributes are locked, they cannot be unlocked or modified.
:::

```ts title="Collection admin permanently locks metadata and attributes"
await api.tx.Nfts.lock_item_properties({
  collection: collectionId,
  item: itemId,
  lock_metadata: true,
  lock_attributes: true,
}).signAndSubmit(admin);
```

### Trading

The NFTs pallet includes built-in trading capabilities that enable direct peer-to-peer transactions without requiring external marketplaces or intermediaries. The trading system supports both simple buy/sell operations and sophisticated item swaps with optional additional payments.

#### Setting an NFT Price

NFT owners can list their tokens for sale by setting a price. This creates an immediate purchase opportunity for any interested party:

```ts
const setPriceTx = await api.tx.Nfts.set_price({
  collection: collectionId,
  item: itemId,
  price: 1n * 10n ** 10n, // 1 DOT
  whitelisted_buyer: undefined, // Optional: restrict to specific buyer
}).signAndSubmit(nftOwner);
```

The `whitelisted_buyer` parameter allows sellers to restrict purchases to a specific account, enabling private sales or exclusive offers.

You can query the current listing price:

```ts
const itemPrice = await api.query.Nfts.ItemPriceOf.getValue(collectionId, 1);
const currentPrice = itemPrice?.[0]; // Returns price or undefined if not for sale
```

#### Buying an NFT

Once an NFT is listed for sale, any account can purchase it by matching or exceeding the asking price:

```ts
const buyItemTx = await api.tx.Nfts.buy_item({
  collection: collectionId,
  item: itemId,
  bid_price: ITEM_PRICE, // Must be >= the listed price
}).signAndSubmit(buyer);
```

The transaction will:
- Transfer ownership of the NFT to the buyer
- Transfer the payment to the seller
- Automatically remove the item from sale
- Clear any existing transfer approvals

#### Withdrawing from Sale

NFT owners can remove their items from the marketplace at any time by setting the price to `undefined`:

```ts
const withdrawTx = await api.tx.Nfts.set_price({
  collection: collectionId,
  item: itemId,
  price: undefined, // Removes from sale
  whitelisted_buyer: undefined,
}).signAndSubmit(nftOwner);
```

Once withdrawn, purchase attempts will fail with a `NotForSale` error.

#### NFT Swapping

The swapping system enables complex peer-to-peer trades where users can exchange NFTs from different collections, optionally with additional payments flowing in either direction.

##### Creating a Swap Offer

To initiate a swap, specify what you're offering and what you want in return:

```ts
const createSwapTx = await api.tx.Nfts.create_swap({
  offered_collection: collectionIdA,
  offered_item: itemIdA,
  desired_collection: collectionIdB,
  maybe_desired_item: undefined, // Any item from collection, or specify item ID
  maybe_price: {
    amount: 5n * 10n ** 10n, // 0.5 DOT additional payment
    direction: { type: "Receive", value: undefined }, // "Send" or "Receive"
  },
  duration: 1000, // Swap expires after 1000 blocks
}).signAndSubmit(swapCreator);
```

**Key Parameters:**

- `maybe_desired_item`: Set to `undefined` to accept any item from the collection, or specify an exact item ID
- `maybe_price`: Optional additional payment. Use `"Send"` if you'll pay extra, `"Receive"` if you want to receive payment
- `duration`: Number of blocks until the swap offer expires

You can query pending swaps:

```ts
const swap = await api.query.Nfts.PendingSwapOf.getValue(collectionId, itemId);
// Returns swap details or undefined if no pending swap exists
```

##### Claiming a Swap

Anyone holding a suitable NFT can claim an active swap:

```ts
const claimSwapTx = await api.tx.Nfts.claim_swap({
  send_collection: collectionIdB,
  send_item: itemIdB, // Claimer's item in collection B
  receive_collection: collectionIdA,
  receive_item: itemIdA,
  witness_price: {
    amount: 5n * 10n ** 10n,
    direction: { type: "Receive", value: undefined },
  },
}).signAndSubmit(swapClaimer);
```

The `witness_price` must match the original swap terms exactly. After a successful claim:
- Both NFTs change ownership
- Any additional payment is transferred
- The swap is automatically removed from pending swaps

##### Canceling Swap Offers

Cancel your own swap offers:

```ts
const cancelSwapTx = await api.tx.Nfts.cancel_swap({
  offered_collection: collectionId,
  offered_item: itemId,
}).signAndSubmit(swapCreator);
```

## Deposits

To prevent blockchain bloat, deposits must be reserved for certain actions. These deposits can be released when the associated storage is cleared or ownership is transferred.

Deposit amounts for collection and item creation are fixed (but may change in future updates). You can query deposit amounts as constants using PAPI:

- `api.constants.Nfts.CollectionDeposit()`
- `api.constants.Nfts.ItemDeposit()`
- `api.constants.Nfts.MetadataDepositBase()`
- `api.constants.Nfts.AttributeDepositBase()`
- `api.constants.Nfts.DepositPerByte()`

Current deposit amounts:

- Collection creation: base amount of `0.2013` DOT
- Item creation: base amount of `0.005041` DOT
- Setting metadata for a collection/item: base amount of `0.020129` DOT, plus an additional `0.00001` DOT per byte
- Setting attributes for a collection/item: base amount of `0.02` DOT, plus an additional `0.00001` DOT per byte

## Batching

:::info
Work in progress
:::

<!-- TODO: tips -->
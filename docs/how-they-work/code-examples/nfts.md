# The Complete Guide to NFTs Pallet

The NFTs pallet is the primary method for creating all types of NFTs on Polkadot. Learn about other available options in the [overview section](../../nfts-offer/tech-overview/nft-pallets.md).

This comprehensive guide explores the capabilities of the NFTs pallet in depth. All coding examples are written in Polkadot-API (PAPI). However, this guide does not cover the basics such as how to initialize PAPI or create a signer. You can start by reading the official [PAPI documentation](https://papi.how/), or if you prefer to learn by doing, you can debug all the [provided code examples](https://github.com/NFTMozaic/papi-nfts) or start with one of the [available templates](../tooling/templates.md).

## 1. Collections

On Polkadot, NFTs begin with a collection, which is a container for future tokens. Every collection has a unique numeric ID that increments each time a new collection is created.

When creating a collection, you need to specify:
- `admin`: the collection's administrator who has rights to manage the collection. <!-- TODO: read about roles here <anchor-link> -->
- collection `config`: a set of rules and configurations for the collection.

### Collection Configuration

A set of rules and configurations for a collection. This configuration is set during minting and can be modified later by the collection team.
<!-- TODO: the anchor link to the roles -->

1. `maxSupply`: the maximum number of tokens that can be minted. This value can be overwritten if it is not locked.

2. collection `settings`: can be specified in bitflag format for a collection:
    - Transferrable items: Controls whether items can be transferred between accounts. When disabled, items become non-transferrable.
    - Unlocked metadata: Determines metadata mutability. When disabled, metadata becomes permanently locked and cannot be changed
    - Unlocked attributes: Controls attribute mutability in the CollectionOwner namespace. When disabled, these attributes become permanently locked
    - Unlocked max supply: Allows modification of the maximum supply limit. When disabled, the max supply becomes permanently fixed

Examples:
- `0` (0000): All settings unlocked
- `15` (1111): All settings locked
- `9` (1001): Locked max supply and tokens are non-transferable 

<!-- TODO: fact check -->
There is a very high chance you don't want to lock metadata and attributes before minting is finished.

## Deposits

To prevent spam, a deposit must be paid for certain actions. This deposit will be locked and refunded to the collection creator if the collection or related item is destroyed.

The deposit amount for collection and item creation is fixed (but can be changed in the future). The deposit amounts can be queried as constants. Using PAPI:
- `api.constants.Nfts.CollectionDeposit()`
- `api.constants.Nfts.ItemDeposit()`
- `api.constants.Nfts.MetadataDepositBase()`
- `api.constants.Nfts.AttributeDepositBase()`
- `api.constants.Nfts.DepositPerByte()`

Current deposits are:

- Collection creation: basic amount of `0.2013` DOT
- Item creation: basic amount of `0.005041` DOT
- Setting metadata to a collection/item: basic amount of `0.020129` DOT, additional amount of `0.00001` DOT per byte
- Setting attributes to a collection/item: basic amount of `0.02` DOT, additional amount of `0.00001` DOT per byte
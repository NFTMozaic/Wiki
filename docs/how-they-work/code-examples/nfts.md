# The Complete Guide to NFTs Pallet

Pallet NFTs is the primary way to create all sorts of NFTs on Polkadot. Learn about other available options in the [overview section](../../nfts-offer/tech-overview/nft-pallets.md).

This is the full guide explaining the capabilities of NFTs pallet in depth. All the coding examples are written in Polkadot-API (PAPI), but this guide does not explain how to initialize it. You can start by reading the official [PAPI documentation](https://papi.how/) or if you prefer to learn by doing, you can start with one of the [available templates](../tooling/templates.md).

## 1. Collections

On Polkadot, NFTs start with a collection, which is a container for future tokens.

### Deposit

To prevent spam, a deposit must be paid for certain actions. This deposit will be locked and refunded to the collection creator if the collection or related item is destroyed.

The deposit amount for collection and item creation is fixed (but can be changed in the future) and can be queried. Current deposits are:

- Collection creation: basic amount of `0.2013` DOT
- Item creation: basic amount of `0.005041` DOT
- Setting metadata to a collection/item: basic amount of `0.020129` DOT, additional amount of `0.00001` DOT per byte
- Setting attributes to a collection/item: basic amount of `0.02` DOT, additional amount of `0.00001` DOT per byte
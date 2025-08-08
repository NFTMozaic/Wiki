---
sidebar_position: 2
hide_table_of_contents: false
toc_min_heading_level: 2
toc_max_heading_level: 4
---

# Unique Assets Identification

## Abstract

This standard specifies how the Unique Assets must be identified in the Polkadot ecosystem throughout the parachains.

For its motivation, see the [Polkadot Unique Asset Standards](./polkadot-unique-assets-standards.md) document.

## Specification

The Unique Assets can be represented as NFTs. The Polkadot ecosystem already has an established way of identifying them, yet just for the limited scope: cross-chain transfers.

This document proposes to use the XCM identification of NFTs as the ecosystem-wise standard of identifying Unique Assets.

```rust
struct UniqueAsset {
    /// The overall asset identity.
    pub id: XcmAssetId,

    /// The *instance ID*, the secondary asset identifier.
    /// E.g., an NFT within the collection identified by the `id` above.
    pub instance: XcmAssetInstance,
}
```

The `UniqueAsset` struct should be versioned in the same manner as XCM. The version of the `UniqueAsset` struct must correspond to the version of XCM types inside it:

```rust
struct UniqueAssetV3 {
    pub id: XcmV3AssetId,
    pub instance: XcmV3AssetInstance,
}
```

The corresponding `VersionedUniqueAsset` enum is also defined for clients to use:

```rust
pub enum VersionedUniqueAsset {
    V3(UniqueAssetV3),
    V4(UniqueAssetV4),
    // and so on, following the XCM versions
}
```

The `VersionedUniqueAsset` should always be used in the API facing the client, not the concrete version of the `UniqueAsset` struct.
The reason is the same as for XCM: if a chain upgrades to a newer version, it shouldn't break the existing clients that haven't yet upgraded themselves.

### Individual Assets and Asset Groups

Since Unique Assets can be represented by individual assets like NFTs and their groups like NFT collections, we need to distinguish them.

This document follows the approach [described](https://polkadot-fellows.github.io/RFCs/approved/0125-xcm-asset-metadata.html#repurposing-assetinstanceundefined) in the Fellowship RFC 125 "XCM Asset Metadata".

A Unique Asset that represents a group of assets (such as an NFT collection) can be identified as follows:

```rust
UniqueAsset {
    id: COLLECTION_ID, // `COLLECTION_ID` is a placeholder for a value.
    instance: XcmAssetInstance::Undefined,
}
```

A Unique Asset that **is** a part of a group (such as an NFT within a collection) is identified as follows:

```rust
UniqueAsset {
    id: COLLECTION_ID, // `COLLECTION_ID` is a placeholder for a value.
    instance: NFT_ID, // `NFT_ID` is a placeholder for a value.
}
```

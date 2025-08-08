---
sidebar_position: 3
hide_table_of_contents: false
toc_min_heading_level: 2
toc_max_heading_level: 4
---

# Unique Assets Inspection

## Abstract

As described in the [Polkadot Unique Assets Standards document](./polkadot-unique-assets-standards.md), Unique Assets have attached data (the metadata).

This document specifies the transport-level metadata representation, the API for its retrieval, and the application-level formats.

## Specification

### Transport-level Metadata Format

The Transport-level Metadata Format describes how a Unique Asset's data should be communicated between a parachain and its client.

This document proposes to use the format defined for the [XCM Asset Metadata](https://polkadot-fellows.github.io/RFCs/approved/0125-xcm-asset-metadata.html#explanation).

Hence, the metadata on the transport level is represented by a SCALE-encoded BTreeMap, where both keys and values are raw bytes.

```rust
type MetadataKey = Vec<u8>;
type MetadataValue = Vec<u8>;
type MetadataMap = BTreeMap<MetadataKey, MetadataValue>;
```

### Runtime API

A compliant chain must provide the following Runtime API to allow a client to fetch the metadata of a Unique Asset.

```rust
// The `MetadataQueryKind` and `MetadataResponseData`
// are the same as in the XCM Asset Metadata RFC.

type MetadataKeySet = BTreeSet<MetadataKey>;

enum MetadataQueryKind {
    /// Query metadata key set.
    KeySet,

    /// Query values of the specified keys.
    Values(MetadataKeySet),
}

enum MetadataResponseData {
    /// The metadata key list to be reported
    /// in response to the `KeySet` metadata query kind.
    KeySet(MetadataKeySet),

    /// The values of the keys that were specified in the
    /// `Values` variant of the metadata query kind.
    Values(MetadataMap),
}

trait UniqueAssetApi {
    /// Return the metadata of the provided Unique Asset.
    /// Can return either a metadata key set
    /// or metadata values for the specified keys. 
    fn query_metadata(
        // See the Identification Standard.
        asset: VersionedUniqueAsset,

        query_kind: MetadataQueryKind,
    ) -> Result<MetadataResponseData, XcmError>;

    /// Query the interior assets of the specified asset.
    /// E.g., the `asset` can be an NFT collection
    /// and the "interior assets" are NFTs within it.
    ///
    /// This method may return a portion of data.
    /// The result vector must be ordered such that
    /// a new data chunk can be retrieved starting from the last object.
    /// NOTE: when iterating, this method MUST be called on the same block,
    /// otherwise the results are unspecified.
    ///
    /// The second argument must be `None` on first call of this method.
    fn query_interior_assets(
        asset: VersionedUniqueAsset,
        iterate_from: Option<VersionedUniqueAsset>,
    ) -> Result<Vec<VersionedUniqueAsset>, XcmError>;
}
```

### Application-level Metadata Formats

The clients must interpret the metadata encoded in the transport-level format using the application-level formats. The chains must also honor the application-level formats, though only a few are mandatory.

Each application-level format must have a unique name and a set of keys, and their value types must be defined. The format must also explicitly define what keys are mutable and, if so, how they are supposed to be mutated.

:::note
if a key is optional (or can be deleted if it exists), its type must be an `Option<T>`, where `T` can be substituted with any type in the key description.
:::

The formats must be listed in this section. More application-level formats can be added in the future.

The format's name must prefix the keys corresponding to this format. For instance, `ownership:owner` defines the metadata key `owner` of the `ownership` application-level format.

#### Format: `supported`

This format is mandatory. All chains must implement it for all Unique Assets.

##### Fields

- `supported:formats`: a mandatory field containing a SCALE-encoded list of supported application-level formats for the given Unique Asset.

This key can only be mutated by a system chain operation, such as a Runtime Upgrade or a custom alternative privileged transaction.

##### Example

A client can always fetch the supported formats of a Unique Asset.

```js
// Fetches the supported application-level formats of collection #42 on Unique Network
query_metadata(
  {
    V4: {
      id: {
        parents: 0,
        interior: { X1: [{ GeneralIndex: 42 }] },
      },
      instance: "Undefined",
    },
  },

  {
    Values: ["supported:formats"],
  }
);
```

The `query_metadata` from the example above must return at least the following:

```js
{
    "supported:formats": ["supported", "ownership"]
}
```

#### Format: `ownership`

This format is mandatory. All chains must implement it for all Unique Assets.

##### Fields

- `ownership:owner`: a mandatory field containing a SCALE-encoded `VersionedXcmLocation` representing the owner of the Unique Asset. The value's XCM version is determined by the Unique Asset's version supplied to the `query_metadata`.
  A privileged operation can modify this key, but it must explicitly specify the change to this field.

##### Example

A client can always fetch the owner of a Unique Asset.

```js
// Fetches the owner of collection #42 on Unique Network
query_metadata(
  {
    V4: {
      id: {
        parents: 0,
        interior: { X1: [{ GeneralIndex: 42 }] },
      },
      instance: "Undefined",
    },
  },

  {
    Values: ["ownership:owner"],
  }
);
```

The `query_metadata` from the example above might return the following:
```js
{
    "ownership:owner": {
        V4: {
            parents: 0,
            interior: {
                X1: [{ AccountId32: { id: "5EkPpFmJcVP4mN5mHLKZqkYUzkDWvjmjqs6t14m4rgndfEm8" } }]
            }
        }
    }
}
```

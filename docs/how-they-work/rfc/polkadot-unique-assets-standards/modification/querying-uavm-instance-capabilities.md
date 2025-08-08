---
sidebar_position: 3
hide_table_of_contents: false
toc_min_heading_level: 2
toc_max_heading_level: 4
---

# Querying UAVM Instance Capabilities

## Abstract

This document specifies the [UAVM](./modification.md)'s instance capabilities and how a client can query them for a given chain.

## Runtime API

A compliant chain must provide the following Runtime API for a client to query the chain's UAVM instance capabilities:

```rust
trait UavmApi {
    fn capabilities(version: XcmVersion) -> Result<UavmCapabilities, XcmError>;
}
```

## Report Format

The report format is a list of instruction capabilities reports.
The list must not contain duplicates.
```rust
type UavmCapabilities = Vec<InstructionCapabilities>;
```

Every instruction capability report is an object of the following form:
```js
{
    // The name of the instruction supported by the given chain.
    "INSTRUCTION_NAME": {
        /*
            the list of instruction names that can alter
            the behavior of the instruction in question.
    
            Only the alterations supported by the chain must be reported.
        */
        "alterations": ALTERATION_LIST,
    
        /*
            ... instruction-specific fields ...
        */
    }
}
```

This document specifies the `InstructionCapabilities` type for all the defined instructions (both mandatory and extension ones).

A given chain may provide a stripped version of it, with the extension ones partially or completely absent.

```rust
enum InstructionCapabilities {
    SelectAsset {
        alterations: Vec<String>,

        /// See the [`SelectableAsset`] documentation.
        selectable_assets: Vec<SelectableAsset>,
    },

    SetBeneficiary {
        alterations: Vec<String>,

        /// See the [`ValidBeneficiary`] documentation.
        valid_beneficiaries: Vec<ValidBeneficiary>
    },

    TransferSelectedAsset {
        alterations: Vec<String>,
    },

    AddMetadataUpdate {
        alterations: Vec<String>,
    },

    ResetMetadataUpdate {
        alterations: Vec<String>,
    },

    UpdateSelectedAsset {
        alterations: Vec<String>,
    },

    SetMetadataUpdateMode {
        alterations: Vec<String>,
    },

    CreateSelectedAsset {
        alterations: Vec<String>,
    },

    DeriveAsset {
        alterations: Vec<String>,
    },

    DestroySelectedAsset {
        alterations: Vec<String>,
    },

    UnlinkSelectedAsset {
        alterations: Vec<String>,
    },
}

/// Represent a Unique Asset that is valid to be selected.
///
/// For instance, on AssetHub one can only select NFTs of the following forms:
/// - NFTs from pallet-uniques:
///   ```rust
///   XcmAsset {
///     id: AssetId { parents: 0, interior: X2(PalletInstance(51), GeneralIndex(COLLECTION_ID)) },
///     fun: NonFungible(AssetInstance::Index(ITEM_ID))
///   }
///   ```
/// - NFTs from pallet-nfts:
///   ```rust
///   XcmAsset {
///     id: AssetId { parents: 0, interior: X2(PalletInstance(52), GeneralIndex(COLLECTION_ID)) },
///     fun: NonFungible(AssetInstance::Index(ITEM_ID))
///   }
///   ```
/// Nothing else can be selected as a Unique Asset there (at the time of writing this text).
/// NOTE: COLLECTION_ID is variable but the `id` prefix is fixed (at least when we are working with a single pallet).
/// The same goes for the ITEM_ID. It is variable but the `AssetInstance::Index` is fixed.
///
/// A list of `SelectableAsset` objects tells the client the form of selectable assets on the given chain.
/// The corresponding `SelectableAsset` objects for the example above are as follows:
/// - NFTs from pallet-uniques:
///   ```rust
///   SelectableAsset {
///     asset_representative: XcmAsset {
///         id: AssetId { parents: 0, interior: X2(PalletInstance(51), GeneralIndex(0)) },
///         fun: NonFungible(AssetInstance::Index(0))
///     },
///     id_variable_suffix_len: 1, // the GeneralIndex can vary
///   }
///   ```
/// - NFT from pallet-nfts
///   ```rust
///   SelectableAsset {
///     asset_representative: XcmAsset {
///         id: AssetId { parents: 0, interior: X2(PalletInstance(52), GeneralIndex(0)) },
///         fun: NonFungible(AssetInstance::Index(0))
///     },
///     id_variable_suffix_len: 1, // the GeneralIndex can vary
///   }
///   ```
struct SelectableAsset {
    asset_representative: UniqueAsset,
    id_variable_suffix_len: usize,
}

/// This struct is similar to the [`SelectableAsset`].
/// It defines what XCM form of beneficiaries is valid on the given chain.
struct ValidBenificiary {
    beneficiary_representative: XcmLocation,
    variable_suffix_len: usize,
} 
```
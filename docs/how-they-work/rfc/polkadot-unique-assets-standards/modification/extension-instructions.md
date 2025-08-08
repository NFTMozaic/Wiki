---
sidebar_position: 2
hide_table_of_contents: false
toc_min_heading_level: 2
toc_max_heading_level: 4
---

# UAVM Extension Instructions

## Abstract

This document specifies the optional instructions of the [UAVM](./modification.md).

## Instructions

### Additional Registers

The following registers are needed for the extension instructions in addition to the registers defined for the mandatory ones.

>NOTE: The registers are outlined only to indicate the data flow between instructions (i.e., how they influence each other). A chain's UAVM instance must ensure data flow, but the actual solution for it is implementation-defined.

| Register | Value Type | Default Value | Note |
|----------|------------|---------------|------|
| `MetadataUpdateMode` | `enum { Preserving, Replacing }` | `Preserving` | |

----

```rust
pub enum ExtensionInstruction {
    /// - Influenced by registers: none
    /// - Modifies registers:
    ///     * `MetadataUpdateMode`: writes the supplied metadata update
    /// - Preconditions: none
    ///
    /// This instruction may alter the behavior of the `UpdateSelectedAsset` instruction.
    /// - When the register is set to `Preserving`,
    ///   the behavior of the `UpdateSelectedAsset` isn't altered: it updates only the specified keys' values.
    /// - When the register is set to `Replacing`,
    ///   the "generally mutable" metadata keys are erased before the update is applied.
    ///
    /// NOTE: A key is considered "generally mutable" only
    /// if its application-level format explicitly states this.
    SetMetadataUpdateMode(MetadataUpdateMode),

    /// - Influenced by registers:
    ///     * `SelectedAsset`: specifies the pre-defined ID of the Unique Asset to create.
    ///     * `Beneficiary`: specifies the owner of the new Unique Asset.
    ///     * `MetadataUpdate`: specifies the initial metadata state of the newly created asset.
    /// - Modifies registers: none
    /// - Preconditions:
    ///     * the selected asset must NOT exist
    ///     * the transaction origin must be authorized to perform this operation
    ///
    /// This instruction creates a new Unique Asset with a predefined ID,
    /// equal to the value of the `SelectedAsset` register.
    ///
    /// The owner of the new Unique Asset must be set according to the `Beneficiary` regiser. 
    ///
    /// This instruction must use the `MetadataUpdate` regiser
    /// to initialize the initial metadata state of the new Unique Asset.
    CreateSelectedAsset,

    /// - Influenced by registers:
    ///     * `SelectedAsset`: specifies ID of the Unique Asset Group where new asset will be created.
    ///     * `Beneficiary`: specifies the owner of the new Unique Asset.
    ///     * `MetadataUpdate`: specifies the initial metadata state of the newly created asset.
    /// - Modifies registers:
    ///     * `SelectedAsset`: writes the derived ID of the Unique Asset
    ///        which is created within the specified asset group.
    /// - Preconditions:
    ///     * the selected asset must point to an asset group (such as an NFT collection)
    ///     * the transaction origin must be authorized to perform this operation
    ///
    /// This instruction creates a new Unique Asset within the asset group,
    /// specified in the `SelectedAsset` register.
    ///
    /// The ID of the newly created asset is automatically derived by the implementation.
    ///
    /// The owner of the new Unique Asset must be set according to the `Beneficiary` regiser. 
    ///
    /// This instruction must use the `MetadataUpdate` regiser
    /// to initialize the initial metadata state of the new Unique Asset.
    DeriveAsset,

    /// - Influenced by registers:
    ///     * `SelectedAsset`: specifies the ID of the Unique Asset to destroy.
    /// - Modifies registers: none
    /// - Preconditions:
    ///     * the selected asset must exist
    ///     * the transaction origin must be authorized to perform this operation
    ///
    /// This instruction completely destroys the asset with all its associated data.
    DestroySelectedAsset,

    /// - Influenced by registers:
    ///     * `SelectedAsset`: specifies the ID of the Unique Asset to unlink.
    /// - Modifies registers: none
    /// - Preconditions:
    ///     * the selected asset must exist
    ///     * the transaction origin must be authorized to perform this operation
    ///
    /// The `Unlink` instruction marks the asset ID as free for new allocation
    /// and all asset's associated data remains intact and retrievable by the asset's ID.
    ///
    /// An unlinked asset should not be modifiable by the UAVM.
    /// Other subsystems of a given chain are allowed to change it.
    UnlinkSelectedAsset,
}

pub enum MetadataUpdateMode {
    Preserving,
    Replacing,
}
```

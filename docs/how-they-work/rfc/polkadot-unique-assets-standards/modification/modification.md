---
sidebar_position: 1
hide_table_of_contents: false
toc_min_heading_level: 2
toc_max_heading_level: 4
---

# Unique Assets Modification

## Abstract

As described in the [Polkadot Unique Assets Standards document](../polkadot-unique-assets-standards.md), Unique Assets can be modified.

This document specifies the standard modification API for Unique Assets for all parachains in the ecosystem.

## Table of Contents

- [Motivation](#motivation)
- [UAVM](#uavm)
    * [Rationale](#rationale)
    * [Pallet](#pallet)
        - [Extrinsics](#extrinsics)
        - [Events](#events)
    * [Mandatory Standard Instructions](#mandatory-standard-instructions)
        - [Registers](#registers)
        - [Program Example](#program-example)
    * [Extension Instructions](#extension-instructions)
    * [Querying UAVM Instance Capabilities](#querying-uavm-instance-capabilities)

## Motivation

Clients need a uniform API implemented by all chains to modify Unique Assets in the ecosystem in a predictable and consistent way.

The existing Unique Assets have diverse modification operations. Some modifications are specific to certain kinds of Unique Assets (like setting limits or a sponsor account for an NFT collection). In contrast, others are common for many kinds of Unique Assets (such as a transfer operation).

The same Unique Asset kinds have different implementations in different parachains and provide different (possibly overlapping) APIs.

This document aims to describe a generic facade API capable of abstracting the interface differences across various Unique Asset kinds and their different implementations without imposing any artificial limitations so that a client can know how to handle Unique Asset modification on any compliant chain.

## UAVM

The generic API is formulated as a virtual machine (the Unique Assets VM) to make it minimal in its core, provide flexibility in its implementation and configuration, and allow optimized batch operations.

>NOTE: the UAVM follows the [Identification Standard](../identification.md) and works with Unique Assets' metadata following the transport-level and application-level formats described in the [Inspection Standard](../inspection.md).
>As such, this document uses the types and terms defined in these standards.

### Rationale

The generic API is specified as a Virtual Machine due to the flexibility of such a description.
A VM can abstract many underlying details (which is the crucial property for making a generic API), it is extendable, and the overall terminology of VMs is widely known, so the standard reader might already have an intuition about that.

The overall simplicity of the VM representations (i.e., in terms of registers and instructions) reduces the likelihood of imposing artificial limitations on the API.

A VM description naturally represents the influence of different operations on each other. The registers show the data flow between the instructions, allowing one to reason about the batch operations more easily and paving the way for various optimizations.

Since a VM has a natural modular structure (it consists of instructions), we can define a clear way of extending it and easily represent its implementation configuration in the Runtime.

### Pallet

A compliant chain must host a pallet capable of executing the UAVM instructions that are described in the next sections.
The pallet must always be called "uavm" in the chain's Runtime so the clients can easily find the needed pallet among other pallets in the given chain.

#### Extrinsics

The pallet must provide the `execute` extrinsic:
```rust
fn execute(origin: RuntimeOrigin, program: Vec<VersionedInstruction>) -> DispatchResult { 
    /* ...UAVM program execution... */

    Ok(())
}
```

The `VersionedInstruction` type is defined following the `VersionedUniqueAsset` type: an instruction of the given version contains the XCM objects of that version.

Each concrete version of the `Instruction` type is defined inductively following this document as a specification.
The `Instruction` type must always contain the instructions labeled as mandatory.

The optional extension instructions may be absent in the `Instruction` type that the given chain understands. So, if the given chain doesn't support some extension instruction, the presence of such an instruction in the supplied `program` may cause the `execute` extrinsic to fail to be decoded by the chain.

To avoid incompatibilities between the client and the chain, a client must inspect the chain's UAVM instance capabilities before executing programs.
For details, see the [Querying UAVM Instance Capabilities](#querying-uavm-instance-capabilities) section.

#### Events

The following events must be define in the pallet implementing the UAVM.
When describing a Unique Asset's state, the use the application-level metadata formats described in the [Inspection Standard](../inspection.md).

```rust
pub enum Event {
    UniqueAssetCreated {
        // NOTE: the version of the asset is determined
        // by the used instruction version in the `execute` extrinsic.
        asset: VersionedUniqueAsset,

        // The initial values of the application-level format keys.
        initial_state: MetadataMap,
    },

    UniqueAssetUpdated {
        // NOTE: the version of the asset is determined
        // by the used instruction version in the `execute` extrinsic.
        asset: VersionedUniqueAsset,

        // Updated application-level format keys.
        state_update: MetadataMap,
    },

    UniqueAssetDestroyed {
        // NOTE: the version of the asset is determined
        // by the used instruction version in the `execute` extrinsic.
        asset: VersionedUniqueAsset,
    }, 
}
```

- When a Unique Asset is created, the `UniqueAssetCreated` must be emitted.
For example, if the `program` uses the `V4` instructions and after its execution the collection #42 is created, the following event must be emitted

    ```rust
    Event::UniqueAssetCreated {
        asset: VersionUniqueAsset::V4(UniqueAssetV4 {
            // The collection is identified if it were on Unique Network.
            id: XcmLocationV4 { parents: 0, interior: X1(GeneralIndex(42)) },
            instance: XcmAssetInstanceV4::Undefined,
        }),

        // The `map!` macro is used here for illustrative purposes only.
        // Imagine if it can build the corresponding BTreeMap.
        initial_state: map! {
            "ownership:owner" = INITIAL_OWNER_XCM_LOCATION_V4,

            // ... the rest supported application-level format keys' initial values ...
        },
    }
    ```

- The state transition of Unique Assets resulted from the execution of the supplied `program`, must be reflected by the `UniqueAssetUpdated` event.
For example, if the `program` uses the `V4` instructions and after its execution the collection #42 owner has changed, the following event must be emitted:
    ```rust
    Event::UniqueAssetUpdate {
        asset: VersionUniqueAsset::V4(UniqueAssetV4 {
            // The collection is identified if it were on Unique Network.
            id: XcmLocationV4 { parents: 0, interior: X1(GeneralIndex(42)) },
            instance: XcmAssetInstanceV4::Undefined,
        }),

        // The `map!` macro is used here for illustrative purposes only.
        // Imagine if it can build the corresponding BTreeMap.
        state_update: map! {
            "ownership:owner" = NEW_OWNER_XCM_LOCATION_V4,
        },
    }
    ```
    >NOTE: this event must NOT be emitted if no actual change is made to the state, even if some update attempt has been made (e.g., an attempt to transfer the token to its current owner). 

- When a Unique Asset is destroyed, the `UniqueAssetDestroyed` event must be emitted.
For example, if the `program` uses the `V4` instructions and after its execution the collection #42 is destroyed, the following event must be emitted:
    ```rust
    Event::UniqueAssetDestroyed {
        asset: VersionUniqueAsset::V4(UniqueAssetV4 {
            // The collection is identified if it were on Unique Network.
            id: XcmLocationV4 { parents: 0, interior: X1(GeneralIndex(42)) },
            instance: XcmAssetInstanceV4::Undefined,
        }),
    }
    ```

### Mandatory Standard Instructions

#### Registers

>NOTE: The registers are outlined only to indicate the data flow between instructions (i.e., how they influence each other). A chain's UAVM instance must ensure data flow, but the actual solution for it is implementation-defined.

| Register | Value Type | Default Value | Note |
|----------|------------|---------------|------|
| `SelectedAsset` | `Option<UniqueAsset>` | `None` | |
| `Beneficiary` | `XcmLocation` | depends on the `RuntimeOrigin` value passed to the `execute` extrinsic: **If the `origin` is `Signed(account)`**, then the default value is `{ parents: 0, interior: X1(AccountId32: { id: account, .. }) }` (or `AccountKey20`, or another account XCM junction, depending on the chain's account format) with the `id` equal to the `account`. The rest of the XCM junction fields should be filled with the regular defaults, e.g., the `network` field should be filled with the corresponding Relay `NetworkId`. **If the `origin` is `Root`**, then the default value is `{ parents: 0, interior: Here }` representing the chain itself. | |
| `MetadataUpdate` | `MetadataMap` | Empty Map | See the `MetadataMap` definition in the [Inspection Standard](../inspection.md) |

----

```rust
pub enum MandatoryInstruction {
    /// - Influenced by registers: none
    /// - Modifies registers:
    ///     * `SelectedAsset`: writes the supplied Unique Asset
    /// - Preconditions: none
    ///
    /// This instruction just writes to the registers described above.
    SelectAsset(UniqueAsset),

    /// - Influenced by registers: none
    /// - Modifies registers:
    ///     * `Beneficiary`: writes the supplied XCM Location 
    /// - Preconditions: none
    ///
    /// This instruction just writes to the register described above.
    SetBeneficiary(XcmLocation),

    /// - Influenced by registers:
    ///     * `SelectedAsset`: identifies the Unique Asset to transfer.
    ///     * `Beneficiary`: identifies the beneficiary of the transfer.
    /// - Modifies registers:
    ///     * `SelectedAsset`: writes `None`
    /// - Preconditions:
    ///     * the selected asset must exist
    ///     * the transaction origin must be authorized to perform this operation 
    ///
    /// This instruction changes the owner of the selected Unique Asset
    /// to the value of the `Beneficiary` register.
    /// This change must be reflected in the application-level metadata key "ownership:owner".
    TransferSelectedAsset,

    /// - Influenced by registers: none
    /// - Modifies registers:
    ///     * `MetadataUpdate`: adds or updates the keys in the register
    ///        according to the supplied metadata map.
    /// - Preconditions: none
    ///
    /// This instruction just writes to the register described above.
    AddMetadataUpdate(MetadataMap),

    /// - Influenced by registers: none
    /// - Modifies registers:
    ///     * `MetadataUpdate`: resets the register to the empty map value.
    /// - Preconditions: none
    ///
    /// This instruction just writes to the register described above.
    ResetMetadataUpdate,

    /// - Influenced by registers:
    ///     * `MetadataUpdate`: specifies the keys to be updated and their new values.
    /// - Modifies registers: none
    /// - Preconditions:
    ///     * the selected asset must exist
    ///     * the transaction origin must be authorized to perform this operation
    ///     * the specified keys must be "generally mutable"
    ///       (this must be stated in their application-level format description).
    ///
    ///       This instruction cannot modify the keys that require
    ///       explicit mention in the instruction spec (e.g., "ownership:owner").
    UpdateSelectedAsset,
}
```

#### Program Example

Let's write a program that transfers the ownership of collection #42 on Unique Network parachain to a user called `ALICE`. The transaction will be signed by a user called `BOB` and the program will use the `V4` instructions. 

Assume `ALICE` and `BOB` are both `AccountId32` addresses.

```js
await uavm.execute({
  V4: [
    { 
      "SelectAsset": {
        "id": {
            "parents": 0,
            "interior": {
              "X1": [{ "GeneralIndex": 42 }]
            } 
        },
        "instance": "Undefined"
      }
    },

    {
        "SetBeneficiary": {
            "parents": 0,
            "interior": {
              "X1": [{ "AccountId32": { "id": ALICE } }]
            }
        }
    },

    "TransferSelectedAsset"
  ]
}).signAndSend(privateKeyOf(BOB));
```

### Extension Instructions

The UAVM instructions can be extended to include new ones. The additional instructions aren't mandatory unless explicitly added to the mandatory set (which generally should be avoided to maintain backward compatibility).

A particular instance of UAVM on a given chain may support any subset (including the whole set) of the extension instructions.

To avoid incompatibilities, a client must [query the UAVM's instance capabilities](#querying-uavm-instance-capabilities) before attempting to execute programs on a given chain.

>NOTE: the extension instructions MAY alter the behavior of other instructions, including the mandatory ones. If a given instruction alters the behavior of another one, it must be explicitly stated in its specification, and the alteration must be clearly defined.

The extension instructions must be described in the [Extension Instructions](./extension-instructions.md) document.

>NOTE: all asset-creating and asset-destroying instructions are extension instructions since these APIs vastly differ across NFT engines and other Unique Asset implementations. They can be classified into a small set of high-level instructions, so different implementations are abstracted into a small set of possible instruction alternatives.

### Querying UAVM Instance Capabilities

A client can query the information about the UAVM's instance on a given chain.

This information aims to help the client learn what XCM version is used, what Unique Assets are identifiable, and how they can be identified using XCM types. Also, it tells the client what instructions are supported by the chain and what influence paths exist between them.

The specification of the report format and the correponding Runtime API can be found in the [Querying UACM Instance Capabilities](./querying-uavm-instance-capabilities.md) document.
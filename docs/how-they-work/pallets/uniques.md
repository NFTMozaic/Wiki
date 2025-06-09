---
sidebar_position: 2 
hide_table_of_contents: false
toc_min_heading_level: 2
toc_max_heading_level: 4
---

# Uniques Pallet


The information presented here below is for developers.

Uniques is a [FRAME pallet](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/uniques) that implements more basic NFT operations than the NFTs pallet. Due to its simple API, this pallet is more attractive to teams seeking basic NFT functionality in their chain. Thus, it is a more widespread NFT pallet in the ecosystem.

The following NFT operations are implemented in this pallet (you can check out its Polkadot JS API for it [here](https://polkadot.js.org/docs/substrate/extrinsics/#uniques)):

### Roles[​](https://wiki.polkadot.network/docs/learn-nft-pallets#roles)

Setting up a collection implies different roles with different permissions:

* Owner:  
  * Destroy collection.  
  * Redeposit: re-evaluate the deposit on some items.  
  * Set team: change the collection’s Issuer, Admin, and Freezer.  
  * Set collection max supply: set the maximum number of items for a collection.  
  * Set attributes and metadata of a collection.  
  * Set attributes and metadata of a collection’s item.  
  * Freeze collection and items metadata (including the attributes).  
* Admin:  
  * Thaw collection: makes a collection’s items transferable  
  * Thaw item: the analogous operation for a collection’s items  
  * Force transfer and force burn: can transfer and burn any item in the collection  
  * Force transfer approval/disapproval: can approve (or cancel the approval of) a delegate to transfer a given item in the collection  
* Freezer:  
  * Freeze collection: makes all collection items non-transferable  
  * Freeze item transfer: makes the given item non-transferable  
* Issuer  
  * Mint items

### Attributes and metadata

The pallet stores associated data for collections and their tokens.  
The data can be any raw bytes.

Data structured as key-value pairs are called **attributes**; their number is restricted only by required data deposits (unless it is a special collection that doesn’t require data deposits).

**Metadata** is unique data associated with a collection or its token (i.e., there can be only one metadata per object).

### Extrinsics

The pallet’s extrinsics will be described below using a short action description, parameter list, preconditions list, events generated when executed successfully, and (optionally) errata.

#### **Collection creation**

A sender can use the “create” extrinsic to create a collection.

The new collection will have no items; its owner is the sender's account.

*Parameters:*

* Collection ID: the sender picks a desired collection ID  
* Admin: the sender picks an Admin account for collection.

*Preconditions:*

* The given collection ID must not already be taken  
* The sender must have a sufficient amount to reserve the creation deposit (CollectionDeposit: the chain’s Runtime configures it)

*Events:*

* `Created { collection: /\* Collection ID \*/, creator: /\* the sender \*/, owner: /\* picked admin \*/}`

*Errata:*

* The \`owner\` event field contains the admin account.

#### **Collection force creation**

A ForceOrigin (as configured by the chain’s Runtime) can create collections that don’t require data storing deposits using the “force\_create” extrinsic.

The ForceOrigin doesn’t pay any deposits for the collection creation.

The new collection will have no items; its owner is specified in the parameters and coincides with the admin account.

*Parameters:*

* Collection ID: the sender picks a desired collection ID  
* Owner: the sender picks the owner account (the same account will be the Admin as well)  
* Free Holding flag: if true, allows to hold an item without reserving the deposit for its attributes and metadata (i.e., storing data for this collection and its tokens becomes free; the owner won’t pay for setting it).

*Preconditions:*

* The sender must be the ForceOrigin  
* The given collection ID must not already be taken

*Events:*

* `ForceCreated { collection: /\* Collection ID \*/, owner: /\* picked owner \*/ }`

#### **Collection destruction**

The sender can use the “destroy” extrinsic to destroy a collection.

The sender must be either the collection’s owner or the ForceOrigin (as configured by the chain’s Runtime).

All the data deposits will be returned to the collection’s owner.

*Parameters:*

* Collection ID: the ID of the collection to be destroyed  
* Destroy Witness: the number of the collection’s items, the number of item metadatas, the number of attributes (both of the collection and all its items)  
  * Note: the extrinsic weight will depend on this parameter. The greater numbers mean a bigger weight.

*Preconditions:*

* The sender must be the collection’s owner or the ForceOrigin  
* The collection must exist  
* The numbers from the witness must be equal to the numbers found on chain

*Events:*

* `Destroyed { collection: /\* Collection ID \*/ }`

#### **Item minting**

The sender can use the “mint” extrinsic to mint a new item.

The sender must be the issuer of the given collection.

If the collection wasn’t created using “force\_create” with the \`free\_holding \= true\`, the collection owner must be able to reserve the item creation deposit (ItemDeposit, as configured by the chain’s Runtime). The minting will fail if the owner doesn’t have enough free balance (even if the issuer is a separate account).

*Parameters:*

* Collection ID: the ID of the collection where to mint the new item  
* Item ID: the desired ID of the new item  
* Owner: the picked owner of the new item

*Preconditions:*

* The sender must be the collection’s issuer  
* The collection must exist  
* The item ID must not be already taken  
* The collection’s maximum supply must not be reached  
* The collection’s owner must have enough funds to reserve the item deposit

*Events:*

* `Issued { collection: /\* Collection ID \*/, item: /\* Item ID \*/, owner: /\* picked owner \*/ }`

#### **Item burning**

The sender can use the “burn” extrinsic to burn an item.

The sender must be either the item’s owner or the collection’s admin.

The item must not be externally locked. Notice the term “locked,” which differs from “frozen.” The chain’s Runtime configures the external locking (the Locker type in the pallet’s Config) and performs differently on different chains.

The deposit for the item will be returned to the collection owner.

Note: the item attributes and its metadata **won’t be destroyed.** Hence, no data deposits will be returned. To destroy the item’s associated data, one should use the “clear\_attribute” and “clear\_metadata” extrinsics separately (it is possible to send them even after the item is burned).

*Parameters:*

* Collection ID: the ID of the collection where the item is located  
* Item ID: the ID of the item to be burned  
* Optional Check-Owner Account: check if this account owns the given item (makes sense only if the collection admin sends this extrinsic)

*Preconditions:*

* The sender must be either the item’s owner or the collection’s admin  
* The collection must exist  
* The item must exist  
* The item must not be externally locked  
* If provided, the item’s owner must be the same as the Check-Owner Account

*Events:*

* `Burned { collection: /\* Collection ID \*/, item: /\* Item ID \*/, owner: /\* item’s owner \*/ }`

*Errata:*

* When the item doesn’t exist, the “UnknownCollection” error will be reported.

#### **Setting collection and item attributes**

The sender can use the “set\_attribute” extrinsic to set an attribute of a collection or its item.

The sender must be either the collection’s owner or the ForceOrigin (as configured by the chain’s Runtime).

If the collection wasn’t created using “force\_create” with the \`free\_holding \= true\`, the collection owner must be able to reserve the data deposit expressed by the following formula: ***AttributeDepositBase \+ DepositPerByte \* (len(key) \+ len(value))***. The underlined parameters set by the chain’s Runtime via the pallet’s config. The “key” and “value” are one of the extrinsic’s parameters.

The “set\_attribute” will fail if the owner doesn’t have enough free balance.

Note: if the collection owner has to reserve the data deposit and the attribute under the given key already exists, the owner only needs to pay for the attribute data difference if the data length increases. Otherwise, if the data length shrinks, the corresponding collection owner’s funds get unreserved.

*Parameters:*

* Collection ID: the ID of the collection  
* Optional Item ID: if provided, the attribute will be set for the item instead of the collection  
* Key: the attribute’s key (raw bytes)  
* Value: the attribute’s value (raw bytes)

*Preconditions:*

* The sender must be either the collection’s owner or the ForceOrigin  
* The collection must exist  
* The collection/item metadata frozen flag must not be set

*Events:*

* `AttributeSet { collection: /\* Collection ID \*/, maybe\_item: /\* Optional Item ID \*/, key, value }`

#### **Clearing collection and item attributes**

The sender can use the “clear\_attribute” extrinsic to clear a given attribute of a collection or item.

The sender must be either the collection’s owner or the ForceOrigin (as configured by the chain’s Runtime).

If the collection owner has reserved funds related to the attribute in question, they will be unreserved after the “clear\_attribute” successful execution.

Note: No error will be emitted when clearing a non-existing attribute. The operation results in no-op.

*Parameters:*

* Collection ID: the ID of the collection  
* Optional Item ID: if provided, the attribute will be set for the item instead of the collection  
* Key: the attribute’s key (raw bytes)

*Preconditions:*

* The sender must be either the collection’s owner or the ForceOrigin  
* The collection must exist  
* The collection/item metadata frozen flag must not be set

*Events:*

* `AttributeCleared { collection: /\* Collection ID \*/, maybe\_item: /\* Optional Item ID \*/, key, value }`

*Errata:*

* No error will be emitted when clearing an attribute of a non-existing item. The operation results in no-op.

#### **Set collection metadata**

The sender can use the “set\_collection\_metadata” to assign the metadata to a collection.

The sender must be either the collection’s owner or the ForceOrigin (as configured by the chain’s Runtime).

If the collection wasn’t created using “force\_create” with the \`free\_holding \= true\`, the collection owner must be able to reserve the data deposit expressed by the following formula: ***MetadataDepositBase \+ DepositPerByte \* (len(data))***. The underlined parameters set by the chain’s Runtime via the pallet’s config. The “data” is one of the extrinsic’s parameters.

The “set\_collection\_metadata” will fail if the owner doesn’t have enough free balance.

Note: if the collection owner has to reserve the data deposit and the metadata exists, the owner only needs to pay for the data difference if the data length increases. Otherwise, if the data length shrinks, the corresponding collection owner’s funds get unreserved.

*Parameters:*

* Collection ID: the ID of the collection  
* Data: the metadata (raw bytes)  
* Frozen flag: sets the collection metadata frozen flag, which will prevent the collection metadata and the attributes from further modification

*Preconditions:*

* The sender must be either the collection’s owner or the ForceOrigin  
* The collection must exist  
* The collection metadata frozen flag must not be set

*Events:*

* `CollectionMetadataSet { collection: /\* Collection ID \*/, data, is\_frozen: /\* Frozen flag \*/ }`

#### **Clear collection metadata**

The sender can use the “clear\_collection\_metadata” extrinsic to clear the metadata of a collection.

The sender must be either the collection’s owner or the ForceOrigin (as configured by the chain’s Runtime).

If the collection owner has reserved funds related to the metadata, they will be unreserved after the “clear\_collection\_metadata” successful execution.

*Parameters:*

* Collection ID: the ID of the collection

*Preconditions:*

* The sender must be either the collection’s owner or the ForceOrigin  
* The collection must exist  
* The collection metadata frozen flag must not be set

*Events:*

* `CollectionMetadataCleared { collection: /\* Collection ID \*/ }`

#### **Set item metadata**

The sender can use the “set\_metadata” extrinsic to clear the metadata of an item.

The sender must be either the collection’s owner or the ForceOrigin (as configured by the chain’s Runtime).

If the collection wasn’t created using “force\_create” with the \`free\_holding \= true\`, the collection owner must be able to reserve the data deposit expressed by the following formula: ***MetadataDepositBase \+ DepositPerByte \* (len(data))***. The underlined parameters set by the chain’s Runtime via the pallet’s config. The “data” is one of the extrinsic’s parameters.

The “set\_metadata” will fail if the owner doesn’t have enough free balance.

Note: if the collection owner has to reserve the data deposit and the metadata exists, the owner only needs to pay for the data difference if the data length increases. Otherwise, if the data length shrinks, the corresponding collection owner’s funds get unreserved.

*Parameters:*

* Collection ID: the ID of the collection  
* Item ID: the ID of the item  
* Data: the metadata (raw bytes)  
* Frozen flag: sets the item metadata frozen flag, which will prevent the item metadata and the attributes from further modification

*Preconditions:*

* The sender must be either the collection’s owner or the ForceOrigin  
* The collection must exist  
* The item metadata frozen flag must not be set

*Events:*

* `MetadataSet { collection: /\* Collection ID \*/, item: /\* Item Id \*/, data, frozen: /\* Frozen flag \*/ }`

*Errata:*

* No error will be emitted when setting the metadata of a non-existing item. The operation results in no-op, but the event **will** be emitted anyway.

#### **Clear item metadata**

The sender can use the “clear\_metadata” extrinsic to clear an item's metadata.

The sender must be either the collection’s owner or the ForceOrigin (as configured by the chain’s Runtime).

If the collection owner has reserved funds related to the metadata, they will be unreserved after the “clear\_metadata” successful execution.

*Parameters:*

* Collection ID: the ID of the collection  
* Item ID: the ID of the item

*Preconditions:*

* The sender must be either the collection’s owner or the ForceOrigin  
* The collection must exist  
* The item metadata frozen flag must not be set

*Events:*

* `MetadataCleared { collection: /\* Collection ID \*/, item: /\* Item Id \*/ }`

*Errata:*

* No error will be emitted when clearing the metadata of a non-existing item. The operation results in no-op, but the event **will** be emitted anyway.

#### **Transfer item**

The sender can use the “transfer” extrinsic to transfer an item to a different account.

To transfer an item, the sender must be either the item’s owner, the collection’s admin, or an approved delegate (the approval will be reset after the transfer).

The item must not be externally locked. Notice the term “locked,” which differs from “frozen.” The chain’s Runtime configures the external locking (the Locker type in the pallet’s Config) and performs differently on different chains.

*Parameters:*

* Collection ID: the ID of the collection  
* Item ID: the ID of the item

*Preconditions:*

* The sender must be either the item’s owner, the collection’s admin, or an approved delegate  
* The collection must exist  
* The item must exist  
* The collection must not be frozen  
* The item must not be externally locked

*Events:*

* `Transferred { collection: /\* Collection ID \*/, item: /\* Item Id \*/, from: /\* old owner \*/, to: /\* new owner \*/ }`

*Errata:*

* When the item doesn’t exist, the “UnknownCollection” error will be reported.

#### **Approve item transfer**

The sender can approve a third-party account to transfer an item by using the “approve\_transfer” extrinsic.

To do this, the sender must be either the item’s owner, the collection’s admin, or the ForceOrigin (as configured by the chain’s Runtime).

Note: the approval is reset if a third-party account performs a transfer.

*Parameters:*

* Collection ID: the ID of the collection  
* Item ID: the ID of the item  
* Delegate: the third-party account to approve

*Preconditions:*

* The sender must be either the item’s owner, the collection’s admin, or the ForceOrigin  
* The collection must exist  
* The item must exist

*Events:*

* `ApprovedTransfer { collection: /\* Collection ID \*/, item: /\* Item Id \*/, owner, delegate }`

*Errata:*

* When the item doesn’t exist, the “UnknownCollection” error will be reported.

#### **Cancel item transfer approval**

The sender can cancel the given item transfer approval by using the “cancel\_approval” extrinsic.

To do this, the sender must be either the item’s owner, the collection’s admin, or the ForceOrigin (as configured by the chain’s Runtime).

*Parameters:*

* Collection ID: the ID of the collection  
* Item ID: the ID of the item  
* Optional Delegate Check: check if the given account is the current transfer delegate

*Preconditions:*

* The sender must be either the item’s owner, the collection’s admin, or the ForceOrigin  
* The collection must exist  
* The item must exist  
* An approved delegate must already be set  
* The delegate check must succeed

*Events:*

* `ApprovalCancelled { collection: /\* Collection ID \*/, item: /\* Item Id \*/, owner, delegate: /\* old delegate \*/ }`

*Errata:*

* When the item doesn’t exist, the “UnknownCollection” error will be reported.

#### **Set/clear item price**

The sender can set and clear the item’s price by using the “set\_price” extrinsic

To do this, the sender must be the item’s owner.

The sender sets the price providing a non-null value to the corresponding extrinsic’s parameter and clears it when a null value is passed.

*Parameters:*

* Collection ID: the ID of the collection  
* Item ID: the ID of the item  
* Price: the price of the item (either null to clear or non-null to set)  
* Optional Whitelisted Buyer: the account that is allowed to buy this item

*Preconditions:*

* The sender must be the item’s owner  
* The collection must exist  
* The item must exist

*Events:*

* When the price is set  
  * `ItemPriceSet { collection: /\* Collection ID \*/, item: /\* Item Id \*/, price, whitelisted\_buyer }`

* When the price is cleared  
  * `ItemPriceSet { collection: /\* Collection ID \*/, item: /\* Item Id \*/ }`

#### **Buy item**

The sender can buy an item using the “buy\_item” extrinsic.

To do this, the sender must **not** be the item’s owner.

This extrinsic will transfer the sender’s funds to the item’s current owner and make the sender the new item’s owner.

*Parameters:*

* Collection ID: the ID of the collection  
* Item ID: the ID of the item  
* Bid price: the maximum amount the sender is willing to pay for the item

*Preconditions:*

* The sender must **not** be the item’s owner  
* The collection must exist  
* The item must exist  
* The item must have a price  
* The bid price must be greater than or equal to the item’s price  
* The sender must correspond to the whitelisted buyer if the item’s owner sets it  
* The sender must have enough funds to pay the price

*Events:*

* `ItemBought { collection: /\* Collection ID \*/, item: /\* Item Id \*/, price, seller, buyer }`

#### **Transfer collection ownership**

The sender can transfer a collection’s ownership to another account using the “transfer\_ownership” extrinsic.

To do this, the sender must be the collection’s owner.

The New Owner must accept the ownership transfer before this transaction is sent.

*Parameters:*

* Collection ID: the ID of the collection  
* New Owner: the account of the new collection’s owner

*Preconditions:*

* The sender must be the collection’s owner  
* The collection must exist  
* The New Owner must have accepted the ownership transfer

*Events:*

* `OwnerChanged { collection: /\* Collection ID \*/, new\_owner }`

#### **Accept/reset collection ownership**

The sender can accept or reset a collection’s ownership transfer using the “set\_accept\_ownership” extrinsic.

The sender specifies a non-null ID of a collection, which ownership the sender is willing to accept. That collection must exist.

Otherwise, the sender passes a null value, indicating the sender won’t accept any ownership transfer.

 *Parameters:*

* Optional Collection ID: the ID of the collection, which ownership transfer will be accepted

*Preconditions:*

* If the collection ID is provided, the collection must exist

*Events:*

* `OwnershipAcceptanceChanged { who: /\* the sender \*/, maybe\_collection: /\* Optional Collection ID \*/ }`

#### **Set collection’s max supply**

The sender can set the max possible number of items in a collection by using the “set\_collection\_max\_supply” extrinsic.

To do this, the sender must be either the collection’s owner, or the ForceOrigin (as configured by the chain’s Runtime).

The max supply can be set only once, it can’t be changed once set.

The desired max supply must be greater than the number of already existing items in the collection.

*Parameters:*

* Collection ID: the ID of the collection  
* Max Supply: the desired max supply of the collection’s items

*Preconditions:*

* The sender must be either the collection’s owner, or the ForceOrigin  
* The collection must exist  
* The max supply must not be already set  
* The passed max supply must be greater than the number of already existing items in the collection

*Events:*

* `CollectionMaxSupplySet { collection: /\* Collection ID \*/, max\_supply }`

#### **Freeze collection**

The sender can disallow all item transfers in a collection by freezing it using the “freeze\_collection” extrinsic.

To do this, the sender must be the Freezer of the collection (it is initially the collection’s Admin, but it can be set to a different account via the “set\_team” extrinsic).

*Parameters:*

* Collection ID: the ID of the collection

*Preconditions:*

* The sender must be either the collection’s Freezer  
* The collection must exist

*Events:*

* `CollectionFrozen { collection: /\* Collection ID \*/ }`

#### **Thaw collection**

The sender can allow item transfers in a collection by thawing it using the “thaw\_collection” extrinsic.

To do this, the sender must be the collection admin.

*Parameters:*

* Collection ID: the ID of the collection

*Preconditions:*

* The sender must be either the collection admin  
* The collection must exist

*Events:*

* `CollectionThawed { collection: /\* Collection ID \*/ }`

#### **Freeze item**

The sender can disallow a transfer of a given item by freezing it using the “freeze” extrinsic.

To do this, the sender must be the collection's Freezer (initially the collection’s Admin, but it can be set to a different account via the “set\_team” extrinsic).

*Parameters:*

* Collection ID: the ID of the collection  
* Item ID: the ID of the item

*Preconditions:*

* The sender must be either the collection’s Freezer  
* The collection must exist  
* The item must exist

*Events:*

* `Frozen { collection: /\* Collection ID \*/, item: /\* Item ID \*/ }`

*Errata:*

* When the item doesn’t exist, the “UnknownCollection” error will be reported.

#### **Thaw item**

The sender can allow a transfer of a given item by thawing it using the “thaw” extrinsic.

To do this, the sender must be the collection admin.

*Parameters:*

* Collection ID: the ID of the collection  
* Item ID: the ID of the item

*Preconditions:*

* The sender must be either the collection admin  
* The collection must exist  
* The item must exist

*Events:*

* `Thawed { collection: /\* Collection ID \*/ }`

*Errata:*

* When the item doesn’t exist, the “UnknownCollection” error will be reported.

#### **Set collection team**

The sender can set the collection’s team of Issuer, Admin, and Freezer, by using the “set\_team” extrinsic.

To do this, the sender must be the collection owner.

*Parameters:*

* Collection ID: the ID of the collection  
* Issuer: the account of the collection’s new Issuer  
* Admin: the account of the collection’s new Admin  
* Freezer: the account of the collection’s new Freezer

*Preconditions:*

* The sender must be the collection owner  
* The collection must exist

*Events:*

* `TeamChanged { collection: /\* Collection ID \*/, issuer, admin, freezer }`

#### **Re-evaluate selected items deposits**

If the pallet’s config has changed or the collection “free\_holding” setting has changed, there may be a need to re-evaluate a collection’s item’s deposits.

The sender can do this by using the “redeposit” extrinsic. Only the collection owner is permitted to do this.

This operation works on a best-effort basis, the non-existing items are skipped and the transaction won’t fail if the collection’s owner doesn’t have the possibly needed additional funds to pay the new deposits. Hence, this extrinsic is mainly for the situation when the deposits should decrease. 

*Parameters:*

* Collection ID: the ID of the collection  
* Item List: the list of item IDs to re-evaluate the deposits

*Preconditions:*

* The sender must be the collection owner  
* The collection must exist

*Events:*

* `Redeposited { collection: /\* Collection ID \*/, successful\_items: /\* items for which the deposit is updated \*/ }`

#### **Force set collection properties**

The sender can simultaneously change the collection’s Owner, Issuer, Admin, and Freezer accounts as well as the “free\_holding” and the “is\_frozen” flags.

To do so, the sender can use the “force\_item\_status” extrinsic (note that the name is wrong, but it operates as described here).

Only the ForceOrigin can execute this transaction.

 *Parameters:*

* Collection ID: the ID of the collection  
* Owner: the new collection owner  
* Issuer: the new collection’s Issuer  
* Admin: the new collection Admin  
* Freezer: the new collection’s Freezer  
* Free Holding flag: sets or clears the “free\_holding” collection flag  
* Frozen flag: sets or clears the “frozen” collection flag (allow/deny items trasnfer)

*Preconditions:*

* The sender must be the ForceOrigin  
* The collection must exist

*Events:*

* `ItemStatusChanged { collection: /\* Collection ID \*/ }`

*Errata:*

* The extrinsic’s name and the corresponding event mention an “item” instead of a “collection”


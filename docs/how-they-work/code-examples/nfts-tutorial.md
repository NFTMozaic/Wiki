---
title: Building NFT App on Polkadot
sidebar_label: Building NFT App on Polkadot
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Building NFT App on Polkadot

In this tutorial, you'll learn how to build a real NFT application using Polkadot's NFTs pallet. We'll start simple and gradually add more features as you understand the concepts.

### What is the NFTs Pallet?

Polkadot treats NFTs as a core part of its runtime. Instead of deploying your own smart contract like you would on Ethereum, you interact with a built‑in NFTs pallet. This approach is cheaper, safer and easier to upgrade because the heavy lifting is handled by the network itself.

At the heart of the system are collections – containers that hold your NFTs. Every time you create a collection the chain assigns a unique numeric ID. When you call the pallet to create a collection you must provide an admin account and a configuration object that defines rules such as the maximum supply and who is allowed to mint tokens. These rules live on‑chain, so you pay a small deposit once and then call extrinsics to manage your collection.

Here are the core concepts you'll work with:

- Collections – groups of related NFTs that share common configuration. Each collection has its own ID and can enforce limits like maximum supply.
- Items – individual NFTs within a collection. Each item has a unique number (item ID) and can carry its own metadata.
- Collection roles – the pallet distinguishes between different roles. An admin can configure metadata and attributes, an issuer can mint, and a freezer can temporarily stop transfers.
- Metadata – JSON data describing a collection or item. Metadata lives off‑chain (e.g. IPFS) but a link to it is stored on‑chain.
- Attributes – key/value pairs of arbitrary data attachable to collections and items

### Setting Up Your Project

The NFT template comes pre-configured with everything you need:

<!-- TODO: check commands -->

```bash
npm create nft-app@latest my-nft-app
cd my-nft-app
npm run dev
```

The template includes wallet connection, Polkadot API setup, and ready‑to‑use hooks for all NFT operations. It's built with Next.js, so you get file‑based routing, hot reloading and server‑side rendering out of the box. This tutorial assumes you have some familiarity with React/Next.js; we'll focus on the Polkadot‑specific pieces rather than explaining basic JSX or state management.

Under the hood, the template wraps low‑level Polkadot API calls in custom React hooks. Throughout this guide you'll call functions like `createCollection`, `mint`, or `setPrice` without worrying about the underlying extrinsics. If you're curious to see what's happening, check out the hooks/nft folder in the template.

## Lesson 1: Collections

Before we write any code, let's talk about collections. On Polkadot, NFTs begin with a collection — a container that defines the rules for all items inside it. When you create a collection you choose an admin and provide a configuration object with options. These options translate to on‑chain settings such as maximum supply, whether items can be transferred and who can mint tokens.

With that in mind, let's create your first collection. We'll use a component that calls our `useCollectionManagement` hook. As you read the code, think about how the parameters map to the concepts above. You'll see the code before we explain it – feel free to skim it, then we'll walk through what it does.

<Tabs>
<TabItem value="component" label="CreateCollection.tsx">

```tsx
"use client";

import React, { useState } from "react";
import { useCollectionManagement } from "../hooks/collections";
import styles from "./CreateCollection.module.css";

export const CreateCollection = () => {
  const { createCollection, isLoading } = useCollectionManagement();
  const [maxSupply, setMaxSupply] = useState("");

  const handleCreate = async () => {
    try {
      const result = await createCollection({
        maxSupply: maxSupply ? parseInt(maxSupply) : undefined,
        transferable: true,
        publicMinting: false,
      });

      alert(`Collection created! ID: ${result.collectionId}`);
      setMaxSupply("");
    } catch (error) {
      alert("Failed to create collection");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create Collection</h1>

      <div className={styles.form}>
        <label>
          Max Supply (optional):
          <input
            type="number"
            value={maxSupply}
            onChange={(e) => setMaxSupply(e.target.value)}
            placeholder="Leave empty for unlimited"
          />
        </label>

        <button onClick={handleCreate} disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Collection"}
        </button>
      </div>
    </div>
  );
};
```

</TabItem>

<TabItem value="styles" label="CreateCollection.module.css">

```css
.container {
  max-width: 500px;
  margin: 1rem auto;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.container h1 {
  margin: 0 0 1.5rem 0;
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  color: #1f2937;
}

.form input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.form button:hover:not(:disabled) {
  background: #2563eb;
}

.form button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
```

</TabItem> 
</Tabs>

### What does this component do?

The `useCollectionManagement` hook wraps the low‑level `api.tx.Nfts.create` extrinsic for you. When you call `createCollection()` it submits a transaction that reserves a deposit, writes your configuration to the chain and sets you as the admin. In other words, it:

1. Creates a new collection on‑chain – the chain increments the collection counter and assigns an ID.
2. Sets you as the `admin`/`issuer`/`freezer` – until you delegate roles, you can mint tokens and manage metadata and attributes.
3. Applies your configuration – flags like transferable and publicMinting map to the collection settings and minting rules described earlier.

The `maxSupply` parameter limits how many NFTs can be minted in your collection. Leaving it undefined creates an unlimited collection. In a real dApp you would also allow users to specify a URL pointing to their collection metadata (a JSON file hosted on IPFS or a similar service). Setting or updating metadata involves a separate extrinsic and deposit.

<!-- TODO add a link -->

:::tip Your challenge
Extend the form with a metadata URL input so that users can store a JSON description of their collection. Use `set_collection_metadata` after the collection is created.
:::

## Lesson 2: Minting NFTs

After creating a collection you can start adding items – the individual NFTs that live inside it. Each item has a unique ID and can carry its own metadata. Minting an item requires a deposit and is subject to the minting rules you defined in the collection's configuration. The pallet supports different mint types: only the issuer can mint (Issuer), anyone can mint (Public) or only holders of another collection can mint (HolderOf). You can also set a price for public minting or limit minting to a specific block range.

Before diving into the code, think about what makes your NFT special: what metadata will you attach? and who will own it? Keep in mind that once you lock an item's metadata or attributes they cannot be changed.

<Tabs>
<TabItem value="component" label="MintNFT.tsx">

```tsx
"use client";

import React, { useState } from "react";
import { useNFTMinting } from "../hooks/items";
import { useWallet } from "../contexts/WalletContext";
import styles from "./MintNFT.module.css";

export const MintNFT = () => {
  const { mint, isLoading } = useNFTMinting();
  const { selectedAccount } = useWallet();
  const [collectionId, setCollectionId] = useState("");
  const [itemId, setItemId] = useState("1");

  const handleMint = async () => {
    if (!collectionId || !itemId || !selectedAccount) {
      alert("Please fill all fields and connect wallet");
      return;
    }

    try {
      const result = await mint(
        parseInt(collectionId),
        parseInt(itemId),
        selectedAccount.address // mint to yourself
      );

      alert(`NFT minted! Item ID: ${result.itemId}`);
      setItemId((parseInt(itemId) + 1).toString()); // auto-increment
    } catch (error) {
      alert("Failed to mint NFT");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Mint NFT</h1>

      <div className={styles.form}>
        <label>
          Collection ID:
          <input
            type="number"
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            placeholder="Enter collection ID"
          />
        </label>

        <label>
          Item ID:
          <input
            type="number"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            placeholder="Unique item number"
          />
        </label>

        <button onClick={handleMint} disabled={isLoading}>
          {isLoading ? "Minting..." : "Mint NFT"}
        </button>
      </div>
    </div>
  );
};
```

</TabItem>
<TabItem value="styles" label="MintNFT.module.css">

```css
.container {
  max-width: 500px;
  margin: 1rem auto;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.container h1 {
  margin: 0 0 1.5rem 0;
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  color: #1f2937;
}

.form input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.form button:hover:not(:disabled) {
  background: #2563eb;
}

.form button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
```

</TabItem>
</Tabs>

### How minting works

The mint function exposed by `useNFTMinting` calls into `api.tx.Nfts.mint`. It expects three arguments:

1. Collection ID – the numeric ID of the collection you're minting into.
2. Item ID – a unique integer for this item. Item IDs are scoped to the collection.
3. Mint To – the Polkadot address that will own the NFT.

When you mint an item, the runtime reserves an item deposit and stores your chosen ID, owner and default item settings. If the collection's mint type is `Issuer` then only you (the issuer) can mint. If it's Public anyone can call this extrinsic. The default item settings determine whether metadata and attributes are mutable and whether transfers are allowed.

The sample component auto‑increments the item ID after a successful mint. In practice you might want to derive item IDs from your database or let users pick their own.

:::tip Your challenge
Your challenge: Enhance the form by adding a metadata URL input (for example, an IPFS link to a JSON file describing the NFT) and a field to specify any recipient address, not just your own. Remember that metadata and attributes can be permanently locked, so design your app to allow editing before locking.
:::

## Lesson 3: Browsing collections and items

Once you've minted a few tokens you need a way to explore them. In Polkadot you can query the chain for collection information, item information, metadata and attributes. We'll build a simple viewer that fetches a collection, its items and displays basic details. Later you can extend it to read the metadata URI and render images or descriptions.

<Tabs>
<TabItem value="component" label="ViewCollections.tsx">

```tsx
"use client";

import React, { useState } from "react";
import { useCollectionManagement } from "../hooks/collections";
import { useNFTLifecycle } from "../hooks/items";
import styles from "./ViewCollections.module.css";

export const ViewCollections = () => {
  const { getCollection } = useCollectionManagement();
  const { getCollectionItems } = useNFTLifecycle();
  const [collectionId, setCollectionId] = useState("");
  const [collectionInfo, setCollectionInfo] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCollection = async () => {
    if (!collectionId) return;

    setLoading(true);
    try {
      const [collection, itemsList] = await Promise.all([
        getCollection(parseInt(collectionId)),
        getCollectionItems(parseInt(collectionId)),
      ]);

      setCollectionInfo(collection);
      setItems(itemsList.items || []);
    } catch (error) {
      alert("Collection not found");
      setCollectionInfo(null);
      setItems([]);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1>View Collection</h1>

      <div className={styles.search}>
        <input
          type="number"
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
          placeholder="Enter collection ID"
        />
        <button onClick={loadCollection} disabled={loading}>
          {loading ? "Loading..." : "Load Collection"}
        </button>
      </div>

      {collectionInfo && (
        <div className={styles.collectionInfo}>
          <h2>Collection #{collectionId}</h2>
          <p>Owner: {collectionInfo.owner}</p>
          <p>Total Items: {items.length}</p>
          {collectionInfo.max_supply && (
            <p>Max Supply: {collectionInfo.max_supply}</p>
          )}
        </div>
      )}

      {items.length > 0 && (
        <div className={styles.items}>
          <h3>NFTs in this collection:</h3>
          <div className={styles.itemGrid}>
            {items.map((item) => (
              <div key={item.itemId} className={styles.item}>
                <h4>#{item.itemId}</h4>
                <p>Owner: {item.owner.slice(0, 8)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

</TabItem>
<TabItem value="styles" label="ViewCollections.module.css">

```css
.container {
  max-width: 800px;
  margin: 1rem auto;
  padding: 1rem;
}

.container h1 {
  margin: 0 0 1.5rem 0;
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
}

.search {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.search input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  color: #1f2937;
}

.search input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.search button:hover:not(:disabled) {
  background: #2563eb;
}

.collectionInfo {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.collectionInfo h2 {
  margin: 0 0 1rem 0;
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
}

.collectionInfo p {
  margin: 0.5rem 0;
  color: #374151;
}

.items {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.items h3 {
  margin: 0 0 1rem 0;
  color: #1e293b;
  font-size: 1.125rem;
  font-weight: 600;
}

.itemGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.item {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.item h4 {
  margin: 0 0 0.5rem 0;
  color: #3b82f6;
  font-size: 1.125rem;
  font-weight: 600;
}

.item p {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}
```

</TabItem>
</Tabs>

<!-- TODO wow wow -->

### Why this viewer matters

The viewer illustrates two important queries:

1. Collection details – fetching the owner, max supply and other settings. You could also query the collection metadata URI to display a name, description or image.
2. Collection items – loading all item IDs and their owners. Individual item metadata and attributes can be fetched with separate queries if you want to render richer information.

The `getCollectionItems` hook returns an array of item IDs and owners. For a production app you might want to batch queries or cache results to improve performance.

:::tip Your challenge
Extend this component to support multiple collections at once (e.g. keep a list of previously loaded IDs) and fetch the metadata for each collection and item so you can display names, descriptions and images.
:::

## Lesson 4: Transferring NFTs and managing ownership

Ownership is a fundamental property of NFTs. Only the current owner can transfer an item, and the pallet enforces this at the runtime level. Transfers are simple extrinsics that change the owner field; there is no need for approvals unless your app introduces them. You can also temporarily freeze transfers for specific items or entire collections.

<Tabs>
<TabItem value="component" label="TransferNFT.tsx">

```tsx
"use client";

import React, { useState } from "react";
import { useNFTTransfers, useNFTLifecycle } from "../hooks/items";
import styles from "./TransferNFT.module.css";

export const TransferNFT = () => {
  const { transfer, isLoading } = useNFTTransfers();
  const { getNFTDetails } = useNFTLifecycle();
  const [collectionId, setCollectionId] = useState("");
  const [itemId, setItemId] = useState("");
  const [recipient, setRecipient] = useState("");
  const [nftInfo, setNftInfo] = useState<any>(null);

  const checkNFT = async () => {
    if (!collectionId || !itemId) return;

    try {
      const details = await getNFTDetails(
        parseInt(collectionId),
        parseInt(itemId)
      );
      setNftInfo(details);
    } catch (error) {
      alert("NFT not found");
      setNftInfo(null);
    }
  };

  const handleTransfer = async () => {
    if (!nftInfo || !recipient) {
      alert("Please check NFT and enter recipient");
      return;
    }

    try {
      await transfer(parseInt(collectionId), parseInt(itemId), recipient);
      alert("NFT transferred successfully!");
      setNftInfo(null);
      setCollectionId("");
      setItemId("");
      setRecipient("");
    } catch (error) {
      alert("Transfer failed");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Transfer NFT</h1>

      <div className={styles.form}>
        <div className={styles.nftCheck}>
          <input
            type="number"
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            placeholder="Collection ID"
          />
          <input
            type="number"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            placeholder="Item ID"
          />
          <button onClick={checkNFT}>Check NFT</button>
        </div>

        {nftInfo && (
          <div className={styles.nftInfo}>
            <h3>
              NFT #{itemId} from Collection #{collectionId}
            </h3>
            <p>Current Owner: {nftInfo.owner}</p>
          </div>
        )}

        {nftInfo && (
          <div className={styles.transferSection}>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Recipient address"
            />
            <button onClick={handleTransfer} disabled={isLoading}>
              {isLoading ? "Transferring..." : "Transfer NFT"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
```

</TabItem>
<TabItem value="styles" label="TransferNFT.module.css">

```css
.container {
  max-width: 500px;
  margin: 1rem auto;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.container h1 {
  margin: 0 0 1.5rem 0;
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.nftCheck {
  display: flex;
  gap: 0.5rem;
}

.nftCheck input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #1f2937;
}

.nftCheck input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.nftCheck button {
  padding: 0.75rem 1rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.nftCheck button:hover {
  background: #059669;
}

.nftInfo {
  background: #dbeafe;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #3b82f6;
}

.nftInfo h3 {
  margin: 0 0 0.5rem 0;
  color: #1e40af;
  font-size: 1.125rem;
  font-weight: 600;
}

.nftInfo p {
  margin: 0;
  font-size: 0.875rem;
  color: #1e40af;
}

.transferSection {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transferSection input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  color: #1f2937;
}

.transferSection input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.transferSection button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.transferSection button:hover:not(:disabled) {
  background: #2563eb;
}

.transferSection button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
```

</TabItem>
</Tabs>

### How transfers work

Transfers may look trivial but there are a few nuances:

- Only the current owner can transfer – the runtime checks the owner field and rejects any unauthorised transfers.
- Freezers can pause transfers – they can lock and unlock transfers for specific items or collections. You might want to expose this functionality in an admin panel.

Our component first calls `getNFTDetails` to fetch the current owner. It then submits a transfer transaction when the user clicks a button.

:::tip Your challenge
Replace the manual collection/item ID inputs with a dropdown listing the NFTs owned by the connected account (see the query in the next section to fetch a list of account NFTs).
:::

## Lesson 5: Trading NFTs on‑chain

Polkadot's NFTs pallet includes a built‑in trading system. Owners can set a price for an item and optionally restrict the buyer to a specific address. Anyone can then query the price and purchase the NFT by matching or exceeding it. All of this happens without deploying or interacting with a separate marketplace contract.

In this lesson you'll build a component that lists an NFT for sale, checks its sale status and allows a user to buy it. We'll also discuss how to display multiple items for sale and how to remove an item from sale.

<Tabs>
<TabItem value="component" label="SimpleMarketplace.tsx">

```tsx
'use client';

import React, { useState } from "react";
import { useNFTTrading } from "../hooks/trading";
import styles from "./SimpleMarketplace.module.css";

export const SimpleMarketplace = () => {
  const { setPrice, buyItem, getPrice, isLoading } = useNFTTrading();
  const [collectionId, setCollectionId] = useState("");
  const [itemId, setItemId] = useState("");
  const [price, setPriceValue] = useState("");
  const [saleInfo, setSaleInfo] = useState<any>(null);

  const DOT_DECIMALS = 10n ** 10n;

  const parseDOT = (amount: string) => {
    return BigInt(Math.floor(parseFloat(amount) * Number(DOT_DECIMALS)));
  };

  const formatDOT = (amount: bigint) => {
    return (Number(amount) / Number(DOT_DECIMALS)).toFixed(4);
  };

  const handleListForSale = async () => {
    if (!collectionId || !itemId || !price) {
      alert("Please fill all fields");
      return;
    }

    try {
      await setPrice(parseInt(collectionId), parseInt(itemId), parseDOT(price));
      alert("NFT listed for sale!");
      setPriceValue("");
    } catch (error) {
      alert("Failed to list NFT");
    }
  };

  const checkSaleStatus = async () => {
    if (!collectionId || !itemId) return;

    try {
      const priceInfo = await getPrice(
        parseInt(collectionId),
        parseInt(itemId)
      );
      setSaleInfo(priceInfo);
    } catch (error) {
      setSaleInfo(null);
    }
  };

  const handleBuy = async () => {
    if (!saleInfo) return;

    try {
      await buyItem(parseInt(collectionId), parseInt(itemId), saleInfo.price);
      alert("NFT purchased successfully!");
      setSaleInfo(null);
    } catch (error) {
      alert("Purchase failed");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Simple Marketplace</h1>

      <div className={styles.section}>
        <h2>List NFT for Sale</h2>
        <div className={styles.form}>
          <input
            type="number"
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            placeholder="Collection ID"
          />
          <input
            type="number"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            placeholder="Item ID"
          />
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPriceValue(e.target.value)}
            placeholder="Price in DOT"
          />
          <button onClick={handleListForSale} disabled={isLoading}>
            List for Sale
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Check & Buy NFT</h2>
        <div className={styles.form}>
          <button onClick={checkSaleStatus}>Check Sale Status</button>

          {saleInfo && (
            <div className={styles.saleInfo}>
              <h3>NFT for Sale</h3>
              <p>Price: {formatDOT(saleInfo.price)} DOT</p>
              <button onClick={handleBuy} disabled={isLoading}>
                Buy Now
              </button>
            </div>
          )}

          {saleInfo === null && collectionId && itemId && (
            <p>This NFT is not for sale</p>
          )}
        </div>
      </div>
    </div>
  );
};
```

</TabItem>
<TabItem value="styles" label="SimpleMarketplace.module.css">

```css
.container {
  max-width: 600px;
  margin: 1rem auto;
  padding: 1rem;
}

.container h1 {
  margin: 0 0 1.5rem 0;
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
}

.section {
  background: white;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin: 0 0 1rem 0;
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.75rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  color: #1f2937;
}

.form input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.form button:hover:not(:disabled) {
  background: #2563eb;
}

.form button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.saleInfo {
  background: #dcfce7;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #22c55e;
  margin-top: 1rem;
}

.saleInfo h3 {
  margin: 0 0 0.5rem 0;
  color: #166534;
  font-size: 1.125rem;
  font-weight: 600;
}

.saleInfo p {
  margin: 0.5rem 0;
  font-weight: 600;
  color: #166534;
}

.saleInfo button {
  background: #22c55e;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.saleInfo button:hover:not(:disabled) {
  background: #16a34a;
}
```

</TabItem>
</Tabs>

### How on‑chain trading works

Trading on Polkadot follows a simple pattern:

- Listing an item – the owner calls set_price with a price expressed in planck (the smallest unit of DOT). They can optionally provide a `whitelisted_buyer` to restrict the sale to a specific account.
- Discovering prices – anyone can query `ItemPriceOf` to see if an NFT is listed and at what price.
- Buying an item – a buyer calls `buy_item` with a bid price equal to or greater than the listed price. The extrinsic atomically transfers the NFT and payment and removes the item from sale.

Withdrawing a listing – the seller can set the price to undefined to remove an item from sale.

Our component implements a minimal UI for these operations. It uses helper functions to convert between DOT and planck for display purposes.

:::tip Your challenge
Extend this marketplace by allowing owners to withdraw their NFTs from sale and by building a browse page that lists all NFTs for sale in a given collection. You could query ItemPriceOf for each item ID and display those with a non‑undefined price.
:::

## Putting It All Together

You've built several standalone components: collection creation, minting, browsing, transferring and trading. Let's tie them together into a single Next.js app. We'll create a basic navigation bar that lets users switch between these views. Feel free to enhance this layout with your own styling or routing.

<Tabs>
<TabItem value="component" label="page.tsx">

```tsx
'use client';

import React, { useState } from "react";
import { CreateCollection } from "./components/CreateCollection";
import { MintNFT } from "./components/MintNFT";
import { ViewCollections } from "./components/ViewCollections";
import { TransferNFT } from "./components/TransferNFT";
import { SimpleMarketplace } from "./components/SimpleMarketplace";
import styles from "./page.module.css";

export default function Home() {
  const [currentPage, setCurrentPage] = useState("view");

  const pages = {
    view: <ViewCollections />,
    create: <CreateCollection />,
    mint: <MintNFT />,
    transfer: <TransferNFT />,
    marketplace: <SimpleMarketplace />,
  };

  return (
    <div className={styles.app}>
      <nav className={styles.nav}>
        <button
          className={currentPage === "view" ? styles.active : ""}
          onClick={() => setCurrentPage("view")}
        >
          View Collections
        </button>
        <button
          className={currentPage === "create" ? styles.active : ""}
          onClick={() => setCurrentPage("create")}
        >
          Create Collection
        </button>
        <button
          className={currentPage === "mint" ? styles.active : ""}
          onClick={() => setCurrentPage("mint")}
        >
          Mint NFT
        </button>
        <button
          className={currentPage === "transfer" ? styles.active : ""}
          onClick={() => setCurrentPage("transfer")}
        >
          Transfer
        </button>
        <button
          className={currentPage === "marketplace" ? styles.active : ""}
          onClick={() => setCurrentPage("marketplace")}
        >
          Marketplace
        </button>
      </nav>

      <main className={styles.main}>{pages[currentPage as keyof typeof pages]}</main>
    </div>
  );
}
```

</TabItem>
<TabItem value="styles" label="page.module.css">

```css
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 1rem;
  font-family: var(--font-geist-sans);
}

.app {
  min-height: 100vh;
  background: #f8fafc;
}

.nav {
  background: white;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.nav button {
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  transition: all 0.2s;
}

.nav button:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.nav button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;
}

@media (max-width: 600px) {
  .page {
    padding: 0.5rem;
  }
  
  .nav {
    padding: 0.75rem;
    gap: 0.25rem;
  }
  
  .nav button {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
}
```

</TabItem>
</Tabs>

## What You've Built

Congratulations! You now have a working NFT application with:

- Collection Creation: Making new NFT collections
- NFT Minting: Creating individual NFTs
- Collection Browsing: Viewing collections and their contents
- NFT Transfers: Moving NFTs between accounts
- Basic Marketplace: Buying and selling NFTs

### Key Concepts Learned

- Collections vs Items – you create a collection (with its own rules and limits) and then mint individual items inside it.
- Roles and permissions – the admin/issuer/freezer roles determine who can mint, configure metadata or freeze transfers.
- Configuration & locking – collection and item settings can lock transfers, metadata, attributes or supply.
- Minting rules – minting can be restricted to issuers, made public or gated by another collection; you can set prices and block ranges for public minting.
- Trading built‑in – listing, buying and withdrawing NFTs happen via pallet extrinsics, no external marketplace is needed.
- Deposits & on‑chain storage – creating collections, items and setting metadata or attributes requires small deposits which are reserved and returned when you clean up.

### Next Steps

Now that you understand the basics, try these enhancements:

- Add metadata support – Display NFT images and descriptions.
- Improve the UI – Add better styling and user feedback.
- Add batch operations – Mint multiple NFTs at once.
- Create collection browsing – Show all available collections.
- Add advanced trading – Experiment with private sales using the `whitelisted_buyer` parameter, implement NFT swaps.
- Explore roles & locks – Build admin panels for setting team roles, freezing transfers or locking metadata and attributes.

### Resources

- [Complete NFTs Pallet Documentation](https://wiki.nftmozaic.com/docs/how-they-work/code-examples/nfts)
- [Polkadot API Documentation](https://papi.how/)

The template provides all the hooks and utilities you need - focus on building great user experiences with the concepts you've learned!

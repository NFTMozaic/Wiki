---
title: Building NFT Application on Polkadot Virtual Machine with Smart Contracts
sidebar_label: Building NFT Application on Polkadot Virtual Machine with Smart Contracts
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Building NFT Application on Polkadot Virtual Machine with Smart Contracts

Polkadot is steadily evolving from a purely substrate-based ecosystem into a platform that supports both native pallets and smart contracts. The original NFT tutorial used the NFTs pallet and the Polkadot API (PAPI) to mint and manage tokens. With Polkadot Virtual Machine (PVM), NFTs can be implemented as smart contracts. This tutorial teaches you how to build an NFT application on Polkadot's PVM using the `create-nft-app` template. You will learn how to deploy an `ERC-721` contract, mint tokens with metadata, query collections via Blockscout, and transfer NFTs. The course mirrors the PAPI version but uses `Solidity`, `Foundry`, and `Reown AppKit` instead of `nfts-pallet`.

The template is a full-stack Next.js/Foundry starter kit. It provides a complete solution for creating, minting, and viewing NFTs on Polkadot's Passet Hub testnet. The stack includes Next.js 15, Reown AppKit for wallet connectivity, Wagmi v2 for Ethereum-style hooks, Foundry for contract development and deployment, BlockScout indexer, and integration with the Polkadot `Passet Hub testnet`. By the end of this tutorial, you will have a working dApp that allows you to mint NFTs, view collections and tokens, transfer them, and explore optional marketplace extensions.

### How PVM differs from pallet-based NFTs

The Polkadot Virtual Machine (PVM) is a smart contract execution environment built for Polkadot's parachains. Instead of running native EVM bytecode, it compiles Solidity contracts to RISC-V instructions using the resolc compiler. This means you can write Solidity just like you would for Ethereum, but your contracts run on Polkadot's infrastructure. The PVM brings the flexibility of programmable smart contracts to the Polkadot ecosystem while still benefiting from its scalability, cross-chain communication, and shared security.

In pallet-based NFTs, collections and tokens are managed directly by the chain's runtime logic, which is written in Rust and embedded in the node. You interact with these via predefined extrinsics, and the pallet enforces all rules for minting, transferring, and burning.

With PVM, NFTs are just another smart contract you deploy — typically an ERC-721 contract. You define your own rules for metadata, minting, and transfer, and you can extend them with features like royalties, on-chain randomness, or custom access control.

Key differences:

- Flexibility – You control the entire contract logic and can upgrade it (with proper patterns), whereas pallet logic is fixed unless the entire runtime is upgraded.
- Costs – PVM transactions incur smart contract gas fees, which are generally higher per operation than pallet calls.
- Extensibility – You can integrate with other contracts, add marketplace logic, or create new token standards without waiting for runtime changes.

## Setting up your project

### Create a new app

Run the following command in an empty directory. This scaffold installs a Next.js application, a Foundry contract folder, and preconfigured hooks:

```bash
npm create nft-app@latest my-pvm-app
```

Follow the prompt to select the `Next.js + Foundry (Polkadot VM)` template. The template contains a `contracts` folder for Solidity sources and a `src` folder for the React application.

### Install dependencies

After creating the app, install the JavaScript and contract dependencies:

```bash
pnpm install
pnpm run contracts:install
```

The second command uses foundry-polkadot to download the RISC-V toolchain required for compiling Solidity contracts to PVM bytecode. Remember that PVM uses the resolc compiler.

### Configure environment variables

Copy the example environment file and edit it with your own values:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

```
# Get your Project ID from https://cloud.reown.com
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id_here

# Polkadot Passet Hub testnet configuration
NEXT_PUBLIC_BLOCKSCOUT_URL=https://blockscout-passet-hub.parity-testnet.parity.io
NEXT_PUBLIC_RPC_URL=https://testnet-passet-hub-eth-rpc.polkadot.io

# Your deployed NFT contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...  # replace with your contract address
```

The `NEXT_PUBLIC_BLOCKSCOUT_URL` and `NEXT_PUBLIC_RPC_URL` variables point to the Passet Hub explorer and RPC, while `NEXT_PUBLIC_CONTRACT_ADDRESS` holds your deployed NFT contract address. You will supply this address after deploying your contract. Obtain testnet `PAS` tokens from the Polkadot faucet and view your account in the Polkadot Apps UI.

## Smart contract development

### Understanding the contract

The template ships with a simple ERC-721 contract located in `contracts/src/PolkadotNFT.sol`. It inherits from OpenZeppelin's `ERC721` and `ERC721URIStorage` and implements a `safeMint` function:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
import { ERC721 } from '@openzeppelin-contracts/token/ERC721/ERC721.sol';
import { ERC721URIStorage } from '@openzeppelin-contracts/token/ERC721/extensions/ERC721URIStorage.sol';

contract PolkadotNFT is ERC721, ERC721URIStorage {
  string private s_contractURI;
  uint256 private s_nextTokenId;

  constructor(string memory name, string memory symbol, string memory _contractURI) ERC721(name, symbol) {
    s_contractURI = _contractURI;
  }

  function contractURI() public view returns (string memory) {
    return s_contractURI;
  }

  function safeMint(address to, string memory uri) public {
    uint256 tokenId = s_nextTokenId++;
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
  }

  function tokenURI(
    uint256 tokenId
  ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view override(ERC721, ERC721URIStorage) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
```

The `contractURI()` function returns a collection-level metadata URI, while `safeMint()` increments a token counter, mints a new token, and assigns a metadata URI. The template does not implement sale logic. You will add marketplace functionality separately if desired.

### Building and deploying the contract

Because PVM uses a RISC-V backend, you must compile your contract with `resolc` instead of the standard `solc`. The `foundry-polkadot` toolchain will install this compiler. To build the contract, run:

```bash
pnpm run contracts:build
```

After compilation, deploy the contract to the Passet Hub testnet using forge:

```bash
# Set your private key (funded with testnet PAS)
export ETH_PRIVATE_KEY=your_private_key_here

# Deploy the contract (replace the constructor args)
forge create PolkadotNFT \
  --resolc \
  --rpc-url https://testnet-passet-hub-eth-rpc.polkadot.io \
  --private-key $ETH_PRIVATE_KEY \
  --broadcast -vvvvv \
  --constructor-args "Collection Name" "SYM" "https://your-collection-metadata-uri.com/"
```

After deployment, copy the resulting contract address into your `.env` file as `NEXT_PUBLIC_CONTRACT_ADDRESS`.

### Minting via the CLI (optional)

You can mint NFTs directly from the command line using Foundry's cast tool. For example, to mint a token to yourself with a metadata URI:

```bash
cast send $CONTRACT_ADDRESS \
  "safeMint(address,string)" \
  $RECIPIENT_ADDRESS \
  "https://your-token-metadata-uri.com/" \
  --rpc-url https://testnet-passet-hub-eth-rpc.polkadot.io \
  --private-key $ETH_PRIVATE_KEY
```

This call uses the contract's `safeMint` function and signs the transaction with your private key. In the next section, you will build a React component that performs the same operation through your dApp.

## Front-end setup

The template uses Reown AppKit and Wagmi v2 to handle wallet connections and contract interactions. The `ContextProvider` in `src/context/index.tsx` configures Wagmi and the AppKit modal. You do not need to modify it unless you add new networks. The Header component includes a `<appkit-button />` element that opens Reown's wallet modal.

### Connecting to the wallet

When a user opens your dApp and clicks Connect, the AppKit modal lets them choose a wallet supported on the Passet Hub. Once connected, Wagmi exposes hooks such as `useAccount`, `useWriteContract`, and `useReadContract` for interacting with your contract.

## Lesson 1: Minting NFTs

In Pallet-based NFTs, creating a collection occurs via an extrinsic. On PVM, each ERC-721 contract is itself a collection, so minting is the first operation your users perform. You will build a `MintNFT` component that accepts a metadata URI and mints a token to the connected account.

### Component code

Below is a simple component that uses Wagmi's `useWriteContract` hook. It loads the contract address and ABI, captures the recipient and metadata URI from user input, and calls `safeMint` on click. When the transaction succeeds, it clears the form and optionally refreshes the list of tokens.

```tsx
'use client';
import React, { useState } from 'react';
import { useAccount, usePrepareContractWrite, useContractWrite } from 'wagmi';
import { parseEther } from 'viem';
import CONTRACT_ABI from '@/contracts/PolkadotNFT.json'; // import your ABI

export const MintNFT = () => {
  const { address } = useAccount();
  const [metadataUrl, setMetadataUrl] = useState('');
  const [to, setTo] = useState('');

  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI.abi,
    functionName: 'safeMint',
    args: [to || address, metadataUrl],
    enabled: !!metadataUrl && !!(to || address),
  });

  const { write, isLoading } = useContractWrite(config);

  const handleMint = async () => {
    try {
      await write?.();
      alert('NFT minted successfully!');
      setMetadataUrl('');
      setTo('');
    } catch (e) {
      alert('Minting failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Mint NFT</h2>
      <label className="block mb-2">
        Recipient (optional):
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Default: your address"
        />
      </label>
      <label className="block mb-4">
        Metadata URI:
        <input
          type="text"
          value={metadataUrl}
          onChange={(e) => setMetadataUrl(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="ipfs://..."
        />
      </label>
      <button
        onClick={handleMint}
        disabled={isLoading || !metadataUrl}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
      >
        {isLoading ? 'Minting...' : 'Mint NFT'}
      </button>
    </div>
  );
};
```

### Explanation

The component imports the contract ABI generated by Foundry. `usePrepareContractWrite` prepares a `safeMint` call with the contract address and arguments. When the user clicks the button, `useContractWrite` sends the transaction. Because `safeMint` is public and increments an internal counter, you do not need to specify a token ID, the contract handles it for you. Minting requires the connected account to pay gas in `PAS`. Ensure you have testnet tokens. You can get PAS from the Polkadot [Passet Hub Faucet](https://faucet.polkadot.io/?parachain=1000) before minting.

:::tip Challenge
Enhance the form so that users can specify the contract's `contractURI` (collection metadata) before deploying. You could also let users upload images to IPFS and automatically set the metadata URI.
:::

## Lesson 2: Browsing collections and tokens

After minting, you need to display all collections and tokens available on the network. The template provides a small BlockscoutAPI wrapper (`src/lib/blockscout.ts`) that calls the Blockscout explorer. It exposes three functions:

- `getERC721Collections()` fetches all ERC-721 collections by querying `/api/v2/tokens?type=ERC-721`.
- `getCollectionTokens(contractAddress)` retrieves tokens for a specific contract via `/api/v2/tokens/{address}/instances`.
- `getUserNFTs(userAddress)` lists NFTs owned by an address by calling `/api/v2/addresses/{address}/nft?type=ERC-721`.

You can wrap these API calls in React Query hooks (`useCollections`, `useCollectionTokens`, and `useUserNFTs`) or call them directly. Below is an example component for browsing collections and tokens.

```tsx
'use client';
import React, { useState } from 'react';
import { useCollections, useCollectionTokens } from '@/hooks';

export const ViewCollections = () => {
  const { data: collections, refetch } = useCollections();
  const [selected, setSelected] = useState<string>('');
  const { data: tokens } = useCollectionTokens(selected);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Collections</h2>
      <button onClick={() => refetch()} className="mb-4 px-3 py-1 bg-green-600 text-white rounded">Refresh</button>
      <ul className="space-y-2">
        {collections?.map((c) => (
          <li key={c.address_hash} className="cursor-pointer" onClick={() => setSelected(c.address_hash)}>
            <strong>{c.name}</strong> - {c.symbol} (address: {c.address_hash.slice(0, 6)}...)
          </li>
        ))}
      </ul>

      {selected && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Tokens in {selected.slice(0,6)}...</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {tokens?.map((token) => (
              <div key={token.id} className="border p-3 rounded">
                <h4 className="font-bold">Token #{token.id}</h4>
                {token.metadata?.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={token.metadata.image} alt="NFT" className="w-full h-32 object-cover rounded" />
                )}
                <p className="text-sm text-gray-600 truncate">Owner: {token.owner?.hash.slice(0, 8)}...</p>
                {token.metadata?.name && <p className="text-sm">{token.metadata.name}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

This component uses the hooks to fetch and display collections. When a user selects a collection, it loads its tokens. You can extend it to display metadata attributes or filter tokens by owner. For best performance, memoize results or paginate large collections.

:::tip Challenge
Modify the viewer so that users can input a wallet address and see all NFTs they own in one place (`useUserNFTs`). Add pagination when a collection has hundreds of tokens.
:::

## Lesson 3: Transferring NFTs

ERC-721 tokens can be transferred by calling `safeTransferFrom` or `transferFrom`. Only the current owner or an approved operator can initiate a transfer. The following component allows a user to check ownership and send a token to another address.

```tsx
'use client';
import React, { useState } from 'react';
import { useAccount, useReadContract, usePrepareContractWrite, useContractWrite } from 'wagmi';
import CONTRACT_ABI from '@/contracts/PolkadotNFT.json';

export const TransferNFT = () => {
  const { address } = useAccount();
  const [tokenId, setTokenId] = useState('');
  const [recipient, setRecipient] = useState('');

  const { data: owner } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI.abi,
    functionName: 'ownerOf',
    args: tokenId ? [BigInt(tokenId)] : undefined,
    enabled: !!tokenId,
  });

  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI.abi,
    functionName: 'safeTransferFrom',
    args: [address!, recipient, BigInt(tokenId)],
    enabled: !!tokenId && !!recipient && owner?.toLowerCase() === address?.toLowerCase(),
  });

  const { write, isLoading } = useContractWrite(config);

  const handleTransfer = async () => {
    try {
      await write?.();
      alert('Transfer successful');
      setTokenId('');
      setRecipient('');
    } catch (e) {
      alert('Transfer failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Transfer NFT</h2>
      <input
        type="number"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
        placeholder="Token ID"
      />
      {owner && <p className="text-sm mb-2">Current owner: {String(owner).slice(0, 8)}...</p>}
      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
        placeholder="Recipient address"
      />
      <button
        onClick={handleTransfer}
        disabled={isLoading || !tokenId || !recipient || owner?.toLowerCase() !== address?.toLowerCase()}
        className="px-4 py-2 bg-purple-600 text-white rounded disabled:bg-gray-400"
      >
        {isLoading ? 'Transferring...' : 'Transfer'}
      </button>
    </div>
  );
};
```

The component uses `ownerOf` to check that the connected wallet owns the token. If the owner matches, `safeTransferFrom` can be called with the sender, recipient, and token ID. Remember to pass BigInt values for token IDs when using Wagmi.

:::tip Challenge
Populate a dropdown with all token IDs owned by the connected account using the `useUserNFTs` hook. When the user selects one, autofill the token ID field.
:::

## Lesson 4: Marketplace (optional)

Unlike the pallet-based NFTs pallet, ERC-721 contracts do not include built-in trading. To enable on-chain listings, you need a separate marketplace contract that stores sale prices and handles purchases. A simple marketplace might:

- Map `(collectionAddress, tokenId)` to a price and optional buyer.
- Provide `listForSale(uint256 tokenId, uint256 price)` and `cancelListing(uint256 tokenId)` functions callable only by the owner.
- Expose a `buy(uint256 tokenId)` function that transfers the NFT and pays the seller.

If you decide to implement a marketplace, deploy it alongside your NFT contract and build UI forms similar to the `MintNFT` and `TransferNFT` components. Alternatively, you can integrate existing EVM marketplaces if they support Passet Hub.

:::tip Challenge
Write a Solidity `Marketplace.sol` contract with the functions described above and add UI components to list and buy NFTs. Use Wagmi's `useContractRead` and `useContractWrite` hooks to call your marketplace.
:::

## Putting it all together

To combine the components into a single application, create a simple navigation bar in `src/app/page.tsx` and render each view based on state. Below is an example of how to structure your main page component:

```tsx
'use client';
import React, { useState } from 'react';
import { MintNFT } from '@/components/MintNFT';
import { ViewCollections } from '@/components/ViewCollections';
import { TransferNFT } from '@/components/TransferNFT';

type View = 'mint' | 'collections' | 'transfer';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('mint');

  const renderView = () => {
    switch (currentView) {
      case 'mint':
        return <MintNFT />;
      case 'collections':
        return <ViewCollections />;
      case 'transfer':
        return <TransferNFT />;
      default:
        return <MintNFT />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Polkadot NFT App</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setCurrentView('mint')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    currentView === 'mint'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Mint NFT
                </button>
                <button
                  onClick={() => setCurrentView('collections')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    currentView === 'collections'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  View Collections
                </button>
                <button
                  onClick={() => setCurrentView('transfer')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    currentView === 'transfer'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Transfer NFT
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <appkit-button />
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderView()}
      </main>
    </div>
  );
}
```

This setup provides a clean, navigable interface where users can switch between minting NFTs, viewing collections, and transferring tokens. The Reown AppKit wallet connection button is prominently displayed in the navigation bar.

## Next steps

- Metadata support – Display images and attributes from your IPFS metadata. Use `metadata.image`, `metadata.description`, and `metadata.attributes` returned by Blockscout.
- Batch minting – Extend the contract with a `mintBatch` function to allow multiple tokens in one transaction.
- Marketplace features – Add private sales, auctions, or royalties. Explore open-source ERC-721 marketplace contracts for inspiration.
- Explore PVM internals – Read the PolkaVM design documentation to understand how the RISC-V register-based architecture improves performance at [docs.polkadot.com](https://docs.polkadot.com). Investigate the planned JIT compiler and how it might benefit your dApp at [docs.polkadot.com](https://docs.polkadot.com).
- Interoperability – Use XCM precompiles or cross-chain bridges to move your NFTs between PVM chains and other parachains.

## Conclusion

You have built a basic NFT application on Polkadot's PVM. Starting from the `create-nft-app` template, you configured your environment, deployed an ERC-721 contract, connected a wallet using Reown AppKit, minted tokens, viewed collections via Blockscout, and transferred NFTs.

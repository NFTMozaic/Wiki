---
id: Templates comparison
title: Templates comparison
sidebar_label: Templates comparison
sidebar_position: 1
---

# dApp templates

Building apps on Polkadot is relatively easy, but getting started can be challenging. Setting up the development environment requires configuring multiple tools including indexers, compilers, and wallet connectors, which can be time-consuming for newcomers. Templates help you get up and running quickly by providing pre-configured environments and tools. This saves hours of setup time and is perfect for developers who learn by doing.

Below are templates for both PVM (Solidity) and native Substrate implementations.

## Template Comparison

<div style={{ fontSize: "0.85rem" }}>

| Template                                                                        | Framework | Blockchain Integration | Indexer       | Wallet Support              | Best For                          |
| ------------------------------------------------------------------------------- | --------- | ---------------------- | ------------- | --------------------------- | --------------------------------- |
| [create-nft-app (PVM)](/docs/how-they-work/quick-start/nft-dapp#pvm-solidity)                                   | Next.js   | Wagmi + Foundry        | Blockscout    | Multiple (Reown AppKit)     | NFT-focused dApps (Solidity)      |
| [create-nft-app (PAPI)](/docs/how-they-work/quick-start/nft-dapp#papi-nfts-pallet)                              | Next.js   | PAPI + smoldot         | KodaDot stick | Multiple (Talisman connect) | NFT-focused dApps (NFTs pallet)   |
| [create-polkadot-dapp (PVM)](/docs/how-they-work/quick-start/generic-dapp#create-polkadot-dapp-pvm-solidity)    | React     | Wagmi + Hardhat        | -             | MetaMask                    | General dApps (Solidity)          |
| [create-polkadot-dapp (PAPI)](/docs/how-they-work/quick-start/generic-dapp#create-polkadot-dapp-papi-substrate) | React     | ReactiveDOT + PAPI     | -             | Multiple (DOTConnect)       | General dApps (Substrate pallets) |

</div>

---
sidebar_position: 3 
---

# The “official” pallet

There is no single “official” NFT pallet in the Polkadot ecosystem. 
The list below outlines the current recommended options for the new dApps coming to use NFTs across the Polkadot ecosystem.

| Pallet            | Chain | Recommendation                                  |
|-----------------------|----|-----------------------------------------------------|
| **NFTs pallet** | AssetHub | Default for new dApps                               |
| **Unique Network pallet** | Unique Network | Best for advanced dApp needs                        |


While the `pallet_uniques` is used by many existing parachains and remains stable and well-tested, the newer `pallet_nfts` is currently recommended for most use cases. It powers the majority of NFT activity across the ecosystem and benefits from broader tooling support and ongoing development.

If you're considering deploying on a specific chain, refer to the **[NFT Pallets in the Polkadot Ecosystem](https://docs.google.com/spreadsheets/d/1BhlmF9BUw0z6B5qBAqC3j_NMZ0dbhenvgFNFIo4oPhQ/edit?usp=sharing)** file to see which pallets are supported where.

Later this year, the introduction of PVM on AssetHub will offer another robust and flexible option for NFT logic — on par with existing pallets.



## NFT Mozaic role 
Support for NFTs and Uniques pallets is done by the Fellowship. No functionality changes are planned, since the code base for pallets has to be very stable. NFTMozaic will attempt to:

- Evaluate what “future proof guarantees” can be provided on NFTs/AssetHub in discussions with Fellowship members and on its own best practices.
- Formalize the upgrade policy for these two pallets in discussions with Fellowship.


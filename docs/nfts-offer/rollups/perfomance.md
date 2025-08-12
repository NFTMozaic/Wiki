---
id: perfomance
title: NFT minting benchmarks
sidebar_label: NFT minting benchmarks
sidebar_position: 20
---

# NFT minting benchmarks (As of 2025-08-08)

### Requirements

AssetHub version (For Revive, pallet nfts, pallet uniques): https://github.com/paritytech/polkadot-sdk/tree/03e07b69039c399ddc6f5e32f9477e186d0f9779

Moonbeam version (For frontier): https://github.com/moonbeam-foundation/moonbeam/tree/0e600693f70b67c59ed6a9688deb91fa5339cd5a

Unique Network version (For frontier): https://github.com/UniqueNetwork/unique-chain/tree/48cf930656ee2a54f4c0b7ee45cd89e45e363536

Relay version: dockerImage: 'parity/polkadot:v1.18.0'

Solc version (For frontier): 0.8.29+commit.ab55807c.Emscripten.clang

Resolc version (For Revive): 0.1.0-dev.12+commit.66f9a4d.llvm-18.1.8

Ethers version (For both Revive and frontier): 6.13.5

### Benchmarking code

Resolc command:

```sh
solc \
  --combined-json asm,bin \
  --include-path ./node_modules \
  --base-path ./ \
  contracts/nft.sol \
  node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol \
  node_modules/@openzeppelin/contracts/utils/Address.sol \
  node_modules/@openzeppelin/contracts/utils/Strings.sol \
  node_modules/@openzeppelin/contracts/utils/math/Math.sol \
  node_modules/@openzeppelin/contracts/utils/math/SignedMath.sol \
  > contracts/nft.json
```

For Smart Contract minting, the standard ERC721 from OpenZeppelin was used for both Revive and Frontier, with a basic implementation of batch minting:

```solidity
// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Nft is ERC721 {
    constructor() ERC721("TEST", "TST")  {
    }

    function mintMany(address to, uint256 startTokenId, uint256 count) external {
        uint endTokenId = startTokenId + count;
        for (uint i = startTokenId; i < endTokenId; i++) {
            _mint(to, i);
        }
    }

}
```

Benchmark code:

```typescript
import { ethers } from "ethers";
import nftAbi from "../../contracts/contracts_nft_mass_minting_sol_Nft.abi.json" assert { type: "json" };
import { readFile } from "fs/promises";
import { FetchRequest } from "ethers/utils";

let url = process.env.RELAY_UNIQUE_HTTP_URL!;
const request = new FetchRequest(url);
const provider = new ethers.JsonRpcProvider(request);

// Create a wallet (signer) using your private key and connect it to the provider
const privateKey =
  "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133";
const wallet = new ethers.Wallet(privateKey, provider);
console.log("Balance", await provider.getBalance(wallet.address));

async function deployContract(abi: any, args: any[], bytecode: any) {
  // Create a ContractFactory connected to your signer
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);

  // Deploy the contract (pass constructor arguments if required)
  const contract = await factory.deploy(...args);

  // Wait until the deployment transaction is mined
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("Contract deployed at:", address);
  return contract;
}
const COUNT = 32;

const nftBin =
  "0x" +
  (
    await readFile(`./contracts/contracts_nft_mass_minting_sol_Nft.bin`)
  ).toString();

console.log("Deploying nft");
const nft = (await deployContract(nftAbi, [], nftBin).catch(
  console.error
)) as any;

const nonce = await provider.getTransactionCount(
  "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"
);
console.log("Nonce", nonce);
const balanceBefore = await provider.getBalance(wallet.address);
const txResponses = [];
for (let i = 0; i < 320; i++) {
  console.log(i);
  txResponses.push(
    await nft.mintMany(
      "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac",
      1 + i * COUNT,
      COUNT,
      { nonce: nonce + i }
    )
  );
}

const receipts = await Promise.all(txResponses.map((tx) => tx.wait()));
let blocks = {} as any;
for (let i = 0; i < receipts.length; i++) {
  const receipt = receipts[i];
  let blockNumber = Number(receipt.blockNumber);
  if (!blocks[blockNumber]) blocks[blockNumber] = 0;
  blocks[blockNumber] += COUNT;
}
console.log(blocks);
const balanceAfter = await provider.getBalance(wallet.address);
console.log("Price", balanceBefore - balanceAfter);
```

### Results

During the benchmarking, the batch minting method was used:
64 tokens per transaction for Smart Contracts (since Revive did not accept transactions with a higher amount, although Frontier allowed minting up to 128 tokens at a time. To ensure equal conditions, Frontier was also limited to 64 tokens per transaction).
100 tokens per transaction for Substrate.

The total number of tokens was limited to 100,000 in both cases. Coinbase and Hydration data was used to determine the price in USD.

| AssetHub       | Price (Per 100k tokens) | Price per token        | tokens per block          | tokens per minute           |
| -------------- | ----------------------- | ---------------------- | ------------------------- | --------------------------- |
| Pallet uniques | 512.9 DOT ($1990)       | ~0.00513 DOT ($0.0199) | 8,000                     | 80,000                      |
| Pallet Nfts    | 587.7 DOT ($2280)       | ~0.00588 DOT ($0.0228) | 6,000                     | 60,000                      |
| Revive         | 8618.3 DOT ($33439)     | ~0.0862 DOT ($0.335)   | 3,000 (max) / 1,600 (avg) | 30,000 (max) / 16,000 (avg) |

| Moonbeam | Price             | Price per token      | tokens per block | tokens per minute |
| -------- | ----------------- | -------------------- | ---------------- | ----------------- |
| Frontier | 976 GLMR ($70.38) | ~0.097 GLMR ($0.007) | 1,400            | 14,000            |

| Unique    | Price             | Price per token       | tokens per block | tokens per minute |
| --------- | ----------------- | --------------------- | ---------------- | ----------------- |
| Substrate | 4179 UNQ ($39.45) | ~0.042 UNQ ($0.00037) | 7,000            | 70,000            |
| Frontier  | 4873 UNQ ($46.01) | ~0.049 UNQ ($0.00046) | 4,800            | 48,000            |

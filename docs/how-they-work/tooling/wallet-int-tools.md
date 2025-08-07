---
id: Wallet-integration-tools
title: Wallet integration tools 
sidebar_label: Wallet integration tools
sidebar_position: 4 
---

# Wallet integration tools 

## Categorization of Solutions

UI Connector Tools simplify blockchain interactions in dApps by abstracting complex technical details behind user-friendly interfaces for wallet connection, transaction handling, data fetching, and user authentication. Although our primary focus is on the actively developing Polkadot ecosystem, we use the mature Ethereum ecosystem as a benchmark to classify these solutions.

This research examines the following key categories:

* **Libraries for Web3 Interaction:** Fundamental JavaScript libraries and SDKs that offer low-level functions to interact with blockchain nodes, wallets, and smart contracts. They serve as the foundation for higher-level abstractions.  
* **Wallet Providers:** Tools and protocols that establish secure and standardized connections between various crypto wallets (e.g., browser extensions, mobile apps) and dApps. These solutions streamline the connection process and simplify wallet integration for developers.  
* **Social Auth Solutions:** Services and protocols that enable user authentication using familiar social media or email accounts—allowing users to access dApps without immediately needing a crypto wallet. These solutions aim to reduce the onboarding barrier for new Web3 users.  
* **Wallet Kits:** Ready-made UI components and libraries that offer pre-built interfaces for wallet connection, balance display, transaction sending, and other common functions, thereby accelerating UI development and enhancing the user experience.  
* **Opinionated Frameworks:** CLI tools and project templates that provide pre-configured development setups with integrated libraries and best practices for rapid dApp creation. They offer an "out-of-the-box" optimal toolset, reducing the initial setup time for developers.  
* **zk-Solutions for Privacy and Authentication:** Tools that utilize Zero-Knowledge Proofs (ZKPs) to ensure data privacy and secure authentication, enabling the creation of more efficient and scalable dApps. These solutions are in active research and experimental stages.

By comparing these categories as implemented in Ethereum—with its extensive, production-ready ecosystem and emerging solutions in Polkadot, this research aims to highlight common trends, differences, and future development prospects, guiding developers in selecting the right tools for their Polkadot dApps.

<div style={{ fontSize: "0.85rem" }}>

| Category | Ethereum (and Cross‑Chain) | Polkadot (Substrate) |
| ----- | ----- | ----- |
| **Libraries** | [**Wagmi**](https://wagmi.sh) – React hooks for Ethereum, a lightweight wrapper over viem/ethers (production‑ready). <br /> [**web3‑react**](https://github.com/NoahZinsmeister/web3-react) – a web3‑wallet connection framework with minimal dependencies (production‑ready) | [**Extension DApp**](https://www.npmjs.com/package/@polkadot/extension-dapp) – utility for working with injected Polkadot wallets (production‑ready) |
| **Providers** | [**WalletConnect**](https://walletconnect.mirror.xyz) – protocol for connecting wallets via QR, v2 supports multi‑chain. [**WalletLink (Coinbase Wallet)**](https://walletlink.org) – integration of Coinbase Wallet into dApps. | [**Talisman Connect**](https://www.npmjs.com/package/@talismn/connect-components) – connecting Polkadot wallets.<br /> [**dot‑connect**](https://www.npmjs.com/package/dot-connect)– UI modals for Polkadot wallets (PoC on Reactive DOT, experimental). <br />[**WalletConnect v2**](https://docs.subwallet.app) – supported by Polkadot wallets (e.g. SubWallet, Nova) for connecting to dApps. |
| **Social Auth** | [**Magic (MagicLink)**](https://magic.link/) – SDK for password‑less login (email/social login) with keys stored in HSM  <br /> [**Web3Auth (Torus)**](https://github.com/Web3Auth/web3auth) – password‑less login with OAuth (Google, etc.) \+ MPC, non‑custodial key | [**Apillon**](https://blog.apillon.io) – Polkadot platform, decentralized OAuth2 login with DID on KILT.<br />[**MagicLink for Polkadot**](https://magic.link/docs/blockchains/other-chains/other/polkadot) <br /> [**Web3Auth for Polkadot**](https://web3auth.io/docs/connect-blockchain/other/polkadot)  |
| **ZK‑auth (type of  Social Auth)** | [**Semaphore**](https://github.com/semaphore-protocol/semaphore) – privacy protocol on Ethereum: proving group membership without revealing identity | **DOT Login (zk OAuth)** – W3F‑grant: OAuth2 login with an ephemeral key registered via zk‑proof on Substrate (experimental) <br /> [**KZero Wallet**](https://kzero.xyz/) – experimental Polkadot wallet claiming improved security via a new architecture |
| **Wallet Kits (UI Components)** | [**RainbowKit**](https://github.com/rainbow-me/rainbowkit) – ready‑made React widget for wallet lists (based on Wagmi, production‑ready). <br />[**Web3Modal**](https://github.com/Web3Modal/web3modal) – modal window for wallet selection (WalletConnect v2, supports EVM/Solana/Cosmos, production‑ready). <br />[**Onboard.js**](https://github.com/blocknative/onboard) – UI kit for wallet connection (production‑ready) | [**Talisman Connect**](https://www.npmjs.com/package/@talismn/connect-wallets) – SDK for connecting Polkadot wallets  <br />[**polkadot.js-onboard**](https://github.com/polkadot-js/extension) – Parity SDK for integrating extension/WC/LEDGER (prototype, discontinued)  <br />[**Vara/gear WalletConnect**](https://wiki.vara.network/docs/api/tooling/wallet-js) – Gear library for a wallet UI (open‑source) |
| **Opinionated Frameworks** | [**Create Eth App**](https://github.com/paulrberg/create-eth-app) – a CLI template for creating Ethereum dApps in one command <br /> [**Scaffold‑ETH**](https://github.com/scaffold-eth/scaffold-eth) – full-stack for Ethereum (Hardhat, Next.js, RainbowKit, etc.) | [**create-polkadot-dapp**](https://www.npmjs.com/package/create-polkadot-dapp) – templates papi-react-tailwind, react-solidity |
</div>

## Polkadot Wallet Integration Solutions

**Overview:** Below is a comparison of four popular approaches to integrating Polkadot wallets into decentralized applications (dApps). The comparison considers bundle size, ease of integration (documentation, hooks, examples, framework support), multi-chain support (Substrate vs EVM vs WalletConnect), real-world adoption in open-source projects, and repository activity/maintenance for each solution

### Feature Comparison of Wallet Integration Solutions

<div style={{ fontSize: "0.7rem" }}>

| Solution | Bundle Size (approx.) | Integration & Docs | Supported Chains  | Adoption in DApps | Repo |
| ----- | ----- | ----- | ----- | ----- | ----- |
| Talisman Connect @talismn/connect-wallets | \~111 kB unpacked​ | Easy: Well-documented minimal SDK​. Offers three integration modes – as a standalone library, React components, or a pre-built modal​. Supports React out-of-the-box; can be used in any JS framework via the standalone API. | Substrate: Yes (Polkadot, Kusama via injected extensions)​ | Interlay (InterBTC app) is integrating Talisman Connect​. Also used in community dApps and recommended for multi-chain Polkadot apps (e.g. Snowbridge)​. Gaining popularity due to simplicity. | Open-source: Available on Talisman’s GitHub. Actively maintained (latest v1.2.8 published \~4 months ago)​  |
| SubConnect (SubWallet Connect) | Large: Core SDK \~60 MB unpacked​ (includes UI, many deps). Individual wallet modules are small (e.g. SubWallet module \~5.7 kB​, Polkadot.js module \~8.2 kB)​ | Moderate: Based on Blocknative’s Web3-Onboard. Provides extensive docs and examples for React, Vue, Svelte, etc.. Includes React hooks (@subwallet-connect/react) for state management​. Integration requires initializing the core and adding wallet modules. | Substrate: Yes (supports Polkadot.js, Talisman, SubWallet, Enkrypt, etc. via injected-wallet modules)​. EVM: Yes, full Web3-Onboard support for MetaMask, Coinbase, Ledger, Trezor, WalletConnect, etc. | Used in SubWallet’s own demo dApps​. Adoption in the broader community is limited, though some dApps have experimented with it. | Open-source: Forked from Web3-Onboard​. Latest NPM release was 7 months ago​. Maintained by SubWallet team. Updates are infrequent after initial release. |
| Reactive DOT / DOTConnect (@reactive-dot/\*) | Lightweight: Emphasis on performance – caches chain data and minimizes redundant calls​. Core library size is modest (several tens of kB), but depends on the Polkadot API. | Developer-friendly: Provides React hooks (useWallets, useConnectWallet, etc.) for state management​. Documentation includes quick-start and a prebuilt DOTConnect web-component for a plug-and-play wallet modal​. React support is first-class; a Vue integration is planned​. | Substrate: Yes (designed for Polkadot/Kusama). Supports all injected wallets via a unified provider​, direct Ledger support​, and even multisig via Mimir​. EVM: Partial. Focus is on Substrate, but WalletConnect v2 can be configured for EVM chains (and future Polkadot mobile wallets)​. ​ WalletConnect: (via @reactive-dot/wallet-walletconnect adapter)​ | Hydration (HydraDX) and similar next-gen Polkadot dApps are exploring Reactive DOT for its modern approach (Hydration supports Ledger, Vault, EVM wallets – aligning with Reactive DOT’s capabilities). Being a newer solution, it’s not yet widely adopted in production – mostly seen in demos and developer prototypes. | Actively developed with frequent releases (e.g. core v0.33 published days ago) and funded by the Polkadot treasury. Maintainer has Polkadot ecosystem experience (ex-Talisman team)​  |
| WalletConnect v2 Universal Provider  | Large: The WC2 core \+ modal library is fairly heavy (hundreds of kB, including cryptography and many wallet icons). Typically added as two packages: @walletconnect/universal-provider and @walletconnect/modal​. Minified \+ gzipped \~200–300 kB for the core provider \+ UI. | Intermediate: Official docs provided for integration. DApp must initialize the provider and specify supported chains. The WalletConnect modal UI simplifies wallet selection (QR code or wallet list)​, but developers still handle session events and chain context.  | Substrate: Limited. WalletConnect is chain-agnostic​, but currently few Polkadot wallets support it (no mainstream extension uses WC v2 yet). Potential for future support via CAIP-13 chain IDs (Polkadot)​.  | Polkadot ecosystem, direct adoption is rare so far – dApps instead rely on Polkadot-specific solutions. Main inconvenience is the old version of web3modal and the unfiltered list of wallets, which contains entirely ethereum wallets. Theoretically, it can be used correctly if you filter wallets through the settings, but there will only several of them (subwallet). But in this case the ability to work with other networks is lost. The flexible approach to working with polkadot, as in the case of Solana, is not implemented  | Open-source: Yes (WalletConnect repo). Actively maintained by WalletConnect team; frequent updates and a large community of integrators. However, not tailored to Polkadot – requires wallet-side adoption for Substrate usage.  |

</div>

### Usage of solutions in public repos

<div style={{ fontSize: "0.7rem" }}>
| Name | Framework | GitHub Link | Directory | Connect to Polkadot Solution |
| ----- | ----- | ----- | ----- | ----- |
| kodadot | Vue Nuxt | [GitHub](https://github.com/kodadot/nft-gallery) | nft-gallery/utils/config/wallets.ts | @polkadot/extension-dapp |
| hydration | React | [GitHub](https://github.com/galacticcouncil/hydration-ui) | src/sections/web3-connect/wallets/WalletConnect.ts | @talismn/connect-wallets, @walletconnect/universal-provider |
| astar portal | Vue | [GitHub](https://github.com/AstarNetwork/astar-apps) | star-apps/src/hooks/useConnectWallet.ts | @polkadot/extension-dapp |
| snowbridge | React (Next.js) | [GitHub](https://github.com/Snowfork/snowbridge-app) | hooks/useConnectPolkadotWallet.ts | @talismn/connect-wallets |
| interlay | React | [GitHub](https://github.com/interlay/interbtc-ui) | src/hooks/use-wallet.ts | @polkadot/extension-dapp |
| polkassembly | React (Next.js) | [GitHub](https://github.com/polkassembly/polkassembly/tree/main) | polkassembly/src/hooks/useGetAllAccounts.ts | @polkadot/extension-dapp |
| zeitgeist | React  (Next.js) | [GitHub](https://github.com/zeitgeistpm/ui) | lib/hooks/useWeb3Wallet.ts | @talismn/connect-wallets |
</div>

## Conclusions

The Polkadot UI connector ecosystem is still evolving, mirroring many functionalities found in Ethereum. Numerous solutions are emerging to streamline wallet integration for dApps, and there is a wealth of ongoing research in this area.

Based on open-source project analysis and testing in boilerplates, the Talisman solution (@talismn/connect-wallets, @talismn/connect-components) appears to be the optimal solution at this time.

Key advantages include:  
* Simplified integration.  
* Broad wallet support (popular wallets).  
* Wide dApp adoption.  
* Small bundle size.

Developers starting a new dApp on Polkadot should consider using the create-polkadot-dapp CLI tool. This tool provides opinionated templates (e.g. React \+ Tailwind) with integrated support for essential Polkadot libraries and wallet connectors. It is especially beneficial for:

* Bootstrapping quickly with minimal setup.  
* Standardizing architecture across teams or hackathon projects.  
* Accelerating prototyping, especially when combined with tools like Talisman Connect.


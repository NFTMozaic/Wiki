---
id: kodadot-indexer-integration
title: Kodadot Indexer Integration Guide
sidebar_label: Kodadot Indexer Integration Guide
sidebar_position: 3
---

# KodaDot Indexer Usage Examples

## Executive Summary

This article explores the technical implementation of KodaDot's NFT Indexer integration across three prominent Polkadot ecosystem applications: Talisman, Nova Wallet, and Dotmemoxyz. The analysis demonstrates a standardized approach to NFT data retrieval using GraphQL, highlighting the versatility and interoperability of KodaDot's infrastructure.

## Integration Approaches

### 1. Talisman (Kotlin) - Substrate NFT Async Generator

#### Key Features:
- Utilizes GraphQL for dynamic NFT collection retrieval
- Supports Kusama Asset Hub blockchain
- Implements async generator for efficient batch processing
- Comprehensive NFT metadata extraction 

#### Code Implementation:

```javascript
export const createSubstrateNftKusamaAssetHubNftAsyncGenerator: CreateNftAsyncGenerator<
  Nft<'substrate-nft', 'kusama-asset-hub'>
> = async function* (address, { batchSize }) {
  let offset = 0
  while (true) {
    const response = await request(
      'https://ahk.gql.api.kodadot.xyz/',
      graphql(`
        query collectionListWithSearch(
          $first: Int!
          $offset: Int
          $orderBy: [CollectionEntityOrderByInput!] = [blockNumber_DESC]
          $address: String!
        ) {
          collections: collectionEntities(
            limit: $first
            offset: $offset
            orderBy: $orderBy
            where: { nfts_some: { burned_eq: false, currentOwner_eq: $address } }
          ) {
            id
            name
            max
            nfts(where: { burned_eq: false, currentOwner_eq: $address }) {
              id
              sn
              currentOwner
              meta {
                name
                description
                image
                attributes {
                  trait
                  value
                }
              }
            }
          }
        }
      `),
      {
        first: batchSize,
        offset,
        address: encodeAddress(address, 2),
      }
    )
    if (response.collections.length === 0) {
      break
    }
    yield* response.collections.flatMap(collection =>
      collection.nfts.map((nft): Nft<'substrate-nft', 'kusama-asset-hub'> => {
        const type = 'substrate-nft' as const
        const chain = 'kusama-asset-hub' as const
        return {
          type,
          chain,
          id: `${type}-${chain}-${nft.id}`,
          name: nft.meta?.name ?? undefined,
          description: nft.meta?.description ?? undefined,
          media: { url: nft.meta?.image || undefined },
          thumbnail: nft.meta?.image || undefined,
          serialNumber: Number(nft.sn),
          properties: nft.meta?.attributes
            ? Object.fromEntries(
                (nft.meta?.attributes ?? []).flatMap(({ trait, value }) => (trait ? [[trait, value]] : []))
              )
            : undefined,
          externalLinks: [{ name: 'Kodadot', url: `https://kodadot.xyz/ahk/gallery/${nft.id}` }],
          collection: !collection
            ? undefined
            : {
                id: collection.id,
                name: collection.name ?? undefined,
                totalSupply: collection.max ?? undefined,
              },
        }
      })
    )
    offset += batchSize
  }
}
```

#### **Technical Highlights:**

* Dynamic pagination with `batchSize` parameter  
* Robust error handling and address encoding  
* Flexible metadata parsing (name, description, attributes)  
* External link generation to KodaDot platform

### **2\. Nova Wallet (Swift) \- Subquery-Based NFT Operations**

#### **Key Features:**

* Modular operation factory for NFT, metadata, and collection queries  
* Supports granular data retrieval  
* Implements flexible GraphQL query construction

#### **Code Implementation:**

```swift
final class KodaDotNftOperationFactory: SubqueryBaseOperationFactory {
    private func buildNftQuery(for address: AccountAddress) -> String {
        """
        {
           nftEntities(where: {currentOwner_eq: "\(address)"}) {
               id
               image
               metadata
               name
               price
               sn
               currentOwner
               collection {
                 id
                 max
                }
            }
        }
        """
    }

    private func buildMetadataQuery(for metadataId: String) -> String {
        """
        {
            metadataEntityById(id: \"\(metadataId)\") {
                image
                name
                type
                description
            }
        }
        """
    }

    private func buildCollectionQuery(for collectionId: String) -> String {
        """
        {
            collectionEntityById(id: \"\(collectionId)\") {
                name
                image
                issuer
            }
        }
        """
    }
}

extension KodaDotNftOperationFactory: KodaDotNftOperationFactoryProtocol {
    func fetchNfts(for address: AccountAddress) -> CompoundOperationWrapper<KodaDotNftResponse> {
        let queryString = buildNftQuery(for: address)

        let operation: BaseOperation<KodaDotNftResponse> = createOperation(for: queryString)

        return CompoundOperationWrapper(targetOperation: operation)
    }

    func fetchMetadata(for metadataId: String) -> CompoundOperationWrapper<KodaDotNftMetadataResponse> {
        let queryString = buildMetadataQuery(for: metadataId)

        let operation: BaseOperation<KodaDotNftMetadataResponse> = createOperation(for: queryString)

        return CompoundOperationWrapper(targetOperation: operation)
    }

    func fetchCollection(for collectionId: String) -> CompoundOperationWrapper<KodaDotNftCollectionResponse> {
        let queryString = buildCollectionQuery(for: collectionId)

        let operation: BaseOperation<KodaDotNftCollectionResponse> = createOperation(for: queryString)

        return CompoundOperationWrapper(targetOperation: operation)
    }
}
```


#### **Technical Highlights:**

* Separate query methods for NFTs, metadata, and collections  
* Compound operation wrapper for asynchronous processing  
* Strongly typed response handling  
* Extensible architecture for future enhancements

### **3\. Dotmemoxyz (Vue.js) \- Reactive NFT Collection Retrieval**

#### **Key Features:**

* Reactive collection fetching using Vue.js composition API  
* Prefix-based dynamic collection ID selection  
* Error-tolerant data retrieval

#### **Code Implementation:**
```javascript
definePageMeta({
  layout: "landing",
});

const { t } = useI18n();

type Collection = {
  id: string;
  createdAt: string;
  name: string;
  image: string;
  metadata: string;
  currentOwner: string;
  issuer: string;
};

const router = useRouter();

const { prefix } = usePrefix();
const collections = ref<Collection[]>([]);

const client = getClient(prefix.value);
const ids = computed(() => (prefix.value === "ahp" ? ["107", "13", "163", "171"] : ["67", "167", "287", "477"]));
const query = client.collectionByIdIn(ids.value);
const result = await client.fetch<{ collections: Collection[] }>(query).catch((e) => {
  console.error("Error while fetching collections", e);
  return null;
});

collections.value = result?.data?.collections ?? [];

const kodaUrl = (id: string) => `https://kodadot.xyz/${prefix.value}/collection/${id}`;

```

#### **Technical Highlights:**

* Dynamic client configuration based on network prefix  
* Computed collection IDs  
* Integrated internationalization support  
* Seamless KodaDot platform linking

## **Integration Patterns and Best Practices**

1. **Consistent GraphQL Approach**

   * All implementations leverage GraphQL for flexible, efficient data retrieval  
   * Standardized query structure across different platforms  
   * Support for complex filtering and pagination  
2. **Metadata Transformation**

   * Uniform approach to parsing and transforming NFT metadata  
   * Extraction of key attributes: name, description, image, properties  
3. **Cross-Platform Compatibility**

   * Language-agnostic integration strategy  
   * Support for multiple blockchain networks within Polkadot ecosystem  
   * 

## **Conclusion**

KodaDot's Indexer integration demonstrates a robust, flexible approach to NFT data retrieval across diverse Polkadot applications, showcasing the product’s versatility and developer-friendly design. 

## **Useful links** 

* KodaDot support chat: [https://t.me/koda\_eco/1](https://t.me/koda_eco/1)  
* KodaDot docs: [https://hello.kodadot.xyz/](https://hello.kodadot.xyz/)  
* Nova Wallet repository: [https://github.com/novasamatech/nova-wallet-ios](https://github.com/novasamatech/nova-wallet-ios)  
* Talisman repository: [https://github.com/TalismanSociety/talisman-web](https://github.com/TalismanSociety/talisman-web)  
* DotmemoXYZ repository [http://github.com/dotmemoxyz/app](http://github.com/dotmemoxyz/app)



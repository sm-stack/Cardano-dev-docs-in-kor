---
id: dandelion-apis
title: Dandelion API 시작하기
sidebar_label: Dandelion APIs
description: Get Started with Dandelion APIs
image: ../img/og/og-getstarted-dandelion-apis.png
--- 

Dandelion은 시작할 수 있는 두 가지 경로를 제공하고 있습니다.

- **개발자용**: 즉시 빌딩을 시작할 수 있도록 [Gimbalabs]에서 무료 커뮤니티 서비스로 제공하는 모두가 사용가능한 Cardano API의 [호스팅된 인스턴스][gimbalabs-dandelion]입니다. 
- **SPOs/DevOps/sysadmins용**: Kubernetes를 사용하여 커뮤니티 서비스를 배포하기 위한 [오픈소스 프로젝트][kustomize-dandelion]입니다. 

[gimbalabs]: https://gimbalabs.com/
[gimbalabs-dandelion]: https://gimbalabs.com/dandelion/
[kustomize-dandelion]: https://gitlab.com/gimbalabs/dandelion/kustomize-dandelion

# 개발자용

더 적합한 API를 선택하여 즉시 프로젝트 프로토타입을 빌딩하십시오.

이는 모두 IOG, Emurgo 및 커뮤니티의 다른 개발자가 만든 오픈 소스 프로젝트로, 직접 호스팅하기로 결정한 경우 아무것도 변경할 필요가 없습니다.

다음은 Github 레퍼지토리에 대한 링크와 이에 대한 간략한 설명입니다.

- [hasura/graphql-api][gh-hasura-graphql]: 이 GraphQL API를 사용하여 블록체인에서 구성된 정보를 수집하고 서명된 트랜잭션을 블록체인으로 전송합니다.
- [cardano-rest/explorer-api][gh-cardano-rest]: 이 REST API를 사용하여 블록체인에서 기본 정보를 수집합니다. ***지원 중단됨***
- [cardano-rest/submit-api][gh-cardano-rest]: 이 REST API를 사용하여 서명된 트랜잭션을 블록체인에 전송합니다. ***지원 중단됨***
- [KtorZ/ogmios-api][gh-ogmios]: 이 JSON-WSP(websocket) API를 사용하여 Cardano 노드 인스턴스에서 직접 실시간 블록체인 정보를 수집합니다.
- [cardano-db-sync][gh-cardano-db-sync]/[postgrest-api][gh-postgrest]: 이 REST API를 사용하여 SQL 쿼리를 수행하고, cardano-db-sync의 데이터베이스에서 직접 정보를 수집합니다.
- [rosetta-api][gh-cardano-rosetta]: 이 API를 사용하여 어플리케이션을 더 간단하고, 빠르며 안정적인 방식으로 여러 블록체인과 통합합니다.
[gh-hasura-graphql]: https://github.com/input-output-hk/cardano-graphql
[gh-cardano-rest]: https://github.com/input-output-hk/cardano-rest
[gh-ogmios]: https://github.com/cardanosolutions/ogmios
[gh-cardano-db-sync]: https://github.com/input-output-hk/cardano-db-sync
[gh-cardano-rosetta]: https://github.com/input-output-hk/cardano-rosetta
[gh-postgrest]: https://github.com/PostgREST/postgrest

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Cardano GraphQL

![img](../../static/img/get-started/dandelion-apis/showcase-graphql-api.png)

유용한 링크:

- Gimbalabs의 엔드포인트 정보 - [Link][gimbalabs-graphql-api] 
- 프로젝트 공식 문서 - [Link][graphql-official-doc] 
- 예제 쿼리의 공식 컬렉션 - [Link][graphql-example-queries]
[GraphQL playground][graphql-playground-testnet]에서 직접 가지고 실행해볼 수 있습니다.

[gimbalabs-graphql-api]: https://gimbalabs.com/dandelion/endpoints/graphql-api
[graphql-example-queries]: https://github.com/input-output-hk/cardano-graphql/tree/master/packages/api-cardano-db-hasura/src/example_queries
[graphql-official-doc]: https://input-output-hk.github.io/cardano-graphql/
[graphql-playground-testnet]:  https://graphql-api.testnet.dandelion.link

사용 예시:

<Tabs
defaultValue="curl"
values={[
{label: 'curl', value: 'curl'},
]}>
  <TabItem value="curl">

```sh
# testnet
curl -H 'Content-Type: application/json' \
     -H 'Accept: application/json' \
     --data-binary \
'{"query":"query cardanoDbSyncProgress {\n cardanoDbMeta {\n initialized\n syncPercentage\n }\n}\n"}' \
    https://graphql-api.testnet.dandelion.link
```
  </TabItem>
</Tabs>

출력 예시:

```json
{"data":{"cardanoDbMeta":{"initialized":true,"syncPercentage":100}}}
```

## Cardano Explorer

![img](../../static/img/get-started/dandelion-apis/showcase-explorer-api.png)

유용한 링크:

- Gimbalabs의 엔드포인트 정보 - [Link][gimbalabs-explorer-api] 
- 프로젝트 공식 문서 - [Link][explorer-official-doc] 

[gimbalabs-explorer-api]: https://gimbalabs.com/dandelion/endpoints/explorer-api
[explorer-official-doc]: https://input-output-hk.github.io/cardano-rest/explorer-api

사용 예시:

<Tabs
defaultValue="curl"
values={[
{label: 'curl', value: 'curl'},
]}>
  <TabItem value="curl">

```sh
# testnet
curl -s https://explorer-api.testnet.dandelion.link/api/txs/last
# mainnet
curl -s https://explorer-api.mainnet.dandelion.link/api/txs/last
```
  </TabItem>
</Tabs>

출력 예시 (편집됨):

```json
{
  "Right": [
    {
      "cteId": "12703a0f201c9596d4fc256924f98e38d33dc23c4be1c7c3bc9bbc373ee3dbdf",
      "cteTimeIssued": 1621292369,
      "cteAmount": {
        "getCoin": "541898740"
      }
    },
    {
      "cteId": "f7f0be9988551b5179b143444f67215a06ef9794f3ed9e6f58a1b067db37f0a1",
      "cteTimeIssued": 1621292297,
      "cteAmount": {
        "getCoin": "1019242"
      }
    },
...
  ]
}
```

## Cardano Submit 

![img](../../static/img/get-started/dandelion-apis/showcase-submit-api.png)

유용한 링크:

- Gimbalabs의 엔드포인트 정보 - [Link][gimbalabs-submit-api] 
- 프로젝트 공식 문서 - [Link][submit-official-doc] 

[gimbalabs-submit-api]: https://gimbalabs.com/dandelion/endpoints/submit-api
[submit-official-doc]: https://input-output-hk.github.io/cardano-rest/submit-api

사용 예시에서는 `/tmp/cbor-tx` 에 위치한 (e.g. `cardano-cli` 또는 다른 라이브러리부터 온) 서명된 트랜잭션을 포함하는 유효한 `application/cbor` 파일을 가지고 있다고 가정합니다.

<Tabs
defaultValue="curl"
values={[
{label: 'curl', value: 'curl'},
]}>
  <TabItem value="curl">

```sh
curl -X POST \
    --header "Content-Type: application/cbor" \
    --data-binary @/tmp/cbor-tx \
    https://submit-api.testnet.dandelion.link/api/submit/tx
```
  </TabItem>
</Tabs>

출력 예시 (트랜잭션 id):

```json
92bcd06b25dfbd89b578d536b4d3b7dd269b7c2aa206ed518012cffe0444d67f
```

## Cardano Rosetta

![img](../../static/img/get-started/dandelion-apis/showcase-rosetta-api.png)

유용한 링크:

- Gimbalabs의 엔드포인트 정보 - [Link][gimbalabs-rosetta-api] 
- 프로젝트 공식 문서 - [Link][rosetta-official-doc] 

[gimbalabs-rosetta-api]: https://gimbalabs.com/dandelion/endpoints/rosetta-api
[rosetta-official-doc]: https://github.com/input-output-hk/cardano-rosetta#documentation

사용 예시:

<Tabs
defaultValue="curl"
values={[
{label: 'curl', value: 'curl'},
]}>
  <TabItem value="curl">

```sh
curl -s -X POST \
     -H 'Content-Type: application/json' \
     --data '{"network_identifier":{"blockchain":"cardano","network":"testnet"},"block_identifier":{"index":100}}' \
     https://rosetta-api.testnet.dandelion.link/block
```
  </TabItem>
</Tabs>

출력 예시:

```json
{
  "block": {
    "block_identifier": {
      "index": 100,
      "hash": "4c81fe7ddb7ab93a1973d674f1920bb1be980efdb819ea0a92d25706e72809fc"
    },
    "parent_block_identifier": {
      "index": 99,
      "hash": "e8b65f34c3b562a996b6bf6a9109e279536ae7efbc714ae0526bd222e7288eb4"
    },
    "timestamp": 1564022216000,
    "transactions": [],
    "metadata": {
      "transactionsCount": 0,
      "createdBy": "ByronGenesis-0df4205606dcb8ad",
      "size": 668,
      "epochNo": 0,
      "slotNo": 1130
    }
  }
}
```

## Ogmios

![img](../../static/img/get-started/dandelion-apis/showcase-ogmios-api.png)

유용한 링크:

- Gimbalabs의 엔드포인트 정보 - [Link][gimbalabs-ogmios-api] 
- 프로젝트 공식 문서 - [Link][ogmios-official-doc] 

[gimbalabs-ogmios-api]: https://gimbalabs.com/dandelion/endpoints/ogmios-api
[ogmios-official-doc]: https://github.com/cardanosolutions/ogmios

사용 예시:

<Tabs
defaultValue="websocat"
values={[
{label: 'github.com/vi/websocat', value: 'websocat'},
]}>
  <TabItem value="websocat">

```sh
echo '{ "type": "jsonwsp/request", "version": "1.0", "servicename": "ogmios", "methodname": "RequestNext", "args": {} }' \
  | websocat --text -1 - wss://ogmios-api.testnet.dandelion.link
```
  </TabItem>
</Tabs>

출력 예시:

```json
{
  "type": "jsonwsp/response",
  "version": "1.0",
  "servicename": "ogmios",
  "methodname": "RequestNext",
  "result": {
    "RollBackward": {
      "point": "origin",
      "tip": {
        "slot": 26925169,
        "hash": "000a47936fed9bd76cfb52abcd9ab3172ba9118cff9b56767087544f295daba3",
        "blockNo": 2591103
      }
    }
  },
  "reflection": null
}
```

## PostgREST

![img](../../static/img/get-started/dandelion-apis/showcase-postgrest-api.png)

유용한 링크:

- Gimbalabs의 엔드포인트 정보 - [Link][gimbalabs-postgrest-api] 
- 프로젝트 공식 문서 - [Link][postgrest-official-doc] 

[gimbalabs-postgrest-api]: https://gimbalabs.com/dandelion/endpoints/postgrest-api
[cardano-db-sync-official-doc]: https://github.com/input-output-hk/cardano-db-sync/blob/master/doc/interesting-queries.md

사용 예시:

<Tabs
defaultValue="curl"
values={[
{label: 'curl', value: 'curl'},
]}>
  <TabItem value="curl">

```sh
# query available metadatums
curl -s "https://postgrest-api.mainnet.dandelion.link/rpc/get_metadatum"
# query metadatum 20201210
curl -d metadatum=20201210 -s "https://postgrest-api.mainnet.dandelion.link/rpc/get_metadata" | jq .
# query metadatum 42 for epoch 234-235 and limit results to 1
curl -s -d metadatum=42 -d epochs="{234,235}" "https://postgrest-api.mainnet.dandelion.link/rpc/get_metadata?limit=1"
# query metadata entry number 15
curl -s "https://postgrest-api.mainnet.dandelion.link/tx_metadata?id=eq.15"
# query pool metadata whose URL contains "repsistance" 
curl -s "https://postgrest-api.mainnet.dandelion.link/pool_meta_data?url=like.*repsistance*"
# query metadata entries for SPOCRA proposalId "80064c28-1b03-4f1c-abf0-ca8c5a98d5b9"
curl -s "https://postgrest-api.mainnet.dandelion.link/tx_metadata?json->>ProposalId=eq.80064c28-1b03-4f1c-abf0-ca8c5a98d5b9"
# query metadata entries for the whole SPOCRA network
curl -s "https://postgrest-api.mainnet.dandelion.link/tx_metadata?json->>NetworkId=eq.SPOCRA"
```
  </TabItem>
</Tabs>

## 나만의 Dandelion 배포하기

Docker가 이미 설치되어 있다면, 로컬 개발 환경에서 Dandelion 사용이 거의 완료된 것입니다. [공식 문서][local-dandelion-deploy]를 참고하시고, 전용 [Discord 채널][discord-dandelion]에서 지원을 요청하세요. 운영 체재, 네트워크 및 클라우드 공급자가 각각 다르기에 임의의 문제가 발생할 수 있음을 충분히 알고 있습니다!

[discord-dandelion]: https://discord.gg/qDc3f9R7Ab
[local-dandelion-deploy]: https://gitlab.com/gimbalabs/dandelion/kustomize-dandelion#local-deployment

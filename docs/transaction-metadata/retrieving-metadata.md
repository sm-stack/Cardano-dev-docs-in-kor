---
id: retrieving-metadata
title: 메타데이터 검색하기
sidebar_label: 메타데이터 검색
description: We will discuss the many ways to retrieve your metadata from the Cardano blockchain.
image: ../img/og/og-developer-portal.png
---

## 개요

**Cardano** 블록체인에 저장된 메타데이터를 검색하는 방법에는 여러 가지가 있습니다. 이 기사에서는 모든 종류의 블록체인 데이터를 검색하는 데 도움이 되는 다양한 구성 요소와 방법에 대해 설명합니다.

## Blockfrost

[Blockfrost](/docs/get-started/blockfrost)는 **Cardano** 블록체인에 빠르고 쉽게 액세스할 수 있는 **API**를 제공합니다.

**Blockfrost**를 사용해 메타데이터를 검색하려면, **트랜잭션 메타데이터**에 대한 엔드포인트를 호풀하면 됩니다.

**1337 메타데이터 쿼리하기**

```bash
curl -H 'project_id: <api_key>' https://cardano-mainnet.blockfrost.io/api/v0/metadata/txs/labels/1337 | jq
```

다음과 같은 내용이 표시되어야 합니다.

```json
[
  {
    "tx_hash": "a54d000ad56cf5b4afe769b5d74b51a5817dc44102c7f8286887e28bf257a2fd",
    "json_metadata": "gimbalabs-poc"
  },
  {
    "tx_hash": "b26cc2323d6212a0396fa4ddb35578648853ef769e2e427d92019d50163f636a",
    "json_metadata": "go build"
  }
]
```

이 예시에서는, 키 `1337` 아래의 모든 메타데이터에 대해 **Cardano 메인넷** 내의 모든 정보를 쿼리합니다. 해당 키를 통해 **Cardano** 블록체인에 이미 들어있는 많은 메타데이터 중 일부를 볼 수 있습니다. 이제 온체인에 있는 모든 데이터를 캐시하고 정렬하는 방법은 구현에 달려 있습니다. **Blockfrost**는 `paging`과 `ordering`이라는 매개변수를 제공합니다.

자세한 내용은 공식 [문서](https://docs.blockfrost.io)를 참고하세요.

## cardano-db-sync

업데이트 예정

## cardano-graphql

업데이트 예정

## cardano-wallet

:::note

이 섹션에서는 사용자가 `cardano-wallet`에 대한 기본적인 이해를 하고 있고, 이를 시스템에 설치했다고 가정합니다. 그렇지 않다면 [cardano-node 설치](/docs/get-started/installing-cardano-node), [cardano-node 실행하기](/docs/get-started/running-cardano)와 [Cardano 지갑 알아보기](/docs/integrate-cardano/creating-wallet-faucet) 가이드를 먼저 읽는 것을 추천합니다.

이 가이드는 또한 `cardano-node`와 `cardano-wallet`을 백그라운드에서 실행 중이고 `testnet` 네트워크에 연결되어 있는 상황을 가정합니다.

:::

선택한 지갑의 트랜잭션에 대한 모든 메타데이터를 검색하려면, '.[].metadata' 필터로 전달하여 지갑 트랜잭션을 쿼리하기만 하면 됩니다.

```bash
curl --url 'http://localhost:1337/v2/wallets/41263958f6668e06190be661900f7129be78d583/transactions' | jq '.[].metadata'
```

***`41263958f6668e06190be661900f7129be78d583` 문자열이 실제로 이전에 생성된 지갑의  `wallet.id` 라는 점에 유의하는 것이 중요합니다.***

모든 지갑 트랜잭션 메타데이터를 반환하는 `JSON`은 아래와 같은 형태를 지닙니다(**이러한 트랜잭션에 대해 생성된 메타데이터에는 다음과 같은 값들이 있음을 고려하세요**).

```json
{
  "1337": {
    "map": [
      {
        "k": {
          "string": "name"
        },
        "v": {
          "string": "hello world"
        }
      },
      {
        "k": {
          "string": "completed"
        },
        "v": {
          "int": 0
        }
      }
    ]
  }
}
```

유사한 명령을 사용하여 단일 트랜잭션의 메타데이터를 검색할 수 있습니다.

```bash
curl --url 'http://localhost:1338/v2/wallets/41263958f6668e06190be661900f7129be78d583/transactions/fab2e2a42b465d0f86452521521a2853597a58d31c5b29663b7e615cd2b2eb47' | jq '.metadata'
```

`41263958f6668e06190be661900f7129be78d583` 문자열이 실제로 이전에 생성된 지갑의  `wallet.id`입니다.


`fab2e2a42b465d0f86452521521a2853597a58d31c5b29663b7e615cd2b2eb47` 문자열은 `transaction.id`입니다.

단일 트랜잭션 메타데이터를 반환하는 `JSON`은 아래와 같은 형태를 지닙니다(**이러한 트랜잭션에 대해 생성된 메타데이터에는 다음과 같은 값들이 있음을 고려하세요**).

```json
{
  "1337": {
    "map": [
      {
        "k": {
          "string": "name"
        },
        "v": {
          "string": "hello world"
        }
      },
      {
        "k": {
          "string": "completed"
        },
        "v": {
          "int": 0
        }
      }
    ]
  }
}
```

## Ogmios

업데이트 예정
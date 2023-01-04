---
id: how-to-create-a-metadata-transaction-cli
title: cardano-cli로 메타데이터 트랜잭션을 생성하는 방법
sidebar_label: 메타데이터 트랜잭션 생성 (CLI)
description: How to create a metadata transaction using `cardano-cli`
image: ../img/og/og-developer-portal.png
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::note
이 가이드는 사용자가 `cardano-wallet`과 `cardano-cli`에 대한 기본적인 이해를 하고 있고, 이를 시스템에 설치했다고 가정합니다. 그렇지 않다면 [cardano-node 설치](/docs/get-started/installing-cardano-node), [cardano-node 실행하기](/docs/get-started/running-cardano)와 [Cardano 지갑 알아보기](/docs/integrate-cardano/creating-wallet-faucet) 가이드를 먼저 읽는 것을 추천합니다.

이 가이드는 또한 `cardano-node`와 `cardano-wallet`을 백그라운드에서 실행 중이고 `testnet` 네트워크에 연결되어 있는 상황을 가정합니다.
:::

## 개요

이 글에서는 **Cardano** 블록체인의 **트랜잭션 메타데이터** 특성을 이용하는 방법을 알아봅니다. 더 자세히 이야기하자면, **트랜잭션 메타데이터**를 사용하여 탈중앙화 어플리케이션에 대해 블록체인에 저장한 메타데이터를 추가하고 검색하는 방법에 대해 알아보겠습니다.

## 사용 사례

중앙 집중식 서버나 스토리지가 아닌 **Cardano 블록체인**에서 메타데이터를 저장하고 검색하는 탈중앙화된 **To-do List 어플리케이션**을 생각해봅시다. 먼저 아래 다이어그램을 확인하여 이와 같은 것이 이론적으로 어떻게 작동하는지 살펴보겠습니다.

![img](../../static/img/tx-meta-data/todo-list-app.png)

:::important
이 다이어그램은 크게 단순화되어 있으며, 이를 프로덕션 환경에 배포하는 것은 권장되지 않습니다.
:::

여기서, **프론트엔드** 어플리케이션은 유저가 상호작용하고, **백엔드** 서버와 상호작용하여 메타데이터를 삽입하고 검색하는 역할을 수행합니다. **백엔드** 서버는 **트랜잭션**을 생성하고 **프론트엔드**에 필요한 **메타데이터** 정보를 블록체인에서 쿼리하면서, `cardano-node`와 통신하는 역할을 수행합니다.

**프론트엔드** 어플리케이션은 특정 **백엔드** API와 반드시 연결된 것은 아니며, **Cardano** 네트워크와 통신만 한다면 다른 API로 전환될 수 있습니다.

그렇다면 **Cardano** 블록체인에서 **트랜잭션 메타데이터**를 실제로 어떻게 생성할까요? 실제로 한 번 해봅시다!

## 설정

`cardano-cli`를 사용하여 트랜잭션 메타데이터를 생성하려면, **지불 키 쌍**과 **지갑 주소**를 생성하여야 합니다.

**지불 키 생성**

```bash
cardano-cli address key-gen \
--verification-key-file payment.vkey \
--signing-key-file payment.skey
```

**지갑 주소 생성**

```bash
cardano-cli address build \
--payment-verification-key-file payment.vkey \
--out-file payment.addr \
--testnet-magic 1097911063
```

이제 **지갑 주소**가 있으므로, [testnet faucet](../../docs/integrate-cardano/testnet-faucet)에서 몇 가지 `tADA`에서 자금을 요청할 수 있습니다.

자금을 받으면, 이제 블록체인에 저장하려는 메타데이터 샘플을 생성할 수 있습니다.

다음 내용으로 `metadata.json` 파일을 생성해봅시다.

```json
{
    "1337": {
        "name": "hello world",
        "completed": 0
    }
}
```

:::note

우리의 **To-Do List** 어플리케이션 구조에서, 이 `JSON` 형태는 우리의 목록에 항목을 삽입/업데이트 하는 방식이 될 수 있습니다. 임의의 숫자(`1337`)를 키로 선택합니다. 기본적으로 해당 키와 같이 삽입될 모든 메타데이터는 **To-Do List** 어플리케이션 데이터와 관련이 있습니다. **Cardano**는 오픈 플랫폼이기 때문에, 해당 메타데이터 키와 함께 삽입되는 항목에 대해 검열하거나 제어할 수는 없습니다.

:::

이제 `JSON` 데이터가 있으므로, 트랜잭션을 만들고 메타데이터를 트랜잭션에 포함할 수 있습니다. 궁극적으로 이는 **Cardano** 블록체인에 영원히 저장됩니다.

## UTXO 쿼리하기

다음 단계는 우리의 **지갑 주소**로부터 사용 가능한 **UTXO**를 쿼리하는 것입니다.

```bash
cardano-cli query utxo --testnet-magic 1097911063 --address $(cat payment.addr)
```

다음과 같은 내용이 표시되어야 합니다.

```
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
dfb99f8f103e56a856e04e087255dbaf402f3801acb71a6baf423a1054d3ccd5     0        1749651926 lovelace
```

여기서 우리의 **지갑 주소**에는 사용가능한 `lovelace`와 `TxHash: dfb99f8f103e56a856e04e087255dbaf402f3801acb71a6baf423a1054d3ccd5` 및 `TxIndex: 0`이 들어 있습니다. 이를 트랜잭션 수수료에 사용할 수 있습니다.

## 블록체인에 제출하기

다음으로 마지막 쿼리의 `TxHash`와 `TxIndex`를 사용해 메타데이터가 포함된 트랜잭션 초안을 작성합니다.

```bash {2}
cardano-cli transaction build-raw \
--tx-in dfb99f8f103e56a856e04e087255dbaf402f3801acb71a6baf423a1054d3ccd5#0 \
--tx-out $(cat payment.addr)+0 \
--metadata-json-file metadata.json \
--fee 0 \
--out-file tx.draft
```

그런 다음 트랜잭션 수수료를 다음과 같이 계산합니다.

```bash
cardano-cli transaction calculate-min-fee \
--tx-body-file tx.draft \
--tx-in-count 1 \
--tx-out-count 1 \
--witness-count 1 \
--byron-witness-count 0 \
--testnet-magic 1097911063 \
--protocol-params-file protocol.json
```

You should see something like this:

```bash
171793 Lovelace
```

이를 통해, 지갑의 총 금액에서 계산된 수수료를 뺀 총 출력 금액으로 최종 트랜잭션을 구성합니다. `1749651926 - 171793 = 1749480133`

```bash {3}
cardano-cli transaction build-raw \
--tx-in dfb99f8f103e56a856e04e087255dbaf402f3801acb71a6baf423a1054d3ccd5#0 \
--tx-out $(cat payment.addr)+1749480133 \
--metadata-json-file metadata.json \
--fee 171793 \
--out-file tx.draft
```

그런 다음 **지불 서명 키**를 사용해 트랜잭션에 서명합니다.

```bash
cardano-cli transaction sign \             
--tx-body-file tx.draft \
--signing-key-file payment.skey \
--testnet-magic 1097911063 \
--out-file tx.signed 
```

마지막으로, 서명된 트랜잭션을 블록체인에 제출합니다.


```bash
cardano-cli transaction submit \
--tx-file tx.signed \    
--testnet-magic 1097911063
```

축하합니다! 이제 메타데이터가 포함된 **Cardano** 트랜잭션을 제출할 수 있습니다. 🎉🎉🎉

다음으로, **Cardano** 블록체인에 저장된 메타데이터를 검색하는 방법에 대해 논의할 것입니다.

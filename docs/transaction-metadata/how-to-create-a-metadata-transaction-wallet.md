---
id: how-to-create-a-metadata-transaction-wallet
title: cardano-wallet으로 메타데이터 트랜잭션을 생성하는 방법
sidebar_label: 메타데이터 트랜잭션 생성 (Wallet)
description: How to create a metadata transaction using `cardano-wallet`
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

`cardano-wallet`으로 트랜잭션 메타데이터를 생성하려면, 지갑을 먼저 만들어야 합니다.

**니모닉 시드 생성하기**

```bash
cardano-wallet recovery-phrase generate
```

**생성된 니모닉 시드로 지갑 만들기**

```bash
curl --request POST \
  --url http://localhost:1337/v2/wallets \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "test_cf_1",
    "mnemonic_sentence": ["shift", "badge", "heavy", "action", "tube", "divide", "course", "quality", "capable", "velvet", "cart", "marriage", "vague", "aware", "maximum", "exist", "crime", "file", "analyst", "great", "cabbage", "course", "sad", "apology"],
    "passphrase": "test123456"
}' | jq
```

이제 지갑이 있으므로, **지갑 주소**를 검색할 수 있습니다.

```bash
curl --request GET \
  --url 'http://localhost:1337/v2/wallets/5076b34c6949dbd150eb9c39039037543946bdce/addresses?state=unused' | jq '.[0]["id"]'
```

이제 **지갑 주소**가 있으므로, [testnet faucet](../../docs/integrate-cardano/testnet-faucet)에서 몇 가지 `tADA`에서 자금을 요청할 수 있습니다.

자금을 받으면, 이제 블록체인에 저장하려는 메타데이터 샘플을 생성할 수 있습니다.

이제 **To-Do List** 어플리케이션에 대해 결정한 `JSON` 자료형은 다음과 같습니다.

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

## JSON 형태

`cardano-wallet`는 허용하는 페이로드의 `JSON` 형태와 관련하여 특별한 요구 사항이 있습니다. 다음은 몇 가지 예시입니다.

```json
{
    "0": {
        "string": "cardano"
    },
    "1": {
        "int": 14
    },
    "2": {
        "bytes": "2512a00e9653fe49a44a5886202e24d77eeb998f"
    },
    "3": {
        "list": [
            {
                "int": 14
            }
        ]
    },
    "4": {
        "map": [
            {
                "k": {
                    "string": "key"
                },
                "v": {
                    "string": "value"
                }
            }
        ]
    }
}
```

따라서 `JSON` 메타데이터 페이로드를 `cardano-wallet`이 허용하는 방식으로 변환하여야 합니다.

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

## 블록체인에 제출하기

형태가 승인되면, 최종적으로 메타데이터를 블록체인에 제출할 수 있습니다.

먼저, 지갑에서 **사용하지 않는 다른 지갑 주소**를 검색해 보겠습니다.

```bash
curl --request GET \
  --url 'http://localhost:1337/v2/wallets/5076b34c6949dbd150eb9c39039037543946bdce/addresses?state=unused' | jq '.[0]["id"]'
```

이제 우리는 트랜잭션에 메타데이터를 붙이면서 우리 자신의 지갑으로 `1,000,000 lovelace`를 보낼 것이고, 이는 궁극적으로 블록체인에 영원히 저장될 것입니다.

```bash
curl --request POST \
  --url http://localhost:1337/v2/wallets/5076b34c6949dbd150eb9c39039037543946bdce/transactions \
  --header 'Content-Type: application/json' \
  --data '{
    "passphrase": "test123456",
    "payments": [
        {
            "address": "addr_test1qpg2eglv9gf2rksvdj53t6ajfgzkycaadlt2fatjyn4etpze0592agqpwraqajx2dsu2sxj64uese5s4qum293wuc00q6hnhqq",
            "amount": {
                "quantity": 1000000,
                "unit": "lovelace"
            }
        }
    ],
    "metadata": {
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
}'
```

축하합니다! 이제 메타데이터가 포함된 **Cardano** 트랜잭션을 제출할 수 있습니다. 🎉🎉🎉

다음으로, **Cardano** 블록체인에 저장된 메타데이터를 검색하는 방법에 대해 논의할 것입니다.


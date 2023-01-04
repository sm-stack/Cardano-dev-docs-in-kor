---
id: tangocrypto
title: Tangocrypto 시작하기
sidebar_label: Tangocrypto
description: Getting started with Tangocrypto
image: ../img/og/og-getstarted-tangocrypto.png
---

# Tangocrypto란?

Tangocrypto는 Cardano 네트워크를 위한, 통합하는 데 1분 밖에 걸리지 않는 API 및 개발자 도구 모음입니다. Cardano에서 시작하는 개발자는 다음과 같은 문제에 직면하기 일쑤입니다.
- 노드나 API 공급자를 사용하지 않고는 블록체인의 정보에 액세스할 수 있는 방법이 없습니다.
- 제품과 비즈니스에 집중하는 대신 인프라 구축을 먼저 해야 합니다.
- 인프라 구축을 해 놓아도, 사용자 수요가 증가하면 이를 확장해야 합니다. 자동으로 확장되지 않습니다.
- 여러 공급자의 여러 API 서비스와 통합할 때, 추가적인 학습과 비용이 필요합니다.

우리는 다음을 수행할 수 있는 플랫폼을 제공합니다.
- 제품을 더 빨리 구성하고 비즈니스 아이디어를 검증할 수 있습니다.
- 하나의 플랫폼으로 온체인 정보, 발행 토큰, 파일 저장 및 지불 처리에 대한 정보를 가져오고, 제출할 할 수 있습니다.
- 다운타임 없이 사용량 급증에도 대처할 수 있는 탄력적인 인프라에 의존하여 사용자 기반을 확장합니다.
- 엔지니어링 및 인프라 운영 비용을 절감합니다. 

우리의 솔루션은 다음 구성 요소를 제공합니다.
- REST API
- Notify (Webhook)

💻 지금 https://dashboard.tangocrypto.com/register에서 **무료** 계정을 만들고 프로덕트 빌딩을 시작할 수 있습니다.

## REST API
HTTP REST API의 목표는 개발을 더 빠르고 쉽게 만드는 것입니다. 이를 통해, 블록체인과 동기화하고 복잡한 설정 작업을 할 필요가 없습니다. 다른 진입점에서 블록제인에 대한 복잡하고 많은 요청들이 더 이상 필요하지 않으므로, 개발자는 더 적은 수의 요청으로 트랜잭션, 토큰 정보 및 디버그에 필요한 모든 데이터를 얻을 수 있습니다.

![alt text](../../static/img/get-started/tangocrypto/restapidiagram.png)

우리는 가장 접근하기 쉽고 안정적인 Cardano 인프라를 제공하여, 기업가 개발자가 복잡한 인프라를 유지 관리하는 책임에서 벗어나 비즈니스 로직을 구축하고 고객들에게 가치를 제공하는 데 집중할 수 있도록 합니다.

- **엔터프라이즈급 인프라**: 전 세계적으로 분산된 클라우드 호스팅 노드 네트워크의 처리 능력을 활용합니다. 당사의 API는 자체 컴퓨팅 및 스토리지 리소스 유지 관리에서 있는 마찰을 완화하여 개발자와 기업의 진입 장벽을 낮춥니다.
- **개발자를 위한 서비스**: 개발자가 빠르게 시작할 수 있도록 도와주는 읽기 쉬운 문서 및 리소스입니다.
- **앱 인사이트 확보**: 우리의 대시보드는 API 사용에 대한 직관적인 인사이트를 제공합니다. 요청 방법에 대해 자세히 살펴보고, 응답 시간, 가장 많이 사용된 엔드포인트, 시간별 사용량, IP 주소, 국가 등을 가져옵니다. 이러한 인사이트는 사용자 행동을 기반으로 어플리케이션을 최적화하는데 큰 도움이 됩니다.
- **표준 인터페이스**: HTTPS를 통한 클라이언트 호환 REST API를 통해 메인넷 및 테스트넷을 지원합니다.
- **항상 온라인**: 최소 99.9%의 가동 시간을 보장하는 최신 네트워크에서 실행됩니다.

### 네트워크와 앱 ID

메인넷과 테스트넷 중 하나를 선택할 수 있습니다. API는 요청 트래픽에 포함된 유효한 `app_id` 를 요구합니다. 이 식별자는 요청 URL에 추가되어야 합니다.

| 네트워크          |  엔드포인트     
| :--------------: | :-----------: 
| Cardano 메인넷    | https://cardano-mainnet.tangocrypto.com/{app_id}/v1 
|Cardano 테스트넷   |   https://cardano-testnet.tangocrypto.com/{app_id}/v1 


### API 키 헤더
https://www.tangocrypto.com에 가입하고 앱을 생성하면 `x-api-key`가 생성됩니다. API 호출을 인증하려면 모든 요청에 HTTP 헤더인 `x-api-key`를 포함해야 합니다.

:::tip 전체 API 참조

https://www.tangocrypto.com/api-reference/에서 API 전체 참조 문서를 확인하세요.

:::

### Tangocrypto 시작하기

#### 1. 🔑 App 만들기

Tangocrypto의 제품을 사용하려면, 요청을 인증하기 위한 API 키가 필요합니다.

대시보드에서 API 키를 생성할 수 있습니다. +Create App을 클릭하고 이름을 지정한 다음 생성을 누르십시오.

![alt text](../../static/img/get-started/tangocrypto/app.png)


앱이 생성되면 app-id와 `x-api-key`를 복사하고 요청을 만들어보세요. 

![alt text](../../static/img/get-started/tangocrypto/tangocrypto_app_details.png)

#### 2. 🏗️ 요청 만들고 빌딩 시작하기
app-id와 `x-api-key`를 통해 요청을 만들 수 있습니다.
예를 들어, 최신 블록 번호를 가져오도록 요청해 보겠습니다.

```shell
curl --location \
--request GET 'https://cardano-testnet.tangocrypto.com/<app-id>/v1/blocks/latest' \
--header 'x-api-key: <your-api-key>'
```

다음과 같은 결과를 얻어야 합니다.
```json
{
    "id": "3064146",
    "hash": "f8eadfc91c3219b3d00d4a902174e0978e449f0e8a6f6b0584e06bbbedc0d050",
    "epoch_no": 158,
    "slot_no": 38197024,
    "epoch_slot_no": 310624,
    "block_no": 2940877,
    "previous_block": 2940876,
    "slot_leader": "pool1rcsezjrma577f06yp40lsz76uvwh7gne35afx3zrq2ktx50f8t8",
    "size": 365,
    "time": "2021-09-25T10:37:20.000Z",
    "tx_count": 1,
    "out_sum": 435928446,
    "fees": 171441,
    "op_cert": "333e175db9a2f89de5d9396c10b4dd136c3fffebd7f22d2eb0a3e8ef3884199c",
    "vrf_key": "vrf_vk1ltjt3ucuvah43gpeqpw4n6say9u6s0kju8c8q76xctmvgsqawgrq7kj48j",
    "confirmations": 1
}
```

#### API 페이지 매기기

일부 API 엔드포인트는 결과를 더 쉽게 처리할 수 있도록 응답에 페이지를 매깁니다. 예를 들어, 잠재적으로 너무 커서 효율적으로 실행할 수 없는 객체 목록을 요청하면 엔드포인트는 커서와 함께 결과의 첫 번째 배치를 반환하여 다음 결과 집합에 액세스합니다.

쿼리 결과는 크기가 1MB 이하인 "페이지" 데이터로 나뉩니다. 어플리케이션은 결과의 첫 번째 페이지를 처리한 다음 두 번째 페이지를 처리하는 방식으로 나아갑니다. 엔드포인트에 대한 다음 요청에 대해, 요청에 대한 URL 내 쿼리 매개변수의 형태로 커서를 포함합니다.

결과가 더 있는지 확인하고, 한 번에 한 페이지씩 검색하려면 어플리케이션에서 다음을 수행해야 합니다.
1. 원하는 `size`로 요청을 만들고 결과를 확인합니다. 커서가 비어 있지 않으면, 이전 요청과 동일한 매개 변수로 새 요청을 구성하십시오. 그러나, 이번엔 마지막 쿼리에서 커서 값을 가져와 새 요청에서 매개 변수로 사용해보십시오.
2. 만약 `cursor`가 결과에서 비어 있으면 더 이상 검색할 항목이 없다는 것을 의미합니다.

#### 예제
size=50으로 다음과 같은 쿼리를 만들어 보겠습니다.
```
https://cardano-mainnet.tangocrypto.com/<app-id>/v1/nft/collections?size=50
```

응답에서, 비어 있지 않은 값이 있는 커서를 볼 수 있습니다(단순화를 위해 하나의 레코드만 표시).

```json
{
    "data": [
        {
            "id": "3d010a77c0e24489923c2a9eda731dde",
            "name": "THE Collection",
            "url": "https://www.thecollection.io",
            "description": "thecollection description",
            "payout_address": "addr_test1qp9mj7vnenx4v99hw7ztfq03n7dmmujpgtlyfjhhel9w67nk72usllcew208n60ym94xcptfrgytuy5apwp565x28jgsg0ztq3",
            "token_count": 5000,
            "token_for_sale_count": 1000,
            "token_sold_count": 2000,
            "revenue": 123456,
            "service_fee": 123456,
            "nft_fee": 123456,
            "tx_fee": 123456,
            "income": 123456,
            "total_fees": 123456,
            "policy": {
                "lock": true,
                "lock_time": "2027-01-24T04:18:59.758Z",
                "policy_id": "90570cb29887860e1cf1af88a106f421d6f22333514dd4ab16e8ff12",
                "script": {
                    "type": "all",
                    "scripts": [
                        {
                            "type": "sig",
                            "keyHash": "ac1746df0ba039de81274d472a477fced610f57cebc5c7841074f54c"
                        },
                        {
                            "type": "before",
                            "slot": 46854826
                        }
                    ]
                }
            },
            "metadata": {
                "label": "721",
                "asset_name": "<asset_name>",
                "name": "<name>",
                "image": "<image_link>",
                "media_type": "<mime_type>",
                "description": "<description>",
                "attributes": {
                    "face": "<face>",
                    "twitter": "https://twitter.com/thecollection_io",
                    "copyright": "Tent 2021",
                    "color": "<color>",
                    "artist": "LOLO",
                    "collection": "The Collection",
                    "body": "<body>",
                    "eyes": "<eyes>",
                    "accessory": "<accessory>"
                },
                "version": "1.0"
            },
            "created_at": "2021-11-30T21:04:09.897Z",
            "updated_at": "2021-11-30T21:04:09.897Z"
        }
    ],
    "cursor": "a97f98a8c533ee55fc2c6897c9b50506dc8d65b921092e469f62f9d0e2d0dc92902605dba96d30b2e027557d3d6ea8cb3c1597d93e36f9c70771f19485f176607d834f6bc4fd664e0f68d4c28eff52cc298dee1dc17975c043d05903c31dae41ff84c779f1f8d2bcc00447e25d066a4e"
}
```

다음 배치를 검색하기 위해서, 동일한 쿼리를 사용하되 이전 단계에서 얻은 커서를 쿼리의 매개변수로 넣습니다.

```
https://cardano-mainnet.tangocrypto.com/<app-id>/v1/nft/collections?size=50&cursor=a97f98a8c533ee55fc2c6897c9b50506dc8d65b921092e469f62f9d0e2d0dc92902605dba96d30b2e027557d3d6ea8cb3c1597d93e36f9c70771f19485f176607d834f6bc4fd664e0f68d4c28eff52cc298dee1dc17975c043d05903c31dae41ff84c779f1f8d2bcc00447e25d066a4e
```

검색할 항목이 더 이상 없기 때문에 커서가 비워질 때까지 이 프로세스를 반복할 수 있습니다.

## NOTIFY (WEBHOOKS)
Notify를 통해, webhook 및 SDK 통합과 프로덕션 준비 알림을 통합할 수 있습니다. 성공적인 트랜잭션, 풀에서 생성된 블록, 새로운 위임 등과 같이 사용자가 관심을 가질 수 있는 모든 블록체인 이벤트에 액세스할 수 있습니다.

![alt text](../../static/img/get-started/tangocrypto/notify.png)

- **결제 및 거래**: 입금, 구매, 게임 내 작업 또는 기타 온체인 활동이 공식적으로 발생한 시점을 알림으로 보내줍니다.
- **주소 활동 Webhook**: 사용자의 주소에서 트랜잭션 활동이 발생하면 사용자에게 알려줍니다. 더 이상 지불을 확인하기 위해 페이지를 새로 고칠 필요 없습니다. 
- **자동 재시도**: 가끔 엔드포인트 수신이 생각보다 자주 실패하거나 중단되는 경우가 있습니다. 따라서 이를 위해 자동 재시도 기능을 제공하고 있습니다.
- **모니터링 및 디버그**: 트리거된 모든 Webhook를 기록하므로, 다른 엔드포인트에 대한 전달 가능성을 모니터링하고 실패한 항목을 비활성화하며 고객에게 이를 알릴 수 있습니다.
- **개발자 경험**: Webhook를 테스트하고 검사하는 기능을 포함하여, 사용자에게 뛰어난 개발자 경험을 제공합니다.

### Webhook란 무엇인가요?
Webhook(웹 콜백 혹은 HTTP 푸시 API라고도 불림)는 앱이 다른 어플리케이션에 실시간 정보를 제공하는 방법입니다. Webhook는 정보가 발생하는 대로 다른 어플리케이션에 데이터를 전달하므로, 즉시 데이터를 얻을 수 있습니다. 이는 실시간으로 데이터를 가져오기 위해 매우 자주 데이터를 폴링해야 하는 일반적인 API와는 다릅니다. 이는 공급자와 소비자 모두에게 webhook가 훨씬 효율적인 부분입니다. Webhook는 특정 이벤트가 발생하면 알림을 보내는 URL을 등록하는 방식으로 작동합니다.

Webhook는 Tangocrypto가 Cardano의 활동을 알리기 위해 호출하는 전화번호와 같다고 생각할 수 있습니다. 여기서 활동은 주소에 대한 지불 활동이거나, 특정 에포크에 도달하는 것일 수 있습니다. Webhook 엔드포인트는 수신한 특정 정보를 기반으로 조치를 취하는 사람에 해당합니다.

Webhook 엔드포인트는 Node.js, Go, Java, Ruby 등으로 작성될 수 있는 서버의 추가 코드입니다. Webhook 엔드포인트에는 연결된 URL(예: https://myserver.com/callback)이 있습니다. Tangocrypto 알림은 Event 객체입니다. 이 Event 객체에는 Event 유형 및 해당 Event와 관련된 게이터를 포함하여 방금 발생한 일에 대한 모든 관련 정보가 포함되어 있습니다. Webhook 엔드포인트에서는 Event 세부 정보를 사용하여 NFT를 지갑으로 보내야 한다는 것 등을 포함해 필요한 작업을 수행합니다.

:::note
Webhooks vs. WebSockets:
Webhook와 WebSocket 간의 차이점은, Webhook는 두 서비스 간 단방향 통신만 할 수 있는 반면, WebSocket은 사용자와 서비스 간의 양방향 통신을 가능하도록 하여, 발생한 이벤트를 인식하고 사용자에게 이벤트를 표시할 수 있다는 것입니다.
:::

### Event 표준 구조

Event 구조는 항상 다음 매개변수로 시작합니다.
```json
{
    "id": "2921e3df-c671-4d20-b51b-d176d5c1e43g", //** Unique uuid per event .**
    "api_version": "1.0", //**Represents the current Tangocrypto API version, which is v1.**
    "webhook_id": "d012a60eccb54c2ba97484f98137be56", // identifies the webhook
    "idempotency_key": "3b3359d0ccdb1d3d3ca8dbaa79cb5395b33c5bc52d782f3ea22904abef45d1j4", //**Specifies a unique ID used by Tangocrypto to recognize consecutive requests with the same data so that not to perform the same operation twice.**
    "object": "event",
    "create_date": 1633954086377,
    "type": "payment", // event type
    ...
}
```
`id`
Event의 고유 식별자입니다. 

`api_version`
귀하가 받게 될 Event의 체계는 Tangocrypto API 버전에 따라 다릅니다. 현재는 v1을 사용하고 있습니다. API의 v1을 사용하는 동안 Event에 대한 구독을 설정하면 v1사양에 따라 콜백이 반환됩니다. API를 다음 버전으로 업데이트할 때마다 현재 사용 중인 최신 버전과 일치하도록 Event 구독을 재설정해야 합니다. 그렇게 하려면 Event 구독을 제거하고 다시 설정해야 합니다. 그렇지 않으면 콜백 응답은 이전 API 버전의 형식으로 수신됩니다.

`webhook_id`
webhook_id는 webhook에 대한 참조를 나타내며, 고유한 코드 형태입니다. Event 구독을 설정할 때마다 해당 Event에는 항상 매개변수 `webhook_id`가 있습니다.

`idempotency_key`
Idempotency는 반환된 결과가 항상 동일하게 유지되는 동일한 요청의 재시도를 인식하기 위해 서버가 사용하는 컴퓨팅 및 REST의 과정을 나타냅니다. 동일한 작업을 두 번 이상 수행할 위험 없이 요청을 재시도하기 위한 보안 메커니즘입니다.

이러한 위험은 일반적으로 처리 중에 특정 이유로 API 호출이 중단되고(예: 네트워크 연결 오류) 응답이 반환되지 않을 때 발생할 수 있습니다. 이러한 경우 API 호출이 재시도됩니다. 처음 요청에 idempotency_id를 포함하면 특정 작업이 수행되지 않는다는 보장을 할 수 있습니다. `idempotency_id`는 Tangocrypto 웹후크에서만 생성됩니다. 이는 Event에 추가되며, Webhook마다 고유한 값을 가집니다.

### Webhook의 종류
Tangocrypto는 5가지 유형의 webhook를 제공합니다.
- 지불
- 블록
- 트랜잭션
- 에포크
- 위임

Tangocrypto에서 보낸 콜백 요청은 항상 POST이며, 여기에는 JSON 페이로드가 포함됩니다.

### 1. 지불
지불 Webhook를 사용하면 주소에 대한 지불 목록을 추적할 수 있습니다. 이는 주소가 토큰을 보내거나 받을 때 앱에 실시간 상태 변경을 제공합니다.

페이로드 예시
```json
{
    "id": "3c23ff25-481c-4e3e-859b-f515135a49b0",
    "data": {
        "transaction": {
            "id": "3776000",
            "fee": "168317",
            "hash": "e29b4f5e2650560ac61dfa3ccf311e020782d8ccdf295dbbf1cfe2e65583d417",
            "size": 289,
            "block": {
                "id": "3372157",
                "fees": "2104143",
                "hash": "7fac4956202395c06028b442faba4f3fda68490e2eb7373bd9d0b7b212ff9e1f",
                "pool": {
                    "url": "https://my-ip.at/atada.testnet-metadata-2.json",
                    "hash": "b4fba3c5a430634f2e5e7007b33be02562efbcd036c0cf3dbb9d9dbdf418ef27",
                    "name": "ATADA TestnetPool Austria",
                    "ticker": "ATADA",
                    "pool_id": "pool18yslg3q320jex6gsmetukxvzm7a20qd90wsll9anlkrfua38flr",
                    "homepage": "https://stakepool.at",
                    "description": "Testnet-Environment Pool ..."
                },
                "size": 6561,
                "time": "Thu Feb 24 2022 12:52:38 GMT+0000 (Coordinated Universal Time)",
                "op_cert": "f9096c23c3a3d8afd8d05467fed2bc75405cdbc27ba2106b55a585e414d26573",
                "out_sum": "9793211682245",
                "slot_no": 51337942,
                "vrf_key": "vrf_vk1sleujze3zraykllkafvrxggcmpts3hp6zxrpazdkdzp9g07kkehsnmy8ka",
                "block_no": 3345852,
                "epoch_no": 189,
                "tx_count": "11",
                "next_block": null,
                "slot_leader": "pool18yslg3q320jex6gsmetukxvzm7a20qd90wsll9anlkrfua38flr",
                "confirmations": 1,
                "epoch_slot_no": 59542,
                "previous_block": 3345851
            },
            "deposit": "0",
            "out_sum": "948312856",
            "block_id": "3372157",
            "block_index": 2,
            "script_size": 0,
            "invalid_before": null,
            "valid_contract": true,
            "invalid_hereafter": "51359405"
        },
        "from": [{
            "address": "addr_test1qqvelqlqk94qm9syd40mpqkvdvk0z8ka8mt7e2sfcrq07rmazcna98r9s350vpnyghfsuqk2y29yq88tdcvwm8j0p5dqsg32es",
            "hash": "d6ef469d198fbf62a5b9860ba9295b9c9fddb80078e975ba032653f66b070b51",
            "index": 1,
            "value": "948481173",
            "smart_contract": false,
            "assets": []
        }],
        "to": [{
                "address": "addr_test1qz5xdujk7unjmyrvqazy7l4w9dzxxfgt48ppv9tsjwywrzckyjqzaxt9rkqxc62m7tcdfylykzzjktqzlwssxfl3mlyqafvh99",
                "hash": "e29b4f5e2650560ac61dfa3ccf311e020782d8ccdf295dbbf1cfe2e65583d417",
                "index": 0,
                "value": "2564320",
                "smart_contract": false,
                "assets": []
            },
            {
                "address": "addr_test1qqvelqlqk94qm9syd40mpqkvdvk0z8ka8mt7e2sfcrq07rmazcna98r9s350vpnyghfsuqk2y29yq88tdcvwm8j0p5dqsg32es",
                "hash": "e29b4f5e2650560ac61dfa3ccf311e020782d8ccdf295dbbf1cfe2e65583d417",
                "index": 1,
                "value": "945748536",
                "smart_contract": false,
                "assets": []
            }
        ]
    },
    "type": "payment",
    "object": "event",
    "webhook_id": "532ce2beb2aa42738e1cc9c5f708168c",
    "api_version": "1.0",
    "create_date": 1645707159923,
    "idempotency_key": "755a42b339274829aefd153285084132532ce2beb2aa42738e1cc9c5f708168c",
    "network": "testnet"
}

```

### 2. 블록
이 Event는 새로운 블록이 생성될 때마다 트리거됩니다.

페이로드 예시 
```json
{
  "id": "7b7c0d8a-8885-46d6-8e05-0d0802d95473",
  "data": {
    "id": "6864165",
    "fees": "17182282",
    "hash": "641aa7bcd185e036d6a379d4908639d436a540158d1db6debd0e2c3b2fa7c8cd",
    "pool": {
      "url": "https://ccwallet.io/ccw.metadata.210713.json",
      "hash": "924ec324a9d2d172cd3fe44fbbb526e5c6bea677fb7276f07387c847dfe9026d",
      "name": "TITANstaking #2",
      "ticker": "TITAN",
      "pool_id": "pool19pyfv4xnln8x4l7auw0n0skk3hd97shun707hrw5d4s553ys74x",
      "homepage": "https://www.titanstaking.io",
      "description": "For a TITAN strong Cardano network. Based in Germany. 💪 Join us! Telegram: https://t.me/titanstakingio - Twitter: https://twitter.com/titanstaking"
    },
    "size": 58970,
    "time": "Fri Feb 04 2022 11:45:09 GMT+0000 (Coordinated Universal Time)",
    "op_cert": "400345da097b2eb0194b4a76f87b6853b07e8b96b5de30b671b0e83c54530cd3",
    "out_sum": "10738455237",
    "slot_no": 52408818,
    "vrf_key": "vrf_vk19kgvazgrvr9gstsk2qn0vz0hc9x8yn3lqdymzgztm92qk6r4q9asksen0h",
    "block_no": 6840368,
    "epoch_no": 318,
    "tx_count": "37",
    "next_block": null,
    "slot_leader": "pool19pyfv4xnln8x4l7auw0n0skk3hd97shun707hrw5d4s553ys74x",
    "confirmations": 1,
    "epoch_slot_no": 396018,
    "previous_block": 6840367
  },
  "type": "block",
  "object": "event",
  "webhook_id": "98c7051ff06b4651949466655ef974fe",
  "api_version": "1.0",
  "create_date": 1643975112334,
  "idempotency_key": "53a957187a4a4dd888b6839ea2d4452298c7051ff06b4651949466655ef974fe",
  "network": "mainnet"
}
```

### 3. 트랜잭션
이 Event는 새로운 트랜잭션이 블록체인에 추가될 때마다 트리거됩니다. 

페이로드 예시
```json
{
  "id": "123c4446-7a4f-4e8b-8baf-3c1437101859",
  "data": {
    "id": "3344667",
    "fee": "305781",
    "hash": "057585b42409a71c34d664e945acb92f30f09f966c5d18f098881c2dbf909d6f",
    "size": 2825,
    "block": {
      "id": "3275904",
      "fees": "1582516",
      "hash": "00fd351c00be3f1775361de12576d51ee582157e330d1ebe596498295a46d02e",
      "pool": {
        "url": null,
        "hash": null,
        "raw_id": "7679567d0559ed3df7cb54a848b9568b04d1976b9926d54ae9efdd3f",
        "pool_id": "pool1weu4vlg9t8knma7t2j5y3w2k3vzdr9mtnynd2jhfalwn76nwh48"
      },
      "size": 6980,
      "time": "Wed Jan 19 2022 23:11:35 GMT+0000 (Coordinated Universal Time)",
      "op_cert": "60ffa1e3c1ab6d03a5447d2f40ab023dbce45b13f0e372d63a964d31c7ee6079",
      "out_sum": "18474206426",
      "slot_no": 48264679,
      "vrf_key": "vrf_vk1mzhz5k03lahvx0gdlqtplkyasgzn8w2cpf8y8a8f76nzskptzzhqdqyyq3",
      "block_no": 3251329,
      "epoch_no": 182,
      "tx_count": "8",
      "next_block": null,
      "slot_leader": "pool1weu4vlg9t8knma7t2j5y3w2k3vzdr9mtnynd2jhfalwn76nwh48",
      "confirmations": 1,
      "epoch_slot_no": 10279,
      "previous_block": 3251328
    },
    "deposit": "0",
    "out_sum": "1591350310",
    "block_id": "3275904",
    "block_index": 1,
    "script_size": 2014,
    "invalid_before": "48264456",
    "valid_contract": true,
    "invalid_hereafter": "48278855"
  },
  "type": "transaction",
  "object": "event",
  "webhook_id": "5ef8985b5ee74b4388f324293df17173",
  "api_version": "1.0",
  "create_date": 1642633895460,
  "idempotency_key": "5wIH/+H/cOj3K+gv3zOek89bEbIXDgxz5ef8985b5ee74b4388f324293df17173"
}
```

### 4. 에포크
새로운 에포크가 시작할 때마다 알림을 받습니다.
페이로드 예시
```json
{
    "no": 178,
    "start_time": "2022-01-04T20:20:24.000Z"
}
```

### 5. 위임
이를 통해 티커 또는 풀 ID로 특정 풀에 대한 위임을 추적할 수 있습니다.
페이로드 예시
```json
{
  "id": "d0cf3218-761f-4ca1-900b-7750fb66fb59",
  "data": {
    "id": 97463,
    "pool": {
      "url": "https://apex.nextvm.net/test/testpoolMetadata.json",
      "hash": "f5ac677b58443ed2c9c9d53aa56652e71a132679e67ed9068f0227867172faf4",
      "name": "ApexTestPool",
      "raw_id": "5f5ed4eb2ba354ab2ad7c8859f3dacf93564637a105e80c8d8a7dc3c",
      "ticker": "APEXT",
      "pool_id": "pool1ta0df6et5d22k2khezze70dvly6kgcm6zp0gpjxc5lwrce0seyq",
      "homepage": "https://cardano-apexpool.github.io/test/",
      "description": "Apex Cardano Test Pool"
    },
    "tx_id": 3340342,
    "addr_id": 402710,
    "slot_no": 48240615,
    "redeemer_id": null,
    "pool_hash_id": 1030,
    "active_epoch_no": 183
  },
  "type": "delegation",
  "object": "event",
  "webhook_id": "7c827ccd2d524eb5aadf1e5a391077aa",
  "api_version": "1.0",
  "create_date": 1642609833343,
  "idempotency_key": "p90C0LTvk1XX1Ha8+JDPzzFfybhxJYYt7c827ccd2d524eb5aadf1e5a391077aa"
}
```

### 트리거 규칙
모든 Webhook에 대해 규칙을 생성하거나 조건을 트리거할 수 있습니다. 규칙은 Tangocrypto 대시보드나 API를 통해 생성할 수 있습니다. 모든 규칙은 `field`, `value`, `operator`로 구성됩니다. Webhook가 트리거되려면 모든 조건이 충족되어야 합니다. 규칙은 선택 사항입니다. 규칙 및 해당 매개변수의 수에 따라 Webhook가 트리거되는지가 결정됩니다.

**예**
주소가 5개 이상의 RBERRY 토큰을 수신할 때 웹후크를 트리거합니다.

```bash
curl --location --request POST 'https://cardano-testnet.tangocrypto.com/<app-id>/v1/webhooks' \
--header 'content-type: application/json' \
--header 'x-api-key: <x-api-key>' \
--data-raw '{
    "type": "payment",
    "name": "Payment webhook",
    "network": "testnet",
    "description": "Notify on payment with more than 5 RBERRY",
    "callback_url": "https://webhook.site/74e4201b-d651-4971-8b74-ebd6b10fd967",
    "address": "addr_test1qqqv50804vhe30n25awp6f8mhy9z3rrysva2mj4c9geaqyjr5gtdwq4yajng57kje93tt3fkc5k8cvvem7vl8yql2mcsxcstnx",
    "rules": [
        {
            "field": "asset_name",
            "operator": "=",
            "value": "RBERRY"
        },
        {
            "field": "quantity",
            "operator": ">",
            "value": "5"
        }
    ]
}'
```

대시보드에서도 규칙을 만들 수 있습니다.

![alt text](../../static/img/get-started/tangocrypto/webhooks.png)

#### 추가 정보
https://docs.tangocrypto.com/notify/notify/using-webhooks


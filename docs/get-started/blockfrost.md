---
id: blockfrost
title: Blockfrost 시작하기
sidebar_label: Blockfrost
description: Get Started with Blockfrost
image: ../img/og/og-getstarted-blockfrost.png
---

Blockfrost는 Cardano 블록체인에 저장된 정보에 액세스하고 처리하는 API를 제공합니다. 기본 티어는 무료이며, 하루에 50,000건의 요청을 제공합니다.

## 로그인

[Blockfrost에 로그인](https://blockfrost.io/auth/signin)은 Github 계정을 통해 가능합니다. 따로 회원가입을 할 필요는 없습니다. 프로젝트 이름을 입력하고, 필요에 따라 Cardano 메인넷 또는 Cardano 테스트넷을 선택합니다. 

![img](../../static/img/get-started/blockfrost/1-add-project.png)

## API 키 얻기

`Save Project` 버튼을 클릭하면 즉시 `API KEY` 를 얻을 수 있습니다. 이를 저장하고, 요청을 보낼 때마다 사용하십시오.

![img](../../static/img/get-started/blockfrost/2-get-api-key.png)

## 가장 최신 에포크 쿼리하기

최신 에포크에 대한 데이터를 얻기 위해 첫 번째 요청을 보냅니다. `1234567890` 을 귀하의 `API KEY` 로 바꾸는 것을 잊지 마십시오.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
defaultValue="curl"
values={[
{label: 'curl', value: 'curl'},
{label: 'wget', value: 'wget'},
{label: 'PHP', value: 'php'},
]}>
<TabItem value="curl">

```sh
curl -H 'project_id: 1234567890' https://cardano-mainnet.blockfrost.io/api/v0/epochs/latest
```

  </TabItem>
  <TabItem value="wget">

```sh
wget --header='project_id: 1234567890' -qO- https://cardano-mainnet.blockfrost.io/api/v0/epochs/latest
```

  </TabItem>
  <TabItem value="php">

```php
$headers = array('http'=> array(
					 'method' => 'GET',
					 'header' => 'project_id: 1234567890'
					)
   			    );
$context = stream_context_create($headers);
$json = file_get_contents('https://cardano-mainnet.blockfrost.io/api/v0/epochs/latest', false, $context);
$parsedJson = json_decode($json);
```

  </TabItem>
</Tabs>

모든 작업을 올바르게 수행한 경우, 다음과 같은 JSON 형식의 응답을 받게 됩니다.

```json
{
  "epoch": 225,
  "start_time": 1603403091,
  "end_time": 1603835086,
  "first_block_time": 1603403092,
  "last_block_time": 1603835084,
  "block_count": 21298,
  "tx_count": 17856,
  "output": "7849943934049314",
  "fees": "4203312194",
  "active_stake": "784953934049314"
}
```

## 특정 스테이크 풀의 데이터 쿼리하기

다른 예를 살펴보고 특정 스테이크 풀의 데이터를 쿼리해보겠습니다. 이를 위해 Bech32 혹은 16진수의 `pool_id` 가 필요합니다.

<Tabs
defaultValue="curl"
values={[
{label: 'curl', value: 'curl'},
{label: 'wget', value: 'wget'},
{label: 'PHP', value: 'php'},
]}>
<TabItem value="curl">

```sh
curl -H 'project_id: 1234567890' https://cardano-mainnet.blockfrost.io/api/v0/pools/c1cadab46b74defa9f79b59b617fe2a50bdbce6b367e472b6109a7bc

```

  </TabItem>
<TabItem value="wget">

```sh
wget --header='project_id: 1234567890' -qO- https://cardano-mainnet.blockfrost.io/api/v0/pools/c1cadab46b74defa9f79b59b617fe2a50bdbce6b367e472b6109a7bc

```

  </TabItem>
  <TabItem value="php">

```php
$headers = array('http'=> array(
					 'method' => 'GET',
					 'header' => 'project_id: 1234567890'
					)
   			    );
$context = stream_context_create($headers);
$json = file_get_contents('https://cardano-mainnet.blockfrost.io/api/v0/pools/c1cadab46b74defa9f79b59b617fe2a50bdbce6b367e472b6109a7bc', false, $context);
$parsedJson = json_decode($json);
```

  </TabItem>
</Tabs>

다음과 같은 JSON 형태의 응답을 받게 됩니다.

```json
{
  "vrf_key": "57c4d222e0f2f8083d7b63c8f7886f16fb7046621442bbd857f404b6f433c5e6",
  "blocks_minted": 1675,
  "live_stake": "33978569808898",
  "live_size": 0.0014709194212545152,
  "live_saturation": 0.5169025966078663,
  "live_delegators": 395,
  "active_stake": "37990508551252",
  "active_size": 0.0016498675360681707,
  "declared_pledge": "250010000000",
  "live_pledge": "765352096766",
  "margin_cost": 0.015,
  "fixed_cost": "340000000",
  "reward_account": "stake1u97pa0j0wtj5r3l6462z0xmlf5tg0dxpmss3y20almfnj5gc4tmrw",
  "owners": [
    "stake1uywma333mgeccv3aa2gvrkhz4qtz0cq9sszrnws8pv78gqqq6a65g",
    "stake1u9dqkqmdtdcav5qd933xwvwxgamrsdkr0zsn63ca0v4lz5cm7tvq0",
    "stake1u97pa0j0wtj5r3l6462z0xmlf5tg0dxpmss3y20almfnj5gc4tmrw"
  ],
  "registration": [
    "f6865b914988ed40998d2ff5453bd8af16976688065c9756d32c7a872064aaf8",
    "0e08711da89ebbaefaf897f5633c7b7bc6c1c9037451431745fbaefbf1227ec7",
    "9b85adfebc25f2cc7737039fb376043207e1ec7147b2800436138e7df58c70d4",
    "1243db764e42a3ec89d815d96bcf7242bfd2837d54f3047f2b5abacd7e52345d"
  ],
  "retirement": []
}
```

## 특정 자산의 정보 쿼리하기

이 마지막 예시를 살펴보고, Cardano 내 특정 네이티브 토큰의 정보를 쿼리해보겠습니다. 이를 위해 `policy_id` 와 16진수로 인코딩된 `asset_name` 의 문자열 연결이 필요합니다.


<Tabs
defaultValue="curl"
values={[
{label: 'curl', value: 'curl'},
{label: 'wget', value: 'wget'},
{label: 'PHP', value: 'php'},
]}>
<TabItem value="curl">

```sh
curl -H 'project_id: 1234567890' https://cardano-mainnet.blockfrost.io/api/v0/assets/d894897411707efa755a76deb66d26dfd50593f2e70863e1661e98a07370616365636f696e73

```

  </TabItem>
  <TabItem value="wget">

```sh
wget --header='project_id: 1234567890' -qO- https://cardano-mainnet.blockfrost.io/api/v0/assets/d894897411707efa755a76deb66d26dfd50593f2e70863e1661e98a07370616365636f696e73

```

  </TabItem>
  <TabItem value="php">

```php
$headers = array('http'=> array(
					 'method' => 'GET',
					 'header' => 'project_id: 1234567890'
					)
   			    );
$context = stream_context_create($headers);
$json = file_get_contents('https://cardano-mainnet.blockfrost.io/api/v0/assets/d894897411707efa755a76deb66d26dfd50593f2e70863e1661e98a07370616365636f696e73', false, $context);
$parsedJson = json_decode($json);
```

  </TabItem>
</Tabs>

You will get this JSON response:

```json
{
  "policy_id": "d894897411707efa755a76deb66d26dfd50593f2e70863e1661e98a0",
  "asset_name": "7370616365636f696e73",
  "fingerprint": "asset1pmmzqf2akudknt05ealtvcvsy7n6wnc9dd03mf",
  "quantity": "50000000",
  "initial_mint_tx_hash": "3cce12c77b9d11d70575320c4f2834b26debb065308fbe43954018fbeb90010d",
  "onchain_metadata": null,
  "metadata": null
}
```

## Blockfrost 문서

Blockfrost에는 많은 일을 할 수 있는 강력한 API가 있습니다. 전체 API 설명서를 보려면 [docs.blockfrost.io](https://docs.blockfrost.io)를 확인하십시오.


---
id: minting
title: 네이티브 자산 발행
sidebar_label: 네이티브 자산 발행
description: How to mint native tokens on Cardano. 
image: ../img/og/og-developer-portal.png
---

이 섹션에서는 **NFT가 아니라** 네이티브 자산 발행에 대해 다룰 것입니다.

이 섹션을 통해 트랜잭션과 발행 작업이 어떻게 이루어지는지 이해하는 것이 좋습니다. NFT 발행은 여기서 몇 가지만 변경하면 동일한 작업 흐름을 따릅니다. NFT 발행 프로세스를 보고 싶다면, [NFT 발행](minting-nfts.md)을 확인하세요.

## 전제 조건

1. 실행 및 동기화된 Cardano 노드 - `cardano-cli` 명령어를 통해 액세스할 수 있어야 합니다. 이 가이드는 `cardano-cli` v 1.27.0을 기반으로 작성되었습니다. 일부 명령어는 버전에 따라 차이가 있을 수 있습니다.
2. 디렉토리 간 탐색, 파일 생성 및 편집, Linux 쉘을 통한 변수 설정 및 검사 등 Linux에 대한 지식이 어느 정도 있어야 합니다.

## 개요
이 튜토리얼은 복사/붙여넣기가 가능한 전체 토큰 라이프사이클에 대한 가이드를 제공합니다.

![img](https://ucarecdn.com/75b79657-9f94-41b9-9426-7a65245f14ee/multiassetdiagram.png)

다음은 전체 라이프사이클을 완료하기 위해 취해야 할 단계입니다.

1. 모든 설정 완료하기
2. 새 주소 및 키 생성
3. 발행 정책 생성
4. 발행 트랜잭션 초안 작성
5. 수수료 계산
6. 트랜잭션 전송 및 토큰 발행
7. 토큰을 Daedalus 지갑으로 전송
8. 토큰 소각

### 디렉토리 구조
새로운 디렉토리에서 작업해 봅시다. 다음은 생성할 파일의 모든 개요입니다.

```
├── burning.raw                    # Raw transaction to burn token
├── burning.signed                 # Signed transaction to burn token
├── matx.raw                       # Raw transaction to mint token
├── matx.signed                    # Signed transaction to mint token
├── metadata.json                  # Metadata to specify NFT attributes
├── payment.addr                   # Address to send / receive 
├── payment.skey                   # Payment signing key
├── payment.vkey                   # Payment verification key
├── policy                         # Folder which holds everything policy-wise
│   ├── policy.script              # Script to genereate the policyID
│   ├── policy.skey                # Policy signing key
│   ├── policy.vkey                # Policy verification key
│   └── policyID                   # File which holds the policy ID
└── protocol.json                  # Protocol parameters
```

### 토큰 아키텍쳐

네이티브 자산을 생성하기 전에, 최소한 다음 네 가지 질문을 스스로에게 물어봐야 합니다.

1. 내 토큰의 이름은 무엇으로 할까?
2. 몇 개나 발행할까?
3. (발행 및 소각 등) 상호작용에 시간 제한이 존재해야 할까?
4. 누가 이를 발행할 수 있도록 할까?

1, 3 그리고 4번은 소위 통화 정책 스크립트라고 불리는 것 내에서 정의되는 반면, 2번의 실제 개수는 발행 트랜잭션에서만 정의됩니다.

이 가이드에서는 다음을 사용할 것입니다.

1. 내 토큰의 이름은 무엇으로 할까?
--> 이를 `Testtoken` 및 `SecondTesttoken`으로 부를 것입니다.
2. 몇 개나 발행할까?
--> 각각 10000000개를 발행할 예정입니다 (10M `Testtoken`, 10M `SecondTesttoken`).
3. (발행 및 소각 등) 상호작용에 시간 제한이 존재해야 할까?
--> 없도록 설정할 것입니다(그러나 NFT를 만들때는 시간 제한을 넣을 것입니다).
4. 누가 이를 발행할 수 있도록 할까?
--> 오직 (우리가 소유한) 하나의 서명만이 트랜잭션에 서명해서 토큰을 발행할 수 있어야 합니다.

## 설정
### Cardano 노드 소켓 경로
`cardano-cli`로 작업하려면, `CARDANO_NODE_SOCKET_PATH`라는 환경 변수를 내보내야 합니다. 해당 환경변수의 이름이 모두 대문자로 되어있는 것에 주의하세요.
이 변수는 Cardano 노드 설치의 소켓 파일에 대한 절대 경로를 담고 있어야 합니다.

소켓 경로를 찾을 수 있는 위치에 대해 불확실하거나 잘 모르겠으면, Cardano 노드를 시작/실행하는 방법에 대한 명령어로 확인해보세요.
예를 들어, 만약 아래 명령으로 노드를 시작하는 경우

```bash
$HOME/.local/bin/cardano-node run \
 --topology config/testnet-topology.json \
 --database-path db \
 --socket-path $HOME/TESTNET_NODE/socket/node.socket \
 --port 3001 \
 --config config/testnet-config.json
```
변수를 `--socket-path` 매개변수에 대응되는 경로로 지정해야 합니다.

```bash
export CARDANO_NODE_SOCKET_PATH="$HOME/TESTNET_NODE/socket/node.socket"
```
그에 따라 설정 및 소켓 경로를 조정해야 합니다.

### 가독성 향상
위 모든 질문에 이미 답했으므로, 터미널/bash에 변수들을 설정함으로서 가독성을 좀 더 쉽게 만들 것입니다.
또한, 테스트넷을 사용할 것입니다. 메인넷에서 네이티브 자산을 생성하는 것과의 유일한 차이점은, 네트워크 변수 <i>testnet</i>을 mainnet으로 대체해야 한다는 것입니다.

<b>cardano-cli 버전 1.31.0부터, 토큰 이름은 base16으로 인코딩되어야 합니다 </b>. 그래서, 여기선 토큰 이름 인코딩에 xxd 도구를 사용합니다.

```bash
testnet="--testnet-magic 1097911063"
tokenname1=$(echo -n "Testtoken" | xxd -ps | tr -d '\n')
tokenname2=$(echo -n "SecondTesttoken" | xxd -ps | tr -d '\n')
tokenamount="10000000"
output="0"
```

앞으로도 계속 쉽게 따라갈 수 있도록, 변수 설정하는 기법을 쭉 사용할 것입니다.

### 노드 상태 확인

또한 우리는 노드가 최신 상태인지 확인하고 싶습니다. 이를 위해, 현재 에포크/블록을 확인하고 [테스트넷에 대한 Cardano 익스플로러](https://explorer.cardano-testnet.iohkdev.io/en)에 표시된 현재 값과 비교합니다.

```bash
cardano-cli query tip $testnet
```

이는 다음과 같은 출력을 제공해야 합니다.
```bash
{
    "epoch": 282,
    "hash": "82cfbbadaaec1a6204442b91de1535505b6482ae9858f3f0bd9c4bb9c8a2c12b",
    "slot": 36723570,
    "block": 6078639,
    "era": "Mary"
}
```

해당 에포크 및 슬롯 번호는 Cardano [테스트넷 익스플로러](https://explorer.cardano-testnet.iohkdev.io/en)의 정보와 일치해야 합니다.

![img](../../static/img/nfts/cardano_explorer_testnet.png)

### 작업 공간 설정

깨끗한 상태에서 시작하기 위해, 새 디렉토리를 만들고 탐색해 봅시다.
```bash
mkdir tokens
cd tokens/
```

### 키 및 주소 생성

이미 지불 주소 및 키를 가지고 있고 이를 사용하려는 경우, 이 단계는 건너뛰면 됩니다.
그렇지 않은 경우 트랜잭션을 제출하고 ada 및 네이티브 자산들을 송수신하기 위해 다음과 같이 지불 주소와 키를 생성해야 합니다.

결제 검증 및 서명 키는 생성해야 하는 첫번째 키입니다.

```bash
cardano-cli address key-gen --verification-key-file payment.vkey --signing-key-file payment.skey
```

이제 이 두 키를 사용하여 주소를 생성할 수 있습니다.

```bash
cardano-cli address build --payment-verification-key-file payment.vkey --out-file payment.addr $testnet
```

`address`라는 변수에 주소 해시를 저장합니다.

```bash
address=$(cat payment.addr)
```
### 주소에 자금 채우기

트랜잭션을 제출하려면 항상 수수료를 지불해야 합니다. 또한 네이티브 자산을 전송하려면 최소 1 ada가 필요합니다. 
따라서 발행 트랜잭션을 위한 입력으로 사용할 주소에 충분한 자금이 있는지 확인하세요.

**테스트넷**의 경우, [testnet faucet](../integrate-cardano/testnet-faucet)에서 자금을 요청할 수 있습니다.

### 프로토콜 매개변수 내보내기

트랜잭션 계산을 위해 현재 매개변수 중 일부가 필요합니다. 매개 변수는 다음과 같은 명령을 사용하여 <i>protocol.json</i> 이라는 파일에 저장할 수 있습니다. 

```bash
cardano-cli query protocol-parameters $testnet --out-file protocol.json
```

## 네이티브 자산 발행

### 정책 생성하기

정책은 토큰을 발행할 수 있는 정의 요소입니다. 정책 키를 소유한 사람만이 이 정책에 따라 발행된 토큰을 더 발행하거나 소각할 수 있습니다. 
모든 것을 정책에 따라 분리하고 보다 체계적으로 유지하기 위해, 작업 디렉토리에 별도의 하위 디렉토리를 만들 것입니다. 
자세한 내용은 [공식 문서](https://docs.cardano.org/native-tokens/getting-started/#tokenmintingpolicies) 또는 [다중 서명 스크립트에 대한 Github 페이지](https://github.com/input-output-hk/cardano-node/blob/c6b574229f76627a058a7e559599d2fc3f40575d/doc/reference/simple-scripts.md)를 참조하세요.

```bash
mkdir policy
```

:::note 
이 디렉토리로 이동하지 않고, 작업 디렉토리에서 모든 작업을 수행합니다.
:::


우선, 다시 몇 개의 키 쌍이 필요합니다.

```bash
cardano-cli address key-gen \
    --verification-key-file policy/policy.vkey \
    --signing-key-file policy/policy.skey
```

`echo` 명령어를 사용하여 `policy.script`를 생성합니다(첫 줄에서 `>>` 대신 `>`을 사용하였는데, 이는 파일이 없을 경우 새로 생성하고, 파일이 있다면 지우는 역할을 합니다).

```bash
echo "{" > policy/policy.script 
echo "  \"keyHash\": \"$(cardano-cli address key-hash --payment-verification-key-file policy/policy.vkey)\"," >> policy/policy.script 
echo "  \"type\": \"sig\"" >> policy/policy.script 
echo "}" >> policy/policy.script
```

:::note 
두 번째 echo는 하위 쉘 명령어를 사용하여 key-hash를 생성합니다. 물론 이를 손수 할 수도 있습니다.
:::

이제 정책 검증 키를 발행 트랜잭션에 서명하는 증인으로 정의한 간단한 스크립트 파일을 만들었습니다. 트랜잭션을 성공적으로 제출하기 위해 토큰을 잠그거나 서명을 요구하는 것과 같은 제약 조건들은 존재하지 않습니다.

### 자산 발행
네이티브 자산을 발행하려면, 생성한 스크립트 파일에서 정책 ID를 생성해야 합니다.

```bash
cardano-cli transaction policyid --script-file ./policy/policy.script > policy/policyID
```

출력은 나중에 사용해야 하므로 `policyID` 파일에 저장합니다.

### 자신에게 보낼 미가공 트랜잭션 빌드
토큰을 발행하기 위해, 이전에 생성되고 자금이 조달되었던 주소를 사용하여 트랜잭션을 생성할 것입니다.

#### Cardano 트랜잭션에 대한 간략한 설명

Cardano의 각 트랜잭션에는 수수료가 필요합니다. 현재로서는 전송하려는 크기에 따라 대부분 결정됩니다. 더 많은 바이트가 전송될수록, 수수료가 높아집니다.

그렇기 때문에 Cardano에서 트랜잭션을 만드는 것은 삼자 과정입니다.

1. 먼저 트랜잭션을 빌드하여 파일을 생성합니다. 이를 기반으로 트랜잭션 수수료를 계산할 것입니다.
2. 이 `raw` 파일과 프로토콜 매개변수를 사용하여 수수료를 계산합니다.
3. 그런 다음 올바른 수수료와 보낼 수 있는 금액을 포함하여 트랜잭션을 다시 빌드해야 합니다. 우리는 이를 우리 자신에게 보낼 것이기 때문에, 출력은 우리가 가진 자금에서 계산된 수수료를 뺀 금액이어야 합니다.

명심해야 할 또 다른 사항은 Cardano에서 트랜잭션 및 "잔액"이 설계되는 방식에 대한 모델입니다. 각 트랜잭션에는 하나의(또는 여러) 입력(지불할 지갑에 있는 현금과 같은 자금의 출처)과 하나 또는 여러 개의 출력이 있습니다.
이 발행 예제에서, 입력과 출력은 동일할 것입니다: <b>우리의 주소</b>일 것이기 때문이죠.

시작 전에, 트랜잭션 빌딩을 더 쉽게 하기 위해 몇 가지 설정이 필요합니다. 먼저 지불 주소를 쿼리하고 존재하는 다양한 값들을 기록해 둡니다.

```bash
cardano-cli query utxo --address $address $testnet
```

출력 결과는 다음과 같은 형태여야 합니다(가상의 예시임).

```bash
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
b35a4ba9ef3ce21adcd6879d08553642224304704d206c74d3ffb3e6eed3ca28     0        1000000000 lovelace
```

트랜잭션에서 위의 각 값들이 필요하므로, 해당하는 변수에 각각 저장합니다.

```bash
txhash="insert your txhash here"
txix="insert your TxIx here"
funds="insert Amount here"
policyid=$(cat policy/policyID)
```

우리의 가상 예시에서는, 다음과 같은 결과가 출력됩니다. <b>각자 값을 알맞게 조정하세요.</b>

```bash
$ txhash="b35a4ba9ef3ce21adcd6879d08553642224304704d206c74d3ffb3e6eed3ca28"
$ txix="0"
$ funds="1000000000"
$ policyid=$(cat policy/policyID)
```
또한, 수수료를 계산하는 데에만 쓰이는 트랜잭션은 수수료가 설정되어 있어야 하긴 해도 정확할 필요는 없습니다. 계산된 수수료는 이 트랜잭션이 *두 번째로* 생성될 때 포함됩니다(서명하고 제출할 때). 처음에는 수수료 매개변수의 *길이* 만 중요하므로, 여기서는 최대값([참고](https://github.com/cardano-foundation/developer-portal/pull/283#discussion_r705612888))을 선택합니다.

```bash
$ fee="300000"
```

이제 수수료를 계산한 뒤 <i>matx.raw</i> 파일에 저장될 첫 번째 트랜잭션을 빌드할 준비가 되었습니다. 
필요한 거의 모든 값을 변수에 저장했기 때문에, 가독성을 높이기 위해 트랜잭션 내 변수를 참조할 것입니다. 
다음이 해당 트랜잭션의 모습입니다.

```bash
cardano-cli transaction build-raw \
 --fee $fee \
 --tx-in $txhash#$txix \
 --tx-out $address+$output+"$tokenamount $policyid.$tokenname1 + $tokenamount $policyid.$tokenname2" \
 --mint "$tokenamount $policyid.$tokenname1 + $tokenamount $policyid.$tokenname2" \
 --minting-script-file policy/policy.script \
 --out-file matx.raw
```

:::note 
이후 버전의 cardano-cli(적어도 1.31.0 이상)에서는 **토큰 이름이 base16으로 인코딩 되어야 합니다. 그렇지 않다면 오류가 발생합니다.**

```bash
option --tx-out: 
unexpected 'T'
expecting alphanumeric asset name, white space, "+" or end of input
```

토큰 이름을 재정의하여 이 문제를 해결할 수 있습니다. 이 튜토리얼에서 지정한 토큰의 base16 형태 이름은 다음과 같습니다.

```bash
tokenname1="54657374746F6B656E"
tokenname2="5365636F6E6454657374746F6B656E"
```
:::

#### 구문 분석
다음은 발행 트랜잭션에서 정의하는 매개변수에 대한 구문 분석입니다.

```bash
--fee: $fee
```
트랜잭션에 대해 지불해야 하는 네트워크 수수료입니다. 수수료는 네트워크 매개변수를 통해 계산되며, 트랜잭션의 크기(바이트 단위)에 따라 달라집니다. 파일 크기가 클수록 수수료가 높아집니다.

```bash
--tx-in $txhash#$txix \
```
트랜잭션 입력으로 사용하는 주소의 해시에는 충분한 자금이 필요합니다.
따라서 구문은 해시, 해당 해시의 해시태그, TxIx 값으로 분석할 수 있습니다.

```bash
--tx-out $address+$output+"$tokenamount $policyid.$tokenname1 + $tokenamount $policyid.$tokenname2" \
```
여기서 마법과 같은 일이 발생합니다. <i>--tx-out</i> 의 경우, 트랜잭션을 수신할 주소를 지정해야 합니다. 이 경우는 우리 자신의 주소로 토큰을 보냅니다.

:::note
구분은 매우 중요하므로, 여기서는 단어 하나하나 나열하겠습니다. 명시하지 않는 한 공백은 없습니다.
1. 주소 해시
2. 더하기 기호
3. Lovelace (ada) 단위로 표현된 출력 (출력 = 입력값 — 수수료)
4. 더하기 기호
5. 따옴표
6. 토큰의 양
7. 공백
8. 정책 ID
9. 마침표
10. 토큰 이름 (여러 개 혹은 다른 종류의 토큰도 적고 싶다면 공백, 플러스, 공백 후 6부터 다시 시작하면 됩니다)
11. 따옴표
:::

```bash
--mint "$tokenamount $policyid.$tokenname1 + $tokenamount $policyid.$tokenname2" \
```
다시, <i>--tx-out</i> 에 지정된 것과 동일한 구문이지만 주소와 출력은 없습니다.

```bash
--out-file matx.raw
```
이름을 지정할 수 있는 파일에 트랜잭션을 저장합니다. 
다음 명령어에서 올바른 파일 이름을 참조하도록 하세요. 여기서는 공식 문서에 따라, <i>matx.raw</i> 라고 선언하였습니다.

이 미가공 트랜잭션을 기반으로 최소 트랜잭션 수수료를 계산하고 이를 <i>$fee</i> 변수에 저장할 수 있습니다. 터미널 기반 계산에 변수를 사용할 수 있도록 값만 저장합니다.

```bash
fee=$(cardano-cli transaction calculate-min-fee --tx-body-file matx.raw --tx-in-count 1 --tx-out-count 1 --witness-count 2 $testnet --protocol-params-file protocol.json | cut -d " " -f1)
```

Ada의 트랜잭션 입력과 출력은 동일해야 하며, 그렇지 않으면 트랜잭션은 실패합니다. 남은 것이 있을 수는 없습니다.
남은 출력을 계산하려면, 자금에서 수수료를 빼고 그 결과를 출력 변수에 저장해야 합니다.

```bash
output=$(expr $funds - $fee)
```

이제 서명할 준비가 된 트랜잭션을 다시 빌드할 때 필요한 모든 값을 얻었습니다. 다시 트랜잭션을 빌드하기 위해 동일한 명령을 다시 실행합니다. 앞선 것과의 유일한 차이점은, 이제 변수가 올바른 값을 담고 있다는 점입니다.

```bash
cardano-cli transaction build-raw \
--fee $fee  \
--tx-in $txhash#$txix  \
--tx-out $address+$output+"$tokenamount $policyid.$tokenname1 + $tokenamount $policyid.$tokenname2" \
--mint "$tokenamount $policyid.$tokenname1 + $tokenamount $policyid.$tokenname2" \
--minting-script-file policy/policy.script \
--out-file matx.raw
```

정책 키의 인증과 소유권 증명을 위해 트랜잭션은 서명되어야 합니다.

```bash
cardano-cli transaction sign  \
--signing-key-file payment.skey  \
--signing-key-file policy/policy.skey  \
$testnet --tx-body-file matx.raw  \
--out-file matx.signed
```

:::note 서명된 트랜잭션은 <i>matx.raw</i> 대신 <i>matx.signed</i> 라는 새 파일에 저장됩니다.
:::

이제 트랜잭션을 제출하여 네이티브 자산을 생성합니다.
```bash
cardano-cli transaction submit --tx-file matx.signed $testnet
```

축하합니다. 이제 자체 토큰을 성공적으로 발행했습니다. 몇 초 후에 출력 주소를 확인할 수 있습니다.

```bash
cardano-cli query utxo --address $address $testnet
```

다음과 같은 형태로 표시되어야 합니다.

```bash
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
d82e82776b3588c1a2c75245a20a9703f971145d1ca9fba4ad11f50803a43190     0        999824071 lovelace + 10000000 45fb072eb2d45b8be940c13d1f235fa5a8263fc8ebe8c1af5194ea9c.5365636F6E6454657374746F6B656E + 10000000 45fb072eb2d45b8be940c13d1f235fa5a8263fc8ebe8c1af5194ea9c.54657374746F6B656E
```

## 지갑으로 토큰 보내기

토큰을 지갑으로 보내려면, 다른 트랜잭션을 빌드해야 합니다. 차이점이라면 이번엔 발행 매개변수가 없이 빌드한다는 점입니다. 
그에 따른 변수 설정은 다음과 같습니다.

```bash
fee="0"
receiver="Insert wallet address here"
receiver_output="10000000"
txhash=""
txix=""
funds="Amount of lovelace"
```

다시 말하지만, 가상의 예시를 사용하면 이게 어떻게 보이는지에 대한 예시가 다음과 같이 나타나 있습니다.

```bash
$ fee="0"
$ receiver="addr_test1qp0al5v8mvwv9mzn77ls0tev3t838yp9ghvgxf9t5qa4sqlua2ywcygl3d356c34576elq5mcacg88gaevceyc5tulwsmk7s8v"
$ receiver_output="10000000"
$ txhash="d82e82776b3588c1a2c75245a20a9703f971145d1ca9fba4ad11f50803a43190"
$ txix="0"
$ funds="999824071"
```

발행 과정에서 다른 변수에 계속 액세스할 수 있어야 합니다.
다음 변수들이 잘 설정되어있는지 확인하세요.


```bash
echo Tokenname 1: $tokenname1
echo Tokenname 2: $tokenname2
echo Address: $address
echo Policy ID: $policyid
```

첫 번째 토큰인 `Testtoken` 중 2개를 외부 주소로 보낼 것입니다.
세 가지 정도를 짚고 넘어가야 합니다.

1. 우리는 외부 주소로 최소 1 ada (1000000 Lovelace)를 보내야 합니다. 토큰만 보낼 수는 없습니다. 따라서 이 값을 출력에 포함해야 합니다. `receiver_output` 변수로 외부 주소의 출력 값을 참조합니다.
2. 수신 주소와 별개로, 자체 주소를 추가 출력으로 설정해야 합니다. 우리는 우리가 가진 모든 것을 외부 주소로 보내고 싶지 않기 때문에, 입력에서 오는 다른 모든 것을 받기 위해 우리 자신의 주소를 사용할 것입니다.
3. 따라서 우리의 주소는 트랜잭션 수수료와 외부 주소로 보내야 하는 최소 자금인 1 ada, 그리고 `txhash`가 가진 모든 토큰에서 보내는 만큼을 뺀 자금을 수령해야 합니다.

:::note 보내는 네이티브 자산의 크기와 양에 따라 최소 요구 사항인 1 ada보다 더 많은 자금을 보내야 할 수도 있습니다. 이 가이드에서는 안전하게 10개의 ada를 보낼 것입니다. [자세한 내용은 Cardano 렛저 문서를](https://cardano-ledger.readthedocs.io/en/latest/explanations/min-utxo-alonzo.html#example-min-ada-value-calculations-and-current-constants) 확인하세요.
:::

첫 번째 토큰 중 2개를 외부 주소로 보낼 것이기 때문에, `Testtoken` 999998개와 `SecondTesttoken` 1000000개가 남을 것입니다.

`raw` 트랜잭션은 다음과 같습니다.

```bash
cardano-cli transaction build-raw  \
--fee $fee  \
--tx-in $txhash#$txix  \
--tx-out $receiver+$receiver_output+"2 $policyid.$tokenname1"  \
--tx-out $address+$output+"9999998 $policyid.$tokenname1 + 10000000 $policyid.$tokenname2"  \
--out-file rec_matx.raw
```

다시 수수료를 계산하고 변수에 저장합니다.

```bash
fee=$(cardano-cli transaction calculate-min-fee --tx-body-file rec_matx.raw --tx-in-count 1 --tx-out-count 2 --witness-count 1 $testnet --protocol-params-file protocol.json | cut -d " " -f1)
```

위에서 말했듯이, 우리는 우리 주소로 반송될 남은 토큰의 양을 계산해야 합니다. 이 계산의 로직은 다음과 같습니다.
`TxHash Amount` — `fee` — `min Send 10 ada in Lovelace` = `the output for our own address`

```bash
output=$(expr $funds - $fee - 10000000)
```

트랜잭션을 업데이트해봅시다.

```bash
cardano-cli transaction build-raw  \
--fee $fee  \
--tx-in $txhash#$txix  \
--tx-out $receiver+$receiver_output+"2 $policyid.$tokenname1"  \
--tx-out $address+$output+"9999998 $policyid.$tokenname1 + 10000000 $policyid.$tokenname2"  \
--out-file rec_matx.raw
```

서명:
```bash
cardano-cli transaction sign --signing-key-file payment.skey $testnet --tx-body-file rec_matx.raw --out-file rec_matx.signed
```

전송:
```bash
cardano-cli transaction submit --tx-file rec_matx.signed $testnet
```

몇 초 후에, 수신자에게 토큰이 전달될 것입니다. 이 예제에서는 Daedalus 테스트넷 지갑이 사용되었습니다.

![img](../../static/img/nfts/daedalus_tokens_rec.PNG)


## 토큰 소각

토큰 라이프사이클의 마지막 파트에선, 새로 만든 토큰인 <i>SecondTesttoken</i> 5000개를 소각하여 영구적으로 파기해 보겠습니다.

이 역시 트랜잭션으로 실행됩니다. 지금까지 잘 따라오셨다면 프로세스에 익숙할 것입니다. 시작해보겠습니다.

모든 설정을 환료하고 주소를 확인합니다.

```bash
cardano-cli query utxo --address $address $testnet
```

:::note 토큰을 이미 보낸 상황이므로, 보낼 Testtoken의 양을 조정해야 합니다.
:::

(아직 설정하지 않았다면) 변수를 알맞게 설정해봅시다. 주소 또는 토큰 이름과 같은 변수도 설정해주어야 합니다.

```bash
txhash="insert your txhash here"
txix="insert your TxIx here"
funds="insert Amount only in here"
burnfee="0"
policyid=$(cat policy/policyID)
burnoutput="0"
```

토큰 소각은 매우 간단합니다.
새로운 발행 작업을 실행하되, 이번에는 **음수** 입력을 사용합니다. 이는 본질적으로 토큰의 총량을 감소시킵니다.

```bash
cardano-cli transaction build-raw \
 --fee $burnfee \
 --tx-in $txhash#$txix \
 --tx-out $address+$burnoutput+"9999998 $policyid.$tokenname1 + 9995000 $policyid.$tokenname2"  \
 --mint="-5000 $policyid.$tokenname2" \
 --minting-script-file policy/policy.script \
 --out-file burning.raw
 ```
 

:::note 이미 여러 트랜잭션 파일이 있으므로, 이 트랜잭션에 <i>burning.raw</i> 라는 이름을 붙여줍시다. 
또한 소각 이후 남은 토큰의 양도 지정해주어야 합니다.
계산 방식은 다음과 같습니다.

<i>입력 토큰의 양</i> — <i>소각 토큰의 양</i> = <i>출력 토큰의 양</i>
:::

여느 때처럼 수수료를 계산해야 합니다. 차별화를 위해 변수 이름은 <i>burnfee</i>로 설정하였습니다.

```bash
burnfee=$(cardano-cli transaction calculate-min-fee --tx-body-file burning.raw --tx-in-count 1 --tx-out-count 1 --witness-count 2 $testnet --protocol-params-file protocol.json | cut -d " " -f1)
```

올바른 출력 값을 계산합니다.
```bash
burnoutput=$(expr $funds - $burnfee)
```

해당 값으로 트랜잭션을 다시 빌드합니다.

```bash
cardano-cli transaction build-raw \
 --fee $burnfee \
 --tx-in $txhash#$txix \
 --tx-out $address+$burnoutput+"9999998 $policyid.$tokenname1 + 9995000 $policyid.$tokenname2"  \
 --mint="-5000 $policyid.$tokenname2" \
 --minting-script-file policy/policy.script \
 --out-file burning.raw
 ```

트랜잭션에 서명합니다.

 ```bash
 cardano-cli transaction sign  \
--signing-key-file payment.skey  \
--signing-key-file policy/policy.skey  \
$testnet  \
--tx-body-file burning.raw  \
--out-file burning.signed
```

이를 전송합니다.
```bash
cardano-cli transaction submit --tx-file burning.signed $testnet
```

주소를 확인합니다.

```bash
cardano-cli query utxo --address $address $testnet
```

이제 전보다 5000개 적은 토큰을 가지고 있어야 합니다.
```bash
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
f56e2800b7b5980de6a57ebade086a54aaf0457ec517e13012571b712cf53fb3     1        989643170 lovelace + 9995000 45fb072eb2d45b8be940c13d1f235fa5a8263fc8ebe8c1af5194ea9c.5365636F6E6454657374746F6B656E + 9999998 45fb072eb2d45b8be940c13d1f235fa5a8263fc8ebe8c1af5194ea9c.54657374746F6B656E
```

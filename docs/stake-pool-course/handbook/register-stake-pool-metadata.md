---
id: register-stake-pool-metadata
title: 메타데이터로 스테이크 풀 등록
sidebar_label: 메타데이터로 스테이크 풀 등록
description: "Stake pool course: Register a stake pool with metadata."
image: ../img/og/og-developer-portal.png
---

다음에 대한 액세스 권한이 있는지 확인하세요.

| 파일 | 내용 |
| :--- | :--- |
| `payment.vkey` | 지불 검증 키 |
| `payment.skey` | 지불 서명 키 |
| `stake.vkey` | 스테이크 검증 키 |
| `stake.skey` | 스테이크 서명 키 |
| `stake.addr` | 등록된 스테이크 주소 |
| `payment.addr` | `stake`와 연결되는 지불 주소 |
| `cold.vkey` | 콜드 검증 키 |
| `cold.skey` | 콜드 서명 키 |
| `cold.counter` | 이슈 카운터 |
| `node.cert` | 운영 인증서 |
| `kes.vkey` | KES 검증 키 |
| `kes.skey` | KES 서명 키 |
| `vrf.vkey` | VRF 검증 키 |
| `vrf.skey` | VRF 서명 키 |

스테이크 풀을 등록하려면 다음이 필요합니다.

* 메타데이터로 JSON 파일을 생성하고 노드와 유지 관리하는 URL에 저장하기.
* JSON 파일의 해시 가져오기
* 스테이크 풀 등록 인증서 생성
* 위임 인증서 서약 만들기
* 인증서를 블록체인에 제출

**경고**: **스테이크 풀 등록 인증서** 및 **위임 인증서**를 생성 하려면 **콜드 키**가 필요합니다 . 따라서 메인넷에서 이 작업을 수행할 때, 콜드 키가 인터넷에 노출되지 않도록 적절한 보안 조치를 취하여 로컬 시스템에서 이러한 인증서를 생성해야 합니다.

#### 풀의 메타데이터로 JSON 파일 만들기

```json
{
    "name": "TestPool",
    "description": "The pool that tests all the pools",
    "ticker": "TEST",
    "homepage": "https://teststakepool.com"
}
```
웹 서버에 파일을 저장합니다(예를 들면 https://teststakepool.com/poolMetadata.json). 풀 메타데이터는 신뢰할 수 있는 서버에 저장해야 합니다. 메타데이터 파일을 사용할 수 없는 경우 풀이 지갑에서 사라지고 새로운 위임자들이 풀을 못 찾을 수도 있습니다.

#### 서버에 업로드된 메타데이터 파일의 해시 가져오기

다음 명령은 방금 웹 서버에 업로드한 json 파일의 해시 값을 반환합니다. `https://teststakepool.com/poolMetadata.json` 대신 자신의 주소를 입력해야 합니다.

```sh
cardano-cli stake-pool metadata-hash --pool-metadata-file <(curl -s -L -k https://teststakepool.com/poolMetadata.json)

>6bf124f217d0e5a0a8adb1dbd8540e1334280d49ab861127868339f43b3948af
```

#### 스테이크 풀 등록 인증서 생성하기

```sh
cardano-cli stake-pool registration-certificate \
    --cold-verification-key-file cold.vkey \
    --vrf-verification-key-file vrf.vkey \
    --pool-pledge <AMOUNT TO PLEDGE IN LOVELACE> \
    --pool-cost <POOL COST PER EPOCH IN LOVELACE> \
    --pool-margin <POOL COST PER EPOCH IN PERCENTAGE> \
    --pool-reward-account-verification-key-file stake.vkey \
    --pool-owner-stake-verification-key-file stake.vkey \
    --mainnet \
    --pool-relay-ipv4 <RELAY NODE PUBLIC IP> \
    --pool-relay-port <RELAY NODE PORT> \
    --metadata-url https://git.io/JJWdJ \
    --metadata-hash <POOL METADATA HASH> \
    --out-file pool-registration.cert
```

| 매개변수 | 설명 |
| :--- | :--- |
| cold-verification-key-file | 콜드 검증 키 |
| vrf-verification-key-file | CRF 검증 키 |
| pool-pledge | lovelace 형태의 서약 |
| pool-cost | lovelace 형태의 에포크당 운영 비용 |
| pool-margin | 운영자 마진 |
| pool-reward-account-verification-key-file | 보상을 위한 스테이크 검증 키 |
| pool-owner-staking-verification-key-file | 풀 소유자를 위한 스테이크 검증 키 |
| pool-relay-ipv4 | relay 노드 IP 주소 |
| pool-relay-port | 포트 |
| metadata-url | JSON 파일의 URL |
| metadata-hash | 풀 메타데이터 JSON 파일의 해시 |
| out-file | 인증서를 쓸 출력 파일 |

**보상에 대해 다른 키를 사용할 수 있으며, 서약을 공유하는 소유자가 여러 명인 경우 둘 이상의 소유자 키를 ​​제공할 수 있습니다.**

**pool-registration.cert** 파일은 다음 과 같아야 합니다.

```
type: CertificateShelley
description: Stake Pool Registration Certificate
cborHex:
18b58a03582062d632e7ee8a83769bc108e3e42a674d8cb242d7375fc2d97db9b4dd6eded6fd5820
48aa7b2c8deb8f6d2318e3bf3df885e22d5d63788153e7f4040c33ecae15d3e61b0000005d21dba0
001b000000012a05f200d81e820001820058203a4e813b6340dc790f772b3d433ce1c371d5c5f5de
46f1a68bdf8113f50e779d8158203a4e813b6340dc790f772b3d433ce1c371d5c5f5de46f1a68bdf
8113f50e779d80f6
```

#### 위임 인증 서약 생성하기

서약을 지키려면 _위임 인증서_ 를 만드세요.

```sh
cardano-cli stake-address delegation-certificate \
    --stake-verification-key-file stake.vkey \
    --cold-verification-key-file cold.vkey \
    --out-file delegation.cert
```
이렇게 하면 `stake.vkey` 키와 관련된 모든 스테이크 주소의 자금 을 콜드 키(`cold.vkey`)에 속하는 풀로 위임하는 위임 인증서가 생성 됩니다. 첫 번째 단계에서 풀 소유자가 많아 여러 스테이킹 키가 있는 경우, 모든 키에 대한 위임 인증서가 필요합니다.

#### 풀 인증서 및 위임 인증서를 블록체인에 제출하기

`pool registration certificate`와 `delegation certificates`를 하나 이상의 트랜잭션에 포함하여 블록체인에 제출합니다. 여러 인증서에 대해 하나의 트랜잭션을 사용할 수 있으며 인증서는 순서대로 적용됩니다.

#### 트랜잭션 초안 만들기

```sh
cardano-cli transaction build-raw \
    --tx-in <TxHash>#<TxIx> \
    --tx-out $(cat payment.addr)+0 \
    --invalid-hereafter 0 \
    --fee 0 \
    --out-file tx.draft \
    --certificate-file pool-registration.cert \
    --certificate-file delegation.cert
```

#### 수수료 계산하기

```sh
cardano-cli transaction calculate-min-fee \
    --tx-body-file tx.draft \
    --tx-in-count 1 \
    --tx-out-count 1 \
    --witness-count 3 \
    --byron-witness-count 0 \
    --mainnet \
    --protocol-params-file protocol.json
```

예를 들면:

```sh
> 184685
```
스테이크 풀을 등록하려면 보증금이 필요합니다. 이 금액은 `protocol.json`에 지정되어 있습니다. 예를 들어 Shelley Mainnet의 경우 다음과 같습니다.

```json
"poolDeposit": 500000000
```

#### --tx-out에 대한 거스름돈 계산하기

모든 금액은 Lovelace로 표현되었습니다.

```sh
expr <UTxO BALANCE> - <poolDeposit> - <TRANSACTION FEE>
```

#### 트랜잭션 빌드하기

```sh
cardano-cli transaction build-raw \
    --tx-in <TxHash>#<TxIx> \
    --tx-out $(cat payment.addr)+<CHANGE IN LOVELACE> \
    --invalid-hereafter <TTL> \
    --fee <TRANSACTION FEE> \
    --out-file tx.raw \
    --certificate-file pool-registration.cert \
    --certificate-file delegation.cert
```

#### 트랜잭션 서명하기

```sh
cardano-cli transaction sign \
    --tx-body-file tx.raw \
    --signing-key-file payment.skey \
    --signing-key-file stake.skey \
    --signing-key-file cold.skey \
    --mainnet \
    --out-file tx.signed
```

#### 트랜잭션 제출하기

```sh
cardano-cli transaction submit \
    --tx-file tx.signed \
    --mainnet
```

#### 스테이크 풀 등록이 성공적으로 완료되었는지 확인하기 

Pool ID 얻기

```sh
cardano-cli stake-pool id --cold-verification-key-file cold.vkey --output-format "hex"
```

다음을 사용하여 네트워크 렛저 상태에 poolID가 있는지 확인합니다.

```sh
cardano-cli query ledger-state --mainnet | grep publicKey | grep <poolId>
```

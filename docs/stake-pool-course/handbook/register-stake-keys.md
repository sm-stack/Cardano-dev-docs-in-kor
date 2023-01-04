---
id: register-stake-keys
title: 블록체인에 스테이크 주소 등록하기
sidebar_label: 스테이크 주소 등록하기
description: "Stake pool course: Learn how to create stake pool keys."
image: ../img/og/og-developer-portal.png
---

스테이크 주소는 블록체인에 등록해야 유용합니다. 키를 등록하려면 다음이 필요합니다.

* 등록 인증서를 만듭니다.
* 트랜잭션과 함께 인증서를 블록체인에 제출합니다.

## 등록 인증서 생성하기

```sh
cardano-cli stake-address registration-certificate \
    --stake-verification-key-file stake.vkey \
    --out-file stake.cert
```

## 트랜잭션 및 입금을 지불하는 주소의 UTXO 쿼리하기 


```sh
cardano-cli query utxo \
    --address $(cat payment.addr) \
    --mainnet
```

    >                            TxHash                                 TxIx      Amount
    > ----------------------------------------------------------------------------------------
    > b64ae44e1195b04663ab863b62337e626c65b0c9855a9fbb9ef4458f81a6f5ee     1      1000000000 lovelace


## 트랜잭션 초안 만들기 및 수수료 계산하기(더 이상 여러 단계로 수행할 필요가 없음)
트랜잭션의 경우 --tx.out은 대략 1 ADA보다 더 커야 합니다. 또한, --invalid-hereafter는 현재 슬롯보다 앞서 닫기로 설정해야 합니다. 
첫 번째: 현재 슬롯 번호를 다시 쿼리하여 --invalid-hereafter에 추가합니다.


```sh
cardano-cli query tip --mainnet
```

```sh
cardano-cli transaction build \
    --alonzo-era \
    --tx-in b64ae44e1195b04663ab863b62337e626c65b0c9855a9fbb9ef4458f81a6f5ee#1 \
    --tx-out $(cat payment.addr)+1000000 \
    --change-address $(cat payment.addr) \
    --mainnet  \
    --out-file tx.raw \
    --certificate-file stake.cert \
    --invalid-hereafter 987654 \
    --witness-override 2
```
결과는 lovelace 형태로 표현된 트랜잭션 수수료입니다.

    > 171485

스테이크 주소를 등록하는 것은 트랜잭션 수수료를 지불하는 기능뿐만 아니라 프로토콜 매개변수에 명시된 대로 _보증금_(키 등록 취소 시 돌려받음)도 지불하는 역할을 합니다.

보증 금액은 `stakeAddressDeposit` 내 `protocol.json` 에서 찾을 수 있습니다.
예를 들어 Shelley Mainnet에서는
```json
"stakeAddressDeposit": 2000000,
```
## (선택사항): 거스름돈을 계산하고 지불 주소로 보내기

위에서 준비한 대로 트랜잭션을 유지하고 최소 1 ADA(1000000 Lovelace)를 payment.addr로 보내면 payment.addr에서 2개의 utxos가 생성되거나 하의 payment.addr에서 하나의 utxo만 생성되도록 정확한 금액을 계산할 수 있습니다. 귀됩니다(거스름돈 없음).

    expr 1000000000 - 171485 - 2000000

    > 997828515

따라서 위 식을 계산한 다음, 위에서 설명한 대로 트랜잭션을 다시 빌드해야 하고 tx-out 매개변수에서 계산된 결과를 추가해야 합니다.

```sh
cardano-cli transaction build \
    --alonzo-era \
    --tx-in b64ae44e1195b04663ab863b62337e626c65b0c9855a9fbb9ef4458f81a6f5ee#1 \
    --tx-out $(cat payment.addr)+997828515 \
    --change-address $(cat payment.addr) \
    --mainnet  \
    --out-file tx.raw \
    --certificate-file stake.cert \
    --invalid-hereafter 987654 \
    --witness-override 2
```

## 트랜잭션과 함께 인증서 제출

다음과 같이 서명하세요.

```sh
cardano-cli transaction sign \
    --tx-body-file tx.raw \
    --signing-key-file payment.skey \
    --signing-key-file stake.skey \
    --mainnet \
    --out-file tx.signed
```

그런 다음 제출하면 됩니다.

```sh
cardano-cli transaction submit \
    --tx-file tx.signed \
    --mainnet
```

이제 블록체인에 스테이크 키가 등록되었습니다.

:::note
`--mainnet`은 Cardano 메인넷을 의미하기 때문에, 테스트넷을 위해서는 `--testnet-magic 1097911063`을 사용합니다.
:::

---
id: create-simple-transaction
title: 단순한 트랜잭션 생성
sidebar_label: 단순한 트랜잭션 생성
description: "Stake pool course: Learn how to create simple transaction."
image: ../img/og/og-developer-portal.png
---

트랜잭션 생성에는 다양한 단계가 필요합니다.

* 프로토콜 매개변수 가져오기
* 수수료 계산
* 트랜잭션의 TTL(time-to-live) 정의
* 트랜잭션 구축
* 트랜잭션에 서명
* 트랜잭션 제출

## 프로토콜 매개변수 가져오기

프로토콜 매개변수를 가져오고 다음을 사용하여 `protocol.json`에 저장합니다

```sh
cardano-cli query protocol-parameters \
    --mainnet \
    --out-file protocol.json
```

## 사용할 UTXO 의 트랜잭션 해시 및 인덱스 가져오기

```sh
cardano-cli query utxo \
    --address $(cat payment.addr) \
    --mainnet
```

## 트랜잭션 초안 만들기

트랜잭션 초안을 생성하고 tx.draft에 저장합니다.

:::note
`--tx-in`에 대해 다음과 같은 문법을 사용합니다: `TxHash#TxIx`(`TxHash`는 트랜잭션 해시, `TxIx`는 트랜잭션 인덱스); `--tx-out`에 대해 다음 문법을 사용합니다: `TxOut+Lovelace` (`TxOut`는 16진수로 인코딩된 주소, 뒤에 오는 것은 `Lovelace`로 표현된 금액). 트랜잭션 초안의 경우 --tx-out, --invalid-hereafter 그리고 --fee는 0으로 설정해도 됩니다.
:::note

```sh
cardano-cli transaction build-raw \
    --tx-in 4e3a6e7fdcb0d0efa17bf79c13aed2b4cb9baf37fb1aa2e39553d5bd720c5c99#4 \
    --tx-out $(cat payment2.addr)+0 \
    --tx-out $(cat payment.addr)+0 \
    --invalid-hereafter 0 \
    --fee 0 \
    --out-file tx.draft
```

## 수수료 계산

간단한 트랜잭션에는 하나의 입력, `payment.addr`로부터의 유효한 UTXO payment.addr및 두 개의 출력이 필요합니다.

* Output1: 트랜잭션을 받는 주소.
* Output2: 트랜잭션의 변경 사항을 받는 주소.

수수료를 계산하려면 트랜잭션 초안을 포함해야 합니다.

```sh
cardano-cli transaction calculate-min-fee \
    --tx-body-file tx.draft \
    --tx-in-count 1 \
    --tx-out-count 2 \
    --witness-count 1 \
    --byron-witness-count 0 \
    --mainnet \
    --protocol-params-file protocol.json
```

## payment.addr로 다시 보낼 거스름돈 계산

모든 금액은 Lovelace로 표현되어야 합니다.

    expr <UTXO BALANCE> - <AMOUNT TO SEND> - <TRANSACTION FEE>

예를 들어, 20개의 ada가 포함된 UTxO에서 10개의 ada를 보낸 경우 수수료를 지불한 후 다시 `payment.addr`에 보낼 거스름돈은 9.832035 ada입니다.

```sh
expr 20000000 - 10000000 - 167965
9832035
```

## 트랜잭션의 의 TTL(Time to Live) 결정하기

트랜잭션을 구축하려면 **TTL (Time to live)**를 지정해야 합니다. 이는 트랜잭션이 블록에 포함될 슬롯 높이 제한입니다. 해당 슬롯에 의해 블록에 없으면 트랜잭션이 취소됩니다. 즉 TTL = 슬롯 + N 슬롯의 형태입니다. 여기서 N은 트랜잭션에 블록에 포함될 범위를 제공하기 위해 추가하려는 슬롯의 양입니다.

블록체인 팁을 쿼리합니다.

```sh
cardano-cli query tip --mainnet
```

`slotNo`의 값을 찾습니다.

```json
    {
        "blockNo": 16829,
        "headerHash": "3e6f59b10d605e7f59ba8383cb0ddcd42480ddcc0a85d41bad1e4648eb5465ad",
        "slotNo": 369200
    }
```

TTL을 계산하세요. 예를 들면, 369200 + 200 슬롯 = 369400 와 같습니다.

## 트랜잭션 구축하기

트랜잭션을 파일에 작성하고 `tx.raw`라고 이름을 지정합니다.

```sh
cardano-cli transaction build-raw \
    --tx-in 4e3a6e7fdcb0d0efa17bf79c13aed2b4cb9baf37fb1aa2e39553d5bd720c5c99#4 \
    --tx-out $(cat payment2.addr)+10000000 \
    --tx-out $(cat payment.addr)+9832035 \
    --invalid-hereafter 369400 \
    --fee 167965 \
    --out-file tx.raw
```

## 트랜잭션 서명하기

서명 키 payment.skey 로 트랜잭션에 서명하고 서명된 트랜잭션을 tx.signed 에 저장합니다.

```sh
cardano-cli transaction sign \
    --tx-body-file tx.raw \
    --signing-key-file payment.skey \
    --mainnet \
    --out-file tx.signed
```

## 트랜잭션 제출하기

```sh
cardano-cli transaction submit \
    --tx-file tx.signed \
    --mainnet
```

## 잔고 확인하기

우리는 이 트랜잭션에 블록체인에 통합될 때까지 약간의 시간을 기다려야 합니다. 

```sh
cardano-cli query utxo \
    --address $(cat payment.addr) \
    --mainnet

    >                            TxHash                                 TxIx         Amount
    > ----------------------------------------------------------------------------------------
    > b64ae44e1195b04663ab863b62337e626c65b0c9855a9fbb9ef4458f81a6f5ee     1         9832035 lovelace
```

```sh
cardano-cli query utxo \
    --address $(cat payment2.addr) \
    --mainnet

    >                            TxHash                                 TxIx         Amount
    > ----------------------------------------------------------------------------------------
    > b64ae44e1195b04663ab863b62337e626c65b0c9855a9fbb9ef4458f81a6f5ee     0         10000000 lovelace
```

:::note
`--mainnet` 은 메인넷을 가리키므로, 테스트넷에 대해서는  `--testnet-magic 1097911063`를 사용합니다.
:::note

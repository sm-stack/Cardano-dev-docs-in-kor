---
id: keys-addresses
title: 키 및 주소 생성
sidebar_label: 키 및 주소 생성
description: "Stake pool course: Creating keys and addresses."
image: ../img/og-developer-portal.png
---

Cardano의 Shelley 시대에 모든 주주는 두 세트의 키와 주소를 가질 수 있습니다.

* 거래를 보내고 받기 위한 지불 키 및 주소 
* 프로토콜 참여를 위해 스테이크 풀을 만들고 위임하여 보상을 받기 위한 스테이크 키 및 주소

:::note
`--mainnet`은 Cardano 메인넷을 의미하기 때문에, 테스트넷을 위해서는 `--testnet-magic 1097911063`을 사용합니다.
:::

## 지불 키 쌍

지불 키 쌍을 생성하려면:

```sh
cardano-cli address key-gen \
    --verification-key-file payment.vkey \
    --signing-key-file payment.skey
```
이렇게 하면 두 개의 파일 `payment.vkey`(_공개 검증 키_)과 `payment.skey`(_개인 서명 키_)가 생성됩니다. 

## 스테이크 키 쌍

스테이크 키 쌍 을 생성하려면 :

```sh
cardano-cli stake-address key-gen \
    --verification-key-file stake.vkey \
    --signing-key-file stake.skey
```
## 지불 주소
두 검증 키 (`payment.vkey` 와 `stake.vkey`)는 주소를 구축하는 데 사용되며, 이 두 키와 연결된 `payment address`가 생성됩니다. 

```sh
cardano-cli address build \
    --payment-verification-key-file payment.vkey \
    --stake-verification-key-file stake.vkey \
    --out-file payment.addr \
    --mainnet
```

## 스테이크 주소

`stake address`를 생성하려면:

```sh
cardano-cli stake-address build \
    --stake-verification-key-file stake.vkey \
    --out-file stake.addr \
    --mainnet
```
이 주소는 지불을 받을 수 **없지만**, 프로토콜 참여에 대한 보상을 받을 것입니다.


## 주소 잔액 조회

:::note
노드가 [explorer.cardano.org](https://explorer.cardano.org)에서 확인할 수 있는 현재 블록 높이와 동기화되었는지 확인하십시오. 그렇지 않은 경우 Byron 시대를 언급하는 오류가 표시될 수 있습니다.
:::

주소의 잔액을 쿼리하려면 실행 중인 노드와 node.socket의 경로로 설정된 환경 변수 `CARDANO_NODE_SOCKET_PATH`가 필요합니다.

```sh
cardano-cli query utxo \
    --address $(cat payment.addr) \
    --mainnet
```

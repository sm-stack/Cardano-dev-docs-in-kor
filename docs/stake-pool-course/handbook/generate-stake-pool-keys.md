---
id: generate-stake-pool-keys
title: 스테이크 풀 키 생성
sidebar_label: 스테이크 풀 키 생성
description: "Stake pool course: Generate stake pool keys."
image: ../img/og/og-developer-portal.png
---

## 스테이크 키 쌍

_스테이크 키 쌍_ 을 생성해보겠습니다.

```sh
cardano-cli stake-address key-gen \
    --verification-key-file stake.vkey \
    --signing-key-file stake.skey
```

## 스테이크 주소

마지막으로 스테이크 주소를 만들 수 있습니다. 이 주소는 지불을 받을 수 없지만 프로토콜 참여에 대한 보상을 받을 수 있습니다. 이 주소는 `stake.addr` 파일에 저장하도록 하겠습니다.


```sh
cardano-cli stake-address build \
    --stake-verification-key-file stake.vkey \
    --out-file stake.addr \
    --testnet-magic 1097911063
```

이렇게 하면 stake.addr 파일이 생성됩니다. 내용을 확인하겠습니다.

```sh
cat stake.addr
> stake_test1ur975g2x22jllzjxnekvqj5d0thdut0aydz8ydwy4pvtg3gy0s7xn
```

## 지불 주소 재생성

이제 스테이크 주소가 생겼으니 지불 주소를 다시 생성할 차례입니다. 이번에는 스테이크 검증 키와 지불 검증 키를 모두 사용하여 주소를 구축합니다. 이를 통해 두 주소가 서로 연결됩니다.

```sh
cardano-cli address build \
    --payment-verification-key-file payment.vkey \
    --stake-verification-key-file stake.vkey \
    --out-file paymentwithstake.addr \
    --testnet-magic 1097911063
```

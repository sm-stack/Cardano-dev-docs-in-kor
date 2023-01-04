---
id: multi-witness-transactions-cli
title: 다중 증인 트랜잭션
sidebar_label: 다중 증인 트랜잭션
description: This article explains how you can create multi witness transactions using the cardano-cli.
image: ../img/og/og-developer-portal.png
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 개요

:::note

이 가이드는 당신이 [Cardano 지갑 알아보기](/docs/integrate-cardano/creating-wallet-faucet) 가이드를 완료했다고 가정하고 진행합니다. 이 가이드를 완료하려면, 각 지갑(`payment1.addr`과 `payment2.addr`)에 하나의 UTxO가 있어야 합니다.

또한 이 가이드는 `cardano-node`가 백그라운드에서 돌아가면서, `testnet` 네트워크에 연결되어 있는 상황을 가정합니다.

:::

### 요약

지금까지 수행한 작업을 요약해 보겠습니다. [이전 가이드](/docs/integrate-cardano/creating-wallet-faucet)에서 우리의 목표는 테스트넷 faucet에서 `1000 tAda`를 받은 다음 **payment1**에서 **payment2**로 `250 tAda`를 보내는 것이었습니다.

올바른 폴더에 위치해 있는지 확인하세요.

```bash
$ pwd
$HOME/cardano
```

<Tabs
  defaultValue="query"
  groupId="step"
  values={[
    {label: 'UTxO 쿼리', value: 'query'},
    {label: '수수료 계산', value: 'calc'},
    {label: 'Tx 빌드', value: 'build'},
    {label: 'Tx 서명 & 제출', value: 'sign'},
    {label: 'Tx 검증', value: 'verify'}
  ]}>

  <TabItem value="query">

Testnet Faucet에서 우리의 **payment1** 지갑으로 `1000 tAda`를 인출하였습니다.

```bash
$ cardano-cli query utxo \
--testnet-magic 1097911063 \
--address $(cat keys/payment1.addr)
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
264c0aa805652e3607c5ea2b1e8a9f3bf9c3bc8d4d938e1a9035f352083ba703     0        1000000000 lovelace
```

  </TabItem>
  <TabItem value="calc">

`protocol-parameters`를 사용하여 트랜잭션 초안을 작성하고 예상 수수료를 계산하였습니다.

```bash
$ cardano-cli query protocol-parameters \
--testnet-magic 1097911063 \
--out-file protocol.json
```

```bash
$ cardano-cli transaction build-raw \
--tx-in 264c0aa805652e3607c5ea2b1e8a9f3bf9c3bc8d4d938e1a9035f352083ba703#0 \
--tx-out $(cat keys/payment2.addr)+0 \
--tx-out $(cat keys/payment1.addr)+0 \
--fee 0 \
--out-file tx.draft
```

```bash {8}
$ cardano-cli transaction calculate-min-fee \
--tx-body-file tx.draft \
--tx-in-count 1 \
--tx-out-count 2 \
--witness-count 1 \
--testnet-magic 1097911063 \
--protocol-params-file protocol.json
174169 Lovelace
```

  </TabItem>
  <TabItem value="build">

`174169 Lovelace`의 예상 수수료부터, 출력을 계산하고 트랜잭션을 빌드할 수 있었습니다.

```bash {3,4,5}
cardano-cli transaction build-raw \
--tx-in 264c0aa805652e3607c5ea2b1e8a9f3bf9c3bc8d4d938e1a9035f352083ba703#0 \
--tx-out $(cat keys/payment2.addr)+250000000 \
--tx-out $(cat keys/payment1.addr)+749825831 \
--fee 174169 \
--out-file tx.draft
```

:::note

수수료는 각각 다를 수 있으므로, 금액에도 차이가 있을 수 있습니다.

:::

  </TabItem>
  <TabItem value="sign">

`payment1.skey`를 사용하여 트랜잭션에 서명하고, 블록체인에 제출하였습니다.

```bash {3,10}
cardano-cli transaction sign \
--tx-body-file tx.draft \
--signing-key-file keys/payment1.skey \
--testnet-magic 1097911063 \
--out-file tx.signed

cardano-cli transaction submit \
--tx-file cardano/tx.signed \
--testnet-magic 1097911063
Transaction successfully submitted.
```

  </TabItem>
  <TabItem value="verify">

마지막으로 **payment1** 및 **payment2** 지갑을 쿼리하여 트랜잭션을 확인하였습니다.

```bash
$ cardano-cli query utxo \
--testnet-magic 1097911063 \
--address $(cat keys/payment1.addr)
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
b73b7503576412219241731230b5b7dd3b64eed62ccfc3ce69eb86822f1db251     1        749825831 lovelace
```

```bash
$ cardano-cli query utxo \
--testnet-magic 1097911063 \
--address $(cat payment2.addr)
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
b73b7503576412219241731230b5b7dd3b64eed62ccfc3ce69eb86822f1db251     0        250000000 lovelace
```

  </TabItem>
</Tabs>

현재 **payment1** 지갑에는 `749.825831 tAda`가 있고, **payment2** 지갑에는 `250 tAda`가 있습니다.

이를 한 번에 어떻게 쓸 수 있는지 봅시다!

## 사용 사례

단일 트랜잭션에서 여러 지갑이 ADA를 전송하도록 하려는 데에는 여러 가지 이유가 있습니다. 그 중 하나는 두 개의 지갑(**payment1**과 **payment2**)을 소유하고 있는 상태에서, 이를 다음과 같은 경우 사용할 때입니다.

* 두 개의 지갑 각각의 잔고보다는 비용이 많이 들지만,
* **두 금액을 합하면** 비용이 충당되는 경우입니다.

당신이 **자전거 매장**에 있는데, `1100 tAda`라는 가격표가 붙은 멋진 자전거를 보았다고 가정해 봅시다. 그런데 당신은 `999 tAda` (거스름돈 포함)만 남은 상태입니다.

*사악한 블록체인 애호가*인 자전거 가게 주인은 당신이 **단 한번에 거래로 결제를 할 수 있다면** 기꺼이 10% 할인을 제공할 것입니다.

> *거스름돈이 없어야 하네!*  --자전거 가게 주인

따라서 우리는 단일 트랜잭션 내에 두 지갑에 있는 모든 `tAda`를 사용해야 합니다.

:::note

그는 트랜잭션에 하나 이상의 출력이 있는지 확인한 다음, 모든 돈을 썼는지 여부를 쉽게 확인할 수 있습니다.

지출 금액을 최적화하는 방법도 있습니다. 우리는 이를 당신이 스스로 알아낼 수 있도록 남겨둘 것입니다.

:::

## 기술 흐름

이 시나리오는 매우 간단하며, 다음과 같습니다.

![img](../../static/img/integrate-cardano/multi-witness-transaction.png "Multi witness flow")

위 다이어그램에서 볼 수 있듯이, *두 개의 입력* 과 *하나의 출력* 이 있는 **다중 증인 트랜잭션**을 빌드하고 제출합니다. 

:::note

`cardano-wallet`이나 Daedalus 또는 Yoroi 같은 다른 지갑으로는 이를 할 수 없습니다. 트랜잭션 서명을 위해 **payment1**와 **payment2**로부터의 `signing-keys`가 둘 다 필요하기 때문입니다.

:::

## 코딩 시간

:::note

위에서 언급한 바와 같이, 위 가이드는 귀하가 [Cardano 지갑 알아보기](/docs/integrate-cardano/creating-wallet-faucet) 가이드를 완료했다고 가정합니다.<br />
또한 귀하가 트랜잭션 수수료를 `174169 Lovelace` 만큼 지불한 상태이며, 현재 잔액이 다음과 같다고 가정합니다.

* **payment1**: `749825831 Lovelace`
* **payment2**: `250000000 Lovelace`

:::

### 가게 주인 지갑 생성하기

이 가이드에 사용할 세 번째 지갑이 아직 없다면, 모든 자금을 이체할 수 있는 지갑을 만들어 봅시다.

현재 `keys` 디렉토리 내에 위치해 있는지 확인해 보십시오: `cd $HOME/cardano/keys`

`cardano-cli`를 통해 **지불 키 쌍**을 생성합니다.

```bash
cardano-cli address key-gen \
--verification-key-file $HOME/cardano/keys/store-owner.vkey \
--signing-key-file $HOME/cardano/keys/store-owner.skey
```

그런 다음 `testnet` 네트워크에서 **지갑 주소**를 생성합니다.

```bash
cardano-cli address build \
--payment-verification-key-file $HOME/cardano/keys/store-owner.vkey \
--out-file $HOME/cardano/keys/store-owner.addr \
--testnet-magic 1097911063
```

`keys` 디렉토리를 확인했을 때, 다음과 같아야 합니다.

```bash
$HOME/cardano/keys/
├── payment1.addr
├── payment1.skey
├── payment1.vkey
├── payment2.addr
├── payment2.skey
├── payment2.vkey
├── store-owner.addr
├── store-owner.skey
└── store-owner.vkey

0 directories, 9 files
```

### 트랜잭션 수수료 계산

이 가이드에 대한 트랜잭션을 저장할 디렉토리를 생성하고 다음과 같이 입력해보겠습니다.

```bash
mkdir -p $HOME/cardano/multi-witness-sample && cd $_;
```
[이전](#요약)에서 검증한 두 개의 UTxO에 있는 **모든 tAda**를 `store-owner.addr`로 보내고 싶은 상태입니다. 이는, **두 개의 입력**이 필요하다는 것을 의미합니다.

출력은 어떨까요? *사악한 가게 주인* 은 우리가 모든 것을 소비하길 원하므로, **가게 주인에게는 하나의 출력**이 있고, **우리에게는 출력이 없을** 것입니다. *"...거스름돈은 없다!"* 를 기억하시나요?

트랜잭션을 빌드해봅시다.

```bash
cardano-cli transaction build-raw \
--tx-in b73b7503576412219241731230b5b7dd3b64eed62ccfc3ce69eb86822f1db251#0 \
--tx-in b73b7503576412219241731230b5b7dd3b64eed62ccfc3ce69eb86822f1db251#1 \
--tx-out $(cat ../keys/store-owner.addr)+0 \
--fee 0 \
--out-file tx2.draft
```

마지막으로 해야 할 일은 `tx2.draft`에 대한 수수료를 계산하는 것입니다. `--tx-in-count` 와 `--witness-count`에 주목하세요.

```bash {3,4,5,8}
cardano-cli transaction calculate-min-fee \
--tx-body-file tx2.draft \
--tx-in-count 2 \
--tx-out-count 1 \
--witness-count 2 \
--testnet-magic 1097911063 \
--protocol-params-file ../protocol.json 
179581 Lovelace
```

트랜잭션 중 두 UTxO가 모두 사용된 경우 **가게 주인**이 받을 금액을 계산할 수 있습니다.

```text
  749825831 (payment1)
+ 250000000 (payment2)
  ---------
  999825831
-    179581 (fee)
  ---------
  999646250 (store-owner)
  =========
```

### 트랜잭션 빌드, 서명 및 제출

우리는 *출력 금액* 과 *수수료* 를 알고 있습니다. 이를 통해 우리는 `tx2.draft` 트랜잭션을 작성, 서명 및 제출할 수 있습니다.

트랜잭션 서명을 위해 `payment1.skey`와 `payment2.skey`를 사용하겠습니다.

```bash {10,11,18}
cardano-cli transaction build-raw \
--tx-in b73b7503576412219241731230b5b7dd3b64eed62ccfc3ce69eb86822f1db251#0 \
--tx-in b73b7503576412219241731230b5b7dd3b64eed62ccfc3ce69eb86822f1db251#1 \
--tx-out $(cat ../keys/store-owner.addr)+999646250 \
--fee 179581 \
--out-file tx2.draft 

cardano-cli transaction sign \
--tx-body-file tx2.draft \
--signing-key-file ../keys/payment1.skey \
--signing-key-file ../keys/payment2.skey \
--testnet-magic 1097911063 \
--out-file tx2.signed

cardano-cli transaction submit \
--tx-file tx2.signed \
--testnet-magic 1097911063
Transaction successfully submitted
```

### 다중 증인 트랜잭션 검증

사악한 가게 주인은 이제 모든 것이 자신의 계획대로 진행되었는지 확인할 것입니다.

```bash
cardano-cli query utxo \
--testnet-magic 1097911063 \
--address $(cat $HOME/cardano/keys/store-owner.addr)
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
258abd628eef7d6ff0f7b4e6866b4f7c21065f4d6b5e49b51e2ac4ff035ad06f     0        999646250 lovelace
```

Cardano 테스트넷 익스플로러에서 [258abd628eef7d6ff0f7b4e6866b4f7c21065f4d6b5e49b51e2ac4ff035ad06f](https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=258abd628eef7d6ff0f7b4e6866b4f7c21065f4d6b5e49b51e2ac4ff035ad06f)를 확인하세요.

:::tip Success!

그는 트랜잭션이 그의 지갑에 대해 하나의 출력을 가지고 있음을 볼 수 있습니다. 다른 출력이 없으므로, 모든 `tAda`를 소모했다는 것을 의미합니다.

:::

축하합니다! 이제 **Cardano에서 다중 증인 트랜잭션을 제출**할 수 있습니다. 이는 기존 혹은 새로운 어플리케이션에 통합하는 작업에 큰 도움이 될 것입니다. 🎉🎉🎉

<!-- ## Compare fees

We had to pay `179581 Lovelace` to get all of our funds from A+B to C. Let's compare with the fees we would have payed had we used two transactions.

For that we draft two transactions

```sh
cardano-cli transaction build-raw \
--tx-in 258abd628eef7d6ff0f7b4e6866b4f7c21065f4d6b5e49b51e2ac4ff035ad06f#0 \
--tx-out $(cat $HOME/cardano/keys/payment1.addr)+0 \
--fee 0 \
--out-file $HOME/cardano/multi-witness-sample/tx-single1.draft

cardano-cli transaction build-raw \
--tx-in 258abd628eef7d6ff0f7b4e6866b4f7c21065f4d6b5e49b51e2ac4ff035ad06f#0 \
--tx-out $(cat $HOME/cardano/keys/payment2.addr)+0 \
--fee 0 \
--out-file $HOME/cardano/multi-witness-sample/tx-single2.draft
```

And invoke the calculate-min-fees endpoint on `cardano-cli` for both of them:

```bash {8,17}
cardano-cli transaction calculate-min-fee \
--tx-body-file $HOME/cardano/multi-witness-sample/tx-single1.draft \
--tx-in-count 1 \
--tx-out-count 1 \
--witness-count 1 \
--testnet-magic 1097911063 \
--protocol-params-file $HOME/cardano/protocol.json 
169857 Lovelace

cardano-cli transaction calculate-min-fee \
--tx-body-file $HOME/cardano/multi-witness-sample/tx-single2.draft \
--tx-in-count 1 \
--tx-out-count 1 \
--witness-count 1 \
--testnet-magic 1097911063 \
--protocol-params-file $HOME/cardano/protocol.json 
169857 Lovelace
```

We would have to have payed `329714 Lovelace`. Another good reason not to use two transactions. -->

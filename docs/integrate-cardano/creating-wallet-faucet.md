---
id: creating-wallet-faucet
title: Cardano 지갑 알아보기
sidebar_label: Cardano 지갑 알아보기
description: This article explains how you can create different kinds of Cardano Wallets and how you can recieve some tAda(test ada) from the faucet.
image: ../img/og/og-developer-portal.png
--- 

### 개요

이 가이드에선, **Cardano** 지갑을 생성하는 방법, `testnet` 네트워크에서 `tAda` (**test ada**)를 받는 방법 및 기본적인 트랜잭션을 보내는 방법을 알아볼 것입니다. 이를 위해 `cardano-cli` 나 `cardano-wallet` 와 같은 도구들이 어떻게 작동하는지에 대해서도 살펴볼 예정입니다.

:::note
이 가이드는 이미 `cardano-node` 와 `cardano-cli`를 설치한 사람을 대상으로 합니다. 만약 설치되어 있지 않다면, [cardano-node 설치하기](/docs/get-started/installing-cardano-node)를 확인하고 설치를 진행하십시오.

또한 당신의 `cardano-node` 를 `testnet` 네트워크에 완전히 동기화시키는 것도 잊지 마십시오.

만약 이를 어떻게 하는지 모르겠다면, [Cardano 노드 실행 방법](/docs/get-started/running-cardano)을 읽어보시는 것을 추천드립니다.
:::

### Cardano 지갑 

`cardano-node`를 설치하고 작동하는 것을 확인했다면, 아마 간단한 블록체인 데이터를 쿼리하는 것까지도 해보셨을 것입니다 (만약 [Cardano 노드 실행 방법](/docs/get-started/running-cardano)를 읽어보셨다면). 그런데 실제로 **Cardano** 지갑을 만들고, `Ada` 나 `tAda` 토큰을 받고 전송하는 것은 어떻게 할까요?

우선 지갑 생성에 사용할 어플리케이션들부터 살펴보겠습니다.

- [Daedalus](https://daedaluswallet.io/) : **Daedalus 지갑**은 **Cardano** 공식 풀노드 지갑으로, 데스크탑(**Linux**, **MacOS**, **Windows**)을 위한 [GUI (Graphical User Interface)](https://en.wikipedia.org/wiki/Graphical_user_interface) 어플리케이션입니다. 이는 사용자로 하여금 좋은 UI(유저 인터페이스), 버튼 및 레이아웃을 통해 **Cardano** 블록체인과 상호작용할 수 있다는 것을 의미합니다.

    풀노드 지갑은 기본적으로 사용자가 지갑에서 트랜잭션을 보내고 상호작용하기 전에 블록체인과 동기화하고 정보를 다운받아야 함을 의미합니다.
    
    이는 **Cardano** 프로토콜 뒤에 있는 개발사이자 **Cardano** 프로젝트 내 세 개의 주축 중 하나인 [InputOutputGlobal](https://iohk.io/)에 의해 개발된 오픈소스 프로젝트입니다.

- [Yoroi](https://yoroi-wallet.com/#/) : **Yoroi 지갑** 은 **Cardano** 공식 라이트 지갑으로, **모바일 어플리케이션**과 **브라우저 익스텐션** 두 가지 버전 모두 사용가능합니다.
  
  라이트 지갑은 사용자가 전체 블록체인을 다운받지 않아도 됨을 의미합니다. **Yoroi**에는 백엔드 서버가 있고, 사용자를 위해 서버에 블록체인 데이터를 다운받습니다. 이 과정에서 사용자의 민감한 정보(**개인 키**)는 서버에 노출되지 않고, 보안이 보장됩니다. 이를 통해 사용자가 지갑 사용을 위해 몇 시간을 기다리지 않아도 되기 때문에, 더 나은 사용자 경험을 제공합니다.

  이는 **Cardano** 블록체인의 비즈니스와 기업 도입에 집중하는 일본 기업인 [Emurgo](https://emurgo.io)에 의해 개발된 오픈소스 프로젝트입니다. 해당 회사도 **Cardano** 프로젝트의 세 가지 주축 중 하나입니다.

- [cardano-wallet](https://github.com/input-output-hk/cardano-wallet) : `cardano-wallet` 은 명령줄 매개변수 또는 [Web API](https://en.wikipedia.org/wiki/Web_API)의 형태로 **Cardano** 지갑의 기능을 제공하는 [CLI (Command Line Interface)](https://en.wikipedia.org/wiki/Command-line_interface) 어플리케이션입니다.

  이는 **Daedalus** 지갑이 내부적으로 사용하는 지갑 백엔드로서, 역시 [InputOutputGlobal](https://iohk.io/)에 의해 작성된 Haskell 기반 **Cardano** 소프트웨어 구성요소 중 하나입니다.

  [https://input-output-hk.github.io/cardano-wallet/api/edge/](https://input-output-hk.github.io/cardano-wallet/api/edge/)에서 `cardano-wallet` **REST API** 문서를 찾을 수 있습니다.

- [cardano-cli](https://github.com/input-output-hk/cardano-node) : `cardano-cli` 는 **Cardano** 지갑 기능을 제공하는 [CLI (Command Line Interface)](https://en.wikipedia.org/wiki/Command-line_interface) 어플리케이션이기도 합니다. 그러나 `cardano-cli`의 목적은 **키** 생성, **트랜잭션** 구축 및 제출, **스테이크 풀** 인증서 관리, 지갑 주소와 **UTXO** 등 간단한 블록체인 쿼리 등과 같은 일반적인 **Cardano** 기능에 더 맞춰져 있습니다.

    이는 `cardano-node` 프로젝트 레퍼지토리의 일부이므로, `cardano-node`를 [컴파일하고 설치](/docs/get-started/installing-cardano-node)하는 경우에도 `cardano-cli`가 있어야 합니다. 이도 역시 [InputOutputGlobal](https://iohk.io/)에 의해 작성된 Haskell 기반 **Cardano** 소프트웨어 구성요소 중 하나입니다

:::warning
항상 공식 소스에서 지갑을 다운로드하십시오. 잠재적으로 토큰/자산을 훔치려고 **Cardano** 지갑인 것처럼 가장한 악성 소프트웨어 및 가짜 지갑들이 많이 있습니다.
:::

### 지갑 생성

위에서 언급한 바와 같이, 이 가이드에서는 `cardano-cli` 와 `cardano-wallet`에만 초점을 맞출 것인데, 이 두 가지가 다양한 사용 사례에서 **Cardano** 통합에 대해 중요한 프로그래밍 가능성을 제공하기 때문입니다.

#### `cardano-cli`로 지갑 만들기

:::note
이 섹션에서는, 모든 `cardano-cli` 관련 파일을 `$HOME/cardano` 경로에 저장할 것입니다. 이를 반드시 파일 저장에 쓰이는 디렉토리로 바꾸십시오.
:::

:::important
계속하기 전에 `cardano-node`가 `testnet` 네트워크에 연결되어 동기화되었는지 확인하십시오.
:::

:::warning
프로덕션 환경에서 본인이 무엇을 하고 있는지 제대로 알지 못하는 상황이라면, 공개 서버에다가 지갑이나 키를 보관하는 것은 좋지 않을 수 있습니다.
:::

우선, 다음과 같이 모든 `keys`를 저장할 디렉토리를 만듭니다.

```bash
mkdir -p $HOME/cardano/keys
```

`cd $HOME/cardano/keys`를 통해 `keys` 디렉토리로 들어가세요.

그런 다음, `cardano-cli`를 사용해 **지불 키 쌍**을 생성합니다.

```bash
cardano-cli address key-gen \
--verification-key-file $HOME/cardano/keys/payment1.vkey \
--signing-key-file $HOME/cardano/keys/payment1.skey
```

`cardano-cli address key-gen` : **지불 키 쌍**을 생성하는 명령어 입니다.

`--verification-key-file` : `vkey` 파일을 저장할 경로를 가리킵니다.

`--signing-key-file` : `skey` 파일을 저장할 경로를 가리킵니다.

이제 `keys` 디렉토리에 다음과 같은 두 파일이 있어야 합니다.

```bash
$HOME/cardano/keys/
├── payment1.skey
└── payment1.vkey

0 directories, 2 files
```

이제 우리 주제와 관련된 높은 수준의 개요에서 이 키들이 사용된다는 것을 이해해보도록 합시다.

- `.vkey` / **공개 검증 키** : 이는 **Cardano** 지갑 주소를 유도하는 데에 사용합니다. 지갑 주소는 기본적으로 다른 사람들이 **Cardano** 블록체인에서 `ada` / `tAda`나 다른 자산들을 귀하의 지갑으로 전송하는 데 사용하는 해시 문자열 값입니다.

    **검증 키 파일은 다음과 같아야 합니다**:
    ```json
    {
        "type": "PaymentVerificationKeyShelley_ed25519",
        "description": "Payment Verification Key",
        "cborHex": "582056a29cba161c2a534adae32c4359fda6f90a3f6ae6990491237b28c1caeef0c4"
    }
    ```

- `.skey` / **개인 서명 키** : 이는 지갑에서 트랜잭션에 서명하고 승인하는 데에 사용됩니다. 당연히 해당 파일은 공개되지 않는 것이 매우 중요하며, 보안을 유지해야 합니다.

    **T서명 키 파일은 다음과 같아야 합니다**:
    ```json
    {
        "type": "PaymentSigningKeyShelley_ed25519",
        "description": "Payment Signing Key",
        "cborHex": "58208c61d557e1b8ddd82107fa506fab1b1565ec76fe96e8fb19a922d5460acd5a5b"
    }
    ```

이제 **지불 키 쌍**이 있으니, 다음 단계는 다음과 같이 `testnet` 네트워크의 **지갑 주소**를 생성하는 것입니다.

```bash
cardano-cli address build \
--payment-verification-key-file $HOME/cardano/keys/payment1.vkey \
--out-file $HOME/cardano/keys/payment1.addr \
--testnet-magic 1097911063
```

- `cardano-cli address build` : `vkey` 파일에서 **지갑 주소**를 생성합니다.

- `--payment-verification-key-file` : 키 유도에 사용되는 `vkey` 파일로의 경로입니다.

- `--out-file` : 지갑 주소 파일을 저장하는 경로입니다.

- `--testnet-magic` : 지갑 주소를 사용하려는 네트워크의 **NetworkMagic**입니다.

이제 `keys` 디렉토리에 `payment1.vkey`, `payment1.skey` 및 `payment1.addr`가 들어가 있을 것입니다. 이는 다음과 같은 모습을 갖춰야 합니다.

```bash
$HOME/cardano/keys/
├── payment1.addr
├── payment1.skey
└── payment1.vkey

0 directories, 3 files
```

`payment1.addr` 파일은 `vkey` 파일에서 유도된 **지갑 주소**를 포함하고 있습니다. 이는 다음과 같은 모습을 갖춰야 합니다.

```
addr_test1vz95zjvtwm9u9mc83uzsfj55tzwf99fgeyt3gmwm9gdw2xgwrvsa5
```

:::note
`cardano-addresses`를 사용해서 더 뛰어난 사용 사례를 위해 **공개 검증 키**로부터 한 개 이상의 **지갑 주소**를 유도할 수 있습니다. 자세한 사항은 향후에 업데이트할 예정입니다.

  - `mainnet` 주소는 `addr1`이라는 문자열이 앞에 붙어있습니다.
  - `testnet` 주소는 `addr_test1`이라는 문자열이 앞에 붙어있습니다. 

만약 `mainnet`에서 사용될 지갑 주소를 생성하려면, `--testnet-magic 1097911063` 대신 `--mainnet`를 사용하세요. [여기](/docs/get-started/running-cardano#mainnet--production)에서 **Cardano**의 여러 블록체인 네트워크에 대해 배울 수 있습니다.
:::

#### `cardano-cli`로 지갑 **UTXO (미사용 트랜잭션 출력)** 쿼리하기

이제 **지갑 주소**가 있으니, 다음과 같이 주소의 **UTXO**를 쿼리할 수 있습니다.

```bash
cardano-cli query utxo \
--testnet-magic 1097911063 \
--address $(cat $HOME/cardano/keys/payment1.addr)
```

- `cardano-cli query utxo` : 지갑 주소의 **UTXO**를 쿼리합니다.

- `--testnet-magic 1097911063` : 우리가 `testnet` **Cardano** 네트워크를 쿼리하고 싶다는 것을 특정하는 명령어입니다.

- `--address $(cat $HOME/cardano/keys/payment1.addr)` : 쿼리하고 싶은 **지갑 주소**의 문자열 값입니다. 이 경우 `cat` 명령어를 통해 `$HOME/cardano/keys/payment1.addr` 내 컨텐츠를 읽고, `--address`를 통해 해당 값을 보냅니다. 이는 다음과 같이 **지갑 주소**를 직접 붙여넣을 수 있다는 것을 의미합니다.
```
--address addr_test1vz95zjvtwm9u9mc83uzsfj55tzwf99fgeyt3gmwm9gdw2xgwrvsa5
```

다음과 같은 내용이 표시되어야 합니다.

```
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
```

여기서 명령을 반환한 결과값에 그다지 많은 정보가 있지 않다는 것에 이상함을 느낄 수 있지만, 이는 우리가 쿼리한 지갑이 새 지갑이기에 해당 주소에 사용가능한 **UTXO**가 없기 때문입니다.

다음 단계는 [Cardano Testnet Faucet](../integrate-cardano/testnet-faucet)에서 몇 개의 `tAda`를 요청하는 것입니다.

[Cardano Testnet Faucet](../integrate-cardano/testnet-faucet)에서 `tAda`를 요청하면, 쿼리를 다시 실행했을 때 다음과 같이 표시되어야 합니다.

```
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
cf3cf4850c8862f2d698b2ece926578b3815795c9e38d2f907280f02f577cf85     0        1000000000 lovelace
```

이 결과는 우리의 **지갑 주소**에 1,000,000,000 `lovelaces` 만큼의 **UTXO** 한 개가 있다는 것을 나타냅니다. 즉, 이 지갑에는 `1,000 tAda` 만큼의 잔고가 있는 것이죠.

또한 이 결과는 **UTXO** **트랜잭션 id** (`TxHash` / `TxId`)가 `cf3cf4850c8862f2d698b2ece926578b3815795c9e38d2f907280f02f577cf85`임을 나타냅니다. 여기서 **트랜잭션 인덱스**는 0입니다.

:::note
**Cardano** 블록체인에서, `lovelace`는 **트랜잭션**과 **UTXO**에서 `Ada`를 나타내는 단위입니다.

여기서 `1 Ada`는 `1,000,000 lovelace`과 같고, 앞으로 `Ada` / `tAda` 대신 `lovelace`를 사용할 것입니다.

또한 `TxHash`를 사용하여 **Cardano 블록체인 익스플로러**를 통해 완결된 트랜잭션을 확인할 수 있습니다. 예시 **UTXO**에 대한 트랜잭션은 다음 링크에서 확인할 수 있습니다: [f3cf4850c8862f2d698b2ece926578b3815795c9e38d2f907280f02f577cf85](https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=cf3cf4850c8862f2d698b2ece926578b3815795c9e38d2f907280f02f577cf85)

**UTXO (미사용 트랜잭션 출력)**에 대해 더 자세히 알아보고 싶다면, [InputOutputGlobal](https://iohk.io)의 교육 책임자인 [Dr. Lars Brünjes](https://iohk.io/en/team/lars-brunjes)의 강의를 보는 것을 추천합니다.
<iframe width="100%" height="400" src="https://www.youtube.com/embed/EoO76YCSTLo?t=1854" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture fullscreen"></iframe>

:::

#### 간단한 트랜잭션 생성하기

`cardano-cli`를 사용하여 트랜잭션을 전송하는 방법에 대해 더 명확하게 이해하기 위해, 다음과 같이 다른 지갑을 생성해 보겠습니다.

**지불 키 쌍 생성**
```bash
cardano-cli address key-gen \
--verification-key-file $HOME/cardano/keys/payment2.vkey \
--signing-key-file $HOME/cardano/keys/payment2.skey 
```

**지갑 주소 생성**
```bash
cardano-cli address build \
--payment-verification-key-file $HOME/cardano/keys/payment2.vkey \
--out-file $HOME/cardano/keys/payment2.addr \
--testnet-magic 1097911063
```

완료되면 다음과 같은 디렉토리 구조가 형성되어야 합니다.

```bash
$HOME/cardano/keys
├── payment1.addr
├── payment1.skey
├── payment1.vkey
├── payment2.addr
├── payment2.skey
└── payment2.vkey

0 directories, 6 files
```

두 번째 지갑 `payment2.addr`에 대한 **UTXO**를 쿼리하면, 다음과 같은 익숙한 결과를 얻을 수 있습니다.

```bash
cardano-cli query utxo \
--testnet-magic 1097911063 \
--address $(cat $HOME/cardano/keys/payment2.addr)
```

**UTXO 결과**
```
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
```

다시 말하지만, `payment2.addr` 지갑 주소와 키가 최근에 생성되었습니다. 따라서, 아직 아무도 `tAda`를 이 지갑으로 보내지 않았다고 예상할 수 있습니다.

이 예제에서 우리는 이제 두 개의 지갑이 있습니다. 각각을 `payment1` 와 `payment2`로 부르도록 합시다. `payment1` 지갑에 대해서는 우리가 [Cardano Testnet Faucet](../integrate-cardano/testnet-faucet)에서 몇 개의 `tAda`를 요청했기 때문에, 다음과 같은 결과가 나오게 됩니다.

`payment1` **지갑**: `1,000,000,000 lovelace`

```
UTXO
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
cf3cf4850c8862f2d698b2ece926578b3815795c9e38d2f907280f02f577cf85     0        1000000000 lovelace
```

`payment2` **지갑**: `0 lovelace`
```
UTXO
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
```

이제 `250,000,000 lovelace`를 `payment2` **지갑**으로 보내고 싶은 상황이라고 해봅시다. 어떻게 하면 이를 수행할 수 있을까요?

현재 온체인 프로토콜 매개변수를 **JSON** 파일에 저장하는 것부터 시작합니다.

**프로토콜 매개변수 쿼리**
```bash
cardano-cli query protocol-parameters \
  --testnet-magic 1097911063 \
  --out-file $HOME/cardano/protocol.json
```
이는 다음과 같은 **JSON** 파일을 생성할 것입니다.
```json
{
    "poolDeposit": 500000000,
    "protocolVersion": {
        "minor": 0,
        "major": 4
    },
    "minUTxOValue": 1000000,
    "decentralisationParam": 0,
    "maxTxSize": 16384,
    "minPoolCost": 340000000,
    "minFeeA": 44,
    "maxBlockBodySize": 65536,
    "minFeeB": 155381,
    "eMax": 18,
    "extraEntropy": {
        "tag": "NeutralNonce"
    },
    "maxBlockHeaderSize": 1100,
    "keyDeposit": 2000000,
    "nOpt": 500,
    "rho": 3.0e-3,
    "tau": 0.2,
    "a0": 0.3
}
```


**트랜잭션 초안 생성**

이제, 다음과 같이 트랜잭션 초안을 생성합니다.

```bash
cardano-cli transaction build-raw \
--tx-in cf3cf4850c8862f2d698b2ece926578b3815795c9e38d2f907280f02f577cf85#0 \
--tx-out $(cat $HOME/cardano/keys/payment2.addr)+0 \
--tx-out $(cat $HOME/cardano/keys/payment1.addr)+0 \
--fee 0 \
--out-file $HOME/cardano/tx.draft
```

`cardano-cli transaction build-raw` : `cardano-cli`에게 미가공 트랜잭션을 만들라고 지시합니다.

`--tx-in` : 이는 트랜잭션이 사용할 **UTXO** 입력을 구체화합니다. 이에 따라, `cardano-cli` 인자 내 여러 개의 `--tx-in`을 추가함으로써 원하는 만큼의 **UTXO** 입력을 추가할 수 있습니다. 물론 각각이 모든 입력에 대해 고유한 `TxHash`와 `TxIdx`를 가지고 있어야 합니다.

`--tx-out` : 이는 보낼 대상의 **지갑 주소**, **보낼 자산**, **보낼 양**을 구체화합니다. 총 **UTXO** 입력이 출력에 의해 구체화된 **자산**과 **양**을 충족시키는 한, 원하는 만큼 **UTXO** 출력을 추가할 수 있습니다.
This specifies the target **wallet address**, **assets** and **quantity** to be sent to. You can add as many **UTXO** outputs as you want as long as the total **UTXO** input can satisfy the **assets** and **quantity** specified by the output.

`--fee` : 이는 거래의 수수료 금액을 `lovelace` 단위로 지정합니다.

`--out-file` : 이는 생성될 트랜잭션 파일의 경로입니다.

이 경우에는, 거래에 필요한 수수료를 계산하기 위해 트랜잭션 초안을 작성하고 있는 것입니다. 다음 명령을 실행하여 이를 수행할 수 있습니다.

```bash
cardano-cli transaction calculate-min-fee \
--tx-body-file $HOME/cardano/tx.draft \
--tx-in-count 1 \
--tx-out-count 2 \
--witness-count 1 \
--testnet-magic 1097911063 \
--protocol-params-file $HOME/cardano/protocol.json
```

출력에 대해 다음과 같이 표시되어야 합니다.

```bash
174169 Lovelace
```

트랜잭션 수수료를 계산하기 위해 좀 전에 쿼리했던 `protocol.json`을 사용한다는 것을 눈치채셨을 겁니다.
```
--protocol-params-file $HOME/cardano/protocol.json
```

이는 온체인 프로토콜 매개변수에 따라 트랜잭션 수수료의 계산 결과가 달라지기 때문입니다.

`--witness-count 1`는 기본적으로 트랜잭션이 유효하기 위해 `1`개의 **서명 키**만 존재해야 한다고 `cardano-cli`에게 말합니다. 이 트랜잭션의 **UTXO** 입력은 `payment1` 지갑으로부터 오기 때문에, 트랜잭션 서명에는 확실히 `1`개의 키만 필요합니다.

이제 다음과 같이 최종적으로 실제 트랜잭션을 빌드할 수 있습니다.

```bash
cardano-cli transaction build-raw \
--tx-in cf3cf4850c8862f2d698b2ece926578b3815795c9e38d2f907280f02f577cf85#0 \
--tx-out $(cat $HOME/cardano/keys/payment2.addr)+250000000 \
--tx-out $(cat $HOME/cardano/keys/payment1.addr)+749825831 \
--fee 174169 \
--out-file $HOME/cardano/tx.draft
```

요약하자면, 우리는 `250,000,000 lovelace`를 `payment1` 지갑에서 `payment2` 지갑으로 보내고 싶습니다. `payment1`은 다음과 같은 **UTXO**를 가지고 있는 상황이었습니다.

```
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
cf3cf4850c8862f2d698b2ece926578b3815795c9e38d2f907280f02f577cf85     0        1000000000 lovelace
```

따라서 `--tx-input`으로 `TxHash` `cf3cf4850c8862f2d698b2ece926578b3815795c9e38d2f907280f02f577cf85`와 `TxIx` `0`을 사용할 것입니다.

```bash
--tx-in cf3cf4850c8862f2d698b2ece926578b3815795c9e38d2f907280f02f577cf85#0
```

그런 다음 `cardano-cli`에게 `250,000,000 lovelace`의 목적지가 `payment2`라고 말해주어야 합니다.

```bash
--tx-out $(cat $HOME/cardano/keys/payment2.addr)+250000000
```

이제, 우리는 아직 `750000000 lovelace` 만큼의 거스름돈이 남았으므로, 다시 `payment1`로 이를 돌려보냅니다.

```bash
--tx-out $(cat $HOME/cardano/keys/payment1.addr)+749825831
```

여기서 중요한 질문 하나를 할 수 있습니다. 왜 금액이 `749825831 lovelace`일까요? 우리가 계산한 수수료는 `174169 lovelace`였습니다. 그리고, 누군가는 트랜잭션 수수료를 부담해야 하기 때문에, 전송하는 사람이 거스름돈에서 차감하는 방식으로 수수료를 지불하게 됩니다. 따라서 `750000000 - 174169 = 749825831` 만큼의 거스름돈 `749825831 lovelace`를 받게 되는 것입니다.

그런 다음 거래 수수료를 다음과 같이 지정합니다.

```
--fee 174169
```

또한 트랜잭션 파일을 저장할 위치에 대해 지정합니다.

```
--out-file $HOME/cardano/tx.draft
```

이제 트랜잭션 파일이 있으므로, 사용된 입력 **UTXO**의 소유자가 우리임을 증명하기 위해 트랜잭션에 서명합니다.

```bash
cardano-cli transaction sign \
--tx-body-file $HOME/cardano/tx.draft \
--signing-key-file $HOME/cardano/keys/payment1.skey \
--testnet-magic 1097911063 \
--out-file $HOME/cardano/tx.signed
```

`--signing-key-file $HOME/cardano/keys/payment1.skey` : 이 인자는 트랜잭션 서명에 `payment1.skey`를 사용할 것임을 `cardano-cli`에 알려줍니다.

마지막으로, 이 트랜잭션을 블록체인에 제출합니다!

```bash
cardano-cli transaction submit \
--tx-file $HOME/cardano/tx.signed \
--testnet-magic 1097911063 
```
:::important
트랜잭션에 서명하고 제출하는 데 너무 오래 기다린 경우, 해당 시간 동안 수수료가 변경되었을 수 있으므로 트랜잭션이 네트워크에서 거부될 수 있습니다. 이 문제를 해결하려면 **수수료를 다시 계산하고, 트랜잭션을 다시 빌드해서 서명하고 제출하기만 하면 됩니다**!
:::

`payment1` 와 `payment2` 두 지갑의 잔고를 확인하면 다음과 같습니다.

```bash
# payment1 wallet UTXO
❯ cardano-cli query utxo --testnet-magic 1097911063 --address $(cat $HOME/cardano/keys/payment1.addr)

                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
63eeeb7e43171aeea0b3d53c5a36236cf9af92d5ee39e99bfadfe0237c46bd91     1        749825303 lovelace

# payment2 wallet UTXO
❯ cardano-cli query utxo --testnet-magic 1097911063 --address $(cat $HOME/cardano/keys/payment2.addr)
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
63eeeb7e43171aeea0b3d53c5a36236cf9af92d5ee39e99bfadfe0237c46bd91     0        250000000 lovelace
```

보시다시피, `payment2`는 `250,000,000 lovelace` 만큼의 **UTXO**를 가지게 되었고, `payment1`는 거스름돈을 받아 `749,825,303 lovelace` 만큼의 **UTXO**를 가진 것을 확인할 수 있습니다.

축하합니다! `cardano-cli`를 사용하여 첫 번째 **Cardano** 트랜잭션을 생성하고 보냈습니다! 🎉🎉🎉

#### `cardano-wallet`으로 지갑 만들기

:::note
이 가이드는 이미 `cardano-wallet`을 설치한 상황을 가정합니다. 만약 설치하지 않았다면, [cardano-wallet 설치하기](/docs/get-started/installing-cardano-wallet) 가이드로 가서 지시에 따르시기 바랍니다.

이 예제에선 모든 `cardano-wallet` 관련 파일을 저장할 때 `$HOME/cardano/wallets` 경로를 사용할 것입니다. 이를 각자 선택한 디렉토리로 바꾸시기 바랍니다.
:::

:::important
계속하기 전에 `cardano-node`가 `testnet` 네트워크와 연결되고 동기화되었는지 확인하세요.
:::

:::warning
프로덕션 환경에서 본인이 무엇을 하고 있는지 제대로 알지 못하는 상황이라면, 공개 서버에다가 지갑이나 키를 보관하는 것은 좋지 않을 수 있습니다.
:::

우선 모든 `wallets`을 저장할 디렉토리를 다음과 같이 생성합니다.

```bash
mkdir -p $HOME/cardano/wallets
```

**REST API server로 cardano-wallet 시작하기**

`cardano-wallet`이 제공하는 [REST API](https://en.wikipedia.org/wiki/Representational_state_transfer)에 중점을 두고 진행할 것입니다. API와 상호작용하려면 우선 서버를 시작해야 합니다.

```bash
cardano-wallet serve \
--port 1337 \
--testnet $HOME/cardano/testnet-byron-genesis.json \
--database $HOME/cardano/wallets/db \
--node-socket $CARDANO_NODE_SOCKET_PATH
```

`cardano-wallet serve` : `cardano-wallet`을 [REST API](https://en.wikipedia.org/wiki/Representational_state_transfer)를 제공하는 웹 서버의 형태로 구동합니다.

`--port` : 웹 서버가 요청을 수신할 포트를 지정합니다.

> 원하는 `port` 숫자를 지정할 수 있지만, `1024` 이상으로 설정하는 것을 추천합니다. 자세한 내용은 [Registered Port](https://www.sciencedirect.com/topics/computer-science/registered-port)를 참조하세요.

`--testnet` : `testnet` 네트워크를 위한 **Byron** 제네시스 파일 경로를 지정합니다.

> 이는 연결되어 있는 `cardano-node`가 사용하는 제네시스 파일과도 일치해야 합니다. 만약 `mainnet`에 연결하고 싶다면 `--mainnet`과 `mainnet` **Byron** 제네시스 파일을 사용하세요.

`--database` : 지갑 데이터베이스가 저장될 경로를 지정합니다.

> 지갑 생성 함수에는 암호가 필요하므로, 모든 지갑 데이터는 암호화된다는 점을 기억하세요.

`--node-socket` : `cardano-wallet`이 노드와 통신하기 위해 사용하는 `cardano-node` 소켓 경로를 지정합니다.

> `cardano-node`는 `cardano-cli`, `cardano-wallet` 및 `cardano-db-sync`와 같은 **Cardano** 구성요소들과 통신할 때 **IPC (Inter-Process-Communication)**를 사용합니다. **Linux**와 **MacOS**에서는 [unix sockets](https://en.wikipedia.org/wiki/Unix_domain_socket)라 불리는 것을 사용하고, **Windows**에서는 [Named Pipes](https://docs.microsoft.com/en-us/windows/win32/ipc/named-pipes)라는 것을 사용합니다.

> 
> 다음은 **Linux**에 대한 `--socket-path` 인자의 예시입니다.
```
--socket-path $HOME/cardano/db/node.socket
```
> 해당 인자가 파일을 가리키는 것을 볼 수 있는데, 이는 **unix sockets**이 (**Linux** 내 다른 모든 것처럼) 파일의 형태를 띠고 있기 때문입니다. 이 경우 우리는 이전에 생성했던 `db` 디렉토리에 소켓 파일을 넣었습니다.
> 
> **Windows**의 경우, `--socket-path` 인자는 다음과 같은 형태를 가집니다.
```
--socket-path "\\\\.\\pipe\\cardano-node-testnet"
```
> 이는 파일보다는 네트워크 `URI`나 `Path`와 유사한데, 이는 운영 체제에 따른 가장 중요한 차이점 중 하나입니다. 인자 내 `cardano-node-testnet` 문자열을 얼마든지 원하는 형태로 바꿀 수 있으며, 이 예시 경로는 **Windows** 내 [Daedalus 테스트넷 지갑](https://daedaluswallet.io)에 쓰입니다.

서버가 실행되면 다음과 같은 부분이 표시되어야 합니다.

```
[cardano-wallet.network:Info:12] [2021-06-03 13:48:24.82 UTC] Protocol parameters for tip are:
 Decentralization level: 100.00%
 Transaction parameters: [Fee policy: 155381.0 + 44.0x, Tx max size: 16384]
 Desired number of pools: 500
 Minimum UTxO value: 1.000000
 Eras:
   - byron from -0
   - shelley from 74
   - allegra from 102
   - mary from 112

Slotting parameters for tip are:
 Slot length:        1s
 Epoch length:       432000
 Active slot coeff:  5.0e-2
 Security parameter: 2160 block


[cardano-wallet.main:Info:4] [2021-06-03 13:48:24.86 UTC] Wallet backend server listening on http://127.0.0.1:1337/
```

**지갑 서버 정보 확인**

지갑 서버가 제대로 작동하는지 테스트하기 위해 가장 먼저 할 수 있는 일은 API를 통해 네트워크 정보를 쿼리하는 것입니다.

```bash
curl --url http://localhost:1337/v2/network/information | jq
```

결과는 다음과 같아야 합니다.

```json
{
  "node_era": "mary",
  "network_tip": {
    "slot_number": 408744,
    "absolute_slot_number": 28359144,
    "time": "2021-06-03T13:52:40Z",
    "epoch_number": 135
  },
  "next_epoch": {
    "epoch_start_time": "2021-06-03T20:20:16Z",
    "epoch_number": 136
  },
  "sync_progress": {
    "status": "ready"
  },
  "node_tip": {
    "height": {
      "unit": "block",
      "quantity": 2639489
    },
    "slot_number": 408722,
    "absolute_slot_number": 28359122,
    "time": "2021-06-03T13:52:18Z",
    "epoch_number": 135
  }
}
```

진행하기 전에, `sync_progress.status`가 `ready`와 같은지 확인하여야 합니다.

**지갑 생성**

지갑을 생성하려면 먼저 CLI에서 `cardano-wallet`을 사용하여 지갑 **복구 문구**를 생성해야 합니다.

```bash
cardano-wallet recovery-phrase generate | jq -c --raw-input 'split(" ")'
```

다음과 같은 **24단어 니모닉 시드**를 반환값으로 얻어야 합니다.

```
["shift", "badge", "heavy", "action", "tube", "divide", "course", "quality", "capable", "velvet", "cart", "marriage", "vague", "aware", "maximum", "exist", "crime", "file", "analyst", "great", "cabbage", "course", "sad", "apology"]
```

이제 `/v2/wallets` API 엔드포인트를 사용하여 **Cardano** 지갑을 만들 수 있습니다.

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

요청 페이로드 데이터는 다음과 같이 구성됩니다.

`name` : 지갑의 이름입니다.

`passphrase` : 지갑 내부의 자금을 보호하기 위한 보안 문구를 설정합니다. 지갑에 대한 쓰기 권한이 필요할 때마다, 특히 자산을 보낼 때마다 필요합니다.

`mnemonic_sentence` : `JSON` 배열로 포맷된 지갑 **복구 문구**입니다.

성공하면 다음과 같이 표시됩니다.

```json
{
  "address_pool_gap": 20,
  "passphrase": {
    "last_updated_at": "2021-06-03T14:25:18.2676524Z"
  },
  "balance": {
    "available": {
      "unit": "lovelace",
      "quantity": 0
    },
    "total": {
      "unit": "lovelace",
      "quantity": 0
    },
    "reward": {
      "unit": "lovelace",
      "quantity": 0
    }
  },
  "id": "5076b34c6949dbd150eb9c39039037543946bdce",
  "state": {
    "status": "syncing",
    "progress": {
      "unit": "percent",
      "quantity": 0
    }
  },
  "name": "test_cf_1",
  "assets": {
    "available": [],
    "total": []
  },
  "tip": {
    "height": {
      "unit": "block",
      "quantity": 0
    },
    "slot_number": 0,
    "absolute_slot_number": 0,
    "time": "2019-07-24T20:20:16Z",
    "epoch_number": 0
  },
  "delegation": {
    "next": [],
    "active": {
      "status": "not_delegating"
    }
  }
}
```

처음에, 새로 생성/복원된 지갑은 사용 전에 동기화되어야 합니다. 다음 요청을 실행하여 지갑이 이미 동기화되었는지 확인할 수 있습니다. 

```bash
curl --url http://localhost:1337/v2/wallets/5076b34c6949dbd150eb9c39039037543946bdce | jq '.state'
```

***`5076b34c6949dbd150eb9c39039037543946bdce`라는 문자열이 실제로 이전에 생성된 지갑의 `wallet.id`라는 점에 유의해야 합니다!***

다음과 같은 내용이 표시되어야 합니다.

```json
{
  "status": "ready"
}
```

**tAda(test ada) 받기**

이제 지갑을 만들었으므로, **Testnet Faucet**에서 몇 개의 tADA를 요청할 수 있습니다. 하지만 그전에 먼저 지갑용 Cardano 주소를 얻어야 합니다.

이는 다음 명령을 통해 수행됩니다.

```bash
curl --url 'http://localhost:1337/v2/wallets/5076b34c6949dbd150eb9c39039037543946bdce/addresses?state=unused' | jq '.[0]'
```

결과는 다음과 같아야 합니다.

```json
{
  "derivation_path": [
    "1852H",
    "1815H",
    "0H",
    "0",
    "0"
  ],
  "id": "addr_test1qzf9q3qjcaf6kxshwjfw9ge29njtm56r2a08g49l79xgt4je0592agqpwraqajx2dsu2sxj64uese5s4qum293wuc00q7j6vsp",
  "state": "unused"
}
```
이 요청의 매개변수가 주소를 얻으려는 대상 지갑의 **지갑 id**라는 점에 유의해야 합니다. 이 경우 이전에 생성된 지갑의 id인 `5076b34c6949dbd150eb9c39039037543946bdce`를 매개변수로 사용합니다.

우리는 기본적으로 아직 사용되지 않은 지갑 주소를 쿼리하고 있고, 이는 `state: "unused"`로 나타납니다. 보시다시피 지갑 주소 값은 다음과 같습니다: `addr_test1qzf9q3qjcaf6kxshwjfw9ge29njtm56r2a08g49l79xgt4je0592agqpwraqajx2dsu2sxj64uese5s4qum293wuc00q7j6vsp"`

이제 드디어 [Cardano Testnet Faucet](../integrate-cardano/testnet-faucet)으로부터 지갑 주소에 대해 `tAda`를 받을 수 있습니다.

[Cardano Testnet Faucet](../integrate-cardano/testnet-faucet)에서 `tAda`를 요청하면, 다음과 같이 지갑에 잘 도착했는지 확인할 수 있습니다.

```bash
curl --url http://localhost:1337/v2/wallets/5076b34c6949dbd150eb9c39039037543946bdce | jq '.balance'
```

다음과 같은 내용이 표시되어야 합니다.

```json
{
  "available": {
    "unit": "lovelace",
    "quantity": 1000000000
  },
  "total": {
    "unit": "lovelace",
    "quantity": 1000000000
  },
  "reward": {
    "unit": "lovelace",
    "quantity": 0
  }
}
```

보시다시피,  [Cardano Testnet Faucet](../integrate-cardano/testnet-faucet)으로부터 `1,000,000,000 lovelace`를 받은 것을 확인할 수 있습니다.

#### 간단한 트랜잭션 만들기

`cardano-wallet`을 사용하여 트랜잭션을 보내는 방법에 대해 더 명확하게 이해하기 위해, 다음과 같이 다른 지갑을 하나 더 생성해 보겠습니다.

**복구 문구 생성**

```bash
cardano-wallet recovery-phrase generate | jq -c --raw-input 'split(" ")'
```
**복구 문구 결과**

```
["then", "tattoo", "copy", "glance", "silk", "kitchen", "kingdom", "pioneer", "off", "path", "connect", "artwork", "alley", "smooth", "also", "foil", "glare", "trouble", "erupt", "move", "position", "merge", "scale", "echo"]
```

**지갑 요청 생성**
```bash
curl --request POST \
  --url http://localhost:1337/v2/wallets \
  --header 'Content-Type: application/json' \
  --data '{
	"name": "test_cf_2",
	"mnemonic_sentence": ["then", "tattoo", "copy", "glance", "silk", "kitchen", "kingdom", "pioneer", "off", "path", "connect", "artwork", "alley", "smooth", "also", "foil", "glare", "trouble", "erupt", "move", "position", "merge", "scale", "echo"],
	"passphrase": "test123456"
}' | jq
```

**지갑 생성 결과**

```json
{
  "address_pool_gap": 20,
  "passphrase": {
    "last_updated_at": "2021-06-04T11:39:06.8887923Z"
  },
  "balance": {
    "available": {
      "unit": "lovelace",
      "quantity": 0
    },
    "total": {
      "unit": "lovelace",
      "quantity": 0
    },
    "reward": {
      "unit": "lovelace",
      "quantity": 0
    }
  },
  "id": "4a64b453ad1c1d33bfec4d3ba90bd2456ede35bb",
  "state": {
    "status": "syncing",
    "progress": {
      "unit": "percent",
      "quantity": 0
    }
  },
  "name": "test_cf_2",
  "assets": {
    "available": [],
    "total": []
  },
  "tip": {
    "height": {
      "unit": "block",
      "quantity": 0
    },
    "slot_number": 0,
    "absolute_slot_number": 0,
    "time": "2019-07-24T20:20:16Z",
    "epoch_number": 0
  },
  "delegation": {
    "next": [],
    "active": {
      "status": "not_delegating"
    }
  }
}
```

이제 우리는 다음과 같은 지갑들을 가지고 있습니다.

| WalletId                                        | Wallet Name       | Balance(Lovelace)     |
| --------                                        | ---------         | ----------            |
| 5076b34c6949dbd150eb9c39039037543946bdce        | test_cf_1         | 1000000000            |
| 4a64b453ad1c1d33bfec4d3ba90bd2456ede35bb        | test_cf_2         | 0                     | 

이제 `test_cf_2` 지갑으로 `250,000,000 lovelaces`를 보내고 싶다고 가정해 보겠습니다. 먼저 다음과 같이 `test_cf_2`의 지갑 주소를 얻어야 합니다.

```bash
curl --url 'http://localhost:1337/v2/wallets/4a64b453ad1c1d33bfec4d3ba90bd2456ede35bb/addresses?state=unused' | jq '.[0]'
```

다음과 같은 결과값을 얻을 수 있습니다.

```json
{
  "derivation_path": [
    "1852H",
    "1815H",
    "0H",
    "0",
    "0"
  ],
  "id": "addr_test1qzyfnjk3zmgzmvnnvnpeguv6se2ptjj3w3uuh30llqe5xdtzdduxxvke8rekwukyn0qt9g5pahasrnrdmv7nr86x537qxdgza0",
  "state": "unused"
}
```

이제 `test_cf_2` 지갑 주소가 `addr_test1qzyfnjk3zmgzmvnnvnpeguv6se2ptjj3w3uuh30llqe5xdtzdduxxvke8rekwukyn0qt9g5pahasrnrdmv7nr86x537qxdgza0` 임을 알았습니다. 이제 이를 사용하여 다음과 같이 `test_cf_1` 지갑에서 `tAda` 몇 개를 전송할 수 있습니다.

```bash
curl --request POST \
  --url http://localhost:1337/v2/wallets/5076b34c6949dbd150eb9c39039037543946bdce/transactions \
  --header 'Content-Type: application/json' \
  --data '{
	"passphrase": "test123456",
	"payments": [
		{
			"address": "addr_test1qzyfnjk3zmgzmvnnvnpeguv6se2ptjj3w3uuh30llqe5xdtzdduxxvke8rekwukyn0qt9g5pahasrnrdmv7nr86x537qxdgza0",
			"amount": {
				"quantity": 250000000,
				"unit": "lovelace"
			}
		}
	]
}'
```

:::note
우리는 `test_cf_1`에서 `test_cf_2`로 전송하는 것을 원하기 때문에, `http://localhost:1337/v2/wallets/<walletId>` 엔드포인트에서 `test_cf_1` 지갑 id를 사용합니다.
:::

이제 다음과 같이 `test_cf_2`의 지갑 잔고를 확인할 수 있습니다.

```bash
curl --url http://localhost:1337/v2/wallets/4a64b453ad1c1d33bfec4d3ba90bd2456ede35bb | jq '.balance'
```

그리고 실제로 `250,000,000 tAda`가 수신되었는지 확인해야 합니다 (***몇 초동안 기다려야 할 수도 있습니다***).


```json
{
  "available": {
    "unit": "lovelace",
    "quantity": 250000000
  },
  "total": {
    "unit": "lovelace",
    "quantity": 250000000
  },
  "reward": {
    "unit": "lovelace",
    "quantity": 0
  }
}
```

`test_cf_1`의 지갑 잔액을 확인하면 다음과 같이 표시됩니다.

```json
{
  "available": {
    "unit": "lovelace",
    "quantity": 749831199
  },
  "total": {
    "unit": "lovelace",
    "quantity": 749831199
  },
  "reward": {
    "unit": "lovelace",
    "quantity": 0
  }
}
```

이제 지갑은 다음과 같아야 합니다.

| WalletId                                        | Wallet Name       | Balance(Lovelace)     |
| --------                                        | ---------         | ----------            |
| 5076b34c6949dbd150eb9c39039037543946bdce        | test_cf_1         | 749831199             |
| 4a64b453ad1c1d33bfec4d3ba90bd2456ede35bb        | test_cf_2         | 250000000             |


:::note

`cardano-wallet`에서는 트랜잭션 수수료를 자동으로 결정해서, `test_cf_1`에서 `test_cf_2`으로 `250,000,000 lovelace`을 보낼 때 `test_cf_1`으로부터 수수료를 자동으로 차감했습니다.

:::

:::tip

`cardano-wallet` [REST API](https://en.wikipedia.org/wiki/Representational_state_transfer)의 전체 문서는 [https://input-output-hk.github.io/cardano-wallet/api/edge](https://input-output-hk.github.io/cardano-wallet/api/edge)에서 찾을 수 있습니다.

:::

축하합니다! `cardano-wallet`을 사용하여 첫 번째 **Cardano** 거래를 생성하고 보냈습니다! 🎉🎉🎉



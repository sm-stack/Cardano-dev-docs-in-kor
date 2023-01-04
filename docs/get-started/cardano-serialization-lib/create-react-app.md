---
id: create-react-app
sidebar_position: 6
title: Serialization-Lib용 React App 만들기
sidebar_label: React App 만들기
description: A Create React App with the necessary code to get started developing front-end DApps on Cardano
image: ../img/og/og-getstarted-serialization-lib.png
--- 

## cardano-wallet-connector
`cardano-wallet-connector` 는 Serialization-Lib을 사용하여 다른 Cardano 웹 지갑에 연결하고 트랜잭션을 보내는 방법에 대한 예제가 포함된 React App 만들기 예제입니다. 이를 통해 React JS에 익숙한 개발자는 Cardano를 빠르게 시작할 수 있습니다. 
해당 코드에는 누군가에게 ADA를 보내는, 간단한 트랜잭션을 실행하는 방법과 Plutus 스크립트와 상호작용하는 방법(스크립트에서 자산 잠금 및 교환)에 대한 예제가 포함되어 있습니다.
React JS에 익숙한 개발자는 Github 레퍼지토리를 복사해서 DApp 구축을 시작할 수 있을 것입니다.

GitHub: [cardano-wallet-connector](https://github.com/dynamicstrategies/cardano-wallet-connector)

## 목차

- [소개](#소개)
- [사용 사례](#사용-사례)
- [설치](#설치)
- [코드 연습](#코드-연습)
    + [프로토콜 매개변수 정의](#1-프로토콜-매개변수-정의)
    + [트랜잭션 빌더 초기화](#2-트랜잭션-빌더-초기화)
    + [트랜잭션에 UTXO를 입력으로 추가](#3-트랜잭션에-UTXO를-입력으로-추가)
    + [트랜잭션에 출력 추가](#4-트랜잭션에-출력-추가)
    + [거스름돈을 보낼 주소 추가](#5-거스름돈을-보낼-주소-추가)
    + [트랜잭션 본문 작성](#6-트랜잭션-본문-작성)
    + [트랜잭션 서명](#7-트랜잭션-서명)
    + [트랜잭션 전송](#8-트랜잭션-전송)
- [UI 구성 요소](#ui-구성-요소)
- [데모](#데모)

## 소개
React JS는 지금까지 가장 인기 있는 프론트엔트 프레임워크이며, Angular, Vue와 Svetle 같은 다른 프레임워크에 비해 Stackoverflow 질문 수 관점에서 빠르게 성장하고 있습니다([출처](https://gist.github.com/tkrotoff/b1caa4c3a185629299ec234d2314e190)).
또한 이는 잘 문서화되어 있어, 약간의 Javascript 지식이 있는 초보자도 선택할 수 있고, Next JS와 같은 보다 정교한 풀스택 프레임워크에 통합될 만큼 충분히 강력한 툴입니다. 

Create React App은 React JS에서 새 어플리케이션을 만드는 데 사용하는 명령어로, 이전에 이 프레임워크를 사용해 본 사람이라면 누구나 이것이 무엇인지, 이것으로 무엇을 해야 하는지 알 것입니다.

React에는 React Native라는 모바일 확장 기능도 있고, Serialization Lib에는 이에 대한 바인딩이 존재합니다. 따라서 새 프로젝트의 시작점으로 React JS를 선택하면, 나중에 풀스택 혹은 모바일 프로젝트로 확장할 수 있다는 이점이 있습니다.

React JS용 보일러플레이트 코드를 사용하면, 많은 개발자가 Cardano를 쉽게 시작하고 빠르게 실행할 수 있습니다. 그리고 다른 프론트엔드 프레임워크에 익숙한 사람들은 [React 기본 사항](https://reactjs.org/docs/create-a-new-react-app.html)을 간단히 수정한 후 빠르게 선택할 수 있습니다.

## 사용 사례

보일러플레이트 코드는 가장 단순한 것부터 시작하여 스마트 컨트랙트와 상호작용하는 예제를 작업하는 것까지 다음과 같은 사용 사례를 다룹니다.

1. 주소로 ADA를 보냅니다.
2. 해당 주소로 토큰 (NFT)을 보냅니다.
3. Plutus 스크립트 주소에 ADA를 잠급니다.
4. Plutus 스크립트 주소에 토큰 (NFT)을 잠급니다.
5. Plutus 스크립트 주소에서 ADA를 사용합니다.
6. Plutus 스크립트 주소에서 토큰 (NFT)을 교환합니다.

이 모든 예에서, 사용자는 웹 지갑을 통해 트랜잭션에 서명합니다. 보일러플레이트에 포함된 지갑은 Nami, Flink, 그리고 CCVault입니다(CCVault는 2022년 3월 말에 Eternlwallet으로 리브랜딩되었습니다). 지갑이 [CIP-30 표준](https://cips.cardano.org/cips/cip30/)을 따르는 한, 몇 줄의 코드를 추가하는 것만으로도 코드를 다른 지갑까지 확장할 수 있습니다.

## 설치

Git 레퍼지토리를 개발 기기에 복제하고, 로컬 서버를 시작합니다. 로딩이 끝나면 시작된 IP와 포트 넘버를 알려줍니다. 대부분의 경우 IP는 localhost:3000에 있을 것입니다. 브라우저가 이 주소를 자동으로 열지 않는다면, 웹 브라우저에서 `localhost:3000` 을 수동으로 열어주십시오.

```sh
git clone https://github.com/dynamicstrategies/cardano-wallet-connector.git
cd cardano-wallet-connector
npm install
npm start
```

:::note

실행 중인 노드 버전을 확인하고 버전 14 이상인지 확인하십시오.

:::

```sh
node --version
```

## 코드 연습
이 섹션에서는 코드를 살펴보고 코드의 다른 부분이 어떤 작업을 수행하는지 설명합니다. 이를 통해 독자는 코드가 무엇을 하고 있는지 더 잘 이해할 수 있으며, 이 정보를 사용하여 자신의 사용 사례를 구축할 수 있습니다. 이를 위해, ADA를 보내는 방법의 예시부터 시작하겠습니다.

트랜잭션 전송을 빌딩하는 것은 8단계로 나누어질 수 있습니다:

### 1. 프로토콜 매개변수 정의

이 매개변수들은 Cardano에 의해 설정되며, 대부분 정적입니다. 의심스러운 경우, `cardano-db-sync` 서비스에 의해 유지관리되는 `epoch_param` 라는 표를 확인해보면 됩니다. 더 자세한 내용은 [cardano-db-sync](https://github.com/input-output-hk/cardano-db-sync)에 나와 있습니다.

```javascript
this.protocolParams = {
    linearFee: {
        minFeeA: "44",
        minFeeB: "155381",
    },
    minUtxo: "34482",
    poolDeposit: "500000000",
    keyDeposit: "2000000",
    maxValSize: 5000,
    maxTxSize: 16384,
    priceMem: 0.0577,
    priceStep: 0.0000721,
    coinsPerUtxoWord: "34482",
}
```

### 2. 트랜잭션 빌더 초기화 

트랜잭션 빌더는 프로토콜 매개변수가 주어지면 초기화됩니다.

```javascript
initTransactionBuilder = async () => {

    const txBuilder = TransactionBuilder.new(
        TransactionBuilderConfigBuilder.new()
            .fee_algo(
                LinearFee.new(
                    BigNum.from_str(this.protocolParams.linearFee.minFeeA), 
                    BigNum.from_str(this.protocolParams.linearFee.minFeeB)
                )
            )
            .pool_deposit(BigNum.from_str(this.protocolParams.poolDeposit))
            .key_deposit(BigNum.from_str(this.protocolParams.keyDeposit))
            .coins_per_utxo_word(BigNum.from_str(this.protocolParams.coinsPerUtxoWord))
            .max_value_size(this.protocolParams.maxValSize)
            .max_tx_size(this.protocolParams.maxTxSize)
            .prefer_pure_change(true)
            .build()
    );

    return txBuilder
}
```

### 3. 트랜잭션에 UTXO를 입력으로 추가
ADA와 전송될 주소와 트랜잭션 빌더가 트랜잭션 균형을 완료한 후, 거스름돈이 제공될 주소를 정의합니다(입력 + 수수료가 항상 출력과 동일하도록). 첫 번째 주소는 일반적으로 ADA(친구 또는 Plutus 스크립트 주소)를 보내려는 곳이고, 두 번째 주소는 일반적으로 자신의 지갑 주소이므로 거스름돈은 다시 돌아올 것입니다.

```javascript
const shelleyOutputAddress = Address.from_bech32(this.state.addressBech32SendADA)
const shelleyChangeAddress = Address.from_bech32(this.state.changeAddress)
```

그런 다음 트랜잭션에 입력을 추가합니다. 트랜잭션 빌더에 지갑에서 사용 가능한 모든 UTXO를 제공하고, 트랜잭션 빌더가 선택할 UTXO를 선택하도록 하는 것입니다. 트랜잭션 빌더가 UTXO를 선택하는 방법에 대해 여러 알고리즘이 존재합니다. 사용 가능한 항목들은 `0` : LargestFirst, `1` : RandomImprove, `2` : LargestFirstMultiAsset and `3` : RandomImproveMultiAsset와 같습니다. 이 예제에서는 RandomImprove 알고리즘을 사용합니다. 

```javascript
const txUnspentOutputs = await this.getTxUnspentOutputs();
txBuilder.add_inputs_from(txUnspentOutputs, 1)
```

Serialization-Lib v10 버전부터 이러한 UTXO 선택 알고리즘이 내장되어 있습니다. Serialization-Lib의 이전 버전에서 RandomImprove는 다른 라이브러리를 사용하여 실행해야 했으며, 그 결과 다른 라이브러리의 구현체에서 코드를 읽을 때 이를 볼 수 있었습니다. 따라서 사용하는 Serialization-Lib의 버전을 확인해야 합니다.

### 4. 트랜잭션에 출력 추가

모든 트랜잭션에는 소비할 일부 출력이 필요합니다. ADA를 보낼 때 금액은 Lovelace 단위로 작성해야 하며, 1 ADA는 1,000,000 Lovelave입니다. 보낼 Lovelace의 양은 문자열의 형태로 작성되어야 합니다.

```javascript
txBuilder.add_output(
    TransactionOutput.new(
        shelleyOutputAddress,
        Value.new(BigNum.from_str(this.state.lovelaceToSend.toString()))
    ),
);
```

### 5. 거스름돈을 보낼 주소 추가
이는 입력값 + 수수료가 항상 출력값과 동일하도록 하기 위해 필요합니다.

```javascript
txBuilder.add_change_if_needed(shelleyChangeAddress)
```

### 6. 트랜잭션 본문 작성

트랜잭션은 어떠한 입력 및 출력이 영향을 받는지 정의하는 본문과, 트랜잭션에 서명한 사람을 정의하고 Plutus 스크립트가 관련된 경우 datum 및 밸리데이터 로직도 전달하는 트랜잭션 증인으로 구성됩니다. 이 단계는 트랜잭션 본문을 작성합니다.

```javascript
const txBody = txBuilder.build();
```

다음 단계에서는 트랜잭션 증인을 생성합니다.

### 7. 트랜잭션 서명

트랜잭션 증인이 생성되고, 트랜잭션에 추가되면 트랜잭션은 웹 지갑으로 서명됩니다. 이 부분의 코드가 실행되면 사용자의 웹 지갑에서 팝업이 나타나 사용자에게 지갑에 비밀번호를 입력하도록 요청하고, 사용자가 비밀번호를 제공하면 지갑에서 거래에 서명합니다.

```javascript
const transactionWitnessSet = TransactionWitnessSet.new();

const tx = Transaction.new(
    txBody,
    TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
)

let txVkeyWitnesses = await this.API.signTx(
    Buffer.from(
        tx.to_bytes(), "utf8"
    ).toString("hex"), 
    true
);

txVkeyWitnesses = TransactionWitnessSet.from_bytes(
    Buffer.from(txVkeyWitnesses, "hex")
);

transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

const signedTx = Transaction.new(
    tx.body(),
    transactionWitnessSet
);
```

### 8. 트랜잭션 전송

마지막 단계는 트랜잭션을 웹 지갑에 제출하는 것입니다. 그런 다음 웹 지갑은 이를 블록체인으로 전달합니다. 제출된 트랜잭션이 지갑에 의해 수행되는 검증을 통과하면, 트랜잭션이 멤풀에 추가되었고 다음 블록들 중 하나에 추가되기 위해 기다리고 있음을 의미하는 트랜잭션 ID를 반환합니다.

```javascript
const submittedTxHash = await this.API.submitTx(
    Buffer.from(
        signedTx.to_bytes(), "utf8"
    ).toString("hex")
);
console.log(submittedTxHash)
```

트랜잭션 해시 확인을 위해 `console.log(submittedTxHash)` 를 사용할 수 있습니다. 또한 [cardanoscan.io](https://cardanoscan.io/)와 같은 블록체인 익스플로러에 가서 이를 확인할 수도 있습니다.

## UI 구성 요소
프론트엔드 앱을 빌드할 때 사용자가 상호작용할 수 있는 버튼, 양식 및 기타 구성 요소가 있으면 유용합니다. 따라서 Create React App에는 웹용 고성능 React 기반 UI 툴킷인 Blueprint JS의 UI 구성 요소 예제가 포함되어 있습니다. 이렇게 Planatir의 오픈 소스 프로젝트 개발자가 어플리케이션 구축을 위한 확장 라이브러리를 만들고 이를 잘 문서화해 두었습니다.

[Blueprint UI docs로의 링크](https://blueprintjs.com/docs/)입니다.

## 데모

이 Create React App의 작업 데모는 [여기](https://dynamicstrategies.io/wconnector)에서 볼 수 있습니다.

## 문제 해결
### 메모리 부족

다음으로 시작하는 오류가 발생하는 경우:

:::caution

`FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory ...` 

:::

그러면 `npm start` 실행 전에 터미널에서 다음 스니펫을 실행하십시오:

```shell
export NODE_OPTIONS="--max-old-space-size=8192"
```

### ADA 부족
다음과 같은 오류가 발생하는 경우:

:::caution

`Not enough ADA leftover to include non-ADA assets in a change address ...`

:::

먼저 지갑에 충분한 ADA가 있는지 확인한 다음, [트랜잭션에 UTXO를 입력으로 추가](#3-트랜잭션에-UTXO를-입력으로-추가) 섹션에서 지갑 내 사용 가능한 UTXO를 선택하는 방법을 결정하는 `txBuilder.add_inputs_from(txUnspentOutputs, 1)` 코드에서 "strategy" 번호를 변경해 보십시오. 옵션에는 `0` - LargestFirst, `1` - RandomImprove, `2` - LargestFirstMultiAsset, 그리고 `3` - RandomImproveMultiAsset 이 있습니다.


---
id: secure-workflow
title: 안전한 트랜잭션 작업 흐름
sidebar_label: 안전한 트랜잭션 작업 흐름
description: Procedures for using private keys separately from the Internet.
image: ../img/og/og-security-secure-transaction-workflow.png
--- 

이 일반적인 가이드는 Cardano 스테이크 풀 운영자 및 개발자로 하여금 다음과 같은 간단한 규칙을 준수하도록 돕기 위해 작성되었습니다.

:::important

지불 키는 인터넷에 연결된 컴퓨터에 잠시라도 저장하면 안됩니다.

:::

따라서 간단한 자금 전송 트랜잭션에 대한 `cardano-cli` 명령어 시퀀스의 표준화된 작업 흐름을 보여줄 것입니다. 

  - **[간단한 트랜잭션 생성](../stake-pool-course/handbook/create-simple-transaction)** (*안전하지 않은* 버전)

간단한 트랜잭션을 안전하게 수행하는 것이 편안해지면, 이를 사용하여 보다 복잡한 트랜잭션도 안전하게 실행할 수 있습니다.

  - [네이티브 자산 발행](../native-tokens/minting)
  - [NFT 발행](../native-tokens/minting-nfts)
  - [스테이킹 주소 등록](../stake-pool-course/handbook/register-stake-keys)
  - [스테이크 풀 등록](../stake-pool-course/handbook/register-stake-pool-metadata)

### 안전한 트랜잭션을 위한 모델

모든 트랜잭션은 다음 3단계로 이루어집니다.

1.  인터넷에 연결된 컴퓨터에서:
      - 모든 트랜잭션 세부 정보를 (Cardano 노드나 다른 쿼리로) 파일에 **모아서** 이동식 장치에 저장합니다.
2.  [에어 갭 환경](./air-gap)에서:
      - 해당 파일의 정보를 서명된 트랜잭션으로 **빌드**하고 Tx 파일을 동일한 장치에 다시 저장합니다 (참고: `Tx` = "트랜잭션").
3.  인터넷에 연결된 컴퓨터에서:
      - Cardano 노드에 Tx 파일을 **업로드하고** 제출합니다.

따라서, 지불 서명 키([Cardano 지갑 주소 키 쌍](../operate-a-stake-pool/cardano-key-pairs#wallet-address-key-pairs)의 프라이빗 키)는 **절대 에어 갭 환경을 벗어나지 않습니다.** 이는 다음과 같은 이유로 중요합니다.

  - 보안의 표준 가정은, *모든* 컴퓨터의 *모든* 인터넷 연결은 악의적ㅇ니 사람이나 프로그램이 해당 컴퓨터에서 암호화되지 않은 *모든 항목* 을 복사, 보기 또는 수정할 수 있는 기회를 생성한다는 것입니다. 
  - 지갑의 개인 지불 키가 신중하게 암호화되고 안전하게 관리되는 암호화폐 지갑 소프트웨어에서의 트랜잭션과 달리, 개발과 스테이크 풀 운영에서의 트랜잭션에 사용되는 지불 키(해당 문서에서는 `payment.skey`)는 *암호화되지 않습니다*.
  - 즉, 인터넷에 연결된 컴퓨터나 서버 어디에나 저장된 이 파일은 잠시더라도 해당 주소(`payment.addr`)의 자금이 ***손실*** 될 수 있는 기회를 만듭니다. 

## 전제

### [에어 갭 환경](./air-gap)

이를 아직 만들지 않은 경우, [다음 지침](./air-gap)에 따라 환경(일반적으로 전용 "에어 갭 기기")을 구성하십시오.

### 존재하는 모든 키를 에어 갭 내로 이동

둘째, 어플리케이션, 토큰/NFT을 생성한 경우 또는 인터넷에 연결된 모든 컴퓨터(데스크톱 또는 서버)에 저장된 키를 사용하여 스테이크 풀을 실행한 경우:

  - 모든 키를 에어 갭 호스트로 옮기고 원본을 [안전하게 삭제](../get-started/air-gap#install-secure-deletion-tools)합니다.
  - 또한 해당 개인 키의 노출로 인해 해당 리소스를 다시 빌드해야 하는지 여부를 심각하게 고려해 보십시오.

아래 명령들을 단순화하기 위해, 이 가이드에서는 모든 키와 주소를 트랜잭션 구축을 위한 *단일 디렉토리에* 저장한다고 가정합니다.

### Tx 파일 이동에 전용 메모리 스틱 사용

안전하다고 생각되는 기기에서 메모리 스틱을 포맷한 다음, 에어 갭 기기로 가서 다시 포맷합니다. 다음은 이에 대한 몇 가지 생각입니다.

  - 여기서 목표는 특히 메모리 스틱에 의해 전파되도록 설계된 바이러스로 인해, 호스트 컴퓨터로부터 에어 갭 환경으로 악성 소프트웨어가 들어오는 것을 방지하는 것입니다.
  - 일반 인터넷 연결 기기 *및* 에어 갭 Linux 환경과 동시에 호환되는 파일 시스템을 사용하십시오. 거의 모든 유형의 데스크탑에서 쓰기 가능한 것은 FAT32입니다.

## 안전한 트랜잭션의 단계

이는 다음 예외를 제외하고 [간단한 트랜잭션 생성](../stake-pool-course/handbook/create-simple-transaction) 페이지(테스트넷에서 실행하는 것이 안전한 것으로 간주됨)에서 재작성되었습니다.

  - 트랜잭션에 대한 [TTL (time to Live) 결정](../stake-pool-course/handbook/create-simple-transaction#determine-the-ttl-time-to-live-for-the-transaction) 은, 정보 수집 단계를 단순화하기 위해 트랜잭션 자체에서 이 값을 설정하는 방식으로 생략되었습니다.
  - 생략된 TTL 값으로 인해 Tx 파일을 무기한 사용할 수 있지만, 해당 Tx를 제출하면 UTxO 집합이 변경되어 해당 트랜잭션을 다시 제출하는 것이 불가능하므로 보안 위험이 없습니다.

또한 일반적으로 "인터넷에 연결된 컴퓨터"와 "Cardano 노드"는 두 개의 별도 시스템이며, [`rsync`](https://linux.die.net/man/1/rsync)와 같은 프로그램을 통해 파일을 전송해야 할 것입니다.

  - 따라서 "업로드"라고 표현된 홈 기기(혹은 예를 들어 Daedalus 노드 포트)에서 Cardano 노드를 실행하고 있다면, 해당 노드에서 액세스할 수 있는 위치에만 해당 파일을 복사하면 됩니다.

### 1\. 모든 트랜잭션 정보를 *취합*

인터넷에 연결된 컴퓨터에서(대신 쿼리 서비스를 사용할 수도 있지만, 일반적으로 Cardano 노드를 의미):

#### 프로토콜 매개변수 가져오기

프로토콜 매개변수를 가져와서 다음과 같이 `protocol.json` 에 저장합니다.

``` sh
cardano-cli query protocol-parameters \
    --mainnet \
    --out-file protocol.json
```

#### 사용할 **UTXO**의 트랜잭션 해시와 인덱스 가져오기

여기서 `payment.addr` 는 지불을 실행할 Cardano 주소를 의미하고, 이는 안전하지 않은 기기에 저장되어 있을 것입니다:

``` sh
cardano-cli query utxo \
    --address $(cat payment.addr) \
    --mainnet
```

이 마지막 명령의 출력을 선택한 *스크래치 파일로* 복사하거나 리디렉션합니다.

그런 다음 이 파일과 `protocol.json` 을 전송 메모리 스틱에 복사합니다.

### 2\. 서명된 트랜잭션에 Tx 정보를 *빌드하기*

전송 메모리 스틱을 에어 갭 호스트에 연결하고 파일을 직접 작업 디렉토리에 복사합니다.

  - `protocol.json`
  - 스크래치 파일

#### 트랜잭션 초안 작성

트랜잭션 초안을 작성하고 `tx.draft` 에 저장합니다. 메모:

  - 안전하지 않은 예에서와 같이, `payment2.addr` 는 지불을 *받는* 주소이고, `payment.addr` (자금이 *들어오는* UTXO를 가지고 있음)는 이 트랜잭션으로부터의 "거스름돈"을 저장합니다.
  - `--tx-in` 에 대해 다음 구문을 사용합니다:`TxHash#TxIx`. 여기서 `TxHash` 는 트랜잭션 해시이고 `TxIx` 는 트랜잭션 인덱스입니다.
  - `--tx-out` 에 대해 다음 구문을 사용합니다: `TxOut+Lovelace`. 여기서 `TxOut` 은 16진수로 코딩된 주소와 `Lovelace` 로 표현된 값을 담습니다.
  - 트랜잭션 초안의 경우, `--tx-out` 금액과 `--fee` 는 0으로 설정될 수 있습니다.
  - `--tx-in` 이후의 값은 스크래치 파일에 저장된 `cardano-cli query utxo` 의 출력에서 가져옵니다.

``` sh
cardano-cli transaction build-raw \
    --tx-in 4e3a6e7fdcb0d0efa17bf79c13aed2b4cb9baf37fb1aa2e39553d5bd720c5c99#4 \
    --tx-out $(cat payment2.addr)+0 \
    --tx-out $(cat payment.addr)+0 \
    --invalid-hereafter 0 \
    --fee 0 \
    --out-file tx.draft
```

#### 수수료 계산

간단한 트랜잭션에는 하나의 입력, `payment.addr` 에서의 유효한 UTXO 한 개, 그리고 두 개의 출력이 필요합니다:

  - Output1: 거래를 받는 주소.
  - Output2: 트랜잭션에 의한 거스름돈을 받는 주소.

수수료를 계산하려면 트랜잭션 초안을 포함해야 합니다.

``` sh
cardano-cli transaction calculate-min-fee \
    --tx-body-file tx.draft \
    --tx-in-count 1 \
    --tx-out-count 2 \
    --witness-count 1 \
    --byron-witness-count 0 \
    --mainnet \
    --protocol-params-file protocol.json
```

#### 변경사항을 `payment.addr` 로 보내기 위해 계산

모든 금액은 Lovelace 단위로 표현됩니다.

    expr <UTXO BALANCE> - <AMOUNT TO SEND> - <TRANSACTION FEE>

예를 들어, 만약 20 ada를 담은 UTxO에서 10 ada를 보낸다고 하면, 수수료를 지불한 후 `payment.addr` 로 다시 보낼 변경사항은 9.832035 ada입니다: 

``` sh
expr 20000000 - 10000000 - 167965
9832035
```

#### 트랜잭션 빌드

`tx.raw` 라고 이름붙인 파일에 트랜잭션을 작성합니다.

``` sh
cardano-cli transaction build-raw \
    --tx-in 4e3a6e7fdcb0d0efa17bf79c13aed2b4cb9baf37fb1aa2e39553d5bd720c5c99#4 \
    --tx-out $(cat payment2.addr)+10000000 \
    --tx-out $(cat payment.addr)+9832035 \
    --fee 167965 \
    --out-file tx.raw
```

#### 트랜잭션 서명

서명 키 `payment.skey` 로 트랜잭션에 서명하고 `tx.signed` 에 이를 저장합니다.

``` sh
cardano-cli transaction sign \
    --tx-body-file tx.raw \
    --signing-key-file payment.skey \
    --mainnet \
    --out-file tx.signed
```

전송 메모리 스틱에 다시 `tx.signed` 파일을 저장하고, 에어 갭 기기로부터 메모리 스틱을 [안전하게 제거](https://help.ubuntu.com/stable/ubuntu-help/files-removedrive.html.en)합니다.

### 3\. Tx 파일 **업로드**하고 제출하기

전송 메모리 스틱을 인터넷에 연결된 컴퓨터에 다시 연결한 다음, `tx.signed` 파일을 Cardano 노드에 업로드합니다.

#### 트랜잭션 제출

Cardano 노드에 로그인하고 다음을 실행합니다:

``` sh
cardano-cli transaction submit \
    --tx-file tx.signed \
    --mainnet
```

그런 다음 [잔고 확인](../stake-pool-course/handbook/create-simple-transaction#check-the-balances)에 설명된 대로, 거래가 성공했는지 확인합니다.

## FAQ

### 왜 `cardano-cli transaction build` 를 사용할 수 없나요?

이는 테스트 거래를 준비하고, 수수료를 계산하며, 이동할 자금의 최종 가치를 계산해야 하는 ["거스름돈" (반환 UTxO) 계산](../get-started/secure-workflow#calculate-the-change-to-send-back-to-paymentaddr)을 피하기 위한 간편한 명령어입니다. 대신, `transaction build` 는 "거스름돈"을 지정된 주소로 돌려보냅니다.

일부는 다음 링크에서 설명하는 것처럼 ***모든*** 트랜잭션을 이 명령어로 수행해야 할 정도로 사용하기가 훨씬 쉽다고 생각하고 있습니다.

  - [Please use `cardano-cli transaction build` instead of `cardano-cli transaction build-raw`](https://forum.cardano.org/t/please-use-cardano-cli-transaction-build-instead-of-cardano-cli-transaction-build-raw/94919)

그러나, 이 논의를 통해 `transaction build` 가 **라이브** Cardano 노드에서만 실행될 수 있는 문서화되지 않은 조건이 드러났습니다. 일반적으로 커뮤니티는 이에 대한 이유를 알지 못하므로(위 스레드에서도 약간의 추측이 있음), 다음과 같이 하십시오.

  - `transaction build` 를 사용하면, 라이브 Cardano 노드 또는 네트워크 환경에서 UTxO 및 잔액 정보를 축적하는 것 외에도 네트워크 환경에서 `build` 명령어를 추가적으로 실행해 전송 미디어에다가 서명되지 않은 트랜잭션 파일을 저장해야 합니다.
  - 그런 다음 이 트랜잭션 파일을 라이브 환경에서 에어 갭 환경으로 복사해서 서명해야 합니다. 그러나 이런 환경에서 사용자는 트랜잭션이 에어 갭 외부에서 악의적으로 빌드되거나 수정되지 않았는지 확신할 수 없습니다.

따라서 이 가이드에서는 에어 갭 내부에서 `cardano-cli transaction build-raw`에 적용될 트랜잭션 *세부 정보를* *모으기만* 하는 것을 제안합니다. `transaction build` 를 사용함에 있어 편의성이 크게 좋아지지도 않고, 약간의 보안 위험도 있기 때문입니다.

## 안전한 작업 흐름에서 보류 중인 기타 주제들

이들은 트랜잭션과 직접 관련이 없으며, 개발자 포털의 자체 페이지에서 모두 해결됩니다.

  - 풀 키 설치 및 업데이트: 에어 갭에서 스테이크 풀 블록 생성자로 안전하게 키 전송
  - 개인 키의 암호화된 백업 만들기(오프사이트 / 에어 갭 환경 외부에 저장)
  - 스테이크 풀 및 개발 리소스의 보안(암호화) 기록 유지


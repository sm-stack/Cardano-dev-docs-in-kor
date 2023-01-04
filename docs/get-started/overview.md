---
id: 개요
slug: /get-started/
title: 시작하기
sidebar_label: 개요
description: 시작하기
image: ../img/og/og-getstarted-overview.png
--- 
![Cardano Get Started](../../static/img/card-get-started-title.svg)

Cardano 개발자 포털에 오신 것을 환영합니다. 이 컨텐츠는 기술자를 위한 것입니다. Cardano 지갑에 대한 정보를 찾고 있다면 [쇼케이스 섹션](../../showcase)으로 이동하십시오.

개발자 포털은 **현재** Cardano **메인넷**에서 할 수 있는 모든 것을 다루고 있습니다.

## Cardano란 무엇인가요? 
Cardano는 특허가 없는 [오픈 소스](https://en.wikipedia.org/wiki/Open_source) 프로토콜의 모음입니다. 가치, ID 및 거버넌스를 저장하고, 변환 및 관리할 수 있는 플랫폼이죠. Cardano는 의견이나 편견이 아닌 연구를 따릅니다.

## 어떻게 시작했나요?
Cardano는 2015년에 연구 개발 프로젝트로 시작했으며, 코드 작성을 시작하기까지 거의 2년의 연구 기간이 걸렸습니다.

Cardano의 목적은 다음과 같은 질문으로 시작합니다: 수십억 명의 사람들을 위한 지속 가능한 금융 및 사회적 운영 체제를 어떻게 구축할 수 있을까? 저렴한 비용으로 모든 것을 얻으려면 어떤 기술을 가져와야 할까?
 
암호화 연구 외에도, 게임 이론, ID 관리, 프로그래밍 언어 연구들을 진행하였습니다. 이러한 엄격한 학문적 프로세스를 통해 100개가 넘는 학술 논문을 발표할 수 있었습니다. 대부분은 Eurocrypt 및 Asiacrypt와 같은 암호화 컨퍼런스에서 승인되었으며, 표준 동료 평가 프로세스를 거쳤습니다. 예를 들어, [“Ouroboros: A Provably Secure Proof-of-Stake Blockchain Protocol”](https://eprint.iacr.org/2016/889.pdf) 논문은 [2015년부터 2019년에 가장 많이 인용된 보안 논문](https://sweis.medium.com/most-cited-security-papers-from-2015-2019-d21515db3681) 중 하나였습니다.

## 필요한 것
Cardano 개발자 포털을 최대한 활용하려면 프로그래밍 경험과 더불어 [UTxO](technical-concepts#unspent-transaction-output-utxo), [트랜잭션](technical-concepts#transactions), [주소](technical-concepts#addresses), [키 유도](technical-concepts#key-derivation), 그리고 [네트워킹](technical-concepts#networking)과 같은 Cardano 블록체인의 기본 컨셉에 대한 기본적인 이해도를 갖추고 있어야 합니다.

이런 용어들에 익숙하지 않다면, [기술 컨셉](technical-concepts)으로 시작해서 [스테이크 풀 코스](../operate-a-stake-pool/#stake-pool-course)까지를 모두 읽고 오길 바랍니다. 이는 스테이크 풀을 운영하지 않더라도, 기본 컨셉을 이해하는데 도움이 될 것입니다.

## Cardano는 다릅니다
만약 다른 스마트 컨트랙트 플랫폼에 경험이 있고 Cardano에서 빌딩을 시작하고 싶다면, 그 차이점에 대해 아는 것이 매우 중요합니다.

- [UTxO의 개념](technical-concepts#unspent-transaction-output-utxo) 과 [확장된 UTxO 모델](https://iohk.io/en/blog/posts/2021/03/11/cardanos-extended-utxo-accounting-model/)에 대해 이해하는 것이 중요합니다.
- [Cardano에서의 토큰](../native-tokens/)은 스마트 컨트랙트를 통해 만들어지지 않습니다. 토큰은 네이티브한 상태로 렛저에 존재합니다. 프로토콜은 이 토큰들을 ADA와 동등하게 취급합니다. 네이티브 토큰이 없고, 스마트 컨트랙트를 사용하여 토큰을 보내야 하는 다른 블록체인과는 상당히 다릅니다.
- [네이티브 토큰](../native-tokens/)은 핵심 인프라를 사용하고, 네트워크는 스마트 컨트랙트를 실행하여 'transfer'라는 메서드를 호출하는 대신 다른 작업을 수행하여야 합니다. Cardano에서는 표준 트랜잭션이라는 기능을 사용합니다. 이를 통해 렛저가 토큰 관련 함수들을 모두 다루기 때문에, 추가 복잡성이나 사람의 실수에 의한 위험성을 줄입니다.
- [스마트 컨트랙트](../smart-contracts/)는 [eUTxO 모델](https://iohk.io/en/blog/posts/2021/03/11/cardanos-extended-utxo-accounting-model/) 때문에 Cardano에서 다르게 작동합니다. 이 때문에 [Cardano가 블록당 하나의 트랜잭션만 지원](https://sundaeswap-finance.medium.com/concurrency-state-cardano-c160f8c07575)한다는 오해가 떠돌았던 적도 있죠.

## Cardano에서 할 수 있는 것
- Ada를 포함한 [네이티브 토큰](../native-tokens/)을 보내고 받을 수 있습니다.
- Ada를 [기존 풀](../../showcase?tags=pooltool) 중 하나에 위임하고 보상을 받을 수 있습니다.
- [가지고 있는 ada로 투표](../governance/project-catalyst#participate-as-a-voter)하여 트레저리에 있는 10억 달러 이상의 ADA로 [Project Catalyst](../governance/project-catalyst)에 대한 커뮤니티 주도 제안에 대해 지원할 수 있습니다.
- [제안에 투표](../governance/project-catalyst#participate-as-a-voter)하여 ADA 보상을 받을 수 있습니다.
- [Cardano 개선 제안](technical-concepts#cardano-improvement-proposals-cip) (CIP)에 참여할 수 있습니다.
- [스마트 컨트랙트](../smart-contracts/)와 상호작용할 수 있습니다.

## 왜 Cardano에 빌딩해야 하나요?
- Cardano는 더 빠르고 안전하며 비용 효율적이기 때문에, 프로덕트 구축에 더 나은 인프라를 가지고 있습니다.
- Cardano는 트랜잭션과 관련하여 정확한 비용 예측이 가능합니다. 즉, 거래 수수료에 대한 옥션과 같은 것들은 존재하지 않습니다.
- Cardano는 활기찬 커뮤니티와 200만 개 이상의 지갑을 보유하고 있습니다. 특정 표준을 지키기만 한다면, 우리는 새로운 프로덕트를 시도하고 참여하는 것을 열렬히 지지합니다. 지금 참여한다면, 당신은 퍼스트 무버가 됩니다.
- Cardano는 벤처 펀드를 제공합니다. Cardano를 기반으로 빌딩하는 경우, [프로젝트 자금을 확보](../governance/project-catalyst)할 수 있습니다. 6주에서 8주마다 Cardano 커뮤니티에서 프로젝트를 제안, 논의 및 투표할 수 있습니다.
- Cardano는 지분 증명 블록체인입니다. 설계상 훨씬 적은 에너지와 계산 능력을 필요로 합니다.
- Cardano는 높은 보증과 함께 엄격하고 공식적인 방식으로 개발되었습니다. 합의 알고리즘인 [Ouroboros](https://cardano.org/ouroboros/)는 사이버 보안 및 암호화 분야의 최상위 컨퍼런스와 간행물에 발표되었고, 여러 동료 평가도 거쳤습니다. Cardano를 기반으로 빌딩하는 것은 이러한 기반을 바탕으로 하는 것과 다름이 없습니다.

## Cardano에서 빌딩할 수 있는 것
- 기존 웹사이트 및 서비스에 [Cardano를 통합](../integrate-cardano/)할 수 있습니다.
- [네이티브 토큰](../native-tokens/)과 [NFT](../native-tokens/minting-nfts)를 발행할 수 있습니다.
- [트랜잭션에 메타데이터](../transaction-metadata/)를 추가하여 트랜잭션에 이야기, 배경 혹은 정체성을 부여할 수 있습니다. 
- [트랜잭션 메타데이터](../transaction-metadata/)를 사용하여 특정 시점에 파일, 텍스트 또는 기타 데이터의 존재를 증명할 수 있습니다. 이를 활용하여 실제 물건에 대해 정품을 검증하고 증명할 수도 있습니다.
- Cardano에서 [스테이크 풀을 설정, 관리 및 유지](../operate-a-stake-pool/)할 수 있습니다.
- [스마트 컨트랙트를 생성](../smart-contracts/)할 수 있습니다.

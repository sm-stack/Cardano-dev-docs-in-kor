---
id: plutus
title: Plutus
sidebar_label: Plutus
description: Plutus
image: ../img/og/og-developer-portal.png
--- 

## Plutus 시작하기
Plutus는 Cardano 블록체인의 스마트 컨트랙트 플랫폼입니다. Cardano 블록체인과 상호작용하는 어플리케이션을 작성할 수 있습니다.

Plutus를 처음 접한다면, [Plutus Tutorial](https://plutus.readthedocs.io/en/latest/tutorials/)을 보거나, 모든 Plutus 관련 레퍼지토리, 문서 및 교육 자료를 찾을 수 있는 [Plutus resources](https://docs.cardano.org/plutus/plutus-resources)를 참조하세요. Haskell을 아직 모른다면, [Haskell부터 시작](#get-started-with-haskell)해 보세요.

[Chris Moreton의 컨텐츠 업데이트를 따르세요](https://plutus-pioneer-program.readthedocs.io/en/latest/plutus_pioneer_program.html). 그는 Plutus Pioneer Program의 강의를 필사하는 데 많은 노력이 들였습니다.

[Cardano Forum](https://forum.cardano.org/c/developers/cardano-plutus/148)에서 다른 사람들과 Plutus에 대해 이야기 하거나, Discord를 선호하는 경우 [IOG Technical Discord](https://discord.com/invite/w6TwW9bGA6)로 이동하세요.

## Plutus platform
이 비디오는 Michael Peyton-Jones가 Plutus와 함께 작업하는 과정을 안내하는 것으로 시작합니다. 이는 단일 Haskell 라이브러리에서 모든 프로그래밍을 구행할 수 있도록 합니다. 이를 통해 사용자는 최고 수준의 보증을 통해 예측 가능하고 결정론적인 환경에서 안전한 어플리케이션을 구축하고, 새로운 자산을 만들며, 스마트 컨트랙트를 생성할 수 있습니다. 또한 개발자는 작업을 테스트하기 위해 Cardano 풀노드를 실행할 필요도 없습니다.

그런 다음 Jann Müller가 자산을 구축하고 런칭되는 Plutus Application Platform을 소개합니다. 또한 그는 스마트 컨트랙트를 사용하여 토큰을 전송하는 방법을 시연합니다. Plutus를 사용하면 다음을 수행할 수 있습니다.

- 가벼운 환경에서 새로운 토큰 만들기.
- 스마트 컨트랙트를 구축.
- 기본적인 멀티시그 스크립트 지원 

<iframe width="100%" height="325" src="https://www.youtube.com/embed/usMPt8KpBeI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture fullscreen"></iframe>

## Plutus Playground
Plutus Playground는 코드 에디터이자 시뮬레이터입니다.

[![Plutus Playground](../../static/img/get-started/smart-contracts/plutus-playground.jpg)](https://playground.plutus.iohkdev.io)

[Plutus App을 컴파일하고 테스트하는 방법](https://plutus-apps.readthedocs.io/en/latest/plutus/tutorials/plutus-playground.html)에 대한 튜토리얼을 보거나, 다음 비디오를 확인해보세요.
<iframe width="100%" height="325" src="https://www.youtube.com/embed/DhRS-JvoCw8" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture fullscreen"></iframe>

## 추가 튜토리얼
- [Plutus Playground에서 기본적인 Plutus App 작성](https://plutus-apps.readthedocs.io/en/latest/plutus/tutorials/basic-apps.html)
- [Plutus Tx 사용](https://plutus.readthedocs.io/en/latest/tutorials/plutus-tx.html)
- [기본적인 밸리데이터 스크립트 작성](https://plutus.readthedocs.io/en/latest/tutorials/basic-validators.html)
- [기본적인 발행 정책 작성](https://plutus.readthedocs.io/en/latest/tutorials/basic-minting-policies.html)
- [Plutus 컨트랙트의 속성 기반 테스트](https://plutus-apps.readthedocs.io/en/latest/plutus/tutorials/contract-testing.html)

## 방법 가이드
- [script, datum과 redeemer를 내보내는 방법](https://plutus.readthedocs.io/en/latest/howtos/exporting-a-script.html)
- [확장 가능한 Plutus app 작성 방법](https://plutus-apps.readthedocs.io/en/latest/plutus/howtos/writing-a-scalable-app.html)
- [블록체인 이벤트 처리 방법](https://plutus-apps.readthedocs.io/en/latest/plutus/howtos/handling-blockchain-events.html)
- [Plutus 스크립트의 비용과 크기를 분석하는 방법](https://plutus-apps.readthedocs.io/en/latest/plutus/howtos/analysing-scripts.html)

## Haskell 시작하기
Haskell은 Plutus 컨트랙트를 위한 프로그래밍 언어입니다. 만약 Haskell에 대한 최고의 가이드를 찾고 있는데 어디서부터 시작해야 할지 모르겠다면 Miran Lipovača의 책이나 웹사이트 [Learn You a Haskell for Great Good](http://learnyouahaskell.com/introduction)을 확인하는 것을 추천합니다.

위 가이드를 통해, Haskell을 굉장히 쉽게 배울 수 있습니다.

또 다른 훌륭한 학습 리소스는 Well-Typed 컨설팅의 공동 창립자인 [Andres Löh](https://kosmikus.org/)와 IOHK의 교육 디렉터인 [Dr. Lars Brünjes](https://iohk.io/en/team/lars-brunjes)가 강의하는 [Haskell and Crypto Mongolia 2020](https://www.youtube.com/watch?v=ctfZ6DwFiPg&list=PLJ3w5xyG4JWmBVIigNBytJhvSSfZZzfTm&index=4)입니다. 이 코스는 [Plutus Pioneer Program](#plutus-pioneer-program-시작하기)을 시작할 때 Plutus Pioneers가 제한하는 *출발점* 입니다. Haskell 및 암호화폐에 대해 10주, 주당 40시간 강의로 심층 분석을 진행합니다.

Python을 배운 적이 있다면, Python을 사용하여 필수 Haskell 개념을 설명하는 [py2hs](https://github.com/cffls/py2hs)라는 유익한 프로젝트도 있습니다.

## Plutus pioneer program 시작하기
Plutus pioneer program은 Cardano 생태계를 위해 Plutus 개발자를 모집하고 교육하기 위해 만들어졌습니다. 프로그램에 참여하면 Haskell과 Plutus에서 코딩하는 방법의 핵심 원칙을 배우는 그룹의 일원이 됩니다. 해당 프로그램은 주간 비디오, 과제, Q&A 세션과 해당 언어의 제작자 및 주요 전문가에 대한 독점적인 액세스와 같은 과정들로 구성됩니다.

**이 과정은 코딩 초보자를 위한 것이 아닙니다.** 공식적인 전문가가 될 필요는 없지만, 프로그래밍 경험과 논리/수학적인 사고에 대한 적성은 어느 정도 요구됩니다. 과정을 수강하기 전에 [Haskell을 시작하는 것](#haskell-시작하기)이 좋습니다.

Plutus는 Haskell에 기반을 두고 있고, Template Haskell, 자료형 수준 프로그래밍 및 효과 시스템과 같은 고급 기능을 포함하므로, Haskell 또는 함수형 프로그래밍에 대한 사전 지식도 권장됩니다.
- [Plutus Pioneer Program 신청 링크](https://testnets.cardano.org/en/plutus-pioneer-program/)

또한 Plutus pioneer program의 3차 과정을 따르고 해당 과정의 모든 코드 예제가 포함된 책 "Plutus - Learning a smart-contract language"을 확인해봐도 좋습니다. 이 책은 [링크](https://github.com/LukaKurnjek/plutus-pioneer-program)의 레퍼지토리에서 구할 수 있습니다.

---
id: marlowe
title: Marlowe
sidebar_label: Marlowe
description: Marlowe
image: ../img/og/og-developer-portal.png
--- 

## Marlowe 시작하기
Marlowe는 사용자가 금융 계약을 위해 특별히 설계된 블록체인 어플리케이션을 만들 수 있도록 하는 DSL(도메인 특화 언어)입니다.

Marlowe를 처음부터 배우고 싶다면 [Marlowe 튜토리얼](https://play.marlowe-finance.io/doc/marlowe/tutorials/index.html)로 시작하거나, [Marlowe Playground](https://play.marlowe-finance.io)로 이동하세요.

Cardano 포럼에서 [Marlowe에 대해 토론](https://forum.cardano.org/c/developers/cardano-marlowe/149)할 수 있고, Telegram을 선호하는 경우 [Marlowe Telegram Group](https://t.me/IOHK_Marlowe)에 참여하세요.

## Marlowe 플랫폼
[튜링 완전](https://en.wikipedia.org/wiki/Turing_completeness) 언어와 비교할 때, Marlowe DSL은 훨씬 뛰어난 보안, 확실성, [종료 보장](https://en.wikipedia.org/wiki/Halting_problem) 및 동작 정확성을 제공합니다.

이 설계 방식은 다음을 보장합니다.
- 계약은 유한합니다. 재귀 또는 반복문이 없습니다.
- 계약은 종료될 것입니다. 모든 작업에 대해 시간 초과가 있습니다.
- 계약에는 정의된 수명이 있습니다.
- 마감 시 보유 자산은 없습니다.
- 가치가 보존됩니다. 

## Marlowe Playground 
Marlowe Playground는 사용하기 쉽고 시각적이며 모듈식인 플러그 앤 플레이 형태의 스마트 컨트랙트 빌더 및 시뮬레이터입니다. 다음 영상에서 Marlowe 계약을 빌딩, 시뮬레이션 및 분석합니다.
<iframe width="100%" height="325" src="https://www.youtube.com/embed/axP-jYQ_6lo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture fullscreen"></iframe>

## Marloew 계약을 개발하고 배포하는 데 드는 리소스

### Cardano 블록체인에서 Marlowe 계약을 어떻게 실행하나요?

1. [Marlowe Playground](https://play.marlowe-finance.io/#/)로 계약을 설계합니다.
2. `Send to Simulator` 버튼을 누른 다음 `Download as JSON` 버튼으로 만든 계약을 JSON 형태로 다운받습니다. 
3. *`marlowe-cli`와 같은 명령줄에서 계약을 실행하고 싶다면*, [`marlowe-cli`](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/ReadMe.md#installation)를 설치하고 [Marlowe CLI로 컨트랙트 실행하기](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/lectures/04-marlowe-cli-concrete.md)의 지침을 따르세요. [Marlowe CLI](https://www.youtube.com/playlist?list=PLNEK_Ejlx3x0GbvCw-61e9VfRafBT1JSw) 영상 목록에서 `marlowe-cli`의 개요를 확인할 수 있습니다.
4. *Jupyter 노트북에서 계약을 실행하고 싶다면*, git을 사용해  [github.com/input-output-hk/marlowe-cardano](https://github.com/input-output-hk/marlowe-cardano)를 복제하고, `marlowe-cli/` 폴더에서 `nix develop --command jupyter-lab`를 실행한 다음 [Marlowe CLI Lecture 4](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/lectures/04-marlowe-cli-concrete.ipynb)의 지침을 따르세요. 관련 영상으로는 [Running a Marlowe Contract with Marlowe CLI](https://www.youtube.com/watch?v=DmF7dIKmJMo&)가 있습니다.
5. *Marlowe Runtime backend를 사용하는 명령줄에서 계약을 실행하고 싶다면*, [tutorial for Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/tutorial.ipynb)을 따라하세요. [Marlowe Runtime Tutorial](https://youtu.be/WlsX9GhpKu8) 영상이 사용법을 설명합니다.
*If you want to run your contract from the command-line using the Marlowe Runtime backend,* then follow the [tutorial for Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/tutorial.ipynb). A video [Marlowe Runtime Tutorial](https://youtu.be/WlsX9GhpKu8) demonstrates its use.
6. *Marlowe Lambda를 사용하여 계약을 실행하고 싶다면*, [using Marlowe Lambda from the command line](https://github.com/input-output-hk/marlowe-lambda/blob/main/examples/zcb.ipynb)의 예제를 따르거나 [web application for Marlowe Lambda](https://github.com/input-output-hk/marlowe-lambda/tree/main/web) 예제를 공부하세요. [Marlowe Lambda at the Command Line](https://youtu.be/huXbRyrmW60)과 [Marlowe Lambda in the Browser](https://youtu.be/o5m_y5l_i_g) 영상이 Marlowe Lanbda의 사용법에 대해 설명할 것입니다.


### 왜 `mainnet`에서 Marlowe 계약을 실행할 수 없나요?

- Marlowe의 감사는 아직 완료되지 않았기 때문에, `mainnet`에서 Marlowe 계약을 실행하는 것은 추천드리지 않습니다.
- 그러나, [enable Marlowe on `mainnet`](https://github.com/input-output-hk/marlowe-cardano/pull/377)라는 풀 리퀘스트를 통해 `mainnet`에서 돌아가는 Marlowe 도구를 수정할 수 있습니다.

### GitHub 레퍼지토리

- [Marlowe language and semantics](https://github.com/input-output-hk/marlowe)
- [Marlowe Improvement Proposals (MIPs)](https://github.com/input-output-hk/MIPs)
- [Marlowe on Cardano](https://github.com/input-output-hk/marlowe-cardano)
- [Marlowe Playground](https://github.com/input-output-hk/marlowe-playground)
- [PureScript implementation of Marlowe](https://github.com/input-output-hk/purescript-marlowe)
- [ACTUS in Marlowe](https://github.com/input-output-hk/marlowe-actus-labs)
- [AWS Lambda service for Marlowe Runtime](https://github.com/input-output-hk/marlowe-lambda)

### 개발자 논의

- [Marlowe - Cardano Forum](https://forum.cardano.org/c/developers/cardano-marlowe/149)
- [\#marlowe - Cardano StackExchange](https://cardano.stackexchange.com/questions/tagged/marlowe)
- [\#ask-marlowe - Discord](https://discord.com/channels/826816523368005654/936295815926927390)
- [IOG\_Marlowe - Telegram](https://t.me/IOHK_Marlowe)
- [Marlowe 개선에 대한 논의](https://github.com/input-output-hk/MIPs/discussions)
- [Cardano에서 Marlowe의 구현 변경 사항에 대한 논의](https://github.com/input-output-hk/marlowe-cardano/discussions)

### 사양

- [Marlowe 사양, 버전 3](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/specification/marlowe-isabelle-specification-4f9fa249fa51ec09a4f286099d5399eb4301ed49.pdf)
- [Marlowe-Cardano 사양](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/specification/marlowe-cardano-specification.md)

### 테스트 및 디버깅

- [Marlowe 디버깅 요리책](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/debugging-cookbook.md)
- [Marlowe 테스트 보고서](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/test/test-report.md)

### 도구
- [Marlowe CLI](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/ReadMe.md): a command-line interface for running Marlowe contracts on the Cardano blockchain.
- [Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/ReadMe.md): an application back-end for running Marlowe contracts on the Cardano blockchain.
- [Marlowe Lambda](https://github.com/input-output-hk/marlowe-lambda): an AWS Lambda client for Marlowe Runtime.

### 예시

- [예시 Marlow 계약 및 온체인 실행 인덱스](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/example-contracts.md)
- [Marlowe 요리책](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-cli/cookbook/ReadMe.md)
- [Marlowe Runtime 튜토리얼](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/tutorial.md)
- [Marlowe Runtime 예시](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-runtime/examples/ReadMe.md)
- [Marlowe 계약의 Haskell 예시](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-contracts)
- [Marlowe의 ACTUS 계약](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-actus)

### 영상

- [Marlowe Pioneers 1st Cohort](https://www.youtube.com/@iogacademy9189/playlists?view=50&sort=dd&shelf_id=2)
	1. [Welcome](https://www.youtube.com/playlist?list=PLNEK_Ejlx3x3xkV0OQ0PjRaCtlbPhL0Eg)
	2. [Marlowe 사용](https://www.youtube.com/playlist?list=PLNEK_Ejlx3x1o4Hv1GC_0kxXnquikXl70)
	3. [Marlowe 심화](https://www.youtube.com/playlist?list=PLNEK_Ejlx3x0beuXQwbcy58pAIyF4kASc)
	4. [Marlowe의 Haskell 및 JavaScript 임베딩](https://www.youtube.com/playlist?list=PLNEK_Ejlx3x0maFKSYpW-17FV0B0MbAoW)
	5. [Marlowe와 표준화 / ACTUS](https://www.youtube.com/playlist?list=PLNEK_Ejlx3x0KLofo1maCkO3AYjQKknz-)
	6. [보증 및 편의성](https://www.youtube.com/playlist?list=PLNEK_Ejlx3x3PArP4vcu4WV0Z5xV0OLhy)
	7. [Marlowe CLI](https://www.youtube.com/playlist?list=PLNEK_Ejlx3x0GbvCw-61e9VfRafBT1JSw)
- [Marlowe Runtime 백엔드 사용으로 Cardano Preview 네트워크에서 Marlowe 계약 실행](https://youtu.be/WlsX9GhpKu8)
- [명령줄에서의 Marlowe Lambda](https://youtu.be/huXbRyrmW60)
- [브라우저에서의 Marlowe Lambda](https://youtu.be/o5m_y5l_i_g)
- [Cardano Beam과 Marlowe를 사용한 지리적 위치 스마트 컨트랙트](https://youtu.be/DmkYen0eaV0)

## 발표
- [블록체인 기초](https://www.youtube.com/watch?v=yi8-xaoTQT4)
- [도메인 특화 언어](https://www.youtube.com/watch?v=T4W19TdJHMw)
- [금융 계약](https://www.youtube.com/watch?v=1HRaRVyj2BI)
- [블록체인으로](https://www.youtube.com/watch?v=dhcmKmAZslc)
- [블록체인에 에스크로](https://www.youtube.com/watch?v=ADMCMDQK7Yo)
- [Marlowe 전체](https://www.youtube.com/watch?v=Ro8iBh7V7oc)

## 추가 튜토리얼
- [첫 번째 계약](https://www.youtube.com/watch?v=es4qpcHxr0I)
- [계약 구체화](https://www.youtube.com/watch?v=DS_ebkGwmXw)
- [선택과 관찰](https://www.youtube.com/watch?v=25fnB7C8mPE)
- [JavaScript로 Marlowe 계약 작성하기](https://www.youtube.com/watch?v=6tkZ3hlYZ7k)
- [playground에서 Haskell 사용하기](https://www.youtube.com/watch?v=S0crHs-wTAc)
- [playground에서 Javascript 사용하기](https://www.youtube.com/watch?v=Oeuyy5AAQ3o)
- [playground에서 직접 Marlowe 빌딩하기](https://www.youtube.com/watch?v=9lHkCq0H4pw)
- [Blockly에서 계약 구축하기](https://www.youtube.com/watch?v=9SKB5MfA_L8)
- [playground에서의 시뮬레이션](https://www.youtube.com/watch?v=3aFoN2wg9oc)
- [playground에서의 오라클](https://www.youtube.com/watch?v=LsTQEPMxyIU)
- [playground에서의 분석](https://www.youtube.com/watch?v=VmoUAifui38)
- [ACTUS labs](https://www.youtube.com/watch?v=6PPWFZEfkks)


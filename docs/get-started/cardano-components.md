---
id: cardano-components
title: Cardano 구성요소
sidebar_label: 개요
description: This article explains all the different Cardano components and their functions.
image: ../img/og/og-getstarted-cardano-components.png
--- 

Cardano 블록체인은 상호 연결된 노드들에 의해 구동됩니다. [`cardano-node`](https://github.com/input-output-hk/cardano-node#cardano-node-overview)는 핵심 블록 생성자, 릴레이, 네트워크의 로컬 진입점 역할을 할 수 있는 소프트웨어를 뜻합니다. 노드 자체는 상호 연결된 여러 요소로 구성됩니다.

- [`The settlement layer`](https://github.com/input-output-hk/cardano-ledger-specs#cardano-ledger): 일련의 공식 사양에서 나온 다중 시대의 렛저 구현체입니다. 여기서는 Cardano의 핵심이 되는 객체들과 이를 사용하기 위한 규칙이 정의됩니다. 이 레이어는 다른 모든 구성 요소가 기반으로 삼는 레이어입니다.

- [`The consensus layer`](https://github.com/input-output-hk/ouroboros-network/tree/master/ouroboros-consensus#consensus): 
Outoboros 프로토콜들의 합의 레이어에 대한 구현입니다. _"The Hard-Fork Combinator"_ 가 존재하는 레이어입니다. 기술적이긴 하지만 높은 수준의 설명을 보려면 [The Abstract Nature of The Consensus Layer](https://iohk.io/en/blog/posts/2020/05/28/the-abstract-nature-of-the-consensus-layer/)를 확인하세요.

- [`The networking layer`](https://github.com/input-output-hk/ouroboros-network/#ouroboros-network): 지분 증명 시스템에 맞춰진 P2P 네트워킹 스택입니다. 여기에는 파이프라인, 멀티플렉싱 및 악의적인 객체에 대한 보호 장치 등을 지원하는 형식화된 프로토콜을 작성하는 프레임워크를 포함합니다. 

- [`The scripting layer`](https://github.com/input-output-hk/plutus#plutus-core): _Plutus_ 라고도 하며, 네트워크에 스마트 컨트랙트 기능을 제공하기 위해 Cardano 렛저에 내장된 스크립트 언어입니다. 핵심 부분에는, 저수준의 인터프리트된 어셈블리어 코드 역할을 하는 일종의 람다 대수가 존재합니다. 

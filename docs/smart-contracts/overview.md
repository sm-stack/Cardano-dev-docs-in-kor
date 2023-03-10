---
id: overview
slug: /smart-contracts/
title: 스마트 컨트랙트
sidebar_label: 개요
description: Learn how to create smart contracts on Cardano.
image: ../img/og/og-developer-portal.png
--- 

![Smart Contracts](../../static/img/card-smart-contracts-title.svg)

## 스마트 컨트랙트란 무엇인가요?
스마트 컨트랙트는 사전 프로그래밍된 자동 디지털 계약입니다. 이는 스스로 실행되고, 불변하며, 부패를 저지를 수 없습니다. 또한 이는 어떤 행동이나 다른 사람의 존재를 필요로 하지 않습니다.

## 스마트 컨트랙트의 두 세계
우리는 스마트 컨트랙트와 금융 트랜잭션을 두 가지 세계로 나눌 수 있습니다.

한 세계에서 한 행위자(또는 행위자 그룹)에서 다른 행위자(또는 행위자 그룹)에게 가치를 전달하고자 합니다. 이를 위해 트리거 이벤트 뿐만 아니라 해당 값을 제어하는 규칙 및 상황, 그리고 해당 가치를 대표하는 것도 있어야 합니다. 금융 계약은 우리가 이를 부르는 명칭이며, 도메인 특화 언어를 사용하는 것이 가장 좋습니다. 이 세상은 대기업을 대체한다던가, 우리가 DApp에 대해 가질 수 있는 일반적인 개념과는 아무 관련이 없습니다.

다른 세계에서는 프로그램을 구축해서, 대기업을 대체하거나 작은 문제를 해결하고 싶을 것입니다. 이러한 어플리케이션에 의해 삼각형 구조가 형성됩니다.

- 클라이언트는 컴퓨터에서 실행되는 프로그램의 일부입니다.
- 서버는 다른 사람의 컴퓨터(또는 여러 서버)에서 작동하는 컴퓨터입니다.
- 스마트 컨트랙트는 분산 시스템이 운용하는 코드 조각입니다.

## 프로그래밍 언어
- [Marlowe](marlowe) - 도메인 특화 언어로, 금융 계약의 세계를 다룹니다.
- [Plutus](plutus) - Cardano 블록체인과 상호작용하는 전체 어플리케이션을 작성하는 플랫폼입니다.

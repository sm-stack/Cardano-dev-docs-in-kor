---
id: overview
slug: /stake-pool-course/
title: 스테이크 풀 코스
sidebar_label: 개요
description: This course is designed to (re)introduce you to Cardano, walk you through how to set up a stake pool, and provide guidance on managing and maintaining your stake pool to ensure optimal performance and profitability.
image: ../img/og/og-developer-portal.png
---

**환영합니다**, Cardano에 스테이크 풀을 세팅하는 데 관심 가져 주셔서 감사합니다.

이 코스는 Cardano를 다시 소개하고, 스테이크 풀 설정 방ㅂ법을 안내하며, 최적의 성능과 수익성을 보장하기 위해 스테이크 풀을 관리 및 유지하는 방법에 대한 지침을 제공하도록 설계되었습니다.

:::danger 테스트넷 전용
모든 스테이크 풀 코스는 테스트넷 전용입니다. 메인넷에서 풀을 실행하기 전에 테스트넷에서 많은 연습을 하고, KES 키를 바꾸는 방법을 배우며, 스테이크 풀 보안에 대해 잘 이해해야 합니다.
:::

## 앞으로 배울 것

<iframe width="100%" height="325" src="https://www.youtube.com/embed/Jb08HTkk7yo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;"></iframe>
<br/>

## 강의 계획

해당 코스는 여러 레슨과 각 레슨에 대한 전체 지침을 제공하는 핸드북으로 구성됩니다.

### Lesson 1

첫 번째 수업에서는 다음 내용을 배우게 됩니다.

1. [VirtualBox를 설정하는 방법](../stake-pool-course/lesson-1#install-virtualbox)
2. [AWS에서 Linux 서버를 설정하는 방법](../stake-pool-course/lesson-1#setup-a-linux-server-on-aws)
3. [다른 서버 공급자에서 서버를 구성하는 방법](../stake-pool-course/lesson-1#alternative-to-aws)
4. [cardano-node 설치 방법](../stake-pool-course/lesson-1#install-cardano-node)
5. [cardano-node를 시작하고 구성 파일을 가져오는 방법](../stake-pool-course/lesson-1#run-cardano-node)

### Lesson 2

두 번째 수업에서는 다음 내용을 배우게 됩니다.

* [UTxO은 무엇인가요?](/docs/stake-pool-course/lesson-2#the-utxo-model)
* [CLI로 지불 키 및 주소를 생성하는 방법](/docs/stake-pool-course/lesson-2#generate-payment-keys-and-addresses)
* [faucet을 요청하는 방법](/docs/stake-pool-course/lesson-2#request-funds-to-the-faucet)
* [트랜잭션 생성 및 제출 방법](/docs/stake-pool-course/lesson-2#create-a-simple-transaction)

### Lesson 3

세 번째 수업에서는 다음 내용을 배우게 됩니다.

* [스테이크 풀 키 및 주소 생성 방법](/docs/stake-pool-course/lesson-3#create-stake-pool-keys-and-adresses)
* [스테이크 풀 인증서 생성 및 등록 방법](/docs/stake-pool-course/lesson-3#create-and-register-a-stake-pool-certificate)

### Lesson 4

네 번째 수업에서는 다음 내용을 배우게 됩니다.

* [Key Evolving Signature(KES)란?](/docs/stake-pool-course/lesson-4#key-evolving-signature)
* [서약 메커니즘은 무엇인가요?](/docs/stake-pool-course/lesson-4#pledge-mechanism) 
* [스테이크 풀에 대한 키 및 인증서 생성 방법](/docs/stake-pool-course/lesson-4#generate-stake-pool-keys)
* [topology 파일 준비 방법](/docs/stake-pool-course/lesson-4#topology-files) 
* [스테이크 풀과 메타데이터를 블록체인에 등록하는 방법](/docs/stake-pool-course/lesson-4#register-stake-pool-metadata)
* [암호화 키를 보호하는 방법](/docs/stake-pool-course/lesson-4#secure-your-cryptographic-keys)

### Lesson 5

다섯 번째 수업에서는 다음 내용을 배우게 됩니다.

* [Prometheus로 로깅 및 모니터링을 수행하는 방법](/docs/stake-pool-course/lesson-5#logging-and-monitoring-with-prometheus)
* [Granfa 대시보드 사용 방법](/docs/stake-pool-course/lesson-5#grafana-dashboard)

## 코스 가이드 및 핸드북

이 코스에는 비디오 튜토리얼부터 [지원 가이드 및 핸드북](/docs/stake-pool-course/handbook/install-cardano-node-written)에 이르기까지 필요한 모든 것이 있습니다.

## 코스 과제

과정을 완전히 이해했는지 확인하려면 [과제](/docs/stake-pool-course/assignments/assignment-1)를 완료하세요.

:::tip 질문이나 제안사항이 있다면?
수업을 듣는 동안 질문이나 제안 사항이 있는 경우, [Cardano forum](https://forum.cardano.org/c/staking-delegation/setup-a-stake-pool/158)에서 언제든지 질문해 주시면 최대한 빨리 답변해 드리겠습니다.
:::


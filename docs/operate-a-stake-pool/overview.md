---
id: overview
slug: /operate-a-stake-pool/
title: 스테이크 풀 운영하기
sidebar_label: 개요
description: Operate a Cardano stake pool.
image: ../img/og/og-developer-portal.png
---

![Cardano Operate a Stake Pool](../../static/img/card-operate-a-stake-pool-title.svg)

cardano-node를 스테이크 풀로 설정하는 방법에 대한 훌륭한 가이드라인이 있습니다. 사전에 Linux를 써봤거나, 모범 사례에 대한 관심이 없었어도 충분히 설정할 수 있습니다. 지침에서 명령어를 복사하여 쉘에 붙여넣기만 하면 됩니다.

안타깝게도 노드를 시작하고 실행하는 것만으로는 충분하지 않습니다. 이를 관리, 업데이트 및 보호할 수 있어야 합니다. 그러기 위해서는 먼저 자신이 하고 있는 일이 무엇인지 이해해야 합니다.

이러한 기본 사항을 숙달한 후에는, 스테이크 풀을 성공적으로 만들기 위해 효과적으로 마케팅해야 합니다.
After you've mastered these fundamentals, you'll need to market your stake pool effectively in order to make it a success.

## 스테이크 풀을 운영하는 방법을 배우려는 사람의 전제 조건은 무엇인가요?
- 서버 관리 방법에 대한 지식이 있어야 합니다. 특히, 서버를 유지관리하려면 선택한 운영 체제에 대해 잘 알고 있어야 합니다.
- 여기에는 네트워크 작동 방식과 데이터 백업 및 복원 방법에 대한 철저한 이해가 포함됩니다.
- 문서 해석 및 모범 사례 구현 경험도 필요합니다.
- 기본 수준의 Cardano, 블록체인, 지갑 및 키 쌍에 대한 이해도 필요합니다.

## 요건을 충족하지 못했다면 어떻게 해야 하나요?
모든 자격조건을 전부 충족하지 못한다면, 공부에 대한 의지와 더불어 몇 주 안에 모든 것을 배울 수는 없다는 것을 이해해야 합니다.

우리는 Linux, 쉘 또는 네트워킹에 대한 사전 지식이 없었지만 이를 적절하게 처리할 수 있는 충분한 시간이 있는 사람들이 결국 현재 수익성 있는 스테이크 풀을 관리하고 있음을 알게 되었습니다. 물론 이는 모든 사람을 위한 것은 아니며, 간단하지 않겠지만 시작하는 데 도움이 되는 몇 가지 리소스를 정리해 두었습니다.

- [Linux로 다양한 작업을 해보세요](https://ubuntu.com/tutorials/command-line-for-beginners#1-overview).
- [nix and NixOS를 알아보세요](https://nixos.org).
- [편안함보다 보안을 선택하세요](#choose-security-over-comfort).
- [스테이크 풀 코스를 이수하세요](#스테이크-풀-코스).
- [스테이크 풀 운영자 포럼을 참고하세요](https://forum.cardano.org/c/staking-delegation/156).

## 편안함보다 보안을 선택하세요
이는 스테이크 풀을 운영할 때 항상 주요 고려 사항이어야만 합니다. 보안은 구성 파일에서 설정하거나 해제 혹은 변경할 수 있는 것이 아닙니다. 이는 태도이자 삶의 방식과 유사합니다.
- [스테이크 풀 운영자와 보안 관련 주제에 대해 논의하세요](https://forum.cardano.org/c/staking-delegation/stake-pool-security/157).

어떤 키를 사용할 수 있는지, 어떤 키가 보안에 민감한지, 아무리 편리하더라도 서버에 저장해서는 안되는 키에는 무엇이 있는지 알아보세요.
- [Cardano 키 쌍에 대해 알아보세요](cardano-key-pairs).


## 스테이크 풀 코스
이 튜토리얼은 최대 성능과 이익을 위해 스테이크 풀을 설정, 관리 및 유지하는 방법을 보여줍니다.
- [스테이크 풀 코스를 시작하세요](../stake-pool-course/).

## 스테이크 풀 마케팅하기
스테이크 풀 운영자라면, 기술적으로 완벽한 기능을 갖추는 것만으로는 충분하지 않다는 것을 눈치챘을 것입니다.

각자의 풀에 대해 Cardano 커뮤니티에서 충분한 위임자를 끌어들일 수 있는 브랜드를 형성해야 합니다.

- [어떻게 할 수 있는지에 대해서는 여기를 읽어보세요](marketing-stake-pool).

## 스체이크 풀 운영자 리소스
- [CNTools](https://cardano-community.github.io/guild-operators/#/Scripts/cntools)과 최고 수준의 컨텐츠로 유명한 [Guild Operators](https://cardano-community.github.io/guild-operators)
- 모든 사람이 수동으로 topology 완료 요청을 연기하고, 기다릴 필요 없이 릴레이 노드를 활성화할 수 있도록 하는 임시 솔루션인 [Topology Updater](https://cardano-community.github.io/guild-operators/#/Scripts/topologyupdater)
- cardano-cli의 성능 향상 및 확장을 위한 유틸리티 모음인 [CNCLI](https://github.com/AndrewWestberg/cncli)
- Cardano 스테이크 풀 관리 소프트웨어인 [Jormanager](https://bitbucket.org/muamw10/jormanager/src/develop/) . 
- 단계적으로 스테이크 풀 관리를 하기 위한 스크립트를 모아 놓은 [Stake Pool Operator Scripts](https://github.com/gitmachtl/scripts)
- 스테이크 풀 운영자를 위한 [Coin Cashew Guides](https://www.coincashew.com/coins/overview-ada/guide-how-to-build-a-haskell-stakepool-node)
- Cardano 스테이크 풀이 작동하는지 확인하고, 작동이 멈춘 이유를 찾는 데 도움이 되는 [Pool Veterinary](http://pool.vet).
- Stake Pool Operator Collective Representation Assembly라는 트레이드 길드가 만ㄷ느 스테이크 풀 설치 가이드인 [SPOCRA](https://members.spocra.io).
- Raspberry Pi 위에서 Docker를 사용해 테스트넷 및 메인넷에서 Cardano 스테이크 풀을 구축하고 실행하기 위한 가이드인 [RaspberryPi with Docker](https://github.com/speedwing/cardano-staking-pool-edu). [Youtube Playlist 참조](https://www.youtube.com/playlist?list=PLBhbLwOuj0DfTnneuG3vyoDHY7Dv_aiyq)
- 스테이크 풀을 설치하기 위한 친절하고 완벽한 스페인어 가이드인 [TOPO Guide](https://es-kb.topopool.com/primeros-pasos).

---
id: configure-topology-files
title: Topology 파일 구성
sidebar_label: Topology 파일 구성
description: "Stake pool course: Learn how to create stake pool keys."
image: ../img/og/og-developer-portal.png
---

노드를 시작하기 전에 블록 생성 및 릴레이 노드를 위한 topology 파일을 준비해야 합니다.

## 블록 생성 노드 구성하기

__블록 생성 노드__ 가 __귀하의__ 릴레이 노드와만 "통신"하도록 하세요. 방화벽도 구성하는 것을 잊지 마세요.

    nano mainnet-topology.json

```json
{
  "Producers": [
    {
      "addr": "<RELAY IP ADDRESS>",
      "port": <PORT>,
      "valency": 1
    }
  ]
}
```

## 릴레이 노드 구성

`topology.json` 파일을 편집하여 __릴레이 노드를__ __블록 생성 노드__ 및 네트워크의 __다른 릴레이 노드와__ 통신하도록 하세요.
Make your __relay node__ `talk` to your __block-producing__ node and __other relays__ in the network by editing the `topology.json` file:


    nano mainnet-topology.json

```json
{
  "Producers": [
    {
      "addr": "<BLOCK-PRODUCING IP ADDRESS>",
      "port": <PORT>,
      "valency": 1
    },
    {
      "addr": "<IP ADDRESS>",
      "port": <PORT>,
      "valency": 1
    },
    {
      "addr": "<IP ADDRESS>",
      "port": <PORT>,
      "valency": 1
    }
  ]
}
```

## (선택 사항) Guild Operators를 통해 릴레이 노드에 대한 `topologyUpdater.sh` 사용
전체 P2P가 활성화될 때까지 릴레이 노드의 `topology.json` 파일에 피어를 수동으로 추가해야 합니다. Guild Operators에서 `topologyUpdater.sh`  스크립트를 실행하여 이를 자동화할 수 있습니다. 이 스크립트의 도움으로 릴레이 등록 속도를 높일 수도 있습니다(현재 등록은 풀 등록에 따라 하루에 두 번 수행됨). cron을 사용하여 릴레이 노드에서 `topologyUpdater.sh`를 60분마다 실행하면 3시간(또는 4회 실행) 후에 릴레이가 등록됩니다. 그리고 가장 중요한 것은 원격 피어를 포함할 `topology.json`를 생성할 수 있다는 것입니다. 자세한 내용은 [여기](https://cardano-community.github.io/guild-operators/Scripts/topologyupdater/)를 참조하십시오 .

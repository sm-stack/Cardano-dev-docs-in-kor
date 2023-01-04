---
id: ogmios
title: Ogmios 시작하기
sidebar_label: Ogmios
description: Get Started with Ogmios
image: ../img/og/og-getstarted-ogmios.png
---

**Ogmios** 는 [cardano-node](https://github.com/input-output-hk/cardano-node/)용 경량 브릿지 인터페이스입니다. 이는 로컬 클라이언트로 하여금 JSON/RPC를 통해 [Ouroboros의 mini-protocols](https://hydra.iohk.io/build/1070091/download/1/network.pdf#chapter.3)을 말할 수 있게 해주는 WebSocket API를 제공합니다.

Ogmios는 노드 자체가 수행하는 것 이상을 수행하지 않습니다. 이는 Cardano 네트워크로 얻을 수 있는 것들 만큼이나 저수준의 것들입니다. 많은 어플리케이션의 경우, 이는 추상 레이어에서 너무 낮은 수준이며 [cardano-graphql](https://github.com/input-output-hk/cardano-graphql), [Rosetta](https://www.rosetta-api.org), 또는 [Blockfrost](https://blockfrost.io)를 사용하는 게 더 나을 것입니다.

## 설치

Ogmios를 시작하는 가장 쉬운 방법은 [docker](https://www.docker.com)를 사용하는 것입니다. Ogmios에는 Cardano 노드가 필요하므로, docker-compose를 사용하여 두 서비스를 조정하는 것이 좋습니다. compose 파일은 Ogmios 저장소에서 사용할 수 있으며, 다음을 통해 가져옵니다.

```sh
git clone --depth 1 https://github.com/CardanoSolutions/ogmios.git
cd ogmios
```

그러고 다음 명령어를 사용하여 구성요소 스택을 시작합니다.
```sh
docker-compose up
```

소스에서 또는 docker 없이 모든 것을 빌드하려면, [Ogmios website](https://ogmios.dev/getting-started)로 이동하십시오.
 

## 대시보드

이제 몇몇 서버 런타임 측정의 실시간 시각화를 통해 [http://localhost:1337](http://localhost:1337)에서 대시보드에 액세스할 수 있습니다.

![img](../../static/img/get-started/ogmios/1-dashboard.gif)

## 쿼리 메트릭

대시보드는 [http://localhost:1337/health](http://localhost:1337/health)에서 제공하는 JSON 응답을 통해 구동됩니다.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
defaultValue="curl"
values={[
{label: 'curl', value: 'curl'},
{label: 'wget', value: 'wget'},
]}>
<TabItem value="curl">

```sh
curl -H 'Accept: application/json' http://localhost:1337/health
```

  </TabItem>
  <TabItem value="wget">

```sh
wget --header='Accept: application/json' -qO- http://localhost:1337/health
```

  </TabItem>
</Tabs>

JSON 응답:

```json
{
    "metrics": {
        "totalUnrouted": 1,
        "totalMessages": 30029,
        "runtimeStats": {
            "gcCpuTime": 1233009354,
            "cpuTime": 81064672549,
            "maxHeapSize": 41630,
            "currentHeapSize": 1014
        },
        "totalConnections": 10,
        "sessionDurations": {
            "max": 57385,
            "mean": 7057,
            "min": 0
        },
        "activeConnections": 0
    },
    "startTime": "2021-03-15T16:16:41.470782977Z",
    "lastTipUpdate": "2021-03-15T16:28:36.853115034Z",
    "lastKnownTip": {
        "hash": "c29428f386c701c1d1ba1fd259d4be78921ee9ee6c174eac898245ceb55e8061",
        "blockNo": 5034297,
        "slot": 15520688
    },
    "networkSynchronization": 0.99,
    "currentEra": "Mary"
}
```

## Ogmios 문서

Ogmios 및 Ouroboros mini-protocol과 상호작용하는 법에 대해 자세히 알아보려면 [ogmios.dev](https://ogmios.dev/mini-protocols)를 방문하십시오.

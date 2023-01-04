---
id: utxo-model
title: 고전적인 UTxO 모델
sidebar_label: 고전적인 UTxO 모델
description: "Stake pool course: The classic UTxO model." 
image: ../img/og/og-developer-portal.png
---

고전적인 UTxO 모델(Byron 및 Shelley의 Cardano SL)에서 스크립트에 의해 잠긴 트랜잭션 출력은 두 가지 정보를 전달합니다.

* 값 (금액)
* 참조 주소 (누가 출력의 소유자인지 알려주는 소유권의 "증거")

모든 트랜잭션에는 최소한 하나의 입력과 최소한 하나의 출력이 있습니다. 트랜잭션은 자금 흐름에 대한 정보를 전달합니다. 입력은 돈이 어디서 왔는지(발신자 주소) 알려주고, 출력은 돈이 가는 곳(수신자 주소)을 알려줍니다. 모든 새 트랜잭션은 이전 트랜잭션의 출력을 사용하고 향후 트랜잭션에서 사용할 수 있는 새 출력을 생성합니다. 블록체인은 이러한 트랜잭션의 집합적인 기록을 기록합니다.

사용되지 않은 트랜잭션 출력은 UTxO라고 하며, 참가자가 소유 한 금액 중 새 트랜잭션에서 입력으로 사용할 수 있는 금액을 나타냅니다. 여기서 중요한 문제는 완전한 UTxO가 새 트랜잭션의 입력으로 사용되어야 한다는 것입니다. UTxO는 부분적으로 사용할 수 없습니다. 오히려 차액은 새로운 UTxO로 표시되는 트랜잭션 내에서 "거스름돈"으로 발신자에게 다시 전송됩니다.

예를 들어, 트랜잭션 수수료가 없는 상황에서 Alice가 100 ada를 가지고 있고 Bob이 20 ada를 가지고 있다고 가정해 보겠습니다. Alice가 Bob에게 40 ada를 전송하려는 경우 Alice는 새 트랜잭션에 대한 입력으로 전체 100 ada를 소비해야 합니다. 이 새로운 트랜잭션은 Bob에게 40 ada, Alice에게 60 ada의 두 가지 출력을 갖게 합니다.

따라서 지갑의 현재 잔액은 사용되지 않은 모든 트랜잭션 출력(UTxO)의 합계입니다. 향후 트랜잭션에서 해당 UTxO는 새 트랜잭션의 입력이 됩니다.

### 참고 문헌

[Cardano의 미사용 트랜잭션 출력 이해하기](https://emurgo.io/blog/understanding-unspent-transaction-outputs-in-cardano)

---
id: running-cardano
title: Cardano 노드 실행 방법
sidebar_label: cardano-node 실행
description: This guide will explain and show you how to run the cardano-node and components on your system.
image: ../img/og/og-getstarted-running-cardano-node.png
--- 
### 개요 

이 가이드는 시스템 내에서 `cardano-node` 와 `cardano-cli` 를 실행하는 방법과 **Cardano** 블록체인과 상호작용하는 몇 가지 간단한 예제에 대해 보여줍니다.

:::note
이 가이드는 `cardano-node` 와 `cardano-cli` 를 설치한 상황을 가정하고 진행됩니다. 만약 아직 설치하지 않았다면, [cardano-node 설치](/docs/get-started/installing-cardano-node)를 읽고 오시기 바랍니다.
:::

:::important
이 가이드는 블록을 생성하는 `cardano-node` 실행이나 **Cardano 스테이크 풀** 실행에 대한 것들은 다루지 않습니다. 해당 주제에 대한 자세한 내용은 [스테이크 풀 운영](/docs/operate-a-stake-pool/) 섹션을 참조하세요.
:::

## Cardano 블록체인 네트워크:
### 테스트넷
`preview` 와 `pre-prod` , 총 두 가지의 테스트넷이 있습니다.

- **Preview 테스트넷**: 릴리스 후보 및 메인넷 릴리스를 테스트합니다. 메인넷 하드 포크보다 최소 4주 앞서서 배포됩니다. 이 네트워크는 cardano-node와 함께 작동 방식을 확인하고, 익숙해지려는 사람들을 위한 것입니다. 

- **Pre-Production 테스트넷**: 릴리스 후보 및 메인넷 릴리스를 테스트합니다. 메인넷과 거의 동시에 (한 에포크 내에서) 포크됩니다. 이 테스트넷은 메인넷을 실행할 준비가 되었지만, 실행하기 전에 테스트하고 싶은 사람들에게 이상적인 테스트 환경을 제공합니다. 

### Production (메인넷)
이는 공식 메인넷 출시가 되는 환경입니다. cardano-node를 사용할 준비가 되면 이 네트워크를 사용하세요.

### 구성 파일

이 글을 작성하는 시점에서 `cardano-node` 어플리케이션을 실행하려면 최소 네 개의 구성 파일이 필요합니다.

- **Main Config**: **로깅**, **버저닝** 등의 일반적인 노드 설정을 포함합니다. 또한 이는 **Byron Genesis** 및 **Shelly Genesis** 파일을 가리킵니다.
- **Byron Genesis**: 초기 프로토콜 변수를 포함하며, `cardano-node` 로 하여금 **Cardano** 블록체인의 **Byron Era**를 부트스트랩하도록 합니다.
- **Shelly Genesis**: 초기 프로토콜 변수를 포함하며, `cardano-node` 로 하여금 **Cardano** 블록체인의 **Shelly Era**를 부트스트랩하도록 합니다.
- **Alonzo Genesis**: 초기 프로토콜 변수를 포함하며, `cardano-node` 로 하여금 **Cardano** 블록체인의 **Alonzo Era**를 부트스트랩하도록 합니다.
- **Topology**: 노드가 연결할 네트워크 피어 (**블록체인 네트워크를 실행하는 다른 노드의 `IP Address` 와 `Port`**) 목록을 포함합니다.

:::important
현재 `cardano-node` topology는 **Cardano** 블록체인의 네트워크 운영자 커뮤니티에서 수동으로 설정합니다. 그러나, 자동화된 p2p(peer-to-peer) 시스템이 작동 중입니다. 자세한 내용은 [Boosting network decentralization with P2P](https://iohk.io/en/blog/posts/2021/04/06/boosting-network-decentralization-with-p2p/)를 참조하세요.

**Cardano** 블록체인의 시대 및 업그레이드에 대한 자세한 내용은 [Cardano Roadmap](https://roadmap.cardano.org/en)을 참조하세요.
:::

현재 **Cardano** 블록체인 네트워크 구성 파일은 [The Cardano Operations Book > Environments](https://book.world.dev.cardano.org/environments.html)에서 다운로드할 수 있습니다.

…또는 다음을 실행할 수도 있습니다.:

#### 테스트넷 / Preview

**NetworkMagic**: `2`

```
curl -O -J https://book.world.dev.cardano.org/environments/preview/config.json
curl -O -J https://book.world.dev.cardano.org/environments/preview/db-sync-config.json
curl -O -J https://book.world.dev.cardano.org/environments/preview/submit-api-config.json
curl -O -J https://book.world.dev.cardano.org/environments/preview/topology.json
curl -O -J https://book.world.dev.cardano.org/environments/preview/byron-genesis.json
curl -O -J https://book.world.dev.cardano.org/environments/preview/shelley-genesis.json
curl -O -J https://book.world.dev.cardano.org/environments/preview/alonzo-genesis.json
```
#### 테스트넷 / Preprod

**NetworkMagic**: `1`

```
curl -O -J https://book.world.dev.cardano.org/environments/preprod/config.json
curl -O -J https://book.world.dev.cardano.org/environments/preprod/db-sync-config.json
curl -O -J https://book.world.dev.cardano.org/environments/preprod/submit-api-config.json
curl -O -J https://book.world.dev.cardano.org/environments/preprod/topology.json
curl -O -J https://book.world.dev.cardano.org/environments/preprod/byron-genesis.json
curl -O -J https://book.world.dev.cardano.org/environments/preprod/shelley-genesis.json
curl -O -J https://book.world.dev.cardano.org/environments/preprod/alonzo-genesis.json
```

#### 메인넷 / Production

**NetworkMagic**: `764824073`

```
curl -O -J https://book.world.dev.cardano.org/environments/mainnet/config.json
curl -O -J https://book.world.dev.cardano.org/environments/mainnet/db-sync-config.json
curl -O -J https://book.world.dev.cardano.org/environments/mainnet/submit-api-config.json
curl -O -J https://book.world.dev.cardano.org/environments/mainnet/topology.json
curl -O -J https://book.world.dev.cardano.org/environments/mainnet/byron-genesis.json
curl -O -J https://book.world.dev.cardano.org/environments/mainnet/shelley-genesis.json
curl -O -J https://book.world.dev.cardano.org/environments/mainnet/alonzo-genesis.json
```

최신 지원 네트워크는 https://book.world.dev.cardano.org/environments.html에서 확인할 수 있습니다.

:::note

각 네트워크에는 `config` 파일, `genesis` 파일, `topology` 파일 및 **Network Magic**이라고 불리는 고유 식별자가 있습니다.

이 섹션은 새로운 **Cardano** 네트워크가 각각의 구성 파일 및 **Network Magic**과 같이 온라인 상태가 되면, 업데이트될 것입니다.
:::

`mainnet` 과 `testnet` 간 차이점이 무엇이고 왜 두 네트워크가 있는지 궁금하실 수 있습니다. 간단히 이야기하자면, **Cardano**는 오픈 소스 블록체인이며, 누구나 **Cardano**의 소프트웨어 구성 요소를 기반으로 네트워크를 자유롭게 가동할 수 있습니다. `mainnet` 네트워크는 2017년 **Byron** 시대가 시작될 때 처음으로 구축된 네트워크였습니다. 그리고 네트워크에 참여하는 사람들은 해당 네트워크가 **Cardano**의 모든 진정한 가치가 모인 곳이라는 데 동의하였습니다.

네트워크의 특징과 기능을 테스트하는데에는 비용이 많이 들 수 있으며, 실제 가치(e.g. 돈, 시간)를 소비하게 됩니다. 따라서 [Input-Output Global](https://iohk.io)은 네트워크의 샌드박스, 즉 테스트넷 버전을 가동하고 있습니다. 여기선 트랜잭션에 실제 `ada` 토큰을 사용하는 대신 `tAda`, **테스트넷 ada**를 사용하게 됩니다. 추가적으로, 사용자 지정 **Cardano** 네트워크를 가동할 수도 있지만, 이는 이 가이드의 범위를 벗어납니다.

### 노드 실행

`cardano-node` 를 실행하여면 터미널에 다음과 같이 입력하세요. 

```bash
 cardano-node run \
   --topology path/to/mainnet-topology.json \
   --database-path path/to/db \
   --socket-path path/to/db/node.socket \
   --host-addr x.x.x.x \
   --port 3001 \
   --config path/to/mainnet-config.json
```

사용 가능한 옵션의 전체 목록을 보려면, `cardano-node run --help` 를 사용하세요.

```
Usage: cardano-node run [--topology FILEPATH] [--database-path FILEPATH] 
                        [--socket-path FILEPATH] 
                        [--byron-delegation-certificate FILEPATH] 
                        [--byron-signing-key FILEPATH] 
                        [--shelley-kes-key FILEPATH] 
                        [--shelley-vrf-key FILEPATH] 
                        [--shelley-operational-certificate FILEPATH] 
                        [--bulk-credentials-file FILEPATH] [--host-addr IPV4] 
                        [--host-ipv6-addr IPV6] [--port PORT] 
                        [--config NODE-CONFIGURATION] [--validate-db]
  Run the node.

Available options:
  --topology FILEPATH      The path to a file describing the topology.
  --database-path FILEPATH Directory where the state is stored.
  --socket-path FILEPATH   Path to a cardano-node socket
  --byron-delegation-certificate FILEPATH
                           Path to the delegation certificate.
  --byron-signing-key FILEPATH
                           Path to the Byron signing key.
  --shelley-kes-key FILEPATH
                           Path to the KES signing key.
  --shelley-vrf-key FILEPATH
                           Path to the VRF signing key.
  --shelley-operational-certificate FILEPATH
                           Path to the delegation certificate.
  --bulk-credentials-file FILEPATH
                           Path to the bulk pool credentials file.
  --host-addr IPV4         An optional ipv4 address
  --host-ipv6-addr IPV6    An optional ipv6 address
  --port PORT              The port number
  --config NODE-CONFIGURATION
                           Configuration file for the cardano-node
  --validate-db            Validate all on-disk database files
  --shutdown-ipc FD        Shut down the process when this inherited FD reaches
                           EOF
  --shutdown-on-slot-synced SLOT
                           Shut down the process after ChainDB is synced up to
                           the specified slot
  -h,--help                Show this help text
```
### cardano-node 매개변수

:::note
이 섹션에서는 `cardano-node` 관련 모든 파일을 저장하는 데 `$HOME/cardano/testnet` 경로를 사용할 것인데, 이는 예시일 뿐이고 실제로는 파일 저장을 위해 따로 디렉토리를 선택해서 이 경로 대신 사용하기 바랍니다.
:::
여기선 노드 실행을 위한 6가지 주요 명령줄 매개변수에 중점을 둘 것입니다.

**`--topology`**: 이는 [위에서](/docs/get-started/running-cardano#구성-파일) 설명한 대로 다운로드받은 `topology.json` 의 경로를 요구합니다.

> 예를 들어, 만약 `topology.json` 파일을 `$HOME/cardano/testnet/topology.json` 경로에 다운로드받았다면 인자는 다음과 같을 것입니다.
```
--topology $HOME/cardano/testnet/topology.json
```

**`--database-path`**: 이는 사람들이 **Cardano** 블록체인에 저장한 **블록**, **트랜잭션**, **메타데이터**와 같은 실제 블록체인 데이터를 저장하는 디렉토리의 경로를 예상합니다. cardano-db-sync 섹션에서 이러한 데이터를 쿼리하는 방법을 알아볼 것입니다.

> 예를 들어, `cardano-node` 에 필요한 모든 파일이 `$HOME/cardano/testnet` 경로에 있다고 한다면, `mkdir -p $HOME/cardano/testnet/db` 를 사용하여 데이터베이스 디렉토리를 만들 수 있습니다.  
> 그러면 디렉토리 구조는 다음과 같을 것입니다.
```
$HOME/cardano/testnet/
├── db
├── alonzo-genesis.json
├── byron-genesis.json
├── config.json
├── shelley-genesis.json
└── topology.json
1 directory, 4 files
```
> 아시다시피, 이 예제에서는 `testnet` 노드를 실행할 것이고 `$HOME/cardano/testnet/` 디렉토리에 구성 파일을 다운로드하였습니다. 또한 `$HOME/cardano/testnet/` 내부에 성공적으로 `db` 디렉토리를 생성한 것을 알 수 있습니다. 인자는 다음과 같을 것입니다.
```
--database-path $HOME/cardano/testnet/db
```
> 이 가이드를 계속 따르려면 위에 표시된 대로 구성 파일을 다운로드하고, Cardano 디렉토리로 이동하세요.

**`--socket-path`**: `cardano-node` 가 [IPC (Inter-Process-Communication)](https://en.wikipedia.org/wiki/Inter-process_communication)에 사용할 `unix socket` 또는 `named pipe` 로의 경로를 예상합니다.

> `cardano-node` 는 `cardano-cli`, `cardano-wallet` 및 `cardano-db-sync` 과 같은 다른 **Cardano**의 구성요소와 통신하기 위해 **IPC (Inter-Process-Communication)**를 사용합니다. **Linux**와 **MacOS**에서는 이를 [unix sockets](https://en.wikipedia.org/wiki/Unix_domain_socket)이라 부르고, **Windows**에서는 [Named Pipes](https://docs.microsoft.com/en-us/windows/win32/ipc/named-pipes)이라고 부릅니다.
> 
> 다음은 **Linux**에 대한 `--socket-path` 인자의 예시입니다. 
```
--socket-path $HOME/cardano/testnet/db/node.socket
```
> 보시다시피, **unix sockets**이 파일 형태로 표시되기 때문에 인자는 파일을 가리킨다고 할 수 있습니다. 이 경우, 방금 생성한 `db` 디렉토리에 해당 socket 파일을 넣습니다.
> 
> **Windows**에서 `--socket-path` 인자는 다음과 같은 형태일 것입니다.
```
--socket-path "\\\\.\\pipe\\cardano-node-testnet"
```
> 아시다시피, 이는 파일보단 네트워크 `URI` 또는 네트워크 `Path` 와 더 비슷해보입니다. 이는 운영체제에 따라 알아야 하는 중요한 차이점입니다. 인자 내 `cardano-node-testnet` 문자열을 마음대로 바꿀 수 있습니다. 이 예시 경로는 **Windows**용 [Daedalus Testnet Wallet](https://daedaluswallet.io)에서 사용됩니다. 
>

**`--host-addr`**: 이는 `cardano-node` 가 실행될 머신의 `IP Address` 를 예상합니다. 만약 해당 노드가 `relay` 노드로 실행된다면, 다른 노드들은 연결을 위해 이 주소를 `topology.json` 파일에서 사용할 것입니다.
> 다음은 `--host-addr` 인자의 예시입니다.
```
--host-addr 192.168.0.1
```
> 이 경우는 `cardano-node` 머신의 `IP Address` 가 실행 중이라고 가정했을 때, 당신의 [LAN (Local Area Network)](https://en.wikipedia.org/wiki/Local_area_network) 내 노드가 `192.168.0.1` 을 통해 연결되었다고 생각한 것입니다. 이를 실제 `IP Address` 로 변경하세요. 외부 노드가 연결될 것으로 예상하지 않거나, 혹은 필요하지 않다면 루프백 주소 `127.0.0.1` 을 사용할 수 있습니다. 만약 네트워크 인터페이스가 여러 개 있고 무엇을 사용해야 할지 확실하지 않은 경우 `0.0.0.0` 을 사용하여 모든 네트워크 인터페이스로부터 연결을 수락할 수 있습니다.

**`--port`**: `IP Address` 와 함께, `cardano-node` 가 들어오는 연결을 확인하는 데 사용하는 `port` 를 설정합니다.
> 다음은 `--port` 인자의 예시입니다.
```
--port 1337
```
> 원하는 `port` 숫자를 설정할 수 있지만, `1024` 이상의 `port` 숫자를 사용하는 것을 추천합니다. 자세한 내용은 [Registered Port](https://www.sciencedirect.com/topics/computer-science/registered-port)를 참조하세요.

**`--config`**: 이전에 다운로드한 기본 구성 파일의 경로를 예상합니다.
> 다음은 `--config` 인자의 예시입니다.
```
--config $HOME/cardano/testnet/config.json
```
> `alonzo-genesis.json`, `byron-genesis.json` 및 `shelley-genesis.json` 이 `config.json` 과 동일한 디렉토리에 있는지 확인하세요.

다음은 `cardano-node` 실행에 대한 실제 예시입니다.

```bash
cardano-node run \
--config $HOME/cardano/testnet/config.json \
--database-path $HOME/cardano/testnet/db/ \
--socket-path $HOME/cardano/testnet/db/node.socket \
--host-addr 127.0.0.1 \
--port 1337 \
--topology $HOME/cardano/testnet/topology.json
```

모든 것이 올바르게 설정되었으면, 다음과 같이 표시됩니다.

```
Listening on http://127.0.0.1:12798
[cardano.node.networkMagic:Notice:5] [2021-05-20 12:17:10.02 UTC] NetworkMagic 1097911063
[cardano.node.basicInfo.protocol:Notice:5] [2021-05-20 12:17:10.02 UTC] Byron; Shelley
[cardano.node.basicInfo.version:Notice:5] [2021-05-20 12:17:10.02 UTC] 1.XX.X
[cardano.node.basicInfo.commit:Notice:5] [2021-05-20 12:17:10.02 UTC] 9a7331cce5e8bc0ea9c6bfa1c28773f4c5a7000f
[cardano.node.basicInfo.nodeStartTime:Notice:5] [2021-05-20 12:17:10.02 UTC] 2021-05-20 12:17:10.024924 UTC
[cardano.node.basicInfo.systemStartTime:Notice:5] [2021-05-20 12:17:10.02 UTC] 2019-07-24 20:20:16 UTC
[cardano.node.basicInfo.slotLengthByron:Notice:5] [2021-05-20 12:17:10.02 UTC] 20s
[cardano.node.basicInfo.epochLengthByron:Notice:5] [2021-05-20 12:17:10.02 UTC] 21600
[cardano.node.basicInfo.slotLengthShelley:Notice:5] [2021-05-20 12:17:10.02 UTC] 1s
[cardano.node.basicInfo.epochLengthShelley:Notice:5] [2021-05-20 12:17:10.02 UTC] 432000
[cardano.node.basicInfo.slotsPerKESPeriodShelley:Notice:5] [2021-05-20 12:17:10.02 UTC] 129600
[cardano.node.basicInfo.slotLengthAllegra:Notice:5] [2021-05-20 12:17:10.02 UTC] 1s
[cardano.node.basicInfo.epochLengthAllegra:Notice:5] [2021-05-20 12:17:10.02 UTC] 432000
[cardano.node.basicInfo.slotsPerKESPeriodAllegra:Notice:5] [2021-05-20 12:17:10.02 UTC] 129600
[cardano.node.basicInfo.slotLengthMary:Notice:5] [2021-05-20 12:17:10.02 UTC] 1s
[cardano.node.basicInfo.epochLengthMary:Notice:5] [2021-05-20 12:17:10.02 UTC] 432000
[cardano.node.basicInfo.slotsPerKESPeriodMary:Notice:5] [2021-05-20 12:17:10.02 UTC] 129600
[cardano.node.addresses:Notice:5] [2021-05-20 12:17:10.05 UTC] [SocketInfo 0.0.0.0:9999,SocketInfo [::]:9999]
[cardano.node.diffusion-mode:Notice:5] [2021-05-20 12:17:10.05 UTC] InitiatorAndResponderDiffusionMode
[cardano.node.dns-producers:Notice:5] [2021-05-20 12:17:10.05 UTC] [DnsSubscriptionTarget {dstDomain = "relays-new.cardano-testnet.iohkdev.io", dstPort = 3001, dstValency = 2}]
[cardano.node.ip-producers:Notice:5] [2021-05-20 12:17:10.05 UTC] IPSubscriptionTarget {ispIps = [], ispValency = 0}
[cardano.node.ChainDB:Info:5] [2021-05-20 12:17:10.06 UTC] Opened imm db with immutable tip at genesis (origin) and chunk 0
[cardano.node.ChainDB:Info:5] [2021-05-20 12:17:10.06 UTC] Opened vol db
[cardano.node.ChainDB:Info:5] [2021-05-20 12:17:10.06 UTC] Replaying ledger from genesis
[cardano.node.ChainDB:Info:5] [2021-05-20 12:17:10.07 UTC] Opened lgr db
[cardano.node.ChainDB:Info:5] [2021-05-20 12:17:10.07 UTC] Opened db with immutable tip at genesis (origin) and tip genesis (origin)
[cardano.node.ChainDB:Notice:33] [2021-05-20 12:17:10.08 UTC] Chain extended, new tip: 1e64e74bd7ac76d6806480a28017deb0aedd356fb61844ec95c429ae2f30c7c3 at slot 0
```

블록체인 동기화에 시간이 걸릴 수 있으니, 기다려주세요. 동기화를 중지하려면 터미널에서 `CTRL` + `C` 를 누르면 됩니다. 올바른 매개변수로 `cardano-node run` 을 재실행하면 다시 블록체인 동기화를 재개할 수 있습니다.

### Cardano 블록체인 쿼리

이제 `cardano-node` 실행과 동기화가 완료되었으므로, 블록체인 팁 데이터(해당 로컬 노드가 동기화된 지점)를 쿼리하여 테스트할 수 있습니다. 이를 위해, `cardano-cli` 명령줄 어플리케이션을 사용할 것입니다.

그러나 그 전에, `cardano-cli` 와 다른 **Cardano** 소프트웨어 구성 요소는 노드 socket 파일이 어디에 위치해있는지 알아야 합니다. 이전 예제에서, 우리는 이를 `$HOME/cardano/db/node.socket` 에 저장하였습니다. 해당 구성 요소들은 이를 찾기 위해 쉘 환경 변수 `CARDANO_NODE_SOCKET_PATH` 를 읽게 됩니다.

따라서 사용하는 쉘 어플리케이션에 따라 `$HOME/.bashrc` 나 `$HOME/.zshrc` 를 통해 이를 설정해줄 것입니다. Windows의 경우, [How to Set Environment Variable in Windows](https://phoenixnap.com/kb/windows-set-environment-variable) 가이드를 따라하면 됩니다.

쉘 프로필의 맨 아래에 다음 라인을 추가합니다(**MacOS** 와 **Linux**).
```
export CARDANO_NODE_SOCKET_PATH="$HOME/cardano/testnet/db/node.socket"
```

저장한 후 변경 사항을 적용하려면 쉘/터미널을 다시 로드하세요.

이제 `cardano-node` 에서 블록체인 팁 쿼리를 테스트할 수 있습니다.

- 먼저 (아직 시작하지 않은 경우) 동기화 시작을 위해 별도의 터미널에서 `cardano-node` 를 실행합니다.
- 다른 터미널을 열어 다음 명령어 `cardano-cli query tip --testnet-magic 1` 를 입력합니다. 
> 다음과 같은 내용이 표시되어야 합니다.
```json
{
    "block": 2598870,
    "epoch": 133,
    "era": "Shelley",
    "hash": "7b5633590bf8924d8fce5b6515f34fga0c712f64e9b7d273f915656f88fba872",
    "slot": 27149964,
    "syncProgress": "57.09"
}
```

:::note
`testnet` 노드를 사용하고 있기 때문에, `cardano-cli query tip` 에 대한 매개변수에 `--testnet-magic <NetworkMagic>` 가 들어갑니다. 만약 `mainnet` 에서 쿼리하고 싶다면, `--mainnet` 매개변수를 사용하는 동시에 해당 노드가 `mainnet` 네트워크에 연결되어 있는지 확인하세요.
:::

여기에 표시되는 것은 노드의 로컬 팁 데이터입니다. 이 경우, `block: 2598870` 와 `slot: 27149964` 에 동기화되었음을 의미합니다.

`syncProgress` 는 노드가 동기화된 정도를 나타냅니다. `100` 에 도달하면 동기화가 완료되었다는 뜻입니다.

완전히 동기화되었는지 여부를 확인하려면, 관련 네트워크의 **Cardano Blockchain Explorer**를 확인하세요.

#### Mainnet Explorer
[https://explorer.cardano.org](https://explorer.cardano.org)

#### Testnet Explorer
[https://explorer.cardano-testnet.iohkdev.io](https://explorer.cardano-testnet.iohkdev.io)

**Latest Blocks** 섹션까지 아래로 스크롤하면 최신 네트워크 팁을 찾을 수 있습니다.

![img](../../static/img/integrate-cardano/latest-block.png)

:::important
트랜잭션을 만들기 전에 블록체인 네트워크와 완전히 동기화되었는지 확인하세요.
:::

축하합니다! 이제 **Cardano**의 세계를 탐험할 준비가 되셨습니다!
🎉🎉🎉

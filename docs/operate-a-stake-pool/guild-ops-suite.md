---
id: guild-ops-suite
title: Guild Operators 도구 시작하기
sidebar_label: Guild Operators 제품군
description: Get Started with Guild Operators Tools
image: ../img/og/og-developer-portal.png
---

## Guild Operators 제품군

Guild Operators 제품군은 Cardano 스테이크 풀을 설정, 관리 및 모니터링하고 토큰 및 키를 관리하기 위한 도구 및 스크립트 세트입니다. 이는 운영자가 해야 할 일을 더 쉽게 만들기 위해 오랫동안 커뮤니티 구성원들이 협력 및 노력한 결과입니다. 우리는 관련 도구에 대한 빠른 실행 및 시작 절차에 대해 높은 수준의 개요를 제공하려고 노력하고 있고, [여기][guild-website]에 해당 제품에 대한 전체 문서가 호스팅됩니다.

### 도구

#### CNTools

CNTools는 일반 작업을 더 쉽게 만들고자 하는 풀 운영자를 위한 일종의 맥가이버 칼입니다. 이는 지갑 생성 및 관리, ADA 및 토큰 전송, 기타 모든 풀 기능을 위한 메뉴 중심의 bash-GUI 어플리케이션입니다. 또한 이 도구는 Cardano Shelley Mainnet의 도입과 동시에 2020년 7월 최초 릴리스 이후 쭉 새로운 기능과 개선 사항을 포함한 업데이트가 이루어지고 있습니다. CNTools에 대한 자세한 내용은 [여기](https://cardano-community.github.io/guild-operators/Scripts/cntools/)에서 확인할 수 있습니다.

![img](../../static/img/get-started/guild-ops-suite/guild_cntools.png)  

#### gLiveView

Guild LiveView는 노드 상태를 모니터링하기 위한 쉬운 인터페이스가 있는 로컬 bash CLI 모니터링 툴으로, 보통 gLiveView라고 불립니다. 지정된 EKG/Prometheus 노드 엔드포인트를 통해 로컬에서 실행 중인 노드에 연결하여 노드 통계, 네트워크 정보 및 기타 정보를 실시간으로 수집하여 표시해줍니다. 프로그램은 노드가 릴레이 아니면 블록 생산자 중 어느 것으로 사용되는지의 여부를 인식하고 그에 따라 출력을 조정합니다. gLiveView에 대한 자세한 내용은 [여기](https://cardano-community.github.io/guild-operators/Scripts/gliveview/)에서 확인할 수 있습니다.
![img](../../static/img/get-started/guild-ops-suite/guild_gliveview.png)  

#### Topology Updater
Topology Updater는 스테이크 풀 릴레이가 네트워크에서 피어를 자동 검색하고 페어링할 수 있도록 하는 솔루션입니다. 다른 우선 순위로 인해 P2P 구현이 보류된 와중에, 이 스크립트는 수동으로 피어와 소통하고 개별 노드를 topology 파일에 포함하도록 요청하지 않아도 되는 기능을 제공하며 중요한 도구로 사용되고 있습니다. 해당 도구에 대한 자세한 내용은 [여기](https://cardano-community.github.io/guild-operators/Scripts/topologyupdater/)에서 확인할 수 있습니다.
![img](../../static/img/get-started/guild-ops-suite/guild_topologyupdater.png)  

#### 다른 네트워크를 위한 Guild Network 및 지원 사항

Guild Network는 테스트넷과 유사하게 기능하지만, 전적으로 커뮤니티에 의해 관리되는 간단한(1 에포크 : 30분) 네트워크입니다. 다른 네트워크에 출시하기 전에 실행 가능한 기능을 테스트할 뿐만 아니라 샌드박스에서 테스트하는 데에 매우 탁월합니다. 이 네트워크는 이미 메인넷, 테스트넷 및 스테이징을 포함하여 레퍼지토리 내 모든 도구에서 지원됩니다.

#### 기타..

규모가 작은 다른 유틸리티 스크립트에는 특정 요소에 대한 소스, 환경설정 전제조건 등에서 핵심 구성 요소를 생성합니다. [여기][guild-website]에서 자세한 내용을 읽을 수 있습니다.

:::note
    시작 전에 guild website에 적힌 disclaimer를 읽으세요!
:::

### 전제 조건 설정

OS 패키지 및 의존성 설치를 위해 [샘플 디렉토리 구조](https://cardano-community.github.io/guild-operators/basics/#folder-structure) 설정이 예시로 제시되어 있습니다. 이는 길드 도구, 구성 가져오기, 제네시스 아티팩트, 도구 스크립트 다운로드 등을 위한 템플릿 입력(사용자 정의 가능)의 예시로 사용됩니다. 스크립트에는 여러 옵션이 있습니다(넣고 싶은 구성요소/인자를 확인하려면 `-h` 를 사용하세요).

``` bash
mkdir "$HOME/tmp";cd "$HOME/tmp"
curl -sS -o prereqs.sh https://raw.githubusercontent.com/cardano-community/guild-operators/master/scripts/cnode-helper-scripts/prereqs.sh
chmod 755 prereqs.sh
./prereqs.sh
. "$HOME"/.bashrc
```

### Node/DBSync 구성 요소 빌드

[여기](../../docs/get-started/installing-cardano-node.md)의 가이드를 이미 본 것이라고 생각하고 진행하겠습니다. 길드 문서에는 서로 다른 cardano-node, cardano-db-sync, offline-metadata-tools를 빌드하고 dbsync로 postgres+postgREST를 설정하는 데 사용할 수 있는 빌드 스크립트 및 지침이 있습니다. [여기](https://cardano-community.github.io/guild-operators/build/)에서 각각에 대한 지침을 탐색할 수 있습니다. 이 지침은 systemd 서비스로도 배포되고, 수동으로 관리하지 않도록 권장됩니다.

### 사용자 지정 구성

이제 OS 의존성과 노드 바이너리를 설정하였으므로, 노드에 대한 구성, 경로, 이름 등을 사용자 지정할 차례입니다. [env](https://cardano-community.github.io/guild-operators/Scripts/env/) 파일을 사용하면 이를 수정할 수 있습니다. 파일 내 각 라인에는 기본값과 변수의 의미에 대한 간단한 설명이 포함되어 있습니다.

### 기여/피드백

[github 레퍼지토리][guild-github]를 통한 Issue/PR로 가능합니다.  

### 지원 요청

[지원 요청을 위해 Telegram 채널][guild-tg]을 가지고 있지만, [홈페이지][guild-website]에서 강조했던 기본 기술 세트에 대해서만 지원할 예정입니다.

[guild-github]: https://github.com/cardano-community/guild-operators
[guild-website]: https://cardano-community.github.io/guild-operators
[guild-tg]: https://t.me/guild_operators_official

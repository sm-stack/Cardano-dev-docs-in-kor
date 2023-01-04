---
id: koios
title: Koios 시작하기
sidebar_label: Koios
description: Get Started with Koios
image: ../img/og/og-getstarted-koios.png
---

Koios 는 (메인넷, 테스트넷 및 길드넷 네트워크에서) Cardano 블록체인을 쿼리할 수 있는 오픈 소스 및 탄력적 API 레이어를 제공합니다. 
Koios API 소비자가 얻을 수 있는 주요 유연성은 Koios를 가벼운 웹 서비스로 사용하거나, 자동 장애 조치 및 고가용성 지원을 통해 쿼리 레이어르 선택적으로 `extend` 할 수 있다는 것입니다. 인스턴스를 실행할 때, 업스트림에 추가할 필요가 없는 유즈 케이스의 경우 개별 서비스에 엔드포인트를 자유롭게 추가할 수 있습니다.

소비자 관점에서 기본부터 시작하여 Koios 인스턴스를 공급자로 실행하는(독립적으로 혹은 Koios 클러스터의 기존 구성원에 추가하는) 방법에 대해 간략하게 요약해 보았습니다.

## 사용 방법

### API 문서

[여기](https://api.koios.rest)에서 API 문서에 액세스할 수 있습니다. Koios는 [PostgREST](https://postgrest.org/)를 통해 데이터를 제공합니다. 즉, 데이터를 수직 및 수평으로 쉽게 필터링하고 [가이드](https://api.koios.rest/#overview--api-usage)에 따라 내장된 주문이나 맞춤형 체이징의 이점을 누릴 수 있습니다. 사용 시 엔드포인트에 액세스할 수 있는 중앙 집중식 레지스트리는 대부분의 경우 없습니다.

문서의 각 엔드포인트는 브라우저에서 직접 실행할 수 있는 예제를 사용하여 테스트에 쓰이는 샘플 curl 명령을 제공합니다.

![img](../../static/img/get-started/koios/1-usage.png)
 
### 한계점

Koios 서비스를 원격으로 사용하는 경우, 스팸으로부터 보호하거나 잠재적으로 인스턴스 공급자에 대한 서비스 거부를 유발할 수 있는 특정 조치들이 존재합니다. [여기](https://api.koios.rest/#overview--limits)에 언급된 제한 사항에 유의하십시오.

## 기능 요청/토론

문제를 발견했거나 기능을 요청(기존 또는 새 엔드포인트)하는 경우 먼저 [Koios Artifacts](https://github.com/cardano-community/koios-artifacts) 레퍼지토리에 issue를 연 다음, [Koios discussions](https://t.me/+zE4Lce_QUepiY2U1) 그룹에서 해당 주제에 대해 자유롭게 토론하시면 됩니다.

## 인스턴스 제공자로 참여하기

외부 연결에 의존하는 대신, 모든 것을 로컬에서 실행하려는 사람들이 항상 있을 것입니다. 일반적으로 이들은 기본 API 제한을 무시하고, 각자만의 요구 사항이 있으며, 대기 시간을 제거하고 싶어하는 API(explorer/지갑 제공자/마켓플레이스)의 유저 **또는** API 레이어에 기여하고 싶은 열정 있는 사람들입니다. 

이러한 사람들을 위해, 현재 널리 받아들여진 `guild-operators` 제품을 활용하여 gRest 인스턴스를 생성할 수 있는 간단한 스크립트를 만들기 위해 노력하고 있습니다. 이 독립적인 gRest 인스턴스는 (최신 `koios` 태그에서 빌드되었다고 가정했을때) api.koios.rest에서 호스팅되는 API 문서에 대해 100% 호환성과 기능들을 제공할 것입니다.

### 인프라 크기 조정

현재 대부분의 인프라 크기 조정은 `cardano-node`, `cardano-db-sync` 및 `postgres` 의 크기 조정에 의존하고, 연결하는 네트워크에 따라 사용량이 다릅니다. [여기](https://github.com/input-output-hk/cardano-db-sync#system-requirements)에서 시스템 요구 사항에 대한 공식 `cardano-db-sync` 문서를 찾을 수 있습니다. 일반적인 dbsync+node+postgres 인스턴스를 실행하는 경우, 기본적인 권장 사항으로 메인넷에 대해 64GB RAM, 테스트넷에 16GB, 길드넷에 8GB를 사용하는 것이 좋습니다(2022년 5월 기준, 만약 이것이 충분하지 않다면 해당 페이지에 다시 업데이트하겠습니다).

:::note

많은 최신 클라우드 설계자가 서비스를 분할하고 하드웨어를 물리적으로 배포하길 원한다는 점을 이해하지만, `cardano-db-sync` 와 `postgres` 는 (인프라와 설정을 이해하고 이에 따라 설정을 크게 조정하지 않는 한) 분할하면 안된다는 점에 유의하십시오. 이렇게 하는 것은 끔찍한 결과를 낳을 것입니다. PostgREST와 HAProxy를 마이크로서비스로 자유롭게 분할할 수 있지만, 그에 따라 스크립트를 조정해야 합니다. 배포에 완전히 익숙해지면 그렇게 할 수도 있습니다. 이것이 우리가 현재 docker 브랜치에 대한 작업을 일시 중지한 이유이기도 합니다.

:::

### 인스턴스 설정

gRest 인스턴스 설정과 간련된 일반적인 단계는 다음과 같습니다(인프라를 이미 설정했다고 가정). 

1. 의존성을 위해 OS를 설정하고, [prereqs script](https://cardano-community.github.io/guild-operators/basics/#pre-requisites)를 사용하여 폴더 구조를 만듭니다.

2. PostgreSQL 서버를 설치한 후, 인프라에 맞는 튜닝 연습을 합니다. [여기](https://cardano-community.github.io/guild-operators/Appendix/postgres/)에서 샘플 가이드를 참조하십시오.

3. Cardano 노드를 설정하고 노드와 현재 에포크와 동기화될 때까지 기다립니다. [여기](https://cardano-community.github.io/guild-operators/Build/node-cli/)에서 샘플 지침을 참조하십시오. 또한, API 문서엣 일관된 경로를 사용하여 트랜잭션을 제출할 수 있도록 `cardano-submit-api` 를 동일한 서버에 설치할 수도 있습니다.

4. 노드가 동기화되면, [여기](https://cardano-community.github.io/guild-operators/Build/dbsync/) 지침에 따라 dbsync 인스턴스를 설정합니다(스크래치로부터 동기화하는 것 대신 스냅샷을 사용하기 더 쉬움). 터미널의 스크립트가 아닌 systemd 서비스로 dbsync를 실행하고 있는지 확인하십시오.

5. 이제 [여기](https://cardano-community.github.io/guild-operators/Build/grest/#setup)에서 설명된 세부사항에 따라 `setup-grest.sh` 스크립트를 실행할 수 있을 것입니다. 따라서, 메인넷 버전에 대해 gRest를 배포하려는 경우 모든 구성요소, 엔드포인트를 설정하고 시스템에다가 서비스로 이를 배포하기 위해 `./setup-grest.sh -f -i prmcd -q -b <branch/tag>` 를 실행할 수 있습니다.

6. [선택 사항] [ogmios](https://ogmios.dev) 인스턴스를 설치하여 귀하의 인스턴스에서 이를 활성화할 수도 있습니다. 이는 현재 디폴트 값으로 활성화되어 있지 않은 상태입니다. 직접 액세스할 때 RESTful 인터페이스보다 서버-클라이언트 아키텍처에 더 적합한 WSS를 통한 고급 세션 관리가 필요하기 때문입니다. 향후 이 서비스를 활용하는 미들웨어가 있을 수도 있지만, Koios API V1의 범위는 아닙니다.

### 중요한 구성 파일/포트

기본적으로 다음은 위의 지침을 사용하는 다양한 서비스에 대한 구성, 서비스 및 포트 매핑입니다.

|Component          | Config                                  | Port  | Default Service Name |
|-------------------|-----------------------------------------|-------|----------------------|
|PostgreSQL         | /etc/postgresql/14/main/postgresql.conf | 5432  | postgresql           |
|Cardano-Node       | /opt/cardano/cnode/files/config.json    | 6000  | cnode                |
|Cardano-Submit-API | /opt/cardano/cnode/files/config.json    | 8090  | cnode-submit-api     |
|Cardano-DB-Sync    | /opt/cardano/cnode/files/dbsync.json    | N.A.  | cnode-dbsync         |
|PostgREST          | /opt/cardano/cnode/priv/grest.conf      | 8050  | cnode-postgrest      |
|HAProxy            | /opt/cardano/cnode/files/haproxy.cfg    | 8053  | cnode-haproxy        |
|Prometheus Exporter| /opt/cardano/cnode/scripts/getmetrics.sh| 8059  | cnode-grest_exporter |
|Health-Check script| /opt/cardano/cnode/scripts/grest-poll.sh| N.A.  | N.A.                 |

쿼리 엔드포인트에 대한 진입점은 항상 HAProxy 포트여야 합니다. ([링크](https://cardano-community.github.io/guild-operators/Build/grest/#tls)의 문서에서 언급한 대로 해당 서비스에 대한 SSL을 활성화할 수 있습니다)

로컬 머신 외부의 인스턴스에 연결할 수 있도록 HAProxy 포트에 대한 방화벽 규칙을 조정해야 합니다. 엔드포인트에 액세스하기 위해 다른 포트를 노출할 필요는 없습니다.

### Koios 클러스터에 참여하기

모든 gRest 인스턴스는 모니터링 인스턴스에서 일부 서비스에 대한 연결을 열기만 하면 Koios 클러스터에 참여할 수 있습니다. 클러스터에 Koios 인스턴스로 참여하려면, 다음과 같은 단계를 따르십시오.

1. 토폴로지에 대한 연결 정보를 지정하는 [koios-artifacts](https://github.com/cardano-community/koios-artifacts/tree/main/topology) 레퍼지토리에 PR을 제출합니다. 만약 IP를 숨기고 싶다면(방화벽을 쓰고 있는 경우에도), 토론 그룹을 통한 접근을 해도 괜찮습니다.

2. 모니터링 인스턴스에 대해 Prometheus Exporter(상태 모니터링 및 분석), HAProxy 및 Cardano-Submit-API용 포트를 엽니다.

3. 버전 릴리스에 대한 업데이트를 따르기 위해 최선을 다합니다. 릴리스는 일반적으로 토요일 오전 8시(UTC)에 이루어지며, 변경 로그와 함께 사전에 통지됩니다.

## 다른 조회/후속 조치

매월 2번째/4번째 목요일 격주로 공개 모임이 있습니다. 자유롭게 [Koios 토론](https://t.me/+zE4Lce_QUepiY2U1)에 참여하고 고정된 메세지를 따르십시오.

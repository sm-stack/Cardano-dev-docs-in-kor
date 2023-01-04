---
id: grafana-loki
title: Grafana Loki 튜토리얼
sidebar_label: Grafana Loki 튜토리얼
description: "Stake pool course: Grafana Loki Tutorial"
image: ../img/og/og-developer-portal.png
---

우리가 여러 개의 Cardano 노드를 실행한다면, 정기적으로 일부 노드의 로그를 검토해야 할 수도 있습니다. 오류가 발생하거나 블록을 놓친 경우 그 원인을 알아내야 합니다. 저는 개인적으로 tail, grep 등으로 로그를 살펴보곤 했습니다. 그러나 그다지 생산적인 방법은 아닙니다. 예를 들어 5월 5일 12:00-12:05 UTC에 대한 모든 노드의 모든 로그를 어떻게 필터링할 수 있습니까? 물론 여러 머신에서 grep한 다음 함께 조각낼 수는 있지만, 모든 로그가 저장되는 중앙 저장소가 존재하고 모든 노드의 모든 로그를 동시에 또는 특정 조건에서 검색할 수 있다면 어떨까요? 

그래서 여기에서 모든 카르다노 노드에 대한 중앙 집중식 로그 솔루션을 개인적으로 구축하는 방법을 설명하고자 합니다. 저는 grafana loki에 사용하여, 로그를 수신하면 grafana에서 볼 수 있도록 하였습니다. 이는 grafana가 SPO에서 널리 사용되는 한 합리적인 선택이라고 생각합니다. 이를 위해 기존 인프라에 추가되어야 하는 사항은 적습니다.

## 1. Loki 설치

저는 얼마 전에 docker-compose를 사용하여 개인적으로 Grafana & prometheus를 설치했기 때문에, Loki를 설치하려면 docker-compose를 업데이트해 주어야 하였습니다.

제가 Grafana, Loki 및 Prometheus에 개인적으로 사용한 Grafana-prometheus-loki docker-compose 파일은 여기에서 찾을 수 있습니다.

[docker-compose 파일](https://github.com/os11k/grafana-loki-prometheus)

기존 grafana 없이 시작하거나, 지금 docker를 사용하려는 경우 다음 명령 5개만 실행하면 됩니다(debian 기반 Linux 배포판을 사용한다고 가정).

```shell
apt-get update && apt-get upgrade -y && apt-get install docker-compose -y
mkdir /docker && cd /docker
git clone https://github.com/os11k/grafana-loki-prometheus.git
cd ./grafana-with-prometheus/
docker-compose up -d --build
```
`./etc-prometheus/prometheus.yml` 설정에 따라 업데이트하는 것을 잊지 마세요.

Loki만 설치하려고 한다면, docker-compose.yml을 업데이트하고 grafana 및 prometheus와 관련된 모든 부분을 주석 처리해야 합니다.

```shell
version: "3.5"

services:
#  grafana:
#    container_name: grafana
#    network_mode: "host"
#    image: grafana/grafana:latest
#    restart: always
#    volumes:
#      - grafana_data:/var/lib/grafana
#    logging:
#      driver: "json-file"
#      options:
#        max-size: "200k"
#        max-file: "10"
#  prometheus:
#    container_name: prometheus
#    network_mode: "host"
#    image: prom/prometheus:latest
#    restart: always
#    volumes:
#      - ./etc-prometheus:/etc/prometheus
#      - prometheus_data:/prometheus
#    logging:
#      driver: "json-file"
#      options:
#        max-size: "200k"
#        max-file: "10"
  loki:
    container_name: loki
    network_mode: "host"
    image: grafana/loki:latest
    restart: always
    volumes:
      - ./etc-loki:/etc/loki
      - loki_data:/loki
    command: -config.file=/etc/loki/loki-config.yml
    logging:
      driver: "json-file"
      options:
        max-size: "200k"
        max-file: "10"
volumes:
#    prometheus_data: {}
#    grafana_data: {}
    loki_data: {}
```

Loki를 설치하는 다른 방법이 몇 가지 또 있지만 개인적으로 다음과 같은 방법은 피하고 싶습니다.

[Ubuntu 20.04에 Loki를 설치하는 법](https://lindevs.com/install-loki-on-ubuntu/)

## 2. 로그를 Loki에 푸시하기 위한 에이전트 설치 및 구성하기

Loki가 설치되면 Loki에 로그를 푸시하도록 노드를 구성해야 합니다. 카르다노 노드가 docker에서 실행 중인 경우 docker 모듈을 설치하고 docker 엔진을 다시 시작하면 됩니다.

```shell
docker plugin install grafana/loki-docker-driver:latest --alias loki --grant-all-permissions
systemctl restart docker
```

다음을 통해 모든 것이 잘 있는지 확인할 수 있습니다.

```shell
docker plugin ls
```

새로 설치된 docker용 플러그인이 표시되어야 합니다.

```shell
ID             NAME          DESCRIPTION           ENABLED
b20ef946c02f   loki:latest   Loki Logging Driver   true
```
그런 다음 각 컨테이너를 개별적으로 구성할 수 있습니다. 예를 들어 저는 방금 docker-compose에 해당 줄을 추가했습니다(loki-ip에 당신의 Loki IP를 입력하는 것을 잊지 마세요).


```shell
    logging:
      driver: loki
      options:
        loki-url: http://loki-ip:3100/loki/api/v1/push
        max-size: 50m
```
또는 `/etc/docker/daemon.json` 파일을 생성하여 모든 컨테이너에 대해 한 번 구성할 수 있습니다(다시 loki-ip를 당신의 Loki IP 주소로 변경하는 것을 잊지 마세요).



```shell
{
    "debug" : true,
    "log-driver": "loki",
    "log-opts": {
        "loki-url": "https://loki-ip/loki/api/v1/push",
        "max-size": "50m"
    }
}
```

`daemon.json`를 생성하거나 편집한 경우, docker 서비스를 다시 시작해야 합니다.

```shell
systemctl restart docker
```


:::note

최대 크기 설정이 이상해 일 수 있지만, 이는 필요합니다. 설정하지 않으면 loki docker 플러그인이 모든 공간을 채울 것입니다.

:::


Loki에 로그를 보낼 수 있도록 컨테이너를 다시 생성해야 합니다.


```shell
docker-compose down
docker-compose up -d --build
```

더 자세한 내용은:

[Docker 드라이버 구성하기](https://grafana.com/docs/loki/latest/clients/docker-driver/configuration/)

[Loki로 docker 로그 수집](https://yuriktech.com/2020/03/21/Collecting-Docker-Logs-With-Loki/)

도커가 아닌 노드를 실행하는 경우, Loki에 로그를 푸시하는 클라이언트인 promtail을 설치해야 합니다.

[Ubuntu 20.04에 Promtail 설치](https://lindevs.com/install-promtail-on-ubuntu/)

promtail도 구성해야 합니다. 다음은 작동해야 하는 간단한 구성 파일입니다(시도해보지는 않았습니다).

```shell
server:
  http_listen_port: 0
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

client:
  url: http://localhost:3100/api/prom/push

scrape_configs:
- job_name: system
  entry_parser: raw
  static_configs:
  - targets:
      - localhost
    labels:
      job: varlogs
      __path__: /var/log
```
올바른 Loki IP를 입력해야 합니다. 위의 예에서 이는 localhost이고, 추가로 cardano-node 로그가 저장되는 디렉토리를 변경해야 합니다. 위의 예에서는 /var/log이고, 이를 업데이트해야 합니다.

구성 파일은 [여기](https://github.com/rongfengliang/grafana-loki-demo/blob/master/promtail-local-config.yaml)에서 가져왔습니다.

Loki는 로그를 직접 가져오지 않습니다. promtail 또는 docker 엔진이 로그를 Loki로 푸시합니다. 따라서 Loki에 기본 9100 포트를 사용하는 경우 클라이언트(이 경우 Cardano 노드)에서 9100 포트에서 Loki에 액세스할 수 있어야 합니다. cardano 노드에서 telnet 명령어로 확인할 수 있습니다.

```shell
telnet loki-ip 9100
```

성공적으로 연결되면 다음과 같이 표시됩니다.

```shell
Connected to loki-ip.
Escape character is '^]'.
```

## 3. Grafana에서 Loki 데이터소스 구성하기
Configuring Loki datasource in Grafana

Loki가 설치되고 Loki 클라이언트가 구성되면(docker 드라이버 또는 promtail) Loki를 Grafana에 소스로 추가해야 합니다. 이는 prometheus에 대해 수행한 것과 동일한 프로세스입니다.


구성 => 데이터소스:

![Datasource](/img/stake-pool-course/loki-grafana-datasource.png)

데이터 소스 추가를 누른 다음, 목록에서 Loki를 선택합니다.

![Datasource](/img/stake-pool-course/loki-grafana-select-loki.png)

다음 화면이 표시됩니다.

![Datasource](/img/stake-pool-course/loki-grafana-data-source-loki.png)

Grafana와 동일한 상자 또는 위에서 설명한 docker에서 Loki를 실행하는 경우 다음과 같이 URL에 localhost를 입력하기만 하면 됩니다.

![Datasource](/img/stake-pool-course/loki-grafana-configure-ip.png)

다른 서버에서 Loki를 실행하면 그에 따라 해당 링크가 업데이트되어야 합니다.

## 4. Loki 대시보드 설정하기

이제 grafana에서 Loki 데이터를 탐색할 준비가 되었습니다. Explore를 눌러보세요.

![Datasource](/img/stake-pool-course/loki-explore-loki.png)

Loki를 선택합니다.

![Datasource](/img/stake-pool-course/loki-select-loki.png)

여기서 다른 레이블을 볼 수 있어야 합니다. 제 경우에는 compose_projects이고 다른 것들은 compose_projects가 제 docker 컨테이너 이름입니다. promtail을 사용한다면 이는 구성 파일 내에 있을 것이라고 생각합니다. 

![Datasource](/img/stake-pool-course/loki-explore-labels.png)

우리의 경우 특정 레이블을 선택하면 다음과 같습니다.

compose_project => test-relay1

![Datasource](/img/stake-pool-course/loki-test-relay1-explore.png)

로그 표시를 누르면 해당 상자의 모든 로그를 볼 수 있습니다.

![Datasource](/img/stake-pool-course/loki-show-logs.png)

이것은 "Explore" 메뉴에서 모든 로그에 액세스할 수 있는 방법입니다. 원하는 경우 오른쪽 상단 모서리에 있는 "add to dashboard" 버튼을 누르면 해당 로그 화면을 대시보드에 추가할 수 있습니다.

![Datasource](/img/stake-pool-course/loki-add-dashboard.png)

다음과 같이 모든 노드의 로그가 있는 4개의 패널로 구성된 하나의 대시보드를 만들어 보았습니다.

![Datasource](/img/stake-pool-course/loki-4-panels.png)

모든 로그를 동시에 검색하려면 "Explore"을 통해 검색하거나 다음 대시보드를 Grafana에 추가할 수 있습니다.

[대시보드](https://gist.github.com/os11k/ffcc2a41862a8c35db7a30fd7f13ef09)

제 예제 대시보드에서 Cardano 노드에는 "compose_project"라는 레이블이 있습니다. 각자 노드를 보았을 때 loki 내부에 다른 레이블이 있는 경우, 위의 파일 단어 "compose_project"를 올바른 레이블 이름으로 바꾸세요. 라벨은 다음과 같이 grafana의 "Explore"에서 찾을 수 있습니다.

![Datasource](/img/stake-pool-course/loki-labels.png)

결국에는 다음과 같은 대시보드가 나와야 합니다.

![Datasource](/img/stake-pool-course/loki-final-dashboard.png)

"compose_project"에서 로그를 검색할 수 있는 노드를 선택할 수 있으며, 문자열 일치 필드도 확인할 수 있습니다. 예를 들어 테스트 풀에 p2p가 있고 피어 상태가 Hot에서 Cold로 변경되면 릴레이에서 검색을 허용합니다.

![Datasource](/img/stake-pool-course/loki-hot2cold.png)

꽤 잘 작동하는 것 같습니다. 이제 SSH를 통해 노드에 로그인하고 로그를 살펴볼 필요가 없습니다.


:::note

Grafana의 현재 최신(8.5+ 및 9+) 버전에는 통합 경보라고 하는 매우 멋진 경보 기능이 있다는 점을 추가하고 싶습니다. 따라서 이전 Grafana 버전을 사용하고 있는 사람이 있다면 새 버전으로 이동하는 것을 고려해 볼 가치가 있으며, docker 기반 Grafana도 좋습니다. 이를 통해 경고 관리자 없이 telegram, slack 등에 경고를 보낼 수 있습니다. docker를 선택하면 Grafana 업데이트가 훨씬 쉬워집니다.

:::

## 권장 리소스:

[Promtail을 사용하여 Grafana Loki에 로그를 전달하는 방법](https://computingforgeeks.com/forward-logs-to-grafana-loki-using-promtail/)

[Loki 설치](https://grafana.com/docs/loki/latest/installation/)

[Ubuntu에서 Loki 설치](https://levelup.gitconnected.com/loki-installation-in-ubuntu-2eb8407de291)

<iframe width="100%" height="325" src="https://www.youtube.com/embed/VEGYgPiAazk" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br/><br/>

<iframe width="100%" height="325" src="https://www.youtube.com/embed/BvgLIsWNV-0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br/><br/>

<iframe width="100%" height="325" src="https://www.youtube.com/embed/UtmmhLraSnE" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br/><br/>

---
id: apply-logging-prometheus
title: Prometheus로 노드 모니터링
sidebar_label: Prometheus로 노드 모니터링
description: "Stake pool course: Monitoring a node with Prometheus."
image: ../img/og/og-developer-portal.png
---

`config.json`파일에서와 같이 prometheus의 기본 포트인 포트 12798을 엽니다 노드를 시작하면 포트 12798(또는 `config.json`에서 지정한 포트)에서 Prometheus 통계 자료를 사용할 수 있습니다. 그런 다음 모니터링 서버를 설정하거나 로컬 시스템에서 노드를 모니터링할 수 있습니다.


## 서버에 노드 익스포터 추가하기
로컬 시스템 또는 모니터링 서버에 Prometheus가 있고 노드 서버에 Prometheus Node Exporter가 있으면 Prometheus를 최대한 활용할 수 있습니다. 이를 수행하는 방법은 플랫폼 및 설정에 따라 다르니, 다음 문서를 확인하세요.

   * [Prometheus](https://prometheus.io/docs/prometheus/latest/getting_started/)

   * [Node exporter](https://prometheus.io/docs/guides/node-exporter/)

## 로컬 기기 혹은 모니터링 서버에 Prometheus 설정하기
Cardano 노드를 모니터링하려면 Prometheus를 구성해야 합니다. 이를 수행하는 최소한의 구성 파일은 다음과 같습니다.

```yaml
global:
  scrape_interval:     15s
  external_labels:
    monitor: 'codelab-monitor'

scrape_configs:
  - job_name: 'cardano' # To scrape data from the cardano node
    scrape_interval: 5s
    static_configs:
      - targets: ['a.b.c.d:12798']
  - job_name: 'node' # To scrape data from a node exporter to monitor your linux host metrics.
    scrape_interval: 5s
    static_configs:
      - targets: ['a.b.c.d:9100']
```
위 `a.b.c.d`를 _IPv4 Public IP_ 아래의 대시보드에서 찾을 수 있는 Cardano 노드 서버의 공용 IP 주소로 교체해야 합니다 .

## Prometheus 시작

    ./prometheus --config.file=prometheus.yml

## 예를 들어, 노드에 서버에서 Prometheus 노드 익스포터를 시작한다면

    ./node_exporter

`a.b.c.d:9090` 브라우저를 열고 하나 이상의 흥미로운 통계를 선택하여 그래프로 표시하고 즐겨보세요!

:::note
모니터링 서버에서 수행해야 하는 보안 구성은 이 튜토리얼의 범위를 벗어납니다.
:::

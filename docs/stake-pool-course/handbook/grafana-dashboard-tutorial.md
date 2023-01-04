---
id: grafana-dashboard-tutorial
title: Grafana 대시보드 튜토리얼
sidebar_label: Grafana 대시보드 튜토리얼
description: "Stake pool course: Grafana Dashboard Tutorial"
image: ../img/og/og-developer-portal.png
---
![Grafana Tutorial](/img/stake-pool-course/snsky_dashboard.jpg)

Cardano 풀이 성공적으로 설정되면, 대시보드 및 경고 설정이라는 가장 아름다운 부분이 나옵니다!

이 문서는 이에 대한 자세한 정보를 제공하여 스테이크 풀 운영자가 풀을 보다 효율적으로 관리하는 데 도움이 되기를 바랍니다. 이 튜토리얼은 교육 및 학습 목적으로만 사용됩니다!


**전제조건:**

- Ubuntu 서버 20.04 LTS

- Cardano 블록 생산 노드 가동 및 실행

- Cardano 릴레이 노드 가동 및 실행



## 1. prometheus 노드 익스포터 설치

먼저 블록 생산 및 모든 릴레이 노드에 Prometheus 노드 익스포터를 설치합니다.

```shell
$ sudo apt-get install -y prometheus-node-exporter

$ sudo systemctl enable prometheus-node-exporter.service
```

:::note
Ubuntu 18.04의 경우 다음 튜토리얼([링크](https://sanskys.github.io/grafana/))를 참조하세요.
:::

새로운 hasEKG로 mainnet-config.json를 업데이트하세요.
```shell
$ cd $NODE_HOME
$ sed -i mainnet-config.json -e "s/127.0.0.1/0.0.0.0/g"

On Producer Node open ports 12798 and 9100

$ sudo ufw allow proto tcp from <Monitoring Node IP address> to any port 9100

$ sudo ufw allow proto tcp from <Monitoring Node IP address> to any port 12798

$ sudo ufw reload
```

그런 다음 노드를 재시작합니다.
```shell
$ sudo systemctl restart <your node name e.g. cnode>
```


## 2. 모니터링 노드에 Prometheus 설치하기


Prometheus를 Grafana 서버가 실행될 노드인 모니터링 노드에 설치합니다. 이는 릴레이 노드 또는 모니터링을 위한 별도의 전용 노드에 있을 수 있습니다.

```shell
$ sudo apt-get install -y prometheus
```



## 3. 모니터링 노드에 Grafana 설치


```shell
$ wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -

$ echo "deb https://packages.grafana.com/oss/deb stable main" > grafana.list
$ sudo mv grafana.list /etc/apt/sources.list.d/grafana.list

$ sudo apt-get update && sudo apt-get install -y grafana
```
서비스가 자동으로 시작되게끔 활성화합니다.
```shell
$ sudo systemctl enable grafana-server.service
$ sudo systemctl enable prometheus.service
$ sudo systemctl enable prometheus-node-exporter.service
```
/etc/prometheus/prometheus.yml에 있는 prometheus.yml를 업데이트합니다.

다음 명령에 있는 *IP 주소* 를 변경하세요.
```shell
$ cat > prometheus.yml << EOF
global:
  scrape_interval:     15s # By default, scrape targets every 15 seconds.

  # Attach these labels to any time series or alerts when communicating with
  # external systems (federation, remote storage, Alertmanager).
  external_labels:
    monitor: 'codelab-monitor'

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label job=<job_name> to any timeseries scraped from this config.
  - job_name: 'prometheus'

    static_configs:
      - targets: ['localhost:9100']

        labels:
          alias: 'relaynode1'
          type:  'cardano-node'

      - targets: ['<relay node 2 public ip address>:9100']

        labels:
          alias: 'relaynode2'
          type:  'cardano-node'
      - targets: ['<block producer public ip address>:9100']

        labels:
          alias: 'block-producer-node'
          type:  'cardano-node'
     - targets: ['localhost:12798']
        labels:
          alias: 'relaynode1'
          type:  'cardano-node'

     - targets: ['<relay node 2 public ip address>:12798']

        labels:
          alias: 'relaynode2'
          type:  'cardano-node'

     - targets: ['<block producer public ip address>:12798']
        labels:
          alias: 'block-producer-node'
          type:  'cardano-node'

EOF
```
2개 이상의 릴레이 노드가 있는 경우, 위 구성에서 모든 릴레이를 새 "타겟"으로 추가하세요.
```shell
$ sudo mv prometheus.yml /etc/prometheus/prometheus.yml
```
서비스를 재시작합니다.
```shell
$ sudo systemctl restart grafana-server.service
$ sudo systemctl restart prometheus.service
$ sudo systemctl restart prometheus-node-exporter.service
```
서비스가 제대로 실행되고 있는지 확인합니다.
```shell
$ sudo systemctl status grafana-server.service prometheus.service prometheus-node-exporter.service
```
모니터링 노드에서 Grafana용 포트 3000을 엽니다.
```shell
$ sudo ufw allow from <your home IP address from where you plan to access Grafana> to any port 3000
```
:::note
보안 강화에 대해서는 [Grafana Labs Secuirty](https://grafana.com/docs/grafana/latest/administration/security/)를 참조하세요. 예를 들어, Grafana 서버와의 통신은 기본값이 암호화되지 않은 상태입니다.
:::

## 4. Grafana 대시보드 설정


릴레이 노드에서 로컬 브라우저를 통해 http://localhost:3000 또는 http://*your Relay Node ip address*:3000을 엽니다.
admin으로 로그인하고 비밀번호를 변경하세요.

![Datasource](/img/stake-pool-course/snsky_prometheus.jpg)

구성 기어 아이콘을 클릭한 다음, 데이터 소스를 추가합니다. Prometheus를 선택하고, 이름은 "Prometheus", URL은 http://localhost:9090를 입력합니다. 그런 다음 Save & Test 버튼을 클릭합니다.

아래 Github 링크에서 이 페이지 상단에 표시되는 대시보드를 다운로드하고 JSON 파일을 저장합니다.


[SNSKY 대시보드 예시](https://github.com/sanskys/SNSKY/blob/main/SNSKY_Dashboard_v2.json)



Grafana에서, Create + 아이콘 (왼쪽 메뉴) > Import 를 클릭합니다. 대시보드에 JSON 파일을 업로드하여 추가하고, Import 버튼을 누릅니다.


노드가 여러 시간대에 있는 경우, Grafan Clock 패널을 추가하는 것이 유용합니다.
```shell
$ grafana-cli plugins install grafana-clock-panel
```

설치된 패널은 Grafana 메인 메뉴의 대시보드 섹션에서 즉시 사용할 수 있습니다.

설치된 패널 목록을 보려면, 메인 메뉴에서 Plugins 항목을 클릭하세요. 코어 패널과 설치된 패널이 모두 나타납니다.



## 5. Cexplorer의 데이터를 대시보드에 추가하기


Cexplorer는 풀에 대한 데이터를 수집할 수 있는 API를 제공합니다. 다음 명령을 실행하여 풀 통계 및 스크립트에 대한 디렉토리를 만듭니다. `adapools_pledged` 통계는 cexplorer에 누락되어 있으므로, 위에서 언급된 SNSKY의 대시보드에는 관련 데이터가 누락된 것을 볼 수 있습니다.

```shell
cd /$NODE_HOME

mkdir -p poolStat

cd poolStat

echo "curl https://js.cexplorer.io/api-static/pool/< YOUR POOL BECH 32 POOL ID >.json 2>/dev/null \\
| jq '.data' | jq 'del(.stats, .url , .img, .updated, .handles, .pool_id, .name, .pool_id_hash)' \\
| tr -d \\\"{},: \\
| awk NF \\
| sed -e 's/^[ \t]*/adapools_/' \\
| sed -e 's/adapools_stake /adapools_total_stake /' \\
| sed -e 's/adapools_stake_active /adapools_active_stake /' \\
| sed -e 's/adapools_position /adapools_rank /' \\
| sed -e 's/adapools_blocks_est_epoch /adapools_blocks_estimated /' \\
| sed -e 's/adapools_saturation /adapools_saturated /' \\
| sed -e 's/adapools_roa_short /adapools_roa /' > poolStat.prom" > getstats.sh

chmod +x getstats.sh

./getstats.sh

```
adapools.prom의 내용을 확인합니다. 해당 값은 숫자 값만 포함하면 안됩니다.
```shell
$ nano poolStat.prom
```

poolStat.prom 파일에서 데이터를 가져오도록 promethues-node-exporter.service를 구성합니다.
```shell
$ sudo cp /lib/systemd/system/prometheus-node-exporter.service /lib/systemd/system/prometheus-node-exporter.service_backup

$ sudo nano /lib/systemd/system/prometheus-node-exporter.service
```
ExecStart 라인을 다음과 같이 바꿔줍니다.
```shell
ExecStart=/usr/bin/prometheus-node-exporter --collector.textfile.directory=< YOUR NODE FULL PATH >/poolStat --collector.textfile
```

데몬을 다시 로드하고 서비스를 재시작합니다.
```shell
$ sudo systemctl daemon-reload

$ sudo systemctl restart prometheus-node-exporter.service

$ sudo systemctl restart prometheus.service
```


이제 대시보드에서 모든 Cexplorer 통계를 볼 수 있습니다.


통계가 변경될 것이기 때문에, 매일 Cexplorer에서 데이터를 업데이트하도록 cron 작업을 설정합니다.


```shell
$ crontab -e
```

```shell
##############################

#Get data from Cexplorer every day at 06:00

0 6 * * * <YOUR NODE FULL PATH >/poolStat/getstats.sh

##############################
```


완료되었습니다!


## 6. 마지막 단계: Grafana 경고 및 이메일 알림 설정하기



Grafana에서 SMTP를 설정합니다.
```shell
$ sudo nano /etc/grafana/grafana.ini
```


SMTP 섹션을 편집합니다.
```shell
#############################

[smtp]
enabled = true
host = smtp.<email server>:465
user = <email user name>
# If the password contains # or ; you have to wrap it with triple quotes. Ex """#password;"""
password = <email password>
from_address = sam@sanskys.de
from_name = Grafana

#############################
```


사용자 이름과 비밀번호를 사용하여 Grafana에 로그인합니다.

![Email Alert](/img/stake-pool-course/snsky_EmailAlert.jpg)

왼쪽 사이드바에서 "종" 모양 아이콘을 클릭합니다.

"Notification channels"를 선택합니다.



"Add Channel" 버튼을 클릭합니다. 그러면 새 알림 채널을 추가하기 위한 양식이 열립니다. 

이 채널에 이름을 지정하세요. 

이메일을 통해 알림을 보내려면 "Type"에서 이메일을 선택합니다.

모든 경고에 대해 이메일을 보내려면 "Send on all alerts" 를 선택하세요.

알림 메일에 패널의 이미지를 포함하려면 "Include image" 체크박스를 선택합니다.

"Email addresses" 영역에 대상 이메일을 추가합니다. ";"을 사용하여 여러 개의 이메일 주소를 사용할 수 있습니다.


설정을 확인하려면 "Send Test"를 클릭하세요. 이는 이전에 설정한 SMTP 세부정보를 사용하여 샘플 이메일을 보내는 것입니다.

이 채널을 추가하려면 "Save" 버튼을 클릭하세요.


아래는 블록 생산 노드에 연결할 수 없는 경우 Alert를 생성하는 것의 예시입니다.

![Peer Alert](/img/stake-pool-course/snsky_PeerAlert.jpg)

알림은 "Graph" 패널에 대해서만 생성할 수 있습니다!

이제 블록 생산 노드에 연결할 수 없는 경우 이메일을 받기 위해 Alert를 만드는 것을 해보겠습니다.


"Connected Peers" 패널에서 Alert로 이동한 다음, "Connected Peer Alert" 규칙을 "2m"에 대해 매 "1m" 마다로 설정합니다.



조건
```shell
WHEN "last()" OF "query(A, 1m, now)" "HAS NO VALUE"
```


데이터 없음 & 오류 처리하는 방법 

데이터가 없거나, 모든 값이 null인 경우 "No Data"로 상태를 설정합니다.

실행 오류나 시간 초과 오류가 발생하면 상태를 "Alerting"으로 설정합니다.




알림

Send To - 알림 채널을 선택합니다. 제 경우에는 "Alert"입니다.

Message - 이메일에 표시되어야 하는 경고 메세지의 유형입니다.

경고가 정확하고 문제가 없는지 확인하려면 "test Rule"을 누르십시오.

이제 끝났습니다! 블록 생산 노드가 작동 중지되면, 4분 이내에 경고를 받을 것입니다.

:::note

이 튜토리얼 작업을 지원하고 싶다면, 기부하거나 제 풀 - SNSKY에 위임하실 수 있습니다.

기부 주소
**addr1qyyhd8cpv4gmhr5axerhezhtzldrw4rp9ayf0fc6arnme4cg46du2qg366943uy0dw5yjmna7arfw265lu4r2fjccl4scf7xrw**

SNSKY 풀 ID
**075578defd7ee97cbeaa2937e5819099cb3835ac9f9c8b1a2c3a3578**

:::


## 7. 권장 사항: Grafana 등록 및 익명 접근


Grafana를 좀 더 안전하게 만들어야 하며, 그렇게 하려면 두 가지 설정을 변경해야 합니다.
```shell
$ sudo nano /etc/grafana/grafana.ini
```

[users] 아래에서 allow_sign_up 지시문을 찾아 다음과 같이 수정합니다.
```shell
##########

[users] # disable user signup / registration

allow_sign_up = false

##########
```

그런 다음, [auth.anonymous] 아래에서 다음 enabled 지시문을 찾아 다음과 같이 수정하세요.

```shell
[auth.anonymous]

enabled = false
```

파일을 저장하고 텍스트 편집기를 종료합니다. 변경 사항을 활성화하려면 Grafana를 다시 시작하세요.


```shell
$ sudo systemctl restart grafana-server
```


## 8. 고급 사용자: 슬롯 리더 패널
![Leader Panel](/img/stake-pool-course/snsky_leaderPanel.jpg)

풀이 커지고 정기적으로 블록을 생성하면, 모든 리더 슬롯을 추적하고 풀 유지 관리를 위해 사용 가능한 것들을 식별하기 어려워집니다. 이 슬롯 리더 패널은 TimeSeries의 모든 예약 슬롯에 대한 좋은 개요를 제공하고, 매우 유용합니다.


cardano-cli를 사용하여 리더십 일정을 쿼리합니다. Grafana에서 결과를 해석해야 하므로 쿼리 출력을 CSV 형태의 읽을 수 있는 구문으로 형식화해야 합니다.

:::note
cardano-cli 쿼리에는 추가 RAM이 필요합니다. 자세한 내용은 [query leadership-schedule](https://github.com/input-output-hk/cardano-node/issues/3673)을 참조하세요. 16GB RAM + 8GB SWAP이 필요했고 리더십 일정을 쿼리하는 데 몇 분이 걸렸습니다.
:::

아래 링크에서 전체 스크립트를 복사할 수 있습니다.

[슬롯 리더 스크립트](https://github.com/sanskys/SNSKY/blob/main/SlotLeader/script.sh)



slot.csv 파일이 다른 노드에 있는 경우, Grafana 모니터링 노드에 수동으로 복사하면 됩니다. 이 단계는 자동화할 수 있지만, 이를 위해 추가 포트를 열고 싶지 않다면 slot.csv 파일의 내용을 복사하여 붙여넣기만 하면 됩니다.




다음으로 Grafana에 CSV 플러그인을 추가합니다. "Installing on a local Grafana:" 섹션의 지침을 따르십시오.



[Grafana CSV 플러그인](https://grafana.com/grafana/plugins/marcusolsson-csv-datasource/?tab=installation)


설치 후 이제 데이터 소스에 CSV 플러그인이 나열되어야 합니다. slot.csv 파일의 위치를 ​​지정하여 CSV 플러그인을 구성하세요. 저장 및 테스트하고 모든 단계를 올바르게 수행한 경우, 녹색으로 성공 메시지가 표시됩니다.



마지막 단계는 슬롯 리더 패널을 대시보드에 추가하는 것입니다. 이를 위해 "Add Panel" 및 "Add New Panel" 아이콘을 클릭합니다.

그런 다음 "Query inspector" 및 "JSON" 버튼을 클릭합니다.

기존 JSON 코드를 삭제하고 다음으로 바꿉니다.


[Slot 리더 패널](https://github.com/sanskys/SNSKY/blob/main/SlotLeader/LeaderPanel.json)


이제 "Apply"를 클릭하면 끝입니다! 지난 6시간부터 다음 18시간까지의 모든 리더 슬롯을 볼 수 있어야 하며 이 시간 창은 자동으로 이동합니다.




## 9. Grafana에 암호화폐 교환 비율 추가

하루종일 가격을 들여다보는 것은 건강에 좋지 않을 수 있기 때문에, 그라파나 대시보드의 한 곳에 해당 정보를 모아두는 것은 유용할 수 있습니다.

아래는 가격을 가져오기 위해 크라켄 거래소의 API를 사용하는 예입니다. 가격에 대한 API 공급자를 선택하고 제안을 쉽게 조정할 수 있습니다.

아래는 prometheus에 데이터를 채울 기본 스니펫입니다(이 페이지에서 사용된 폴더 구조와 일치함). `jq` 와 `curl`이 설치된 상황에서 실행하세요.

아래와 같은 내용으로 `$NODE_HOME/poolStat/prices.sh`를 생성한 다음 시작해 보겠습니다.

``` shell
PRICES=$(curl -s https://api.kraken.com/0/public/Ticker?pair=ADAEUR,ADAUSD,XXBTZUSD,XETHZUSD)
echo $PRICES | jq .result.ADAEUR.c | jq .[0] | sed 's/"//g'| sed 's/^/adaeur /' > $NODE_HOME/poolStat/price.prom
echo $PRICES | jq .result.ADAUSD.c | jq .[0] | sed 's/"//g'| sed 's/^/adausd /' >> $NODE_HOME/poolStat/price.prom
echo $PRICES | jq .result.XXBTZUSD.c | jq .[0] | sed 's/"//g'| sed 's/^/btcusd /' >> $NODE_HOME/poolStat/price.prom
echo $PRICES | jq .result.XETHZUSD.c | jq .[0] | sed 's/"//g'| sed 's/^/ethusd /' >> $NODE_HOME/poolStat/price.prom
```

보시다시피 이는 자체 설명 코드가 있는 매우 간단한 스크립트이며, 다른 통화를 먼저 추가해야 하는 경우 `curl -s https://api.kraken.com/0/public/AssetPairs`를 확인하세요. 이는 사용가능한 모든 자산 쌍을 반환하고 각 코드와 함께 하단에 필요한 쌍을 추가합니다.

이제 이 스크립트를 실행 가능하게 만들어야 합니다.

```
chmod +x $NODE_HOME/poolStat/prices.sh
```

쉘에서 `$NODE_HOME/poolStat/prices.sh`을 실행하고 아래와 같은 내용이 포함된 `$NODE_HOME/poolStat/price.prom`이 표시되는지 확인합니다.
  
```
adaeur 0.502300
adausd 0.531625
btcusd 30187.90000
ethusd 2012.02000
```

그런 다음 grafan로 이동하여, 통계 메뉴를 확인하고 `adaeur`, `adausd` 및 다른 통계 자료를 볼 수 있는지 확인하세요.

확인된 경우, 매분 해당 스크립트를 실행하도록 cron을 구성해야 매분 새로운 데이터를 얻을 수 있습니다.  

```shell
crontab -l 2>/dev/null; echo "* * * * * $NODE_HOME/poolStat/prices.sh") | crontab -
```

이제 남은 것은 가격으로 그래프를 만드는 것입니다. 이는 다소 사소한 작업이며 설명이 필요하지 않을 겁니다.

---
id: ansible-cardano-node
title: 스테이크 풀을 위한 Ansible 시작하기
sidebar_label: 스테이크 풀을 위한 Ansible
description: Get Started with Ansible for Stake Pools
---

![ansible-cardano](https://user-images.githubusercontent.com/84546123/137635107-1b183f63-3cac-4ef9-be9e-3f116cb79aef.png)

## 개요

[Ansible cardano-node](https://github.com/moaipool/ansible-cardano-node) 레퍼지토리에는 스테이크 풀 운영자(SPO)를 위해 안전하고 최적화된 Cardano 노드를 제공하기 위한 [Ansible](https://www.ansible.com/) 플레이북 이 포함되어 있습니다. 원래 MOAI 풀 (티커: MOAI) 운영자가 개발했지만, 이제 더 큰 Cardano 커뮤니티에서 사용할 수 있게 되었습니다.

다음은 제공되는 기본 기능입니다.

* 기본 Linux 보안 설정(SSH 강화, 방화벽 설정 등)
* 카르다노 노드 설치(IOHK 소스에서 컴파일됨)
* 블록 생산자 및 릴레이 노드의 기본 구성
* 관리 및 모니터링 도구 설정(cncli, gLiveView 등)

위의 작업을 용이하게 하기 위해 다음과 같은 최소 소프트웨어 패키지가 설치됩니다.

* git-core
* ufw
* unattended-upgrades
* logrotate
* logwatch
* net-tools
* tmuxinator
* vim
* htop
* curl

## 목차

 - [왜 Ansible을 써야 하나요?](#왜-Ansible을-써야-하나요)
 - [설치](#설치)
 - [플레이북](#플레이북)
 - [구조](#구조)
 - [인벤토리 설정](#인벤토리-설정)
 - [사용자 설정](#사용자-설정)
 - [태그 사용하기](#태그-사용하기)
 - [플레이북 실행하기](#플레이북-실행하기)
 - [기본 구성](#기본-구성)
 - [추가 요소](#추가-요소)
 - [전문가 팁](#전문가-팁)

### 왜 Ansible을 써야 하나요?

Ansible은 프로비저닝, 애플리케이션 배포 및 구성 관리 자동화 도구입니다. 작업을 수행하기 위해 서버에 bash 스크립트를 결합하거나 SSH를 사용하는 시대는 지났습니다.

Ansible은 에이전트가 없으므로 원격 시스템을 위한 특정 소프트웨어가 필요하지 않습니다. Ansible을 통해 모든 명령을 실행하는 데에 SSH를 사용합니다.

Ansible을 통해 실행되는 명령은 [_idempotent_ (멱등)](https://en.wikipedia.org/wiki/Idempotence)적입니다. 즉, 필요한 경우가 아니면 아무 것도 변경되지 않은 채로 안전하게 여러 번 실행될 수 있습니다. 모든 호스트에서 `cardano-node` 구성이 최신 상태인지 확인해야 할 때도 유용합니다. 명령을 실행하기만 하면 업데이트가 필요한 사람만 업데이트를 받을 수 있도록 합니다. 다른 모든 호스트는 그대로 유지됩니다.

Ansible은 [수백 개의 사용 가능한 모듈](https://docs.ansible.com/ansible/2.8/modules/list_of_all_modules.html)이 있는 매우 인기 있는 [오픈 소스 프로젝트](https://github.com/ansible/ansible)입니다.

### 설치
Ansible 명령을 실행하도록 단일 제어 시스템을 설정할 수 있습니다. 아래 예제는 OS X를 사용하지만, Python이 설치된 모든 플랫폼에서도 작동합니다(Windows 포함).

>**참고:** Ansible은 Python으로 작성되었지만, Python으로 코딩할 필요는 없습니다. 원하지 않는 한 Python을 만질 필요가 없습니다. Ansible 스크립트 자체는 매우 간단한 YAML 형식으로 작성됩니다.

먼저 `pip`가 설치되어 있는지 확인합니다.

```
sudo apt install python-pip
```
그런 다음 Ansible 및 [netaddr](https://pypi.org/project/netaddr/) Python 패키지를 설치합니다. 후자는 ipaddr()Jinja2 템플릿의 `ipaddr()` 필터에서 사용됩니다.
```
sudo pip install ansible
sudo pip install netaddr
```
또는 [Homebrew](https://brew.sh/)가 설치되어 있는 경우(반드시 설치해야 함) 다음과 같이 Ansible을 설치할 수 있습니다.
```
brew install ansible 
```

설치가 완료되면 다음을 실행하여 모든 것이 올바르게 설치되었는지 확인할 수 있습니다.

```
ansible --version
```

### 플레이북
플레이북은 청사진이나 절차 지침 모음을 만들기 위해 명령을 연결하는 방법입니다. Ansible은 플레이북을 순서대로 실행하여 다음으로 진행하기 전에 각 명령의 출력을 확인합니다. 중간에 플레이북 실행을 중지하고 나중에 계속하면 아직 완료되지 않은 명령만 실행됩니다. 나머지는 건너뜁니다.

일부 기본 플레이북 용어는 다음과 같습니다.

**역할**은 플레이북을 체계적으로 유지하는 데 도움이 됩니다. 그들은 복잡한 빌드 지침들을 관리 가능한 부분으로 분해했습니다. 이를 통해 코드를 복제하지 않고도 플레이북 간에 역할을 공유할 수 있습니다.

**템플릿**은 Ansible 템플릿 모듈이 적절한 값으로 대체할 수 있는 변수 및 표현식을 포함하는 파일입니다. 이렇게 하면 동일한 파일로 여러 서버를 구성하는 데 동적으로 사용할 수 있으므로 파일을 더 재사용할 수 있습니다. 

**호스트 및 그룹 변수**는 개별 호스트 및 호스트의 논리 그룹을 관리하기 위한 Ansible [인벤토리 설정](https://docs.ansible.com/ansible/latest/intro_inventory.html)의 일부입니다(자세한 내용은 아래 참조). 이렇게 하면 개별 IP 주소나 도메인 이름을 기억할 필요가 없습니다. 또한 이는 호스트별 구성을 관리하는 간단한 방법을 제공합니다. 

**핸들러**에는 모듈 실행이 완료된 후 수행되어야 하는 논리가 포함되어 있습니다. 이는 알림이나 이벤트와 매우 유사하게 작동합니다. 예를 들어 `ufw` 구성이 변경되면 핸들러가 방화벽 서비스를 다시 시작합니다. 이러한 이벤트는 모듈 상태가 변경된 경우에만 발생한다는 점에 유의해야 합니다.

### 구조
플레이북을 구성하는 데 사용되는 기본 디렉토리 구조는 다음과 같습니다.

```
├── ansible-cardano-node/
│   ├── filter_plugins
│   ├── group_vars
│   └── inventories
│       ├── block-producer/
│       ├── relay-node/
│       ├── all.yml
│       ├── vault
│   ├── roles/
│   │   ├── cardano-node/
│   │   ├── common/
│   │   ├── ssh/
│   │   └── ufw/
│   ├── ansible.cfg
│   ├── apt_periodic
│   └── provision.yml
```
모든 Ansible 작업, 핸들러, 구성 등이 위에 포함되어 있습니다. 구체적인 내용은 다음 섹션에서 설명합니다.

### 인벤토리 설정
다른 작업을 수행하기 전에 Ansible에 무엇을 실행할지 알려줘야 합니다. Ansible은 인벤토리라고 하는 목록 또는 목록 그룹을 사용하여, 인프라 내 수많은 노드 또는 호스트에 대해 동시에 작업합니다. 따라서 우리는 인벤토리를 구축한 후 패턴을 활용하여 Ansible이 실행해야 하는 호스트 또는 그룹을 선택할 수 있습니다. 가장 간단한 해결책은 알려진 모든 호스트를 포함하는 단일 '호스트' 파일을 만드는 것입니다. 이 파일의 형식은 INI 또는 YAML일 수 있습니다. 다음은 호스트 INI 파일의 예입니다.

```
[node]
foo.mypool.com
bar.mypool.com
```
이 인벤토리 배열은 간단한 구성에는 적합하지만 구성이 복잡해지면 한계가 드러납니다. 우리가 필요로 하는 바람직한 기술은 단일 `hosts` 선언을 기능별 그룹으로 나누는 것입니다. 이러한 스타일에는 엄격하고 빠른 규칙이 없으며 이는 Ansible의 강력한 장점 중 하나입니다. 그러나 인벤토리를 처음부터 새로 만든다면, 이러한 장점이 오히려 위협적일 수 있습니다. 다음과 같은 것들을 추적하는 그룹을 만들 수 있습니다.

- 대상 - 애플리케이션, 스택 또는 마이크로서비스(예: 데이터베이스 서버, 웹 서버 등)
- 위치 - 로컬 DNS, 스토리지 등과 통신하기 위한 데이터 센터 또는 지역(예: 동부, 서부, 파리, 케이프타운)
- 시기 - 프로덕션 리소스(예: 메인넷, 테스트넷)에 대한 테스트를 피하기 위한 개발 단계

우리의 목적을 위해 "대상"과 "시기" 그룹 구조의 조합을 선택했습니다. 인벤토리 그룹 구조에 대한 대략적인 개요를 살펴보겠습니다.

```
├── ansible-cardano-node/
    └── inventories
        ├── block-producer/
        └── relay-node/
```

이러한 각 그룹이 고유한 노드 유형에 해당함을 알 수 있습니다. `block-producer` 내에서 다음과 같은 INI 파일을 찾습니다.

```
[node]
blockprod.mypool.com ansible_user=deploy
```
여기서 Ansible 사용자 `deploy`는 전체적으로 사용되지만,  특정 권한/기능을 가진 다른 사용자가 각 호스트마다 정의될 수도 있습니다. 프로덕션 백엔드 호스트에 해당하는 각 FQDN(정규화된 도메인 이름)을 사용하여 여기에서 기능(또는 "대상") 그룹이 정의되어 있는지도 확인할 수 있습니다.


:::note 
보안상의 이유로 블록 프로듀서의 공개 IP 주소를 난독화하거나 숨길 수 있습니다. 이 경우 위의 예에서 FQDN을 IP 주소로 바꿀 수 있습니다. 최종 결과는 동일합니다.
::::

### 그룹 변수
그룹은 구성에 유용하지만 변수를 처리하는 데에도 사용됩니다. 예를 들어 `/groups_vars/all` 파일의 정의는 다음과 같습니다.

```
---
# Cross-environent variables are stored here

# ports 
ssh_port: "22"
cardano_default_port: "6000"

```

이는 아주 최소한의 예시입니다. 그러나 `group_vars`를 기능 또는 그룹별로 변수 또는 기타 설정을 저장하는 데 어떻게 사용할 수 있는지 생각해 볼 수 있습니다.
This is a very minimal example. However, you can think about how `group_vars` can be used to store variables or other settings on a [functional or per-group basis](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html#defining-variables-in-inventory). 

:::note 
Ansible은 플레이북의 일반 텍스트보다는 암호 또는 키와 같은 데이터를 암호화 하는 [볼트](https://www.ansible.com/blog/2014/02/19/ansible-vault) 기능을 제공합니다.
::::

### 사용자 설정
우리는 사용자 계정에 대한 공개 키 인증을 요구하여 보안과 사용 편의성을 강화합니다. 그 후 Ansible은 **배포** 계정 을 통해서만 상호 작용 합니다.

1. **배포** 사용자 를 생성하여 시작합니다.

	```
	useradd deploy
	mkdir /home/deploy
	mkdir /home/deploy/.ssh
	chmod 700 /home/deploy/.ssh
	chown -R deploy:deploy /home/deploy
	```

새 사용자에 대한 강력한 암호를 설정합니다: `passwd deploy`. 다음 단계에서 공개 키를 추가할 때 이것을 딱 한 번 사용하고, 그 이후에는 Ansible에서 암호가 필요하지 않습니다.

2. 공개 키를 워크스테이션에서 원격 호스트(이 예에서는 relay1.mypool.com)로 안전하게 복사합니다:

	```
	ssh-copy-id -i ~/.ssh/id_rsa.pub deploy@relay1.mypool.com
	
	The authenticity of host 'relay1.mypool.com (<no hostip for proxy command>)' can't be established.
	ECDSA key fingerprint is SHA256:HRTSF5/nHmrgiNDvHFZ6OhxF9whXl4o7O1KwuW6Fbd0.
	Are you sure you want to continue connecting (yes/no)? yes
	/usr/local/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
	/usr/local/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
	deploy@relay1.mypool.com's password:
	
	Number of key(s) added: 1
	```

이제 키가 성공적으로 추가되었는지 확인하기 위해 `ssh deploy@relay1.mypool.com`로 컴퓨터에 로그인해 보십시오 .
	
3. visudo를 사용하여 배포 사용자에게 sudo 액세스 권한을 부여해서, 매번 암호를 요구하지 마십시오.

```
visudo
```
기존의 모든 사용자/그룹 권한 부여 라인에 주석을 달고 다음을 추가합니다.	
```
# User privilege specification
root    ALL=(ALL:ALL) ALL
deploy  ALL=(ALL) NOPASSWD:ALL
	
# Allow members of group sudo to execute any command
%sudo  ALL=(ALL:ALL) NOPASSWD:ALL

```

배포 사용자로 로그인하고 -v(검증) 옵션을 사용하여 sudo 액세스 권한이 있는지 확인합니다.

	
```
sudo -v
```
	
기본 쉘을 bash로 변경하고 싶다면, 다음 명령어를 사용합니다.

```
sudo chsh -s /bin/bash deploy
```

### 태그 사용하지
태그는 작업의 하위 집합을 선택적으로 수행하는 데 사용할 수 있는 Ansible 구조 내 속성입니다. 태그는 전체가 아닌 거대한 플레이북의 일부만 실행할 수 있게 해주기 때문에, 매우 가치가 있습니다. Ansible에서 태그는 다양한 구조에 사용될 수 있지만 가장 기본적인 용도는 개별 작업입니다. 별개의 태그를 사용하는 'cardano-node' 역할 내부의 두 가지 작업은 다음과 같습니다.

```
- name: "Node Install | Building Cardano node"
  shell: cd /home/{{ server_username }}/cardano-node && cabal build cardano-node cardano-cli
  tags:
    - install
    - node

- name: "Node Install | Stop cardano-node service"
  systemd:
    name: cardano-node.service
    state: stopped
  tags:
    - binaries
    - install
    - node
```
플레이북 을 실행할 때, `–tags` 또는 `–skip-tags`를 사용하여 작업의 하위 집합을 실행할 수 있습니다. 이를 `--list-tasks`와 결합하여 이러한 옵션으로 실행될 작업을 확인할 수도 있습니다. 예를 들자면 다음과 같습니다:

```
ansible-playbook provision.yml --tags "install" --list-tasks
```
상속 및 특수 태그를 포함한 고급 태그 사용은 [여기](https://docs.ansible.com/ansible/latest/user_guide/playbooks_tags.html)에서 다룹니다 .

### 플레이북 실행하기
예제 플레이북 실행이 아래에 나와 있습니다. 이 플레이북은 볼트 자격 증명을 사용하여 `relay-node` 인벤토리를 대상으로 합니다. `--tags`는 "구성" 설정으로 태그된 작업을 의미합니다. 마지막으로 `--check` 모드는 원격 시스템을 변경하지 않는 "시험 실행" 옵션입니다.

```
ansible-playbook provision.yml -i inventories/relay-node --vault-password-file ~/.vault_pass.txt --tags "install" --check
```
호스트 파일이 채워지고 호스트에 액세스할 수 있다고 가정하면 다음과 같은 출력이 표시됩니다.

![playbook](https://user-images.githubusercontent.com/229399/135495282-5aaa1f3d-77d3-472b-826e-079c81b1da82.png)

위의 프로세스에는 필요한 경우 최신 의존성 및 소스에서 `cardano-node`를 다운로드하고 컴파일하는 작업이 포함됩니다.

### 기본 구성
이 플레이북에는 정상 작동이 확인된 기본 설정 세트가 제공됩니다. 해당되는 경우, 각 역할 아래에 `/defaults/main.yml`이라는 파일이 존재합니다. 이러한 파일에는 변수에 대한 기본값이 포함되어 있으며, 이는 라이브 호스트를 프로비저닝하기 전에 수정해야 합니다. 예를 들어 `ssh`라는 역할은 여러 Linux 보안 모범 사례를 적용하여 노드에 대한 보안 쉘 액세스를 강화합니다. 원격 관리 IP 주소(즉, Ansible을 실행하는 시스템)와 일치하도록 `ssh/defaults/main.yml` 파일을 수정해야 합니다.

```
ssh_allowed_users: "AllowUsers deploy@127.0.0.1/32"
```
이 `ufw` 역할은 Linux 방화벽 서비스를 구성하고 다음과 같이 기본값을 정의해야 합니다.

```
# Relay node public IP addresses
relay_node_ips:
  - 127.0.0.1/32  #relay1.mypool.com
  - 127.0.0.2/32  #relay2.mypool.com

# Trusted IP addresses, used for remote access/administration
trusted_ips:
  - 127.0.10.1/32
  - 127.0.10.2/32
```

위의 릴레이 노드에 대한 자리 표시자 값은 실제 릴레이 호스트 IP 주소와 일치해야 합니다. 그렇지 않으면 블록 생산자와 서로 통신할 수 없습니다.

마찬가지로 이 `cardano-node/defaults/main.yml` 파일에는 풀의 메타데이터를 채우는 데 사용할 값이 포함되어 있습니다. 다음과 같이 자리 표시자 값을 바꿔야 합니다.

```
# Pool metadata
cardano_pool_name: "My Cardano Stake Pool"
cardano_pool_description: "A description of my stake pool"
cardano_pool_ticker: "My Pool ticker symbol"
cardano_pool_homepage: "https://mypool.com/"
cardano_pool_extended: "https://mypool.com/extendedMetaData.json"
```
플레이북을 실행하기 전에 인벤토리를 정의해야 합니다. 릴레이 노드의 인벤토리 파일에는 각 릴레이에 대한 FQDN이 포함되어야 합니다. 이 파일은 `inventories/relay-node/inventory`에 위치합니다.

```
[node]
relay1.mypool.com ansible_user=deploy
relay2.mypool.com ansible_user=deploy
```

마찬가지로 블록 생산자에 대한 공용 IP 주소를 할당합니다. 이 파일은 `inventories/block-producer/inventory`에 위치합니다.

```
[node]
127.0.0.1 ansible_user=deploy
```

### 추가 요소

#### cardano-submit-api
`cardano-submit-api`는 트랜잭션(예: 외부 지갑에서 생성)을 Cardano 블록체인에 게시할 수 있는 웹 API를 제공합니다. 네트워크(메인넷, 스테이징 또는 테스트넷)에 트랜잭션을 제출하려면 `cardano-node`가 실행 중이어야 하며 네트워크의 제네시스 파일 및 제네시스 해시 값에 액세스할 수 있어야 합니다. 플레이북이 `cardano-node` 전체를 설치한다는 점을 감안할 때, 이 요구 사항은 이미 충족되었습니다.

스테이크 풀 운영자는 하나 이상의 릴레이에 웹 API를 설치하고 활성화할 수 있습니다. 이는 사용자가 트랜잭션을 제출할 수 있는 또 다른 mempool을 제공합니다. 이 구성 요소는 기본적으로 비활성화되어 있습니다. 활성화하려면 `roles/cardano-node/defaults/main.yml`에 있는 다음 값을 `true`로 설정합니다.

```
# Cardano submit API (optional)
cardano_submit_api: false
```
`cardano-submit-api`를 기본 릴레이 노드 설정의 일부로 설치하거나 릴레이가 실행된 후 선택적으로 설치할 수 있습니다. 후자의 경우 다음과 같이 플레이북을 실행할 때 관련 태그를 지정하여 웹 API를 설치할 수 있습니다.

```
ansible-playbook provision.yml -i inventories/relay-node --vault-password-file ~/.vault_pass.txt --tags "api"
```

>**참고:** 블록 생산자에 `cardano-submit-api`가 설치되는 것을 방지하기 위해, 이러한 작업은 플레이북 실행 중에 `relay-node` 인벤토리가 지정된 경우에만 실행됩니다.

관련 작업은 `/usr/bin`에다가 `cardano-submit-api`의 빌드 프로세스 및 설치를 처리할 것입니다. 또한 이는 IOHK의 [메인넷 기본 구성 설정](https://raw.githubusercontent.com/input-output-hk/cardano-node/master/cardano-submit-api/config/tx-submit-mainnet-config.yaml)을 확인하고 선택적으로 다운로드합니다.

마지막으로, 두 개의 스크립트가 생성됩니다. 1) API 시작을 처리하기 위해 `tx-api.sh`가 `/opt/cardano/cnode/scripts`에 추가되고 2) `tx-api.service`가 `/etc/systemd/system`에 설치되어 활성화됩니다. 후자의 `systemd` 서비스를 사용하면 다음과 같이 API를 시작하고 실행 상태를 확인할 수 있습니다.

```
sudo systemctl start tx-api.service
sudo systemctl status tx-api.service
```

API 서비스가 활성화되면, 릴레이 노드는 포트 8090에서 실행되는 tx 제출 API를 갖게 됩니다. 로컬 네트워크 외부에서 이를 사용하려면 포트를 열어야 합니다. 이것은 다음과 같이 `ufw`로 할 수 있습니다:

```
sudo ufw allow 8090/tcp
```

서명된 트랜잭션의 예는 다음과 같습니다.

```
$ curl --header "Content-Type: application/cbor" -X POST http://localhost:8090/api/submit/tx --data-binary @tx.signed.cbor
"8a3d63d4d95f669ef62570f2936ad50d2cfad399e04808ca21474e70b11987ee"%
```

### 전문가 팁
플레이북을 처음 실행할 때 Ansible의 `--check` 옵션을 사용하세요. 이렇게 하면 호스트를 수정하지 _않고도_ 플레이북을 안전하게 실행하고 오류를 확인할 수 있습니다.

이전에 Cardano 노드를 수동으로 구성한 경우, Ubuntu 20.04 LTS를 새로 설치하고 새 호스트에 대해 Ansible 플레이북을 실행하는 것이 좋습니다.


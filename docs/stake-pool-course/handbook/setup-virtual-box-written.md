---
id: setup-virtual-box-written
title: VirtualBox 설치
sidebar_label: VirtualBox 설치
description: "Stake pool course: Learn how to install and setup VirtualBox."
image: ../img/og/og-developer-portal.png
---

소스로부터 노드를 구축하고 실행하여 Cardano 메인넷에 연결하려면, 최소 4GB RAM과 24GB 하드 드라이브 공간이 있는 Linux 시스템이 필요합니다. RAM은 대부분 노드 를 _빌딩_ 하는 데 필요합니다. _실행하는데는_ 1GB면 충분합니다. Cardano 블록체인에 연결하고 다운로드하려면, 충분한 하드 드라이브 공간이 필요합니다.

여기서는 VirtualBox를 사용하여 스테이크 풀을 설정하는 방법을 배울 수 있습니다.

## Virtual Box 설치하기

[https://www.virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads)

## Ubuntu 20.04 설치하기

다음 튜토리얼을 따라가보세요.

[https://linuxhint.com/install\_ubuntu\_virtualbox\_2004/](https://linuxhint.com/install_ubuntu_virtualbox_2004/)

가상 머신 생성을 마쳤으면 터미널을 열고 실행하여 Ubuntu VirtualBox VM에 VirtualBox Guest Additions를 설치합니다.

```sh
sudo apt install virtualbox-guest-dkms virtualbox-guest-x11 virtualbox-guest-utils
```

:::tip 질문이나 제안 사항
수업을 듣는 동안 질문이나 제안 사항이 있는 경우, [Cardano forum에 질문](https://forum.cardano.org/c/staking-delegation/setup-a-stake-pool/158)해 주시면 최대한 빨리 답변해 드리겠습니다.
:::

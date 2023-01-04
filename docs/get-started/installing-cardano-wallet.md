---
id: installing-cardano-wallet
title: cardano-wallet 설치
sidebar_label: cardano-wallet 설치
description: This guide shows how to build and install the cardano-wallet from the source-code for all major Operating Systems
image: ../img/og/og-getstarted-installing-cardano-wallet.png
--- 
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

### 개요

이 가이드에서는 소스 코드에서부터 직접 선택한 운영 체제에 `cardano-wallet` 을 컴파일하고 설치하는 방법을 보여줍니다. 이는 **Cardano** 지갑을 여러 개 생성하고, 트랜잭션을 전송하며, 트랜잭션 내역 정보와 잔고 등을 불러오는 방식을 위해 [CLI (Command Line Interface)](https://en.wikipedia.org/wiki/Command-line_interface)와 [Web API](https://en.wikipedia.org/wiki/Web_API)을 제공합니다.

:::note

바이너리 단에서 직접 컴파일하지 않으려면, 아래 링크에서 사전에 빌드된 `cardano-wallet` 의 바이너리를 직접 다운로드할 수 있습니다.

- [Linux](https://hydra.iohk.io/job/Cardano/cardano-wallet/cardano-wallet-linux64/latest)
- [MacOS](https://hydra.iohk.io/job/Cardano/cardano-wallet/cardano-wallet-macos64/latest)
- [Windows](https://hydra.iohk.io/job/Cardano/cardano-wallet/cardano-wallet-win64/latest)

이 가이드는 `cardano-node` 및 `cardano-cli` 를 이미 설치했다는 가정하에 진행됩니다. 아직 설치하지 않았다면, [cardano-node 설치](/docs/get-started/installing-cardano-node) 가이드를 참고하세요.

:::

:::important

`testnet` 네트워크에 `cardano-node` 를 연결하고 완전히 동기화되었는지 확인해야 합니다. 만약 어떻게 하는지 잘 모르겠다면, 진행 전에 [cardano-node 실행](running-cardano.md) 가이드를 참고하세요.

:::

### 플랫폼 선택

* [MacOS / Linux](#macos--linux)
* [Windows](#windows)

## MacOS / Linux

이 섹션에서는 **Linux / MacOS** 기반 운영체제에 `cardano-wallet` 을 다운로드, 컴파일 및 설치하는 과정을 안내합니다.  

#### 다운로드 & 컴파일

cabal이 없으면 미리 설치해야 합니다. 설명은 다음 링크를 참조하세요: https://www.haskell.org/cabal/

[cardano-node 설치](/docs/get-started/installing-cardano-node) 가이드를 따라했다면, `$HOME/cardano-src` 디렉토리가 있어야 합니다. 없다면, `cardano-wallet` 을 위해 소스 코드를 저장하고 빌드할 작업 디렉토리를 하나 만들도록 합시다.

```bash
mkdir -p $HOME/cardano-src
cd $HOME/cardano-src
```

그런 다음, `cardano-wallet` 소스 코드를 다운받습니다.

```bash
git clone https://github.com/input-output-hk/cardano-wallet.git 
cd ./cardano-wallet/ 
```

레퍼지토리를 태그됨 최신 커밋으로 전환합니다.

```bash
TAG=$(git describe --tags --abbrev=0) && echo latest tag $TAG 
git checkout $TAG
```

:::important
`cardano-wallet` [Github Release](https://github.com/input-output-hk/cardano-wallet/releases) 페이지에 가서 사용가능한 최신 버전 및 태그를 확인할 수 있습니다. 이 글을 쓰는 시점에서, 현재 버전은 `v2021-11-11` 입니다. `git tag -l` 명령어를 통해 모든 태그를 나열할 수 있습니다. 
:::

#### 지갑 빌드 및 설치

실행 가능한 바이너리를 생성하기 위해 `cardano-wallet` 코드를 빌드하겠습니다.

```bash
cabal build all
```

새롭게 빌드된 `cardano-wallet` 바이너리를 `$HOME/.local/bin` 디렉토리에 설치합니다.

```bash
cabal install cardano-wallet
```

다음과 같이 설치된 버전을 확인할 수 있습니다.

```bash
cardano-wallet version
```

다음과 같은 내용이 표시되어야 합니다. 

```bash
v2021-11-11 (git revision: dac16ba7e3bf64bf5474497656932fd342c3b720)
```

축하합니다! Linux/MacOS 시스템에 `cardano-wallet` 을 성공적으로 설치하셨습니다!🎉🎉🎉

## Windows

:::important
현재, **Windows 설치 가이드**는 아직 진행 중입니다. 그동안 [WSL (Windows Subsystem for Linux)](https://docs.microsoft.com/en-us/windows/wsl/)을 사용하여 Windows 위에 Linux 환경을 구축하는 것이 좋습니다. 설치가 완료되면 [Linux](#linux) 가이드를 사용하여 `cardano-node` 를 설치하고 실행할 수 있습니다.
:::

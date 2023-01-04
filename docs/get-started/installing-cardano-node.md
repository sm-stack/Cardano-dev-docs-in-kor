---
id: installing-cardano-node
title: cardano-node와 cardano-cli 설치
sidebar_label: cardano-node 설치
description: This guide shows how to build and install the cardano-node and cardano-cli from the source-code for all major Operating Systems
image: ../img/og/og-getstarted-installing-cardano-node.png
---
### 개요

이 가이드는 소스 코드로부터 직접 각자의 운영 체제에 `cardano-node` 와 `cardano-cli` 를 컴파일하고 설치하는 방법을 보여줄 것입니다. 이를 통해 **트랜잭션**을 보내고 받는 것뿐만 아니라, **NFT**를 만들고, 블록체인에 트랜잭션 **메타데이터**를 올리며, **네이티브 토큰**을 발행/소각하고, **스테이크 풀**을 생성하며, **스마트 컨트랙트**를 실행하는 등 엄청나게 많은 방식으로 **Cardano** 블록체인과 상호작용할 수 있습니다.

:::note
바이너리를 직접 컴파일하지 않고 싶다면 `cardano-node` 와 `cardano-cli` 의 최신 버전을 다음 링크에서 다운로드받을 수 있습니다.

[comment]: # (hard version code links, pending answer to...)
[comment]: # (https://github.com/input-output-hk/cardano-node/issues/4688#issuecomment-1336154065)

- [Linux](https://update-cardano-mainnet.iohk.io/cardano-node-releases/cardano-node-1.35.4-linux.tar.gz)
- [MacOS](https://update-cardano-mainnet.iohk.io/cardano-node-releases/cardano-node-1.35.4-linux.tar.gz)
- [Windows](https://update-cardano-mainnet.iohk.io/cardano-node-releases/cardano-node-1.35.4-win64.zip)

구성 요소는 **Windows**와 **MacOS**에서 빌드하고 실행될 수 있지만, 스테이크 풀 운영자는 프로덕션 환경에서 **Linux**를 사용하여 성능에 대한 이점을 활용할 것을 권장합니다.
:::

### 필요 조건

해당 요소들을 설정하려면, 다음과 같은 것들이 필요합니다.

* **Windows**, **MacOS**, 또는 **Linux**
* **1.6GHz 이상, 2개 이상의 core**를 가진 Intel이나 AMD x86 프로세서 (스테이크 풀이나 릴레이를 운영하려면 2GHz 이상을 추천)
* **16GB** RAM, 최소 **75GB** 의 여유 디스크 공간

:::note
메인넷 인스턴스에 연결하려는 경우, RAM 및 스토리지에 대한 요구 사항이 기준 이상으로 증가합니다.
:::

### 플랫폼 선택

* [Linux](#linux)
* [MacOS](#macos)
* [Windows](#windows)


## Linux

이 섹션에서는 **Linux 기반** 운영체제에 `cardano-node` 와 `cardano-cli` 를 다운로드, 컴파일하고 설치하는 방법을 안내합니다. 

#### 운영 체제 의존성 설치

소스 코드를 다운로드하고 빌드하려면, Linux 시스템에 다음 패키지 및 도구가 필요합니다.

* 버전 관리 시스템 `git`
*  C 컴파일러 `gcc`
* `gcc` 에 대한 C++ 지원 
* arbitrary precision 라이브러리 `gmp` 에 대한 개발자 라이브러리
* 압축 라이브러리 `zlib` 에 대한 개발자 라이브러리
* `systemd` 에 대한 개발자 라이브러리
* `ncurses` 에 대한 개발자 라이브러리
* `ncurses` 호환성 라이브러리
* Haskell 빌드 도구인 `cabal`
* GHC Haskell 컴파일러 (버전 `8.10.7` 이상).

Redhat, Fedora, 그리고 Centos에서는 다음과 같은 명령어를 입력하세요.
```bash
sudo yum update -y
sudo yum install git gcc gcc-c++ tmux gmp-devel make tar xz wget zlib-devel libtool autoconf jq -y
sudo yum install systemd-devel ncurses-devel ncurses-compat-libs -y
```

Debian/Ubuntu에 대해서는 , 다음을 입력하세요.
```bash
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install automake build-essential pkg-config libffi-dev libgmp-dev libssl-dev libtinfo-dev libsystemd-dev zlib1g-dev make g++ tmux git jq wget libncursesw5 libtool autoconf -y
```
다른 종류의 Linux를 사용하는 경우, `yum` 이나 `apt-get` 대신 플랫폼에 맞는 올바른 패키지 관리자를 사용해야 하며, 설치해야 하는 패키지의 이름이 다를 수 있습니다.

#### GHC와 Cabal 설치

**GHC** (Glasgow Haskell Compiler)와 **Cabal** (Common Architecture for Building Applications and Libraries)를 설치하는 가장 빠른 방법은 [ghcup](https://www.haskell.org/ghcup)을 사용하는 것입니다.

`ghcup` 설치를 위해 다음 명령어를 사용하세요.
```bash
curl --proto '=https' --tlsv1.2 -sSf https://get-ghcup.haskell.org | sh
```
이후 나오는 지침들을 따르고 설치 프로그램에 필요한 입력값을 제공하세요.

`Do you want ghcup to automatically add the required PATH variable to "/home/ubuntu/.bashrc"?` - (P or enter)

`Do you want to install haskell-language-server (HLS)?` - (N or enter)

`Do you want to install stack?` - (N or enter)

`Press ENTER to proceed or ctrl-c to abort.` (enter)

완료되면, `ghc` 와 `cabal` 을 시스템에 설치해야 합니다.

:::note
`ghcup` 은 쉘을 감지하고 환경 변수를 추가하라고 요청할 것입니다. `ghcup` 설치 후 쉘/터미널을 재시작 하십시오.
:::

`ghcup` 이 올바르게 설치되었는지 확인하려면, 터미널에 `ghcup --version` 을 치면 됩니다. 그러면 다음과 같은 문구를 볼 수 있습니다.

```
The GHCup Haskell installer, version v0.1.17.8
```

`ghcup` 은 `ghc` 의 최신 버전을 설치할 것입니다. 그러나, 글을 쓰는 시점에서 [Input-Output](https://iohk.io)은 `ghc 8.10.7` 을 사용하는 것을 추천합니다. 따라서, `ghcup` 을 통해 설치 후 해당 버전으로 전환할 것입니다.

```bash
ghcup install ghc 8.10.7
ghcup set ghc 8.10.7
```

`ghcup` 은 `cabal` 의 최신 버전을 설치할 것입니다. 그러나, 글을 쓰는 시점에서 [Input-Output](https://iohk.io)은 `cabal 3.6.2.0` 을 사용하는 것을 추천합니다. 따라서, `ghcup` 을 통해 설치 후 해당 버전으로 전환할 것입니다.

```bash
ghcup install cabal 3.6.2.0
ghcup set cabal 3.6.2.0
```


마지막으로, `ghc` 와 `cabal` 에 대해 올바른 버전이 설치되어 있는지 확인할 것입니다.

`ghc` 버전 확인:
```bash
ghc --version
```

다음과 같은 내용이 표시되어야 합니다.
```
The Glorious Glasgow Haskell Compilation System, version 8.10.7
```

`cabal` 버전 확인:
```bash
cabal --version
```

다음과 같은 내용이 표시되어야 합니다.

```
cabal-install version 3.6.2.0
compiled using version 3.6.2.0 of the Cabal library
```

:::important
설치한 버전이 위의 권장 버전과 일치하는지 확인하십시오. 그렇지 않은 경우 이전 단계 중 놓친 것이 있는지 확인하십시오.
:::

#### 다운로드 & 컴파일

구성 요소에 대해 소스 코드 및 빌드를 저장할 작업 디렉토리를 생성해 보겠습니다.

```bash
mkdir -p $HOME/cardano-src
cd $HOME/cardano-src
```
다음으로, `libsodium` 을 다운로드하고, 컴파일 및 설치할 것입니다.

```bash
git clone https://github.com/input-output-hk/libsodium
cd libsodium
git checkout 66f017f1
./autogen.sh
./configure
make
sudo make install
```

그런 다음 쉘 프로필에 다음 환경 변수를 추가합니다. 예시로는, 어떤 쉘 어플리케이션을 사용하고 있는지에 따라 `$HOME/.zshrc` 또는 `$HOME/.bashrc` 가 될 수 있습니다. 컴파일러가 `libsodium` 이 시스템에 설치된 것을 인식할 수 있도록 쉘 프로필/구성 파일의 맨 아래에 다음을 추가해 주세요.


```bash
export LD_LIBRARY_PATH="/usr/local/lib:$LD_LIBRARY_PATH"
export PKG_CONFIG_PATH="/usr/local/lib/pkgconfig:$PKG_CONFIG_PATH"
```

일단 저장되면, 쉘 프로필을 다시 로드하여 새 변수를 사용합니다. `source $HOME/.bashrc` 또는 `source $HOME/.zshrc` 을 입력하여 이를 수행할 수 있습니다(***사용하는 쉘 어플리케이션에 따라 다릅니다***).

그런 다음 1.35.0 cardano-node 버전에 필요한 Secp256k1을 설치해야 합니다.

libsecp256k1을 다운로드하고 설치하세요:
```bash
cd $HOME/cardano-src
git clone https://github.com/bitcoin-core/secp256k1
cd secp256k1
git checkout ac83be33
./autogen.sh
./configure --enable-module-schnorrsig --enable-experimental
make
make check
sudo make install
```

이제 `cardano-node` 와 `cardano-cli` 를 다운로드, 컴파일 및 설치할 준비가 되었습니다. 그러나 그 전에, 먼저 작업 디렉토리의 루트로 돌아가있는지 확인해야 합니다.

```bash
cd $HOME/cardano-src
```

`cardano-node` 레퍼지토리를 다운로드하세요.

```bash
git clone https://github.com/input-output-hk/cardano-node.git
cd cardano-node
git fetch --all --recurse-submodules --tags
```
레퍼지토리를 태그된 최신 커밋으로 전환합니다.

```bash
git checkout $(curl -s https://api.github.com/repos/input-output-hk/cardano-node/releases/latest | jq -r .tag_name)
```

:::important
기존 노드를 업그레이드하는 경우, 변경사항에 대해 [GitHub의 릴리스 정보](https://github.com/input-output-hk/cardano-node/releases)를 읽어야 합니다.
:::

#### 빌드 옵션 구성

앞서 설치했던 `ghc` 버전을 명시적으로 사용하면, 설치한 것보다 최신이거나 오래된 `ghc` 버전으로 돌아가는 것을 피할 수 있습니다.

```bash
cabal configure --with-compiler=ghc-8.10.7
```

ARM과 같은 x86/x64이 아닌 플랫폼을 실행 중인 경우, 다음과 같이 LLVM을 설치하고 구성하세요.
```bash
sudo apt install llvm-9
sudo apt install clang-9 libnuma-dev
sudo ln -s /usr/bin/llvm-config-9 /usr/bin/llvm-config
sudo ln -s /usr/bin/opt-9 /usr/bin/opt
sudo ln -s /usr/bin/llc-9 /usr/bin/llc
sudo ln -s /usr/bin/clang-9 /usr/bin/clang
```

#### 노드 빌드 및 설치

이제 바이너리 생성을 위해 `Haskell-based` `cardano-node` 를 빌드할 수 있습니다.

```bash
cabal build cardano-node cardano-cli
```

새로 빌드된 노드와 CLI 커맨드를 $HOME/.local/bin 디렉토리에 설치합니다.

```bash
mkdir -p $HOME/.local/bin
cp -p "$(./scripts/bin-path.sh cardano-node)" $HOME/.local/bin/
cp -p "$(./scripts/bin-path.sh cardano-cli)" $HOME/.local/bin/
```

쉘/터미널이 `cardano-node` 와 `cardano-cli` 를 전역 명령어로 인식할 수 있도록 다음을 쉘 프로필 아래에 추가해주어야 합니다.
(***사용하는 쉘 어플리케이션에 따라***`$HOME/.zshrc` 또는 `$HOME/.bashrc`)

```bash
export PATH="$HOME/.local/bin/:$PATH"
```

저장되었으면, (***사용하는 쉘 어플리케이션에 따라***) `source $HOME/.zshrc` 또는 `source $HOME/.bashrc` 을 입력하여 쉘 프로필을 다시 로드합니다.

설치된 버전 확인:
```
cardano-cli --version
cardano-node --version
```

축하합니다! Linux 시스템에 Cardano 구성 요소를 성공적으로 설치했습니다!🎉🎉🎉

다음으로, [cardano-node를 실행](running-cardano.md)하는 방법에 대해 이야기하겠습니다..

## MacOS

이 섹션에서는 **MacOS 기반** 운영체제에 `cardano-node` 와 `cardano-cli` 를 다운로드, 컴파일하고 설치하는 방법을 안내합니다.

#### 운영 체제 의존성 설치

소스 코드를 다운로드하고 빌드하려면 MacOS 시스템에 다음 패키지와 도구가 필요합니다.

* [Xcode](https://developer.apple.com/xcode) - Apple 개발 IDE 및 SDK/도구
* [Xcode Command Line Tools](https://developer.apple.com/xcode/features/), 터미널에 `xcode-select --install` 을 입력하여 설치할 수 있습니다.
* [Homebrew](https://brew.sh) - MacOS (또는 Linux)에 대한 Missing Package Manager 

#### Homebrew 패키지 설치

`cardano-node` 과 `cardano-cli` 구성 요소가 제대로 컴파일되려면, `brew` 를 통해 몇 가지 라이브러리를 설치해야 합니다.

```bash
brew install jq
brew install libtool
brew install autoconf
brew install automake
brew install pkg-config
brew install openssl
```

#### M1을 사용하는 경우 llvm을 설치해야 합니다.

```
brew install llvm
```

#### GHC와 Cabal 설치

**GHC** (Glasgow Haskell Compiler)와 **Cabal** (Common Architecture for Building Applications and Libraries)을 설치하는 가장 빠른 방법은 [ghcup](https://www.haskell.org/ghcup) 을 사용하는 것입니다.

다음 명령어를 통해 `ghcup` 을 설치하세요.
```bash
curl --proto '=https' --tlsv1.2 -sSf https://get-ghcup.haskell.org | sh
```
지침을 따르고 설치 프로그램에 필요한 입력을 제공하십시오.

`Do you want ghcup to automatically add the required PATH variable to "/home/ubuntu/.bashrc"?` - (P or enter)

`Do you want to install haskell-language-server (HLS)?` - (N or enter)

`Do you want to install stack?` - (N or enter)

`Press ENTER to proceed or ctrl-c to abort.` (enter)

완료되면 시스템에 `ghc` 와 `cabal` 을 설치해야 합니다.


:::note
`ghcup` 은 쉘을 감지하고 환경 변수를 추가하라고 요청할 것입니다. `ghcup` 설치 후 쉘/터미널을 재시작 하십시오.
:::

`ghcup` 이 올바르게 설치되었는지 확인하려면, 터미널에 `ghcup --version` 을 치면 됩니다. 그러면 다음과 같은 문구를 볼 수 있습니다.

```
The GHCup Haskell installer, version v0.1.17.4
```

`ghcup` 은 `ghc` 의 최신 버전을 설치할 것입니다. 그러나, 글을 쓰는 시점에서 [Input-Output](https://iohk.io)은 `ghc 8.10.7` 을 사용하는 것을 추천합니다. 따라서, `ghcup` 을 통해 설치 후 해당 버전으로 전환할 것입니다.

```bash
ghcup install ghc 8.10.7
ghcup set ghc 8.10.7
```

`ghcup` 은 `cabal` 의 최신 버전을 설치할 것입니다. 그러나, 글을 쓰는 시점에서 [Input-Output](https://iohk.io)은 `cabal 3.6.2.0` 을 사용하는 것을 추천합니다. 따라서, `ghcup` 을 통해 설치 후 해당 버전으로 전환할 것입니다.

```bash
ghcup install cabal 3.6.2.0
ghcup set cabal 3.6.2.0
```


마지막으로, `ghc` 와 `cabal` 에 대해 올바른 버전이 설치되어 있는지 확인할 것입니다.

`ghc` 버전 확인:
```bash
ghc --version
```

다음과 같은 내용이 표시되어야 합니다.
```
The Glorious Glasgow Haskell Compilation System, version 8.10.7
```

`cabal` 버전 확인:
```bash
cabal --version
```

다음과 같은 내용이 표시되어야 합니다.

```
cabal-install version 3.6.2.0
compiled using version 3.6.2.0 of the Cabal library
```

:::important
설치한 버전이 위의 권장 버전과 일치하는지 확인하십시오. 그렇지 않은 경우 이전 단계 중 놓친 것이 있는지 확인하십시오.
:::


#### 다운로드 & 컴파일

구성 요소에 대해 소스 코드 및 빌드를 저장할 작업 디렉토리를 생성해 보겠습니다.

```bash
mkdir -p $HOME/cardano-src
cd $HOME/cardano-src
```
다음으로, `libsodium` 을 다운로드하고, 컴파일 및 설치할 것입니다.

```bash
git clone https://github.com/input-output-hk/libsodium
cd libsodium
git checkout 66f017f1
./autogen.sh
./configure
make
sudo make install
```

그런 다음 쉘 프로필에 다음 환경 변수를 추가합니다. 예시로는, 어떤 쉘 어플리케이션을 사용하고 있는지에 따라 `$HOME/.zshrc` 또는 `$HOME/.bashrc` 가 될 수 있습니다. 컴파일러가 `libsodium` 이 시스템에 설치된 것을 인식할 수 있도록 쉘 프로필/구성 파일의 맨 아래에 다음을 추가해 주세요.

```bash
export LD_LIBRARY_PATH="/usr/local/lib:$LD_LIBRARY_PATH"
export PKG_CONFIG_PATH="/usr/local/lib/pkgconfig:$PKG_CONFIG_PATH"
```

M1에 llvm을 설치했다면, 다음 또한 추가해 주어야 할 것입니다.

```bash
export PATH="/opt/homebrew/opt/llvm/bin:$PATH"
```

:::note
llvm 설치 경로는 설치 방식에 따라 다를 수 있습니다. 디폴트 설치 방식을 사용했다면 괜찮을 것입니다. 이 정보를 보려면, llvm을 설치한 후 화면을 확인하세요. 잊어버린 경우 llvm을 다시 설치하면 볼 수 있습니다.
:::

일단 저장되면, 쉘 프로필을 다시 로드하여 새 변수를 사용합니다. (***사용하는 쉘 어플리케이션에 따라***) `source $HOME/.bashrc` 또는 `source $HOME/.zshrc` 를 입력하면 됩니다.

그런 다음 1.35.0 cardano-node 버전에 필요한 Secp256k1을 설치해야 합니다.

libsecp256k1을 다운로드하고 설치하세요:
```bash
cd $HOME/cardano-src
git clone https://github.com/bitcoin-core/secp256k1
cd secp256k1
git checkout ac83be33
./autogen.sh
./configure --enable-module-schnorrsig --enable-experimental
make
make check
sudo make install
```

이제 `cardano-node` 와 `cardano-cli` 를 다운로드, 컴파일 및 설치할 준비가 되었습니다. 그러나 그 전에, 먼저 작업 디렉토리의 루트로 돌아가있는지 확인해야 합니다.

```bash
cd $HOME/cardano-src
```

`cardano-node` 레퍼지토리를 다운로드하세요.

```bash
git clone https://github.com/input-output-hk/cardano-node.git
cd cardano-node
git fetch --all --recurse-submodules --tags
```
레퍼지토리를 태그된 최신 커밋으로 전환합니다.

```bash
git checkout $(curl -s https://api.github.com/repos/input-output-hk/cardano-node/releases/latest | jq -r .tag_name)
```

:::important
기존 노드를 업그레이드하는 경우, 변경사항에 대해 [GitHub의 릴리스 정보](https://github.com/input-output-hk/cardano-node/releases)를 읽어야 합니다.
If upgrading an existing node, please ensure that you have read the [release notes on GitHub](https://github.com/input-output-hk/cardano-node/releases) for any changes.
:::

##### 빌드 옵션 구성

앞서 설치했던 `ghc` 버전을 명시적으로 사용하면, 설치한 것보다 최신이거나 오래된 `ghc` 버전으로 돌아가는 것을 피할 수 있습니다.

```bash
cabal configure --with-compiler=ghc-8.10.7
```

#### 빌딩 전 cabal 관련 옵션 설정을 위해, M1에서 다음 명령어를 실행하여야 합니다.

```
echo "package trace-dispatcher" >> cabal.project.local
echo "  ghc-options: -Wwarn" >> cabal.project.local
echo "" >> cabal.project.local

echo "package HsOpenSSL" >> cabal.project.local
echo "  flags: -homebrew-openssl" >> cabal.project.local
echo "" >> cabal.project.local
```

#### 노드 빌드 및 설치
```bash
cabal build all
```
:::caution
MacOS의 최신 버전들은 디폴트로 예상된 위치와 다른 곳에 openssl을 설치하는 것으로 보입니다. **homebrew**를 통해 openssl을 설치하였다면 다음과 같은 빌드 에러가 발생할 것입니다.

```
Failed to build HsOpenSSL-0.11.7.2. The failure occurred during the configure
step.
[1 of 1] Compiling Main (...)
Linking .../dist-newstyle/tmp/src-75805/HsOpenSSL-0.11.7.2/dist/setup/setup ...
Configuring HsOpenSSL-0.11.7.2...
setup: Can’t find OpenSSL library
```

다음과 같이 관련 symlink을 추가해야 할 가능성이 높습니다.

```
sudo mkdir -p /usr/local/opt/openssl
sudo ln -s /opt/homebrew/opt/openssl@3/lib /usr/local/opt/openssl/lib
sudo ln -s /opt/homebrew/opt/openssl@3/include /usr/local/opt/openssl/include
```

이것은 `HsOpenSSL` 라이프러리 래퍼의 안 좋은 점이며, `LDFLAGS` & `CPPFLAGS` 를 설정하는 것과 같은 고전적인 방식이나 `--extra-include-dirs` 와 `--extra-lib-dirs` 를 사용하는 것은 제대로 먹히지 않을 가능성이 큽니다.
:::

새로 빌드된 노드와 CLI를 $HOME/.local/bin 디렉토리에 설치합니다.

```bash
mkdir -p $HOME/.local/bin
cp -p "$(./scripts/bin-path.sh cardano-node)" $HOME/.local/bin/
cp -p "$(./scripts/bin-path.sh cardano-cli)" $HOME/.local/bin/
```

쉘/터미널이 `cardano-node` 와 `cardano-cli` 를 전역 명령어로 인식할 수 있도록 다음을 쉘 프로필 아래에 추가해주어야 합니다.
(***사용하는 쉘 어플리케이션에 따라***`$HOME/.zshrc` 또는 `$HOME/.bashrc`)

```bash
export PATH="$HOME/.local/bin/:$PATH"
```

저장되었으면, (***사용하는 쉘 어플리케이션에 따라***) `source $HOME/.zshrc` 또는 `source $HOME/.bashrc` 을 입력하여 쉘 프로필을 다시 로드합니다.

설치된 버전 확인.
```
cardano-cli --version
cardano-node --version
```

축하합니다! MacOS 시스템에 Cardano 구성 요소를 성공적으로 설치했습니다!🎉🎉🎉 

다음으로, [cardano-node를 실행](running-cardano.md)하는 방법에 대해 이야기하겠습니다.

## Windows

:::important
현재 **Windows** 설치 가이드는 작성 진행 중입니다. 그 동안, Windows 위에 Linux 환경을 구축하는 [WSL (Windows Subsystem for Linux)](https://docs.microsoft.com/en-us/windows/wsl/) 사용을 추천합니다. 이를 설치하면, **WSL** 내에서 `cardano-node` 설치와 실행을 위해 [Linux](#linux) 가이드를 활용하면 됩니다.
:::

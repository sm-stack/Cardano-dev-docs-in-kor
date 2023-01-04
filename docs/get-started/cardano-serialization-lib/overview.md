---
id: overview
sidebar_position: 1
title: Cardano Serialization Lib 시작하기
sidebar_label: 개요
description: Get Started with Cardano Serialization Lib
image: ../img/og/og-getstarted-serialization-lib.png
--- 
 
이는 Shelley의 Cardano용 Haskell 구현에 사용되는 데이터 구조의 직렬화 및 역직렬화를 위한 라이브러리입니다.

## 해당 라이브러리를 사용하는 방법

Rust는 휴대성이 뛰어납니다! 모든 일반적인 프로그래밍 언어(심지어 C와 WebAssembly까지)에서 네이티브 Rust 라이브러리에 쉽게 바인딩할 수 있습니다!

### NPM packages패키지
 
-  [NodeJS WASM package](https://www.npmjs.com/package/@emurgo/cardano-serialization-lib-nodejs)
-  [Browser (chrome/firefox) WASM package](https://www.npmjs.com/package/@emurgo/cardano-serialization-lib-browser)
-  [Browser (pure JS - no WASM) ASM.js package](https://www.npmjs.com/package/@emurgo/cardano-serialization-lib-asmjs)


### 모바일 바인딩

-  [React-Native mobile bindings](https://github.com/Emurgo/react-native-haskell-shelley)

## 해당 라이브러리 사용의 이점

직렬화/역직렬화 코드는 Cardano 공식 사양에서 자동으로 생성되므로, 쉽게 최신 상태를 유지할 수 있습니다! 우리는 Cardano 메타데이터 사양을 위한 Rust 라이브러리 자동 생성과 같은 작업에 재사용될 수 있는 [cddl-codegen](https://github.com/Emurgo/cddl-codegen)이라는 EMURGO 작성 도구를 사용하여 이 작업을 수행합니다!

Rust 또는 WASM에서 스크립트를 생성하여 스테이크 풀과 공유하거나 온라인 도구에 포함시키는 것도 매우 쉽습니다! 더 이상 어려운 cardano-cli bash 스크립트를 쓰지 않아도 됩니다!

이는 지갑 및 거래소에 사용할 수 있을 만큼 강력하고 유연한 도구입니다!

## 문서

이 라이브러리는 [Typescript](https://www.typescriptlang.org/)와 [Flow](https://flow.org/)의 자료형 정의를 둘 다 생성하기 때문에, 자료형을 보는 것만으로도 무엇이 가능한지 확인할 수 있습니다!
[여기](https://github.com/Emurgo/cardano-serialization-lib/blob/master/rust/pkg/cardano_serialization_lib.js.flow)에서 Flow 자료형을 확인할 수 있습니다.

또한 [예제](https://github.com/Emurgo/cardano-serialization-lib/tree/master/example) 폴더에서 Typescrupt를 통해 이 라이브러리를 사용하는 방법을 확인하거나, 라이브러리를 실험해볼 수 있습니다.

## Cardano의 다른 버전에 대해서는 어떻습니까?

만약 레거지 바인딩을 찾고 있다면, 다음에서 찾을 수 있습니다.

-  [Byron WASM bindings](https://github.com/input-output-hk/js-cardano-wasm/tree/master/cardano-wallet)
-  [Jormungandr WASM bindings](https://github.com/emurgo/js-chain-libs)

## 원래 바이너리 사양

원래 [CDDL](http://cbor.io/tools.html) 사양의 위치는 다음과 같습니다.

-  Byron: [링크](https://github.com/input-output-hk/cardano-ledger/tree/master/eras/byron/cddl-spec)
-  Shelley: [링크](https://github.com/input-output-hk/cardano-ledger/tree/master/eras/shelley/test-suite/cddl-files)
-  Mary: [링크](https://github.com/input-output-hk/cardano-ledger/tree/master/eras/shelley-ma/test-suite/cddl-files)

## 빌딩

Rust를 설치해야 한다면, 다음과 같이 하면 됩니다.

```shell
curl https://sh.rustup.rs -sSf | sh -s -- -y
echo 'export PATH=$HOME/.cargo/bin/:$PATH' >> $BASH_ENV
rustup install stable
rustup target add wasm32-unknown-unknown --toolchain stable
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```   

이 레퍼지토리를 빌드하려면, 다음과 같이 하면 됩니다.

```shell
git submodule update --init --recursive
nvm use
npm install
npm run rust:build-nodejs
```

## 테스트

```shell
npm run rust:test
```

## 배포

[crates.io](https://crates.io)에 새 버전을 배포하려면

```shell
npm run rust:publish
```

새 버전을 NPM에 게시하여면(해당 프로젝트의 관리자일 경우만 해당)

```shell
npm run js:publish-nodejs
npm run js:publish-browser
npm run js:publish-asm
```
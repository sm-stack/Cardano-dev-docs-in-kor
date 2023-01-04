---
id: use-cli
title: 명령줄 인터페이스
sidebar_label: 명령줄 인터페이스
description: "Stake pool course: Learn how to use command line interface (cli)."
image: ../img/og/og-developer-portal.png
---

이 명령줄 인터페이스는 키 생성, 트랜잭션 구성, 인증서 생성 및 기타 중요한 작업을 위한 도구 모음을 제공합니다.

하위 명령의 계층 구조로 구성되어 있으며 각 수준에는 명령 구문 및 옵션에 대한 자체 내장 문서가 함께 제공됩니다.

인자 없이 명령을 입력하면 최상위 수준의 도움말을 얻을 수 있습니다.


```sh
cardano-cli
```

사용 간으한 하위 명령 중 `node`가 있음을 알 수 있고, 다음 명령어를 입력해보세요.

```sh
cardano-cli node
```

이는 node 아래 하위 명령어들을 나타냅니다. 이 중 `key-gen`을 사용해봅시다.

```sh
cardano-cli node key-gen
```

이는 해당 명령이 취하는 매개변수에 대해 알려줍니다. 따라서 다음과 같은 것들을 입력하여 오프라인 키의 쌍과 issue counter 파일을 생성할 수 있습니다.

```sh
cardano-cli node key-gen \
    --cold-verification-key-file cold.vkey \
    --cold-signing-key-file cold.skey \
    --operational-certificate-issue-counter-file cold.counter
```

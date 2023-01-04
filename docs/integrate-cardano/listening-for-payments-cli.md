---
id: listening-for-payments-cli
title: cardano-cli를 사용하여 ada 결제 받기
sidebar_label: 결제 받기 (cardano-cli)
description: How to listen for ada Payments with the cardano-cli.
image: ../img/og/og-developer-portal.png
--- 
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 개요

:::note
이 가이드는 사용자가 `cardano-cli`에 대한 기본적인 이해를 하고 있고, 이를 시스템에 설치했다고 가정합니다. 그렇지 않다면 [cardano-node 설치](/docs/get-started/installing-cardano-node), [cardano-node 실행하기](/docs/get-started/running-cardano)와 [Cardano 지갑 알아보기](/docs/integrate-cardano/creating-wallet-faucet) 가이드를 먼저 읽는 것을 추천합니다.

이 가이드는 또한 `cardano-node`를 백그라운드에서 실행 중이고 `testnet` 네트워크에 연결되어 있는 상황을 가정합니다.
:::

## 사용 사례

`Ada` 결제를 수신하는 기능이 필요한 데는 여러 가지 이유가 있겠지만, 매우 분명한 사용 사례는 **온라인 상점**이나 `Ada` 토큰을 통화로 사용하는 **결제 게이트웨이**와 같은 것들입니다. 

![img](../../static/img/integrate-cardano/ada-online-shop.png)

## 기술 흐름

기술적인 관점에서 이와 같은 것이 어떻게 작동하는지 이해하려면, 다음 다이어그램을 보면 됩니다.

![img](../../static/img/integrate-cardano/ada-payment-flow.png)

**고객**이 온라인 상점에서 상품을 검색하는 아주 기본적인 시나리오를 생각해 봅시다. 사용자가 모든 항목을 선택하고 **장바구니**에 추가하면, 다음 단계는 항목을 체크아웃해서 결제하는 것입니다. 물론 이를 위해 **Cardano**를 사용할 것입니다!

그런 다음 **프론트엔드** 어플리케이션은 백엔드 서비스로부터 **지갑 주소**를 요청하고 **Cardano** 지갑을 통해 스캔할 QR 코드를 **고객**에게 렌더링합니다. 그러면 백엔드 서비스는 결제가 성공적으로 완료되었음을 **프론트엔드** 어플리케이션에 확인하고 알리기 위해 특정 시간 간격으로 `cardano-cli`를 사용해 **지갑 주소**를 쿼리해야 합니다.

그 동안 트랜잭션은 **Cardano** 네트워크 내에서 처리되고 확정됩니다. 위 다이어그램에서도 볼 수 있듯이, 결제에 참여하는 두 객체는 `cardano-node` 소프트웨어 구성요소를 통해 궁극적으로 네트워크에 연결되어 있습니다.

## 코딩 시간

이제 직접 실제 코드에서 이와 같은 것을 구현하는 방법을 살펴보겠습니다.

:::note
이 섹션에서는, `$HOME/receive-ada-sample` 경로를 사용하여 이 예제와 관련된 모든 파일을 저장합니다. 각자 선택한 디렉토리로 바꾸십시오. 
이 문서의 모든 코드 예제에서는 이 디렉터리의 루트 아래에 모든 소스 코드 파일을 저장한다고 가정합니다. 
:::

### 키 생성 및 tAda 요청

먼저 샘플 프로젝트를 저장할 디렉토리를 생성해 보겠습니다.

```bash
mkdir -p $HOME/receive-ada-sample/keys
```

다음으로 `cardano-cli`를 사용하여 **지불 키 쌍**을 생성합니다.

```bash
cardano-cli address key-gen \
--verification-key-file $HOME/receive-ada-sample/keys/payment.vkey \
--signing-key-file $HOME/receive-ada-sample/keys/payment.skey
```

이제 **지불 키 쌍**이 있으므로, 다음 단계는 다음과 같이 `testnet` 네트워크의 **지갑 주소**를 생성하는 것입니다.

```bash
cardano-cli address build \
--payment-verification-key-file $HOME/receive-ada-sample/keys/payment.vkey \
--out-file $HOME/receive-ada-sample/keys/payment.addr \
--testnet-magic 1097911063
```

이제 디렉토리 구조는 다음과 같아야 합니다.

```bash
$HOME/receive-ada-sample/receive-ada-sample
└── keys
    ├── payment.addr
    ├── payment.skey
    └── payment.vkey
```

이제 선택한 **프로그래밍 언어**를 사용하여 처음 몇 줄의 코드를 생성합니다!

### 초기 변수

먼저 아래 설명된 대로 사용할 초기 변수를 설정합니다.

<Tabs
  defaultValue="js"
  groupId="language"
  values={[
    {label: 'JavaScript', value: 'js'},
    {label: 'Typescript', value: 'ts'},
    {label: 'Python', value: 'py'},
    {label: 'C#', value: 'cs'}
  ]}>

  <TabItem value="js">

```js title="checkPayment.js"
import * as fs from 'fs';
// Please add this dependency using npm install node-cmd
import cmd from 'node-cmd';

// Path to the cardano-cli binary or use the global one
const CARDANO_CLI_PATH = "cardano-cli";
// The `testnet` identifier number
const CARDANO_NETWORK_MAGIC = 1097911063;
// The directory where we store our payment keys
// assuming our current directory context is $HOME/receive-ada-sample
const CARDANO_KEYS_DIR = "keys";
// The total payment we expect in lovelace unit
const TOTAL_EXPECTED_LOVELACE = 1000000;
```

  </TabItem>
  <TabItem value="ts">

```ts title="checkPayment.ts"
import * as fs from 'fs';
// Please add this dependency using npm install node-cmd but there is no @type definition for it
const cmd: any = require('node-cmd');

// Path to the cardano-cli binary or use the global one
const CARDANO_CLI_PATH: string = "cardano-cli";
// The `testnet` identifier number
const CARDANO_NETWORK_MAGIC: number = 1097911063;
// The directory where we store our payment keys
// assuming our current directory context is $HOME/receive-ada-sample/receive-ada-sample
const CARDANO_KEYS_DIR: string = "keys";
// The total payment we expect in lovelace unit
const TOTAL_EXPECTED_LOVELACE: number = 1000000;
```

  </TabItem>
  <TabItem value="py">

```python title="checkPayment.py"
import os
import subprocess

# Path to the cardano-cli binary or use the global one
CARDANO_CLI_PATH = "cardano-cli"
# The `testnet` identifier number
CARDANO_NETWORK_MAGIC = 1097911063
# The directory where we store our payment keys
# assuming our current directory context is $HOME/receive-ada-sample
CARDANO_KEYS_DIR = "keys"
# The total payment we expect in lovelace unit
TOTAL_EXPECTED_LOVELACE = 1000000
```

  </TabItem>
  <TabItem value="cs">

```csharp title="Program.cs"
using System.Linq;
using SimpleExec; // `dotnet add package SimpleExec --version 7.0.0`

// Path to the cardano-cli binary or use the global one
const string CARDANO_CLI_PATH = "cardano-cli";
// The `testnet` identifier number
const int CARDANO_NETWORK_MAGIC = 1097911063;
// The directory where we store our payment keys
// assuming our current directory context is $HOME/user/receive-ada-sample
const string CARDANO_KEYS_DIR = "keys";
// The total payment we expect in lovelace unit
const long TOTAL_EXPECTED_LOVELACE = 1000000;
```

  </TabItem>
</Tabs>

### 지갑 주소 값 읽기

다음으로, 조금 전 생성된 `payment.addr` 파일에서 **지갑 주소**의 문자열 삾을 가져옵니다. 또한 코드에 다음 라인을 추가합니다.

<Tabs
  defaultValue="js"
  groupId="language"
  values={[
    {label: 'JavaScript', value: 'js'},
    {label: 'Typescript', value: 'ts'},
    {label: 'Python', value: 'py'},
    {label: 'C#', value: 'cs'}
  ]}>

  <TabItem value="js">

```js title="checkPayment.js"
// Read wallet address value from payment.addr file
const walletAddress = fs.readFileSync(`${CARDANO_KEYS_DIR}/payment.addr`).toString();
```

  </TabItem>
  <TabItem value="ts">

```ts title="checkPayment.ts"
// Read wallet address string value from payment.addr file
const walletAddress: string = fs.readFileSync(`${CARDANO_KEYS_DIR}/payment.addr`).toString();
```

  </TabItem>
  <TabItem value="py">

```python title="checkPayment.py"
# Read wallet address value from payment.addr file
with open(os.path.join(CARDANO_KEYS_DIR, "payment.addr"), 'r') as file:
    walletAddress = file.read()
```

  </TabItem>
  <TabItem value="cs">

```csharp title="Program.cs"
// Read wallet address value from payment.addr file
var walletAddress = await System.IO.File.ReadAllTextAsync($"{CARDANO_KEYS_DIR}/payment1.addr");
```

  </TabItem>
</Tabs>

### UTxO 쿼리하기

그런 다음 `cardano-cli`를 실행하고, 키를 생성한 **지갑 주소**에 대해 **UTxO**를 쿼리하여 `stdout` 결과를 `rawUtxoTable` 변수에 저장합니다.

<Tabs
  defaultValue="js"
  groupId="language"
  values={[
    {label: 'JavaScript', value: 'js'},
    {label: 'Typescript', value: 'ts'},
    {label: 'Python', value: 'py'},
    {label: 'C#', value: 'cs'}
  ]}>

  <TabItem value="js">

```js title="checkPayment.js"
// We use the node-cmd npm library to execute shell commands and read the output data
const rawUtxoTable = cmd.runSync([
    CARDANO_CLI_PATH,
    "query", "utxo",
    "--testnet-magic", CARDANO_NETWORK_MAGIC,
    "--address", walletAddress
].join(" "));
```

  </TabItem>
  <TabItem value="ts">

```ts title="checkPayment.ts"
// We use the node-cmd npm library to execute shell commands and read the output data
const rawUtxoTable: any = cmd.runSync([
    CARDANO_CLI_PATH,
    "query", "utxo",
    "--testnet-magic", CARDANO_NETWORK_MAGIC,
    "--address", walletAddress
].join(" "));
```

  </TabItem>
  <TabItem value="py">

```python title="checkPayment.py"
# We tell python to execute cardano-cli shell command to query the UTXO and read the output data
rawUtxoTable = subprocess.check_output([
    CARDANO_CLI_PATH,
    'query', 'utxo',
    '--testnet-magic', str(CARDANO_NETWORK_MAGIC),
    '--address', walletAddress])
```

  </TabItem>
  <TabItem value="cs">

```csharp title="Program.cs"
// We use the SimpleExec dotnet library to execute shell commands and read the output data
var rawUtxoTable = await Command.ReadAsync(CARDANO_CLI_PATH, string.Join(" ",
    "query", "utxo",
    "--testnet-magic", CARDANO_NETWORK_MAGIC,
    "--address", walletAddress
), noEcho: true);
```

  </TabItem>
</Tabs>

### UTxO 테이블 처리하기

**UTXO** 테이블 문자열에 액세스할 수 있게 되면, 이를 구문분석하여 현재 지갑에 있는 총 lovelace를 계산합니다.

<Tabs
  defaultValue="js"
  groupId="language"
  values={[
    {label: 'JavaScript', value: 'js'},
    {label: 'Typescript', value: 'ts'},
    {label: 'Python', value: 'py'},
    {label: 'C#', value: 'cs'}
  ]}>

  <TabItem value="js">

```js title="checkPayment.js"
// Calculate total lovelace of the UTXO(s) inside the wallet address
const utxoTableRows = rawUtxoTable.data.trim().split('\n');
let totalLovelaceRecv = 0;
let isPaymentComplete = false;

for (let x = 2; x < utxoTableRows.length; x++) {
    const cells = utxoTableRows[x].split(" ").filter(i => i);
    totalLovelaceRecv += parseInt(cells[2]);
}
```

  </TabItem>
  <TabItem value="ts">

```ts title="checkPayment.ts"
// Calculate total lovelace of the UTXO(s) inside the wallet address
const utxoTableRows: string[] = rawUtxoTable.data.trim().split('\n');
let totalLovelaceRecv: number = 0;
let isPaymentComplete: boolean = false;

for (let x = 2; x < utxoTableRows.length; x++) {
    const cells = utxoTableRows[x].split(" ").filter((i: string) => i);
    totalLovelaceRecv += parseInt(cells[2]);
}
```

  </TabItem>
  <TabItem value="py">

```python title="checkPayment.py"
# Calculate total lovelace of the UTXO(s) inside the wallet address
utxoTableRows = rawUtxoTable.strip().splitlines()
totalLovelaceRecv = 0
isPaymentComplete = False

for x in range(2, len(utxoTableRows)):
    cells = utxoTableRows[x].split()
    totalLovelaceRecv +=  int(cells[2])
```

  </TabItem>
  <TabItem value="cs">

```csharp title="Program.cs"
// Calculate total lovelace of the UTXO(s) inside the wallet address
var utxoTableRows = rawUtxoTable.Trim().Split("\n");
var totalLovelaceRecv = 0L;
var isPaymentComplete = false;

foreach(var row in utxoTableRows.Skip(2)){
    var cells = row.Split(" ").Where(c => c.Trim() != string.Empty);
    totalLovelaceRecv +=  long.Parse(cells.ElementAt(2));
}
```

  </TabItem>
</Tabs>

### 결제 성공 여부 확인

총 lovelace 금액을 얻었으면 ,해당 결제가 성공했는지 코드를 사용하여 결정하고, 궁극적으로 성공했다면 물건을 보내거나 배송합니다. 이 예제에서는 지급액이 상수 변수인 `TOTAL_EXPECTED_LOVELACE`에서 정의한 `1,000,000 lovelace`와 같을 것입니다.

<Tabs
  defaultValue="js"
  groupId="language"
  values={[
    {label: 'JavaScript', value: 'js'},
    {label: 'Typescript', value: 'ts'},
    {label: 'Python', value: 'py'},
    {label: 'C#', value: 'cs'}
  ]}>

  <TabItem value="js">

```js title="checkPayment.js"
// Determine if the total lovelace received is more than or equal to
// the total expected lovelace and displaying the results.
isPaymentComplete = totalLovelaceRecv >= TOTAL_EXPECTED_LOVELACE;

console.log(`Total Received: ${totalLovelaceRecv} LOVELACE`);
console.log(`Expected Payment: ${TOTAL_EXPECTED_LOVELACE} LOVELACE`);
console.log(`Payment Complete: ${(isPaymentComplete ? "✅" : "❌")}`);
```

  </TabItem>
  <TabItem value="ts">

```ts title="checkPayment.ts"
// Determine if the total lovelace received is more than or equal to
// the total expected lovelace and displaying the results.
isPaymentComplete = totalLovelaceRecv >= TOTAL_EXPECTED_LOVELACE;

console.log(`Total Received: ${totalLovelaceRecv} LOVELACE`);
console.log(`Expected Payment: ${TOTAL_EXPECTED_LOVELACE} LOVELACE`);
console.log(`Payment Complete: ${(isPaymentComplete ? "✅" : "❌")}`);
```

  </TabItem>
  <TabItem value="py">

```python title="checkPayment.py"
# Determine if the total lovelace received is more than or equal to
# the total expected lovelace and displaying the results.
isPaymentComplete = totalLovelaceRecv >= TOTAL_EXPECTED_LOVELACE

print("Total Received: %s LOVELACE" % totalLovelaceRecv)
print("Expected Payment: %s LOVELACE" % TOTAL_EXPECTED_LOVELACE)
print("Payment Complete: %s" % {True: "✅", False: "❌"} [isPaymentComplete])
```

  </TabItem>
  <TabItem value="cs">

```csharp title="Program.cs"
// Determine if the total lovelace received is more than or equal to
// the total expected lovelace and displaying the results.
isPaymentComplete = totalLovelaceRecv >= TOTAL_EXPECTED_LOVELACE;

System.Console.WriteLine($"Total Received: {totalLovelaceRecv} LOVELACE");
System.Console.WriteLine($"Expected Payment: {TOTAL_EXPECTED_LOVELACE} LOVELACE");
System.Console.WriteLine($"Payment Complete: {(isPaymentComplete ? "✅":"❌")}");
```

  </TabItem>
</Tabs>

## 실행 및 테스트

최종 코드는 다음과 같아야 합니다.


<Tabs
  defaultValue="js"
  groupId="language"
  values={[
    {label: 'JavaScript', value: 'js'},
    {label: 'Typescript', value: 'ts'},
    {label: 'Python', value: 'py'},
    {label: 'C#', value: 'cs'}
  ]}>
  <TabItem value="js">

```js title="checkPayment.js"
import * as fs from 'fs';
// Please add this dependency using npm install node-cmd
import cmd from 'node-cmd';

// Path to the cardano-cli binary or use the global one
const CARDANO_CLI_PATH = "cardano-cli";
// The `testnet` identifier number
const CARDANO_NETWORK_MAGIC = 1097911063;
// The directory where we store our payment keys
// assuming our current directory context is $HOME/receive-ada-sample/receive-ada-sample
const CARDANO_KEYS_DIR = "keys";
// The imaginary total payment we expect in lovelace unit
const TOTAL_EXPECTED_LOVELACE = 1000000;

// Read wallet address string value from payment.addr file
const walletAddress = fs.readFileSync(`${CARDANO_KEYS_DIR}/payment.addr`).toString();

// We use the node-cmd npm library to execute shell commands and read the output data
const rawUtxoTable = cmd.runSync([
    CARDANO_CLI_PATH,
    "query", "utxo",
    "--testnet-magic", CARDANO_NETWORK_MAGIC,
    "--address", walletAddress
].join(" "));

// Calculate total lovelace of the UTXO(s) inside the wallet address
const utxoTableRows = rawUtxoTable.data.trim().split('\n');
let totalLovelaceRecv = 0;
let isPaymentComplete = false;

for(let x = 2; x < utxoTableRows.length; x++) {
    const cells = utxoTableRows[x].split(" ").filter(i => i);
    totalLovelaceRecv += parseInt(cells[2]);
}

// Determine if the total lovelace received is more than or equal to
// the total expected lovelace and displaying the results.
isPaymentComplete = totalLovelaceRecv >= TOTAL_EXPECTED_LOVELACE;

console.log(`Total Received: ${totalLovelaceRecv} LOVELACE`);
console.log(`Expected Payment: ${TOTAL_EXPECTED_LOVELACE} LOVELACE`);
console.log(`Payment Complete: ${(isPaymentComplete ? "✅" : "❌")}`);
```

  </TabItem>
  <TabItem value="ts">

```ts title="checkPayment.ts"
import * as fs from 'fs';
// Please add this dependency using npm install node-cmd but there is no @type definition for it
const cmd: any = require('node-cmd');

// Path to the cardano-cli binary or use the global one
const CARDANO_CLI_PATH: string = "cardano-cli";
// The `testnet` identifier number
const CARDANO_NETWORK_MAGIC: number = 1097911063;
// The directory where we store our payment keys
// assuming our current directory context is $HOME/receive-ada-sample/receive-ada-sample
const CARDANO_KEYS_DIR: string = "keys";
// The imaginary total payment we expect in lovelace unit
const TOTAL_EXPECTED_LOVELACE: number = 1000000;

// Read wallet address string value from payment.addr file
const walletAddress: string = fs.readFileSync(`${CARDANO_KEYS_DIR}/payment.addr`).toString();

// We use the node-cmd npm library to execute shell commands and read the output data
const rawUtxoTable: any = cmd.runSync([
    CARDANO_CLI_PATH,
    "query", "utxo",
    "--testnet-magic", CARDANO_NETWORK_MAGIC,
    "--address", walletAddress
].join(" "));

// Calculate total lovelace of the UTXO(s) inside the wallet address
const utxoTableRows: string[] = rawUtxoTable.data.trim().split('\n');
let totalLovelaceRecv: number = 0;
let isPaymentComplete: boolean = false;

for (let x = 2; x < utxoTableRows.length; x++) {
    const cells = utxoTableRows[x].split(" ").filter((i: string) => i);
    totalLovelaceRecv += parseInt(cells[2]);
}

// Determine if the total lovelace received is more than or equal to
// the total expected lovelace and displaying the results.
isPaymentComplete = totalLovelaceRecv >= TOTAL_EXPECTED_LOVELACE;

console.log(`Total Received: ${totalLovelaceRecv} LOVELACE`);
console.log(`Expected Payment: ${TOTAL_EXPECTED_LOVELACE} LOVELACE`);
console.log(`Payment Complete: ${(isPaymentComplete ? "✅" : "❌")}`);
```

  </TabItem>
  <TabItem value="cs">

```csharp title="Program.cs"
using System;
using System.IO;
using System.Linq;

// Install using command `dotnet add package SimpleExec --version 7.0.0`
using SimpleExec;

// Path to the cardano-cli binary or use the global one
const string CARDANO_CLI_PATH = "cardano-cli";
// The `testnet` identifier number
const int CARDANO_NETWORK_MAGIC = 1097911063;
// The directory where we store our payment keys
// assuming our current directory context is $HOME/receive-ada-sample
const string CARDANO_KEYS_DIR = "keys";
// The total payment we expect in lovelace unit
const long TOTAL_EXPECTED_LOVELACE = 1000000;

// Read wallet address string value from payment.addr file
var walletAddress = await File.ReadAllTextAsync(Path.Combine(CARDANO_KEYS_DIR, "payment.addr"));

// We use the SimpleExec library to execute cardano-cli shell command to query the wallet UTXO and read the output data
var rawUtxoTable = await Command.ReadAsync(CARDANO_CLI_PATH, string.Join(" ",
    "query", "utxo",
    "--testnet-magic", CARDANO_NETWORK_MAGIC,
    "--address", walletAddress
), noEcho: true);

// Calculate total lovelace of the UTXO(s) inside the wallet address
var utxoTableRows = rawUtxoTable.Trim().Split("\n");
var totalLovelaceRecv = 0L;
var isPaymentComplete = false;

foreach(var row in utxoTableRows.Skip(2)){
    var cells = row.Split(" ").Where(c => c.Trim() != string.Empty);
    totalLovelaceRecv +=  long.Parse(cells.ElementAt(2));
}

// Determine if the total lovelace received is more than or equal to
// the total expected lovelace and displaying the results.
isPaymentComplete = totalLovelaceRecv >= TOTAL_EXPECTED_LOVELACE;

Console.WriteLine($"Total Received: {totalLovelaceRecv} LOVELACE");
Console.WriteLine($"Expected Payment: {TOTAL_EXPECTED_LOVELACE} LOVELACE");
Console.WriteLine($"Payment Complete: {(isPaymentComplete ? "✅":"❌")}");
```

  </TabItem>
  <TabItem value="py">

```python title="checkPayment.py"
import os
import subprocess

# Path to the cardano-cli binary or use the global one
CARDANO_CLI_PATH = "cardano-cli"
# The `testnet` identifier number
CARDANO_NETWORK_MAGIC = 1097911063
# The directory where we store our payment keys
# assuming our current directory context is $HOME/receive-ada-sample
CARDANO_KEYS_DIR = "keys"
# The total payment we expect in lovelace unit
TOTAL_EXPECTED_LOVELACE = 1000000

# Read wallet address value from payment.addr file
with open(os.path.join(CARDANO_KEYS_DIR, "payment.addr"), 'r') as file:
    walletAddress = file.read()

# We tell python to execute cardano-cli shell command to query the UTXO and read the output data
rawUtxoTable = subprocess.check_output([
    CARDANO_CLI_PATH,
    'query', 'utxo',
    '--testnet-magic', str(CARDANO_NETWORK_MAGIC),
    '--address', walletAddress])

# Calculate total lovelace of the UTXO(s) inside the wallet address
utxoTableRows = rawUtxoTable.strip().splitlines()
totalLovelaceRecv = 0
isPaymentComplete = False

for x in range(2, len(utxoTableRows)):
    cells = utxoTableRows[x].split()
    totalLovelaceRecv +=  int(cells[2])

# Determine if the total lovelace received is more than or equal to
# the total expected lovelace and displaying the results.
isPaymentComplete = totalLovelaceRecv >= TOTAL_EXPECTED_LOVELACE

print("Total Received: %s LOVELACE" % totalLovelaceRecv)
print("Expected Payment: %s LOVELACE" % TOTAL_EXPECTED_LOVELACE)
print("Payment Complete: %s" % {True: "✅", False: "❌"} [isPaymentComplete])
```

  </TabItem>
</Tabs>

프로젝트 디렉토리는 다음과 같아야 합니다.

<Tabs
  defaultValue="js"
  groupId="language"
  values={[
    {label: 'JavaScript', value: 'js'},
    {label: 'Typescript', value: 'ts'},
    {label: 'Python', value: 'py'},
    {label: 'C#', value: 'cs'}
  ]}>
  <TabItem value="js">

```bash
# Excluding node_modules directory

$HOME/receive-ada-sample/receive-ada-sample
├── checkPayment.js
├── keys
│   ├── payment.addr
│   ├── payment.skey
│   └── payment.vkey
├── package-lock.json
└── package.json

1 directories, 6 files
```

  </TabItem>
  <TabItem value="ts">

```bash
# Excluding node_modules directory

$HOME/receive-ada-sample/receive-ada-sample
├── checkPayment.ts
├── keys
│   ├── payment.addr
│   ├── payment.skey
│   └── payment.vkey
├── package-lock.json
└── package.json

1 directories, 6 files
```

  </TabItem>
  <TabItem value="cs">

```bash
# Excluding bin and obj directories

$HOME/receive-ada-sample/receive-ada-sample
├── Program.cs
├── dotnet.csproj
├── keys
│   ├── payment.addr
│   ├── payment.skey
│   └── payment.vkey

1 directories, 5 files
```

  </TabItem>
  <TabItem value="py">

```bash
$HOME/receive-ada-sample/receive-ada-sample
├── checkPayment.py
└── keys
    ├── payment.addr
    ├── payment.skey
    └── payment.vkey

1 directory, 4 files
```

  </TabItem>
</Tabs>

이제 테스트할 준비가 되었습니다 🚀. 코드를 실행하면 다음과 같은 결과가 나타납니다.

<Tabs
  defaultValue="js"
  groupId="language"
  values={[
    {label: 'JavaScript', value: 'js'},
    {label: 'Typescript', value: 'ts'},
    {label: 'Python', value: 'py'},
    {label: 'C#', value: 'cs'}
  ]}>
  <TabItem value="js">

```bash
❯ node checkPayment.js
Total Received: 0 LOVELACE
Expected Payment: 1000000 LOVELACE
Payment Complete: ❌
```

  </TabItem>
  <TabItem value="ts">

```bash
❯ ts-node checkPayment.ts
Total Received: 0 LOVELACE
Expected Payment: 1000000 LOVELACE
Payment Complete: ❌
```

  </TabItem>
  <TabItem value="cs">

```bash
❯ dotnet run
Total Received: 0 LOVELACE
Expected Payment: 1000000 LOVELACE
Payment Complete: ❌
```

  </TabItem>
  <TabItem value="py">

```bash
❯ python checkPayment.py 
Total Received: 0 LOVELACE
Expected Payment: 1000000 LOVELACE
Payment Complete: ❌
```

  </TabItem>
</Tabs>

코드는 현재 지갑이 총 `0 lovelace`를 받았고, 예상된 지급액이 `1,000,000 lovelace`이므로 결제가 완료되지 않았다고 결론짓습니다.

## 결제 완료하기

성공적인 결제를 시뮬레이션하기 위해 할 수 있는 것은 이 프로젝트를 위해 방금 생성하였던 **지갑 주소**로 적어도 `1,000,000 lovelace`를 보내는 것입니다. 다음과 같이 `payment.addr` 파일의 내용을 읽어 **지갑 주소**를 얻을 수 있습니다.

```bash
cat $HOME/receive-ada-sample/receive-ada-sample/keys/payment.addr
```

**지갑 주소** 값이 표시되어야 합니다.

```bash
addr_test1vpfkp665a6wn7nxvjql5vdn5g5a94tc22njf4lf98afk6tgnz5ge4
```

이제 최소한 `1,000,000 lovelace`를 이 **지갑 주소**로 보내거나, [Cardano Testnet Faucet](https://docs.cardano.org/cardano-testnet/tools/faucet)에서 `test ada` 자금을 요청하세요. 완료되면 이제 코드를 다시 실행할 수 있으며, 이번에는 성공적인 결과를 볼 수 있습니다.

<Tabs
  defaultValue="js"
  groupId="language"
  values={[
    {label: 'JavaScript', value: 'js'},
    {label: 'Typescript', value: 'ts'},
    {label: 'Python', value: 'py'},
    {label: 'C#', value: 'cs'}
  ]}>
  <TabItem value="js">

```bash
❯ node checkPayment.js
Total Received: 1000000000 LOVELACE
Expected Payment: 1000000 LOVELACE
Payment Complete: ✅
```

  </TabItem>
  <TabItem value="ts">

```bash
❯ ts-node checkPayment.ts
Total Received: 1000000000 LOVELACE
Expected Payment: 1000000 LOVELACE
Payment Complete: ✅
```

  </TabItem>
  <TabItem value="cs">

```bash
❯ dotnet run
Total Received: 1000000000 LOVELACE
Expected Payment: 1000000 LOVELACE
Payment Complete: ✅
```

  </TabItem>
  <TabItem value="py">

```py
❯ python checkPayment.py 
Total Received: 1000000000 LOVELACE
Expected Payment: 1000000 LOVELACE
Payment Complete: ✅
```

  </TabItem>
</Tabs>

:::note

네트워크 상태에 따라 트랜잭션이 네트워크 내에서 전파되는데 20초 이상이 걸릴 수 있으므로, 인내심을 가져야 합니다.

:::

축하합니다! 이제 성공적으로 **Cardano** 결제를 탐지하실 수 있습니다. 이는 기존 혹은 새로운 어플리케이션에 통합하는 데 큰 도움이 될 것입니다. 🎉🎉🎉

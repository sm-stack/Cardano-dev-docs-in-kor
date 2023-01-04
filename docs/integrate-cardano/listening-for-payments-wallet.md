---
id: listening-for-payments-wallet
title: cardano-wallet을 사용하여 ada 결제 받기
sidebar_label: 결제 받기 (cardano-wallet)
description: How to listen for ada Payments with the cardano-wallet.
image: ../img/og/og-developer-portal.png
--- 
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 개요

:::note

이 가이드는 사용자가 `cardano-wallet`에 대한 기본적인 이해를 하고 있고, 이를 시스템에 설치했다고 가정합니다. 그렇지 않다면 [cardano-node 설치](/docs/get-started/installing-cardano-node), [cardano-node 실행하기](/docs/get-started/running-cardano)와 [Cardano 지갑 알아보기](/docs/integrate-cardano/creating-wallet-faucet) 가이드를 먼저 읽는 것을 추천합니다.

이 가이드는 또한 `cardano-node`가 백그라운드에서 실행 중이고 `testnet` 네트워크에 연결되어 있는 상황을 가정합니다.

:::

## 사용 사례

`Ada` 결제를 수신하는 기능이 필요한 데는 여러 가지 이유가 있겠지만, 매우 분명한 사용 사례는 **온라인 상점**이나 `ada` 토큰을 통화로 사용하는 **결제 게이트웨이**와 같은 것들입니다. 

![img](../../static/img/integrate-cardano/ada-online-shop.png)

## 기술 흐름

기술적인 관점에서 이와 같은 것이 어떻게 작동하는지 이해하려면, 다음 다이어그램을 보면 됩니다.

![img](../../static/img/integrate-cardano/ada-payment-flow-wallet.png)

**고객**이 온라인 상점에서 상품을 검색하는 아주 기본적인 시나리오를 생각해 봅시다. 사용자가 모든 항목을 선택하고 **장바구니**에 추가하면, 다음 단계는 항목을 체크아웃해서 결제하는 것입니다. 물론 이를 위해 **Cardano**를 사용할 것입니다!

그런 다음 **프론트엔드** 어플리케이션은 백엔드 서비스로부터 **지갑 주소**를 요청하고 **Cardano** 지갑을 통해 스캔할 QR 코드를 **고객**에게 렌더링합니다. 그러면 백엔드 서비스는 결제가 성공적으로 완료되었음을 **프론트엔드** 어플리케이션에 확인하고 알리기 위해 특정 시간 간격으로 `cardano-wallet`을 쿼리해야 합니다.

그 동안 트랜잭션은 **Cardano** 네트워크 내에서 처리되고 확정됩니다. 위 다이어그램에서도 볼 수 있듯이, 결제에 참여하는 두 객체는 `cardano-node` 소프트웨어 구성요소를 통해 궁극적으로 네트워크에 연결되어 있습니다.

## 코딩 시간

이제 직접 실제 코드에서 이와 같은 것을 구현하는 방법을 살펴보겠습니다.

### 지갑 생성 및 tAda 요청

먼저 `cardano-wallet` **REST API**를 통해 새 **지갑**을 생성합니다.

#### 시드 생성하기

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

```js
// Please add this dependency using npm install node-cmd
import cmd from 'node-cmd';
const mnemonic = cmd.runSync(["cardano-wallet","recovery-phrase", "generate"].join(" ")).data;

```

  </TabItem>
  <TabItem value="py">

```py
import subprocess

mnemonic = subprocess.check_output([
    'cardano-wallet', 'recovery-phrase', 'generate'
])
```

  </TabItem>

  <TabItem value="cs">

```csharp
using System;
using SimpleExec; // dotnet add package SimpleExec --version 7.0.0

var mnemonic = await Command.ReadAsync("cardano-wallet", "recovery-phrase generate", noEcho: true);
```

  </TabItem>
  <TabItem value="ts">

```ts
// Please add this dependency using npm install node-cmd but there is no @type definition for it
const cmd: any = require('node-cmd');

const mnemonic: string = cmd.runSync(["cardano-wallet", "recovery-phrase", "generate"].join(" ")).data;
```

  </TabItem>
</Tabs>

#### 시드로부터 지갑 복원

그런 다음 생성된 시드를 `cardano-wallet`의 지갑 생성/복원 엔드포인트로 보냅니다. 

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

```js
// Please add this dependency using npm install node-fetch
import fetch from 'node-fetch';

const resp = await fetch("http://localhost:9998/v2/wallets", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: "test_cf_1",
        mnemonic_sentence: ["expose", "biology", "will", "pause", "taxi", "behave", "inquiry", "lock", "matter", "pride", "divorce", "model", "little", "easily", "solid", "need", "dose", "sadness", "kitchen", "pyramid", "erosion", "shoulder", "double", "fragile"],
        passphrase: "test123456"
    })
});
```

  </TabItem>

  <TabItem value="ts">

```ts
// Please add this dependency using npm install node-fetch and npm install @types/node-fetch
import fetch from 'node-fetch';
import { Response } from 'node-fetch';

const resp: Response = await fetch("http://localhost:9998/v2/wallets", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: "test_cf_1",
        mnemonic_sentence: ["expose", "biology", "will", "pause", "taxi", "behave", "inquiry", "lock", "matter", "pride", "divorce", "model", "little", "easily", "solid", "need", "dose", "sadness", "kitchen", "pyramid", "erosion", "shoulder", "double", "fragile"],
        passphrase: "test123456"
    })
});
```

  </TabItem>

  <TabItem value="py">

```py
# pip install requests
import requests

data = {
    'name'                  :   'test_cf_1',
    'mnemonic_sentence'     :  ["expose", "biology", "will", "pause", "taxi", "behave", "inquiry", "lock", "matter", "pride", "divorce", "model", "little", "easily", "solid", "need", "dose", "sadness", "kitchen", "pyramid", "erosion", "shoulder", "double", "fragile"],
    'passphrase'            :   'test123456'
}

r = requests.post("http://localhost:9998/v2/wallets", json=data)
```

  </TabItem>

  <TabItem value="cs">

```csharp
using System;
using System.Net.Http;
using System.Net.Http.Json;

// Restore the wallet using the previously generated seed. Assuming cardano-wallet is listening on port 9998
using var http = new HttpClient() { BaseAddress = new Uri("http://localhost:9998/v2/") };

var resp = await http.PostAsJsonAsync("wallets", new {
    name = "test_cf_1",    
    mnemonic_sentence = new[] { "expose", "biology", "will", "pause", "taxi", "behave", "inquiry", "lock", "matter", "pride", "divorce", "model", "little", "easily", "solid", "need", "dose", "sadness", "kitchen", "pyramid", "erosion", "shoulder", "double", "fragile" },    
    passphrase = "test123456"
});
```

  </TabItem>

</Tabs>

#### 일부 결제를 받기 위한 미사용 지갑 주소 얻기

우리는 고객에게 지갑을 보여주고 해당 지갑으로 결제를 받아야 하므로, **지갑 주소**를 얻어야 합니다. 이 경우 해당 주소를 이용해서 [Cardano Testnet Faucet](../integrate-cardano/testnet-faucet)에서 몇 개의 `tAda`를 요청하고, 결제를 시뮬레이션할 수 있습니다.

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

```js
// Please add this dependency using npm install node-fetch
import fetch from 'node-fetch';
const walletId = "101b3814d6977de4b58c9dedc67b87c63a4f36dd";
const resp = await fetch(`http://localhost:9998/v2/wallets/${walletId}/addresses?state=unused`);
const addresses = await resp.json();
const firstWalletAddress = addresses[0].id;
```

  </TabItem>

  <TabItem value="ts">

```ts
// Please add this dependency using npm install node-fetch and npm install @types/node-fetch
import fetch from 'node-fetch';
import { Response } from 'node-fetch';

const walletId: string = "101b3814d6977de4b58c9dedc67b87c63a4f36dd";
const resp: Response = await fetch(`http://localhost:9998/v2/wallets/${walletId}/addresses?state=unused`);
const addresses: any = await resp.json();
const firstWalletAddress: string = addresses[0].id;
```

  </TabItem>

  <TabItem value="py">

```python
# pip install requests
import requests
walletId = '101b3814d6977de4b58c9dedc67b87c63a4f36dd'
r = requests.get('http://localhost:9998/v2/wallets/%s/addresses?state=unused' % walletId)
addresses = r.json()
firstWalletAddress = addresses[0]['id']
```

  </TabItem>

  <TabItem value="cs">

```csharp
using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;

using var http = new HttpClient() { BaseAddress = new Uri("http://localhost:9998/v2/") };
// Retrieve wallet address from previously created wallet
// Replace with the wallet Id you previously generated above
var walletId = "101b3814d6977de4b58c9dedc67b87c63a4f36dd";
var address = await http.GetFromJsonAsync<JsonElement>($"wallets/{walletId}/addresses?state=unused");
var firstWalletAddress = addressResponse[0].GetProperty("id");
```

  </TabItem>

</Tabs>

### 지갑 잔고 검색

그런 다음 지갑 세부 정보를 검색하여 `sync status`, `native assets` 및 `balance (lovelace)`와 같은 정보를 불러올 것입니다. 그 후 결제를 받았는지 확인하기 위해 `balance`를 사용할 수 있습니다.

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

```csharp
// Please add this dependency using npm install node-fetch
import fetch from 'node-fetch';
const walletId = "101b3814d6977de4b58c9dedc67b87c63a4f36dd";
// The total payment we expect in lovelace unit
const totalExpectedLovelace = 1000000;
const resp = await fetch(`http://localhost:9998/v2/wallets/${walletId}`);
const wallet = await resp.json();
const balance = wallet.balance.total.quantity;
```

  </TabItem>

  <TabItem value="ts">

```ts
// Please add this dependency using npm install node-fetch and npm install @types/node-fetch
import fetch from 'node-fetch';
import { Response } from 'node-fetch';
const walletId: string = "101b3814d6977de4b58c9dedc67b87c63a4f36dd";
// The total payment we expect in lovelace unit
const totalExpectedLovelace = 1000000;
const resp: Response = await fetch(`http://localhost:9998/v2/wallets/${walletId}`);
const wallet: any = await resp.json();
const balance: number = wallet.balance.total.quantity;
```

  </TabItem>

  <TabItem value="py">

```py
# pip install requests
import requests
walletId = '101b3814d6977de4b58c9dedc67b87c63a4f36dd'
# The total payment we expect in lovelace unit
totalExpectedLovelace = 1000000;
r = requests.get('http://localhost:9998/v2/wallets/%s' % walletId)
wallet = r.json()
balance = wallet['balance']['total']['quantity']
```

  </TabItem>

  <TabItem value="cs">

```csharp
using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;

using var http = new HttpClient() { BaseAddress = new Uri("http://localhost:9998/v2/") };
// Get Wallet Details / Balance
// Replace with your wallet Id
var walletId = "101b3814d6977de4b58c9dedc67b87c63a4f36dd";
// The total payment we expect in lovelace unit
var totalExpectedLovelace = 1000000;

var wallet = await http.GetFromJsonAsync<JsonElement>($"wallets/{walletId}");
var balance = wallet.GetProperty("balance").GetProperty("total").GetProperty("quantity").GetInt32();
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

```js
// Check if payment is complete
const isPaymentComplete = balance >= totalExpectedLovelace;

console.log(`Total Received: ${balance} LOVELACE`);
console.log(`Expected Payment: ${totalExpectedLovelace} LOVELACE`);
console.log(`Payment Complete: ${(isPaymentComplete ? "✅":"❌")}`);
```

  </TabItem>

  <TabItem value="ts">

```ts
// Check if payment is complete
const isPaymentComplete: boolean = balance >= totalExpectedLovelace;

console.log(`Total Received: ${balance} LOVELACE`);
console.log(`Expected Payment: ${totalExpectedLovelace} LOVELACE`);
console.log(`Payment Complete: ${(isPaymentComplete ? "✅":"❌")}`);
```

  </TabItem>

  <TabItem value="py">

```py
# Check if payment is complete
isPaymentComplete = balance >= totalExpectedLovelace

print("Total Received: %s LOVELACE" % balance)
print("Expected Payment: %s LOVELACE" % totalExpectedLovelace)
print("Payment Complete: %s" % {True: "✅", False: "❌"} [isPaymentComplete])
```

  </TabItem>
  <TabItem value="cs">

```csharp
// Check if payment is complete
var isPaymentComplete = balance >= totalExpectedLovelace;

Console.WriteLine($"Total Received: {balance} LOVELACE");
Console.WriteLine($"Expected Payment: {totalExpectedLovelace} LOVELACE");
Console.WriteLine($"Payment Complete: {(isPaymentComplete ? "✅":"❌")}");
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

```js
// Please add this dependency using npm install node-fetch
import fetch from 'node-fetch';
const walletId = "101b3814d6977de4b58c9dedc67b87c63a4f36dd";
// The total payment we expect in lovelace unit
const totalExpectedLovelace = 1000000;
const resp = await fetch(`http://localhost:9998/v2/wallets/${walletId}`);
const wallet = await resp.json();
const balance = wallet.balance.total.quantity;

// Check if payment is complete
const isPaymentComplete = balance >= totalExpectedLovelace;

console.log(`Total Received: ${balance} LOVELACE`);
console.log(`Expected Payment: ${totalExpectedLovelace} LOVELACE`);
console.log(`Payment Complete: ${(isPaymentComplete ? "✅":"❌")}`);
```

  </TabItem>

  <TabItem value="ts">

```ts
// Please add this dependency using npm install node-fetch and npm install @types/node-fetch
import fetch from 'node-fetch';
import { Response } from 'node-fetch';
const walletId: string = "101b3814d6977de4b58c9dedc67b87c63a4f36dd";
const totalExpectedLovelace: number = 1000000;
const resp: Response = await fetch(`http://localhost:9998/v2/wallets/${walletId}`);
const wallet: any = await resp.json();
const balance: number = wallet.balance.total.quantity;

// Check if payment is complete
const isPaymentComplete: boolean = balance >= totalExpectedLovelace;

console.log(`Total Received: ${balance} LOVELACE`);
console.log(`Expected Payment: ${totalExpectedLovelace} LOVELACE`);
console.log(`Payment Complete: ${(isPaymentComplete ? "✅":"❌")}`);
```

  </TabItem>

  <TabItem value="py">

```py
# coding: utf-8
# pip install requests
import requests
walletId = '101b3814d6977de4b58c9dedc67b87c63a4f36dd'
r = requests.get('http://localhost:9998/v2/wallets/%s' % walletId)
wallet = r.json()
balance = wallet['balance']['total']['quantity']
totalExpectedLovelace = 1000000

# Check if payment is complete
isPaymentComplete = balance >= totalExpectedLovelace

print("Total Received: %s LOVELACE" % balance)
print("Expected Payment: %s LOVELACE" % totalExpectedLovelace)
print("Payment Complete: %s" % {True: "✅", False: "❌"} [isPaymentComplete])
```

  </TabItem>
  <TabItem value="cs">

```csharp
using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;

using var http = new HttpClient() { BaseAddress = new Uri("http://localhost:9998/v2/") };
// Get Wallet Details / Balance
// Replace with your wallet Id
var walletId = "101b3814d6977de4b58c9dedc67b87c63a4f36dd";
// The total payment we expect in lovelace unit
var totalExpectedLovelace = 1000000;

var wallet = await http.GetFromJsonAsync<JsonElement>($"wallets/{walletId}");
var balance = wallet.GetProperty("balance").GetProperty("total").GetProperty("quantity").GetInt32();

// Check if payment is complete
var isPaymentComplete = balance >= totalExpectedLovelace;

Console.WriteLine($"Total Received: {balance} LOVELACE");
Console.WriteLine($"Expected Payment: {totalExpectedLovelace} LOVELACE");
Console.WriteLine($"Payment Complete: {(isPaymentComplete ? "✅":"❌")}");
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

해당 코드는 현재 지갑이 `0 lovelace`를 받았고 예상 지불금은 `1,000,000 lovelace`로 예상되었기 때문에, 결제가 완료되지 않았다고 결론을 내었습니다.

## 결제 완료하기

성공적인 결제를 시뮬레이션하기 위해 할 수 있는 것은 이 프로젝트를 위해 방금 생성하였던 **지갑 주소**로 적어도 `1,000,000 lovelace`를 보내는 것입니다. 위 예시에 있는 코드를 통해 **지갑 주소**를 얻는 방법을 보여주었습니다.

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

```bash
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


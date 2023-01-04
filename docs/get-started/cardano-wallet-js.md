---
id: cardano-wallet-js
title: cardano-wallet-js 시작하기
sidebar_label: cardano-wallet-js
description: Get Started with cardano-wallet-js
image: ../img/og/og-getstarted-cardano-wallet-js.png
---

## cardano-wallet-js
`cardano-wallet-js` 는 몇 가지 기능이 있는 Cardano용 javascript/typescript SDK입니다. 공식 [cardano-wallet](https://github.com/input-output-hk/cardano-wallet)의 클라이언트로 사용할 수 있으며, 기본 토큰 및 NFT를 생성할 수 있습니다.

## 목차

- [소개](#소개)
- [요구 사항](#요구-사항)
- [설치](#설치)
- [사용 방법](#사용-방법)
    + [Cardano 지갑 서비스에 연결하기](#Cardano-지갑-서비스에-연결하기)
    + [블록체인 정보](#블록체인-정보)
  * [유용한 작업](#유용한-작업)
    + [복구 문구 생성](#복구-문구-생성)
    + [지갑 생성 및 복원](#지갑-생성-및-복원)
    + [지갑 주소](#지갑-주소)
    + [잔고](#잔고)
    + [지갑 위임](#지갑-위임)
    + [지갑 내 스테이크 풀 운영](#지갑-내-스테이크-풀-운영)
    + [지갑 트랜잭션](#지갑-트랜잭션)
    + [외부 트랜잭션 제출](#외부-트랜잭션-제출)
    + [키 관리](#키-관리)
    + [네이티브 토큰](#네이티브-토큰)
		+ [네이티브 토큰 전송](#네이티브-토큰-전송)
- [테스트](#테스트)
- [프로젝트 지원](#프로젝트-지원)


## 소개
IOHK의 공식 Cardano 지갑은 REST api/CLI 인터페이스를 공개함으로써 Cardano 블록체인에서 다음과 같은 작업을 수행할 수 있도록 합니다:
 - 지갑 생성 혹은 복구
 - [메타데이터](https://github.com/input-output-hk/cardano-wallet/wiki/TxMetadata)를 포함하거나 포함하지 않고 트랜잭션 제출
 - 노드 상태 확인
 - 트랜잭션 나열
 - 지갑 나열

우리 프로젝트는 미가공된 REST 구조를 직접 공개하기 보다는, Javascript SDK 형태로 프로그래머들에게 더 쓰기 쉽게 이를 제공하는 것을 목표로 하고 있습니다.

## 요구 사항
이 라이브러리를 사용하기 전에, 실행 중인 `cardano-wallet` 서버가 필요합니다. 만약 사용가능한 docker가 있으면 제공되는 `docker-composer.yml` 을 다운로드하고 `docker-compose` 를 사용하여 시작할 수 있습니다.

```shell
wget https://raw.githubusercontent.com/input-output-hk/cardano-wallet/master/docker-compose.yml
NETWORK=testnet docker-compose up
```

:::note
[여기](https://github.com/input-output-hk/cardano-wallet)에서 cardano-wallet 서버를 시작하기 위한 다양한 옵션에 대한 자세한 정보를 찾을 수 있습니다.
:::

## 설치

npm을 사용하여:

```shell
npm i cardano-wallet-js
```

## 사용 방법

시작하려면 `WalletServer` 로 시작하십시오. 이를 통해 일부 원격 `cardano-wallet` 서비스와 연결할 수 있습니다.

### Cardano 지갑 서비스에 연결하기

```js
const { WalletServer } = require('cardano-wallet-js');
let walletServer = WalletServer.init('http://{your-server-host}:{port}/v2');
```   
### 블록체인 정보

우선 다음과 같은 블록체인 정보를 얻을 수 있습니다: (네트워크 매개변수, 정보 및 시간)

네트워크 정보 얻기

```js
let information = await walletServer.getNetworkInformation();
console.log(information);
```

이는 다음과 같은 출력값을 가집니다:

```json
{
    "network_tip": {
        "time": "2021-04-12T21:59:25Z",
        "epoch_number": 125,
        "absolute_slot_number": 23895549,
        "slot_number": 265149
    },
    "node_era": "mary",
    "node_tip": {
        "height": {
            "quantity": 0,
            "unit": "block"
        },
        "time": "2019-07-24T20:20:16Z",
        "epoch_number": 0,
        "absolute_slot_number": 0,
        "slot_number": 0
    },
    "sync_progress": {
        "status": "syncing",
        "progress": {
            "quantity": 0,
            "unit": "percent"
        }
    },
    "next_epoch": {
        "epoch_start_time": "2021-04-14T20:20:16Z",
        "epoch_number": 126
    }
}
```

네트워크 매개변수 얻기

```js
let parameters = await walletServer.getNetworkParameters();
console.log(parameters);
```

이는 다음과 같은 출력값을 가집니다.

```json
{
    "slot_length": {
        "quantity": 1,
        "unit": "second"
    },
    "decentralization_level": {
        "quantity": 100,
        "unit": "percent"
    },
    "genesis_block_hash": "96fceff972c2c06bd3bb5243c39215333be6d56aaf4823073dca31afe5038471",
    "blockchain_start_time": "2019-07-24T20:20:16Z",
    "desired_pool_number": 500,
    "epoch_length": {
        "quantity": 432000,
        "unit": "slot"
    },
    "eras": {
        "shelley": {
            "epoch_start_time": "2020-07-28T20:20:16Z",
            "epoch_number": 74
        },
        "mary": {
            "epoch_start_time": "2021-02-03T20:20:16Z",
            "epoch_number": 112
        },
        "byron": {
            "epoch_start_time": "2019-07-24T20:20:16Z",
            "epoch_number": 0
        },
        "allegra": {
            "epoch_start_time": "2020-12-15T20:20:16Z",
            "epoch_number": 102
        }
    },
    "active_slot_coefficient": {
        "quantity": 5,
        "unit": "percent"
    },
    "security_parameter": {
        "quantity": 2160,
        "unit": "block"
    },
    "minimum_utxo_value": {
        "quantity": 1000000,
        "unit": "lovelace"
    }
}
```

네트워크 시간 얻기

```js
let clock = await walletServer.getNetworkClock();
console.log(clock);
```
This will print out something like this:
```json
{
	"status": "available",
	"offset": {
        "quantity": 405623,
        "unit": "microsecond"
	}
}
```
## 유용한 작업

### 복구 문구 생성

   복구 문구 생성은 [bip39](https://github.com/bitcoinjs/bip39)에 의존합니다.
  
```js   
const { Seed } = require('cardano-wallet-js');
    
// generate a recovery phrase of 15 words (default)
let recoveryPhrase = Seed.generateRecoveryPhrase();
console.log(recoveryPhrase);

Output:
> "hip dust material keen buddy fresh thank program stool ill regret honey multiply venture imitate"
```

:::important
복구 문구는 지갑을 복원할 수 있는 유일한 방법이며, 이를 **안전하고 비공개로 유지해야 합니다**. 메서드를 실행할 때마다 완전히 다른 복구 문구를 얻게 됩니다.
:::

편의를 위해, 다음을 사용하여 복구 문구를 배열로 변환할 수 있습니다.

```js
let words = Seed.toMnemonicList(recoveryPhrase);
console.log(words);

Output:
> ['hip', 'dust', 'material', 'keen', 'buddy', 'fresh', 'thank', 'program', 'stool', 'ill', 'regret', 'honey', 'multiply', 'venture', 'imitate']
```

### 지갑 생성 및 복구

이 예에서는 새 지갑을 만들 것입니다. `createOrRestoreShelleyWallet` 메서드는 지갑이 존재하지 않는 경우 새 지갑을 생성하거나 기존 지갑을 복원하는 작업을 수행합니다.

```js
const { Seed, WalletServer } = require('cardano-wallet-js');
    
let walletServer = WalletServer.init('http://you.server.com');
let recoveryPhrase = Seed.generateRecoveryPhrase();
let mnemonic_sentence = Seed.toMnemonicList(recoveryPhrase);
let passphrase = 'tangocrypto';
let name = 'tangocrypto-wallet';
    
let wallet = await walletServer.createOrRestoreShelleyWallet(name, mnemonic_sentence, passphrase);
```    
지갑 나열:
```js    
let wallets = await walletServer.wallets();
```    
ID로 지갑 가져오기:
```js
let wallets = await walletServer.wallets();
let id = wallets[0].id;
let wallet = await walletServer.getShelleyWallet(id);
```
지갑의 UTXO 통계 가져오기:
```js
let statistics = await wallet.getUtxoStatistics();
```    
통계에는 전체 지갑에 대한 UTxO 분포가 아래와 유사한 히스토그램 형태로 표현됩니다.
![Utxo Histogram](https://www.tangocrypto.com/images/cardano-wallet-js-utxo-histogram.png)
           
지갑 제거:
```js
await wallet.delete();
```    
지갑 이름 바꾸기:
```js
let newName = 'new-name';
wallet = await wallet.rename(newName);
```
지갑 암호 변경:
```js
let oldPassphrase = 'tangocrypto';
let newPassphrase = 'new-passphrase';
wallet = await wallet.updatePassphrase(oldPassphrase, newPassphrase);
```
:::note 
지갑 자체에는 암호가 없습니다. 암호가 필요한 메서드 (e.g: `sendPayment`)를 호출하여고 시도하면, 올바르게 업데이트되었는지 확인할 수 있습니다.
:::

### 지갑 주소

Cardano 지갑은 [여기](https://github.com/input-output-hk/implementation-decisions/blob/e2d1bed5e617f0907bc5e12cf1c3f3302a4a7c42/text/1852-hd-chimeric.md)에 설명된 BIP-44의 변형을 따르는 다중 계층적 결정성(HD) 지갑입니다. 모든 주소는 복구 문구에서 얻을 수 있는 루트 키(키 팩토리와 같음)에서 파생됩니다. 또한, 지갑에는 항상 20개의 "연속된" 미사용 주소가 있으므로, 그 중 하나를 사용할 때마다 새 주소가 "발견"되어 규칙을 유지합니다. 

```js
let addresses = await wallet.getAddresses(); // list will contain at least 20 address
```
미사용 주소 가져오기:
```js
let unusedAddresses = await wallet.getUnusedAddresses();
```    
사용된 주소 가져오기:
```js
let usedAddresses = await wallet.getUsedAddresses();
```
다음 미사용 주소 생성/검색:
```js
// you'll get the n-th address where n is the current addresses list length 
let address = await wallet.getNextAddress();    

// you can also pass the specific index
let address = await wallet.getAddressAt(45);  
``` 
### 잔고

지갑을 생성하면 초기 잔고는 0입니다. 메인넷에 있는 경우 이 주소로 ada를 전송할 수 있습니다. 테스트넷에 있는 경우 [Faucet](https://developers.cardano.org/en/testnets/cardano/tools/faucet/)에서 테스트 토큰을 요청할 수 있습니다. 지갑 주소 중 하나를 입력하고 자금을 요청하면 됩니다.

```js
// get available balance. The balance you can expend
let availableBalance = wallet.getAvailableBalance();

// get rewards balance. The balance available to withdraw
let rewardBalance = wallet.getRewardBalance();

// get total balance. Total balance is the sum of available balance plus reward balance
let totalBalance = wallet.getTotalBalance();
```
### 지갑 위임

지갑에는 스테이크 풀에 자금을 위임했는지 여부에 대한 정보가 존재합니다.

```js
let delegation = wallet.getDelegation();
console.log(delegation);
```

지갑이 스테이크 풀에 위임하지 않은 경우, 출력은 다음과 같습니다.

```js
{
    "next": [],
    "active": {
        "status": "not_delegating"
    }
}
```

위임을 시작하면 ([스테이크 풀 섹션](#지갑-내-스테이크-풀-운영)참조), 작업이 즉시 적용되지는 않지만 `next` 특성이 위임이 시작되는 시기를 나타낼 것입니다. 그 동안 위임은 다음과 같이 보일 것입니다.

```js
{
    "next": [{
        "status": "delegating",
        "changes_at": {
            "epoch_start_time": "2021-04-15T15:03:27Z",
            "epoch_number": 10
        },
        "target": "pool1as50x0wtumtyqzs7tceeh5ry0syh8jnvpnuu9wlxswxuv48sw4w"
    }],
    "active": {
        "status": "not_delegating"
    }
}
```
:::note 
`changes_at` 속성은 위임이 시작되는 에포크를 나타냅니다.
:::

만약 에포크 10 이후/도중에 다시 요청하면, 해당 위임은 제자리에 있어야 합니다.

```js
// refresh the wallet if you are using the same object. This will fecth the info from the blockchain
await wallet.refresh();

let delegation = wallet.getDelegation();
console.log(delegation);

Output:
>  {
      next: [],
      active: {
	status: 'delegating',
	target: 'pool1as50x0wtumtyqzs7tceeh5ry0syh8jnvpnuu9wlxswxuv48sw4w'
      }
   }	
```

### 지갑 내 스테이크 풀 운영

멤버 보상에 따른 스테이크 풀 랭킹 목록 가져오기:
```js
let stake = 1000000000;
let pools = await walletServer.getStakePools(stake);
```    
:::note 
기본적으로 가장 높은 보상에서 더 낮은 예상 보상까지 `non_myopic_member_rewards` 에 따라 순서대로 정렬된 풀을 받게 됩니다. 기본적으로 지갑 서버는 풀의 메타데이터(예: 티커, 이름, 홈페이지)를 저장하도록 구성되어 있진 않지만, 업데이트 설정 기능을 통해 지정할 수 있습니다. 아래 업데이트 설정 섹션을 참고하십시오.
:::

위임 수수료 예상:

```js
let fee = await wallet.estimateDelegationFee();
```
:::note 
풀에 처음 위임할 때 추가로 2 ada가 청구됩니다. 이 추가 요금은 해당 응답에 포함되지 않을 것입니다.
:::

스테이크 풀에 위임:
```js
let passphrase = 'tangocrypto';
// choose the first pool from the previous ranking list, but you can select whatever you want.
let pool = pools[0]; 
let transaction = await wallet.delegate(pool.id, passphrase);
```   
:::note 
트랜잭션 상태는 처음에 `pending` 으로 설정되어 있으므로, 최종 상태(예: `in_ledger`)를 확인하려면 `id` 를 사용하여 트랜잭션을 계속 추적해야 합니다. [여기](https://github.com/input-output-hk/cardano-wallet/wiki/About-Transactions-Lifecycle)에서 트랜잭션의 수명 주기에 대해 자세히 알아볼 수 있습니다. 다른 스테이크 풀에 위임하려면 위와 같이 다른 스테이크 풀을 지정하는 것과 동일한 방법을 사용하십시오.
:::

스테이크 풀 보상 회수:
```js
let passphrase = 'tangocrypto';

// select the address to receive the rewards
let address = (await wallet.getUsedAddresses())[0];
// get the reward balance available to withdraw
let rewardBalance = wallet.getRewardBalance();

let transaction = await wallet.withdraw(passphrase, [address], [rewardBalance]);
```    
:::note 
각 주소에 대해 rewardBalance를 분할하여 여러 주소로 보상을 보낼 수도 있습니다. 또한 본인의 지갑인지 아닌지와 상관 없이 임의의 유효한 주소로도 보낼 수 있습니다.
:::

위임 중지:
```js
let transaction = await wallet.stopDelegation(passphrase);
```
스테이크 풀 유지관리 작업:
```js
let maintenanceActions = await walletServer.stakePoolMaintenanceActions();
```    
가능한 값은 다음과 같습니다:
- `not_applicable` -> 현재 SMASH 서버에 메타데이터를 쿼리하지 않고 있습니다.
- `not_started` -> Garbage Collection이 아직 시작되지 않았습니다. 잠시 후에 다시 시도하세요.
- `restarting` -> Garbage Collection이 현재 재시작되는 중입니다. 잠시 후에 다시 시도하세요.
- `has_run` -> Garbage Collection이 성공적으로 실행 중입니다. 
 
:::note 
유지관리 작업은 지갑 서버가 Stakepool Metadata Aggregation Server(SMASH)를 사용하는지 여부에 따라 달라집니다.
:::

Garbage Collection 수동으로 트리거:
```js
await walletServer.triggerStakePoolGarbageCollection();
```    
    
### 지갑 트랜잭션

지갑 트랜잭션 얻기:
```js
// get all wallet transactions
let transactions = await wallet.getTransactions();

// filter by start and end date
let start = new Date(2021, 0, 1); // January 1st 2021;
let end = new Date(Date.now());
let transactions = await wallet.getTransactions(start, end);
```

트랜잭션 세부 정보 얻기:
```js
let transaction = await wallet.getTransaction(tx.id);
```
수수료 얻기:
```js
let receiverAddress = new AddressWallet('addr1q99q78gt2898zgu2dcswf2yuxj6vujcqece38rycc7wsncl5lx8y....');
let amount = 5000000; // 5 ada
let estimatedFees = await senderWallet.estimateFee([receiverAddress], [amount]);
```

지불 트랜잭션 전송. 최소 수수료를 직접 계산할 필요 없이 SDK가 실행.

```js
let passphrase = 'tangocrypto';

let receiverAddress = [new AddressWallet('addr1q99q78gt2898zgu2dcswf2yuxj6vujcqece38rycc7wsncl5lx8y....')];
let amounts = [5000000]; // 5 ada
let transaction = await senderWallet.sendPayment(passphrase, receiverAddress, amounts);
```
:::note 
주소 및 금액 목록을 전달할 수 있습니다. 이 두 목록의 길이는 같을 것으로 예상되고, 각 목록의 요소는 각각 서로에게 관련된 인뎃ㄱ스입니다.
`amounts[i]` 를 `addresses[i]` 로 보내는 것과 같다고 생각해도 좋습니다.
:::

메타데이터와 함께 지불 트랜잭션 보내기:

메타데이터는 다음과 같은 몇 가지 제한사항이 있는 JSON 객체로 표현할 수 있습니다.
- 모든 최상위 키는 0과 2<sup>64</sup> - 1 사이 정수여야 합니다.
- 각 메타데이터 값은 해당 자료형으로 태그가 지정됩니다.
- UTF-8 인코딩 시 문자열은 최대 64바이트여야 합니다.
- 바이트 문자열은 최대 길이가 64바이트인 16진수로 인코딩됩니다.

자세한 내용은 [여기](https://github.com/input-output-hk/cardano-wallet/wiki/TxMetadata)를 확인하십시오.

```js
let passphrase = 'tangocrypto';

let receiverAddress = [new AddressWallet('addr1q99q78gt2898zgu2dcswf2yuxj6vujcqece38rycc7wsncl5lx8y....')];
let amounts = [5000000]; // 5 ada

let metadata = ['abc', '2512a00e9653fe49a44a5886202e24d77eeb998f', 123];
let transaction = await senderWallet.sendPayment(passphrase, receiverAddress, amounts, metadata);
``` 
:::warning 
트랜잭션에서 제공된 메타데이터는 블록체인에 영원히 저장됩니다. 민감한 데이터, 특히 개인 식별 정보(PII)를 포함하지 않도록 하십시오.
:::

더 복잡한 메타데이터 개체 보내기:
```js
let passphrase = 'tangocrypto';

// receiver address
let receiverAddress = [new AddressWallet('addr1q99q78gt2898zgu2dcswf2yuxj6vujcqece38rycc7wsncl5lx8y....')];
let amounts = [5000000]; // 5 ADA

let metadata: any = {0: 'hello', 1: Buffer.from('2512a00e9653fe49a44a5886202e24d77eeb998f', 'hex'), 4: [1, 2, {0: true}], 5: {'key': null, 'l': [3, true, {}]}, 6: undefined};
let transaction = await senderWallet.sendPayment(passphrase, receiverAddress, amounts, metadata);
```
:::note 
boolean, null 및 undefined와 같은 값은 문자열의 형태로 전달됩니다 (e.g "true", "null", "undefined").
:::

트랜잭션 잊어버리기:
만약 어떤 이유로 트랜잭션이 `pending` 상태에 오랜 기간 정지한 경우, 이를 "취소하는" 것을 고려할 수 있습니다.

```js
wallet.forgetTransaction(transaction.id)
```
:::important 
전송된 트랜잭션은 취소할 수 없습니다. 다른 트랜잭션에서 동일한 UTxO를 동시에 지출하는 방식으로 취소를 요청할 수만 있습니다. 그러나 트랜잭션은 여전히 나중에 블록에 표시될 것이므로, 지갑에 그 기록이 남습니다. 
:::

### 외부 트랜잭션 제출
외부에서 (다른 도구에 의해) 생성된 트랜잭션을 전달하고 블록체인에 제출할 수 있습니다. 이 라이브러리를 사용하여 오프라인에서도 트랜잭션을 생성할 수 있습니다. 다음은 그 예시입니다.

```js   
// recovery phrase, this should be the same you use to create the wallet (see Wallet section)
let recovery_phrase = [...];

// blockchain config, this is where you can find protocol params, slotsPerKESPeriod etc.
// This lib comes with  Mainnet, Testnet and LocalCluster config, but you should pass your own to make sure they are up to date.
// You can find the latest config files here: https://hydra.iohk.io/build/6498473/download/1/index.html
let config = { ..., "protocolParams": {... "minFeeA": 44, ..., "minFeeB": 155381, ...} }

// get first unused wallet's address
let addresses = (await wallet.getUnusedAddresses()).slice(0, 1);
let amounts = [1000000];

// get ttl 
let info = await walletServer.getNetworkInformation();
let ttl = info.node_tip.absolute_slot_number * 12000;

// you can include metadata
let data: any = {0: 'hello', 1: Buffer.from('2512a00e9653fe49a44a5886202e24d77eeb998f', 'hex'), 4: [1, 2, {0: true}], 5: {'key': null, 'l': [3, true, {}]}, 6: undefined};

// get the tx structure with all the necessary components (inputs, outputs, change, etc).
let coinSelection = await wallet.getCoinSelection(addresses, amounts, data);

// get the signing keys (can be offline)
let rootKey = Seed.deriveRootKey(recovery_phrase); 
let signingKeys = coinSelection.inputs.map(i => {
    let privateKey = Seed.deriveKey(rootKey, i.derivation_path).to_raw_key();
    return privateKey;
});

// build and sign tx (can be offline)
// include the metadata in the build and sign process
let metadata = Seed.buildTransactionMetadata(data);
let txBuild = Seed.buildTransaction(coinSelection, ttl, {metadata: metadata, config: config});
let txBody = Seed.sign(txBuild, signingKeys, metadata);

// submit the tx into the blockchain
let signed = Buffer.from(txBody.to_bytes()).toString('hex');
let txId = await walletServer.submitTx(signed);
```    
### 키 관리
개인 / 공개 키 쌍을 만들고 가져오는데 사용할 수 있는 몇 가지 방법이 있습니다. 자세한 내용은 [여기](https://github.com/input-output-hk/technical-docs/blob/main/cardano-components/cardano-wallet/doc/About-Address-Derivation.md)를 확인하십시오.

복구 문구에서 루트 키 가져오기
```js
let phrase = [...];
let rootKey = Seed.deriveRootKey(phrase);
console.log(rootKey.to_bech32());

Output:
> "xprv..."
```

루트 키에서 개인/서명 키(지출 키라고도 함) 도출
```js
let rootKey = Seed.deriveRootKey(phrase);
let privateKey = Seed.deriveKey(rootKey, ['1852H','1815H','0H','0','0']).to_raw_key();
console.log(privateKey.to_bech32());
 
Output:
> "ed25519e_sk1..."
```

루트로부터 계성 키 도출
```js
let rootKey = Seed.deriveRootKey(phrase);
let accountKey = Seed.deriveAccountKey(rootKey, 0);
console.log(accountKey.to_bech32());

Output:
> "xprv..."
```

위에서 언급된 모든 메서트는 키와 주소를 계속 도출하고 생성할 수 있는 `Bip32PrivateKey` 를 반환합니다. 자세한 내용은 [여기](../get-started/cardano-serialization-lib/overview.md)를 확인하십히오. 예를 들어 `cardano-serialization-lib` 를 설치했다고 가정하면, 다음과 같은 스테이킹 주소를 얻을 수 있습니다.

```js
let rootKey = Seed.deriveRootKey(phrase);
let stakePrvKey = Seed.deriveKey(rootKey, ['1852H','1815H','0H','2','0']).to_raw_key();
const stakePubKey = stakePrvKey.to_public();

const rewardAddr = RewardAddress.new(
NetworkInfo.mainnet().network_id(),
StakeCredential.from_keyhash(stakePubKey.hash())
)
.to_address();
console.log(rewardAddr.to_bech32());

Output:
> "stake..."
```

개인/공개 키 쌍을 사용하여 메세지에 서명하고 확인합니다.
```js
let message = 'Hello World!!!';
const rootKey = Seed.deriveRootKey(phrase);
const accountKey = Seed.deriveAccountKey(rootKey);
```
```js
// we'll use the stake private/public key at 0 in this case but you can use whatever private/public key pair.
const stakePrvKey = accountKey
	.derive(CARDANO_CHIMERIC) // chimeric
	.derive(0);

const privateKey = stakePrvKey.to_raw_key();
const publicKey = privateKey.to_public();

const signed = Seed.signMessage(privateKey, message);
const verify_result = Seed.verifyMessage(publicKey, message, signed);

Output:
> True
```

### 네이티브 토큰

몇 가지 차이점이 있는 트랜잭션을 생성하는 네이티브 토큰을 만들어 낼 수 있습니다. 다음은 예시입니다.

```js
// address to hold the minted tokens. You can use which you want.
let addresses = [(await wallet.getAddresses())[0]];

// blockchain config, this is where you can find protocol params, slotsPerKESPeriod etc.
// This lib comes with  Mainnet, Testnet and LocalCluster config (Config.Mainnet, Config.Testnet and Config.LocalCluster), but you may consider provide your own to make sure they are up to date.
// You can find the latest config files here: https://hydra.iohk.io/build/6498473/download/1/index.html
let config = { ..., "protocolParams": {... "minFeeA": 44, ..., "minFeeB": 155381, ...} }

// policy public/private keypair
let keyPair= Seed.generateKeyPair();
let policyVKey = keyPair.publicKey;
let policySKey = keyPair.privateKey;

// generate single issuer native script
let keyHash = Seed.getKeyHash(policyVKey);
let script = Seed.buildSingleIssuerScript(keyHash);

//generate policy id
let scriptHash = Seed.getScriptHash(script);
let policyId = Seed.getPolicyId(scriptHash);

// metadata
let data: any = {};
let tokenData: any = {}
tokenData[policyId] = {
	Tango: {
		arweaveId: "arweave-id",
		ipfsId: "ipfs-id",
		name: "Tango",
		description: "Tango crypto coin",
		type: "Coin"
	}
};
data[0] = tokenData;

// asset
let asset = new AssetWallet(policyId, "Tango", 1000000);

// token
let tokens = [new TokenWallet(asset, script, [keyPair])];

//scripts
let scripts = tokens.map(t => t.script);

// get min ada for address holding tokens
let minAda = Seed.getMinUtxoValueWithAssets([asset], config);
let amounts = [minAda];

// get ttl info
let info = await walletServer.getNetworkInformation();
let ttl = info.node_tip.absolute_slot_number * 12000;

// get coin selection structure (without the assets)
let coinSelection = await wallet.getCoinSelection(addresses, amounts, data);

// add signing keys
let rootKey = Seed.deriveRootKey(payeer.mnemonic_sentence); 
let signingKeys = coinSelection.inputs.map(i => {
	let privateKey = Seed.deriveKey(rootKey, i.derivation_path).to_raw_key();
	return privateKey;
});

// add policy signing keys
tokens.filter(t => t.scriptKeyPairs).forEach(t => signingKeys.push(...t.scriptKeyPairs.map(k => k.privateKey.to_raw_key())));

let metadata = Seed.buildTransactionMetadata(data);

// the wallet currently doesn't support including tokens not previuosly minted
// so we need to include it manually.
coinSelection.outputs = coinSelection.outputs.map(output => {
	if (output.address === addresses[0].address) {
		output.assets = tokens.map(t => {
			let asset: WalletsAssetsAvailable = {
				 policy_id: t.asset.policy_id,
				 asset_name: Buffer.from(t.asset.asset_name).toString('hex'),
				 quantity: t.asset.quantity
			};
			return asset;
		});
	}
	return output;
});

// we need to sing the tx and calculate the actual fee and the build again 
// since the coin selection doesnt calculate the fee with the asset tokens included
let txBody = Seed.buildTransactionWithToken(coinSelection, ttl, tokens, signingKeys, {data: data, config: config});
let tx = Seed.sign(txBody, signingKeys, metadata, scripts);

// submit the tx	
let signed = Buffer.from(tx.to_bytes()).toString('hex');
let txId = await walletServer.submitTx(signed);
```
:::note
`test/assets.ts` 에서 더 많은 스크립트를 확인할 수 있고, 이 예제는 JSON으로 만들 수 있는 "RequireSignature"와 동일합니다.
:::

```json
{
  "type": "sig",
  "keyHash": "e09d36c79dec9bd1b3d9e152247701cd0bb860b5ebfd1de8abb6735a"
} 
```

### 네이티브 토큰 전송
여기에는 cardano-wallet에 의존하거나, 직접 tx를 구축하는 두 가지 옵션이 있습니다.

#### Cardano 지갑 사용
```js
// passphrase
let passphrase = "your passphrase";
let policyId = "your policyId";

// passphrase
let passphrase = "your passphrase";
let policyId = "your policyId";

// blockchain config, this is where you can find protocol params, slotsPerKESPeriod etc.
// This lib comes with  Mainnet, Testnet and LocalCluster config (Config.Mainnet, Config.Testnet and Config.LocalCluster), but you may consider provide your own to make sure they are up to date.
// You can find the latest config files here: https://hydra.iohk.io/build/6498473/download/1/index.html
let config = { ..., "protocolParams": {... "minFeeA": 44, ..., "minFeeB": 155381, ...} }

// address to send the minted tokens
let addresses = [new AddressWallet("addr......")];
let asset = new AssetWallet(policyId, "Tango", 100);

// bind the asset to the address
let assets = {}; 
assets[addresses[0].id] = [asset];

// calculate the min ADA to send in the tx
let minAda = Seed.getMinUtxoValueWithAssets([asset], config);

// send it using the wallet
let tx = await wallet.sendPayment(passphrase, addresses, [minAda], ['send 100 Tango tokens'], assets);	
```
#### tx 빌딩
```js
// passphrase
let passphrase = "your passphrase";
let policyId = "your policyId";

// blockchain config, this is where you can find protocol params, slotsPerKESPeriod etc.
// This lib comes with  Mainnet, Testnet and LocalCluster config (Config.Mainnet, Config.Testnet and Config.LocalCluster), but you should pass your own to make sure they are up to date.
// You can find the latest config files here: https://hydra.iohk.io/build/6498473/download/1/index.html
let config = { ..., "protocolParams": {... "minFeeA": 44, ..., "minFeeB": 155381, ...} }

// address to send the minted tokens
let addresses = [new AddressWallet("addr......")];
let asset = new AssetWallet(policyId, "Tango", 100);

// blockchain config, this is where you can find protocol params, slotsPerKESPeriod etc.
// This lib comes with  Mainnet, Testnet and LocalCluster config, but you may consider provide your own to make sure they are up to date.
// You can find the latest config files here: https://hydra.iohk.io/build/6498473/download/1/index.html
let config = { ..., "protocolParams": {... "minFeeA": 44, ..., "minFeeB": 155381, ...} }

// bind the asset to the address
let assets = {}; 
assets[addresses[0].id] = [asset];

// calculate the min ADA to send in the tx
let minUtxo = Seed.getMinUtxoValueWithAssets([asset], config)

// you can include metadata as well
let data =  ['send 100 Tango tokens'];
let coinSelection = await wallet.getCoinSelection(addresses, [minUtxo], data, assets);
let info = await walletServer.getNetworkInformation();

//build and sign tx
let rootKey = Seed.deriveRootKey(payeer.mnemonic_sentence); 
let signingKeys = coinSelection.inputs.map(i => {
	let privateKey = Seed.deriveKey(rootKey, i.derivation_path).to_raw_key();
	return privateKey;
});
let metadata = Seed.buildTransactionMetadata(data);
let txBuild = Seed.buildTransaction(coinSelection, info.node_tip.absolute_slot_number * 12000, {metadata: metadata, config: config});
let txBody = Seed.sign(txBuild, signingKeys, metadata);
let signed = Buffer.from(txBody.to_bytes()).toString('hex');
let txId = await walletServer.submitTx(signed);
```
# 테스트

### Stack
stack >= 1.9.3 을 설치하여야 합니다. https://docs.haskellstack.org/en/stable/README/ 에서 찾을 수 있습니다.
성공적인 빌드를 위해 libsodium-dev, libghc-hsopenssl-dev, gmp, sqlite 및 systemd 개발 라이브러리를 설치해야 할 수도 있습니다.

또한 PATH에 `cardano-node` 와 `cardano-cli` 바이너리가 필요합니다.

설정은 매우 간단합니다.
  - clone: `cardano-wallet`
  - execute: `stack install cardano-wallet:exe:local-cluster`
  - 지갑이 항상 같은 포트에서 시작하도록 `export CARDANO_WALLET_PORT=7355` 를 통해 특정 포트를 설정해줍니다.
  - run `~/.local/bin/local-cluster`


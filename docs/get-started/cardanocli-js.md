---
id: cardanocli-js
title: cardanocli-js 시작하기
sidebar_label: cardanocli-js
description: Get Started with cardanocli-js
image: ../img/og/og-getstarted-cardanocli-js.png
---

cardanocli-js는 Javascript에서 cardano-cli를 래핑하여 cli 명령어와 함께 훨씬 빠르고 효율적으로 상호작용할 수 있도록 합니다. 

## 전제 조건

- `cardano-node >= 1.26.1`
- `node.js >= 12.19.0`

## 설치

#### NPM

```bash
npm install cardanocli-js
```

#### 소스로부터

```bash
git clone https://github.com/Berry-Pool/cardanocli-js.git
cd cardanocli-js
npm install
```

## 시작하기

```javascript
const CardanocliJs = require("cardanocli-js");
const shelleyGenesisPath = "/home/ada/mainnet-shelley-genesis.json";

const cardanocliJs = new CardanocliJs({ shelleyGenesisPath });

const createWallet = (account) => {
  cardanocliJs.addressKeyGen(account);
  cardanocliJs.stakeAddressKeyGen(account);
  cardanocliJs.stakeAddressBuild(account);
  cardanocliJs.addressBuild(account);
  return cardanocliJs.wallet(account);
};

const createPool = (name) => {
  cardanocliJs.nodeKeyGenKES(name);
  cardanocliJs.nodeKeyGen(name);
  cardanocliJs.nodeIssueOpCert(name);
  cardanocliJs.nodeKeyGenVRF(name);
  return cardanocliJs.pool(name);
};

const wallet = createWallet("Ada");
const pool = createPool("Berry");

console.log(wallet.paymentAddr);
console.log(pool.vrf.vkey);
```

## For testnet for example this is the working version

```
const CardanocliJs = require("cardanocli-js");
const shelleyGenesisPath = "../..//tconfig/testnet-shelley-genesis.json";
const options={}
options.shelleyGenesisPath = shelleyGenesisPath
options.network = "testnet-magic 1097911063"

const cardanocliJs = new CardanocliJs(options);

const createWallet = (account) => {
    try{
        paymentKeys = cardanocliJs.addressKeyGen(account);
        stakeKeys   = cardanocliJs.stakeAddressKeyGen(account);
        stakeAddr   = cardanocliJs.stakeAddressBuild(account);
        paymentAddr = cardanocliJs.addressBuild(account,{
            "paymentVkey": paymentKeys.vkey,
            "stakeVkey": stakeKeys.vkey
        });
        return cardanocliJs.wallet(account);
    }
    catch(err){
        console.log(err)
    }

};

const createPool = (name) => {
  cardanocliJs.nodeKeyGenKES(name);
  cardanocliJs.nodeKeyGen(name);
  cardanocliJs.nodeIssueOpCert(name);
  cardanocliJs.nodeKeyGenVRF(name);
  return cardanocliJs.pool(name);
};

const wallet = createWallet("Ada");
const pool = createPool("Berry");

console.log(wallet.paymentAddr);
console.log(pool.vrf.vkey);
```


전체 API 문서를 보려면 [cardanocli-js](https://github.com/Berry-Pool/cardanocli-js/blob/main/API.md)를 방문하십시오.

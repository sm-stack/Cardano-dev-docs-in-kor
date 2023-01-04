---
id: cardanosharp-wallet
title: CardanoSharp 지갑 시작하기
sidebar_label: CardanoSharp 지갑
description: Get Started with CardanoSharp Wallet
image: ../img/og/og-getstarted-cardanosharp-wallet.png
--- 

# CardanoSharp.Wallet 
[![Build status](https://ci.appveyor.com/api/projects/status/knh87k86mf7gbxyo?svg=true)](https://ci.appveyor.com/project/nothingalike/cardanosharp-wallet/branch/main) [![Test status](https://img.shields.io/appveyor/tests/nothingalike/cardanosharp-wallet)](https://ci.appveyor.com/project/nothingalike/cardanosharp-wallet/branch/main) [![NuGet Version](https://img.shields.io/nuget/v/CardanoSharp.Wallet.svg?style=flat)](https://www.nuget.org/packages/CardanoSharp.Wallet/) ![NuGet Downloads](https://img.shields.io/nuget/dt/CardanoSharp.Wallet.svg)

CardanoSharp 지갑은 지갑 생성/관리 및 트랜잭션 구축/서명을 위한 .NET 라이브러리입니다.

## 시작하기

CardanoSharp.Wallet은 NuGet을 통해 설치됩니다.

```sh
Install-Package CardanoSharp.Wallet
```

## 니모닉 만들기

`MnemonicService` 는 니모닉을 *생성하고 복원하는* 것을 도와주는 작업을 수행합니다. 이는 DI 컨테이너(i.e. `IMnemonicService` 인터페이스)에서 사용되도록 구축되었습니다.

```cs
IMnemonicService service = new MnemonicService();
```

### 니모닉 생성

```cs
IMnemonicService service = new MnemonicService();
Mnemonic rememberMe = service.Generate(24, WordLists.English);
System.Console.WriteLine(rememberMe.Words);
```

### 니모닉 복구

```cs
string words = "art forum devote street sure rather head chuckle guard poverty release quote oak craft enemy";
Mnemonic mnemonic = MnemonicService.Restore(words);
```

## 개인 / 공개 키 생성

키를 생성하고 도출하기 위해 강력한 확장 기능을 사용합니다.

```cs
// The rootKey is a PrivateKey made of up of the 
//  - byte[] Key
//  - byte[] Chaincode
PrivateKey rootKey = mnemonic.GetRootKey();

// This path will give us our Payment Key on index 0
string paymentPath = $"m/1852'/1815'/0'/0/0";
// The paymentPrv is Private Key of the specified path.
PrivateKey paymentPrv = rootKey.Derive(paymentPath);
// Get the Public Key from the Private Key
PublicKey paymentPub = paymentPrv.GetPublicKey(false);

// This path will give us our Stake Key on index 0
string stakePath = $"m/1852'/1815'/0'/2/0";
// The stakePrv is Private Key of the specified path
PrivateKey stakePrv = rootKey.Derive(stakePath);
// Get the Public Key from the Stake Private Key
PublicKey stakePub = stakePrv.GetPublicKey(false);
```

 > 키 경로에 대해 자세히 알아보려면, [주소 도출에 대하여](https://github.com/input-output-hk/technical-docs/blob/main/cardano-components/cardano-wallet/doc/About-Address-Derivation.md) 문서를 읽어보십시오.

## 주소 생성

`AddressService`는 키로부터 주소를 생성합니다. 이는 DI 컨테이너(i.e. `IMnemonicService` 인터페이스)에서 사용되도록 구축되었습니다.

```cs
IAddressService addressService = new AddressService();
```

위에 생성한 공개 키로부터 공개 주소를 얻을 수 있습니다.

```csharp
// add using
using CardanoSharp.Wallet.Models.Addresses;

// Creating Addresses require the Public Payment and Stake Keys
Address baseAddr = addressService.GetAddress(
    paymentPub, 
    stakePub, 
    NetworkType.Testnet, 
    AddressType.Base);
```

이미 주소가 있는 경우:

```cs
Address baseAddr = new Address("addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjqp");
```

## Fluent 키 도출

Fluent API는 도출 경로를 탐색하는 데 도움이 됩니다.

```cs
// Add using
using CardanoSharp.Wallet.Extensions.Models;

// Restore a Mnemonic
var mnemonic = new MnemonicService().Restore(words);

// Fluent derivation API
var derivation = mnemonic
    .GetMasterNode("password")      // IMasterNodeDerivation
    .Derive(PurposeType.Shelley)    // IPurposeNodeDerivation
    .Derive(CoinType.Ada)           // ICoinNodeDerivation
    .Derive(0)                      // IAccountNodeDerivation
    .Derive(RoleType.ExternalChain) // IRoleNodeDerivation
    //or .Derive(RoleType.Staking) 
    .Derive(0);                     // IIndexNodeDerivation

PrivateKey privateKey = derivation.PrivateKey;
PublicKey publicKey = derivation.PublicKey;
```

## 트랜잭션 구축 및 서명

CardanoSharp.Wallet은 트랜잭션을 구축하기 위해 체인으로부터 입력을 받아야 합니다. 다음과 같은 정보를 수집했다고 가정해보겠습니다.

```cs
uint currentSlot = 40000000;
ulong minFeeA = 44;
ulong minFeeB = 155381;
string inputTx = "0000000000000000000000000000000000000000000000000000000000000000";
```

트랜잭션을 구축하는 동안 사용할 몇 가지의 키를 도출해 보겠습니다.

```cs
// Derive down to our Account Node
var accountNode = rootKey.Derive()
    .Derive(PurposeType.Shelley)
    .Derive(CoinType.Ada)
    .Derive(0);

// Derive our Change Node on Index 0
var changeNode = accountNode
    .Derive(RoleType.InternalChain) 
    .Derive(0);

// Derive our Staking Node on Index 0
var stakingNode = accountNode
    .Derive(RoleType.Staking) 
    .Derive(0);

// Deriving our Payment Node
//  note: We did not derive down to the index.
var paymentNode = accountNode
    .Derive(RoleType.ExternalChain);
```

## 단순한 트랜잭션

다음과 같은 상황을 가정합시다:

- 다음 경로에 100 ada 가지고 있습니다:        `m/1852'/1815'/0'/0/0`
- 다음 경로로 25 ada 보내려고 합니다:         `m/1852'/1815'/0'/0/1`

### 트랜잭션 본문 구축

```cs
// Generate the Recieving Address
Address paymentAddr = addressService.GetAddress(
    paymentNode.Derive(1).PublicKey, 
    stakingNode.PublicKey, 
    NetworkType.Testnet, 
    AddressType.Base);

// Generate an Address for changes
Address changeAddr = addressService.GetAddress(
    changeNode.PublicKey, 
    stakingNode.PublicKey, 
    NetworkType.Testnet, 
    AddressType.Base);

var transactionBody = TransactionBodyBuilder.Create
    .AddInput(inputTx, 0)
    .AddOutput(paymentAddr, 25)
    .AddOutput(changeAddr, 75)
    .SetTtl(currentSlot + 1000)
    .SetFee(0)
    .Build();
```

### 트랜잭션 증인 구축

이 단순한 트랜잭션에는 키를 추가하기만 하면 됩니. 이는 트랜잭션에 서명하는 방법과 같습니다.

```cs
// Derive Sender Keys
var senderKeys = paymentNode.Derive(0);

var witnesses = TransactionWitnessSetBuilder.Create
    .AddVKeyWitness(senderKeys.PublicKey, senderKeys.PrivateKey);
```

### 수수료 계산

```cs
// Construct Transaction Builder
var transactionBuilder = TransactionBuilder.Create
    .SetBody(transactionBody)
    .SetWitnesses(witnesses);

// Calculate Fee
var fee = transaction.CalculateFee(minFeeA, minFeeB);

// Update Fee and Rebuild
transactionBody.SetFee(fee);
Transaction transaction = transactionBuilder.Build();
transaction.TransactionBody.TransactionOutputs.Last().Value.Coin -= fee;
```

## 메타데이터 트랜잭션

본문과 증인을 구축하는 것은 단순한 트랜잭션과 같습니다.

> 메타데이터에 대해 더 자세히 알고 싶다면, [Tx Metadata](https://github.com/input-output-hk/cardano-node/blob/master/doc/reference/tx-metadata.md) 글을 참조하십시오.

```cs
// Build Metadata and Add to Transaction
var auxData = AuxiliaryDataBuilder.Create
    .AddMetadata(1234, new { name = "simple message" });

var transaction = TransactionBuilder.Create
    .SetBody(transactionBody)
    .SetWitnesses(witnesses)
    .SetAuxData(auxData)
    .Build();
```

## 트랜잭션 발행

토큰을 발행하기 전에 정책을 먼저 생성해야 합니다.

> 정책 스크립트에 대해 자세히 알아보려면, 다음과 같은 [간단한 스크립트](https://github.com/input-output-hk/cardano-node/blob/master/doc/reference/simple-scripts.md)에 대한 문서를 읽어보십시오.

```cs
// Generate a Key Pair for your new Policy
var keyPair = KeyPair.GenerateKeyPair();
var policySkey = keyPair.PrivateKey;
var policyVkey = keyPair.PublicKey;
var policyKeyHash = HashUtility.Blake2b244(policyVkey.Key);

// Create a Policy Script with a type of Script All
var policyScript = ScriptAllBuilder.Create
    .SetScript(NativeScriptBuilder.Create.SetKeyHash(policyKeyHash))
    .Build();

// Generate the Policy Id
var policyId = policyScript.GetPolicyId();
```

이제 토큰을 정의하겠습니다.

```cs
// Create the AWESOME Token
string tokenName = "AWESOME";
uint tokenQuantity = 1;

var tokenAsset = TokenBundleBuilder.Create
    .AddToken(policyId, tokenName.ToBytes(), tokenQuantity);
```

발행 시 트랜잭션 본문의 출력 중 하나에 새 토큰을 추가해야 합니다.

```cs
// Generate an Address to send the Token
Address baseAddr = addressService.GetAddress(
    paymentNode.Derive(1).PublicKey, 
    stakingNode.PublicKey, 
    NetworkType.Testnet, 
    AddressType.Base);

// Build Transaction Body with Token Bundle
var transactionBody = TransactionBodyBuilder.Create
    .AddInput(inputTx, 0)
    // Sending to Base Address, includes 100 ADA and the Token we are minting
    .AddOutput(baseAddr, 100, tokenAsset)
    .SetTtl(currentSlot + 1000)
    .SetFee(0)
    .Build();
```

## 토큰 묶음 관리

트랜잭션 구축 시, 토큰을 제대로 다루는 것이 중요합니다.

```cs
var tokenBundle = TokenBundleBuilder.Create
    .AddToken(policyId, "Token1".ToBytes(), 100)
    .AddToken(policyId, "Token2".ToBytes(), 200);

Address baseAddr = addressService.GetAddress(
    paymentNode.Derive(1).PublicKey, 
    stakingNode.PublicKey, 
    NetworkType.Testnet, 
    AddressType.Base);

var transactionBody = TransactionBodyBuilder.Create
    .AddInput(inputTx, 0)
    .AddOutput(baseAddr, 2, tokenBundle)
    .AddOutput(changeAddr, 98)
    .SetTtl(currentSlot + 1000)
    .SetFee(0)
    .Build();
```

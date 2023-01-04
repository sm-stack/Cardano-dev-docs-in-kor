---
id: minting-nfts
title: NFT 발행
sidebar_label: NFT 발행
description: How to mint NFTs on Cardano. 
image: ../img/og/og-developer-portal.png
---

<iframe width="100%" height="325" src="https://www.youtube.com/embed/n5x9bvrOHW0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture fullscreen"></iframe>

:::note
Cardano를 통해 NFT를 실현하는 방법에는 여러 가지가 있습니다. 그러나, 이 가이드에서는 [IPFS]](https://ipfs.io/)와 같은 다른 서비스의 저장소 참조를 토큰에 연결하는 가장 대표적인 방식에 집중할 것입니다.
:::

## 차이점은 무엇인가요?
네이티브 자산과 NFT의 차이점은 무엇인가요?
기술적인 관점에서 NFT는 기본 자산과 동일합니다. 그러나, 몇 가지 특성이 추가됨에 따라 네이티브 자산이 진정한 NFT로 만들어집니다.

1. 이름에서 알 수 있듯이 '대체 불가능'해야 합니다. 즉, 토큰을 다른 토큰과 구별할 수 있도록 고유한 식별자 또는 속성을 토큰에 첨부해야 합니다.
2. 대부분의 경우, NFT는 체인에 영원히 남아 있어야 합니다. 따라서 NFT가 고유하게 유지되고 복제될 수 없도록 보장하는 메커니즘이 필요합니다.

### policyID
Cardano의 네이티브 자산은 다음과 같은 특징을 가지고 있습니다.
1. 금액/가치
2. 이름
3. 고유한 `policyID`

자산 이름은 고유하지 않고 쉽게 복제될 수 있으므로, Cardano의 NFT는 `policyID`로 식별됩니다. 해당 ID는 고유하고, 자산과 영구적으로 연결됩니다. 정책 ID는 토큰을 발행할 수 있는 사람과 발행 시점 등을 결정하는 정책 스크립트로부터 나옵니다. 

많은 NFT 프로젝트들은 `policyID`를 공개적으로 사용가능하도록 만들기 때문에, 누구나 사기/중복 NFT를 원래 것과 구별할 수 있습니다.

일부 서비스는 동일한 속성을 가지고 있지만 서로 다른 정책에 따라 발행된 토큰들을 감지하기 위해 `policyID`를 등록하도록 제안하기도 합니다.

### 메타데이터 속성

고유한 `policyID` 외에도 다양한 속성을 가진 메타데이터를 트랜잭션에 첨부할 수 있습니다.

다음은 [nft-maker.io](https://www.nft-maker.io/)의 예입니다.

```json
{
  "721": {
    "{policy_id}": {
      "{policy_name}": {
        "name": "<required>",
        "description": "<optional>",
        "sha256": "<required>",
        "type": "<required>",
        "image": "<required>",
        "location": {
          "ipfs": "<required>",
          "https": "<optional>",
          "arweave": "<optional>"
        }
      }
    }
  }
}
```
메타데이터는 이미지 URL과 같이 NFT를 구성하는 것들을 표시하는데 도움이 됩니다. 메타데이터를 붙이는 방법을 사용하면, [pool.pm](https://pool.pm/)과 같은 제 3자 플랫폼에서 마지막 발행 트랜잭션을 쉽게 추적하고, 메타데이터를 읽어 이미지와 속성을 쿼리할 수 있습니다. 쿼리는 다음과 같은 모습을 가질 것입니다.

1. 자산 이름과 `policyID`를 얻습니다.
2. 해당 자산의 최신 발행 트랜잭션을 조회합니다.
3. `721` 라벨에 대한 메타데이터를 확인합니다.
4. 자산 이름과 (이 경우) {policy_name}-entry를 일치시킵니다.
5. 해당 항목에 대한 IPFS 해시 및 기타 모든 속성을 쿼리합니다.


:::note
**현재 NFT 또는 메타데이터를 정의하는 방법에 대해 합의된 표준은 없습니다**. 
그러나, 토론의 결과에 따르고 싶다면 [Cardano Improvement Proposal](https://github.com/cardano-foundation/CIPs/pull/85) 페이지가 있습니다.
:::

### 시간 잠금

NFT는 거래되거나 판매될 가능성이 높기 때문에, 보다 엄격한 정책을 따라야 합니다. 대부분의 경우 가치는 자산의 (인위적인) 희소성에 의해 정의됩니다.

이러한 요소를 [다중 서명 스크립트]](https://github.com/input-output-hk/cardano-node/blob/c6b574229f76627a058a7e559599d2fc3f40575d/doc/reference/simple-scripts.md)로 제어할 수 있습니다.

이 가이드에선, 다음 제약 조건을 따르고 구현해볼 것입니다.

1. NFT를 발행(또는 소각)할 수 있는 서명은 하나만 있어야 합니다.
2. 서명은 지금부터 **10000개의 슬롯** 뒤에 만료될 것입니다.


## 전제 조건
[네이티브 자산 발행](minting.md)에서의 전제 조건 외에도, 다음과 같은 것들이 추가로 필요합니다.

1. 어떤 / 얼마나 많은 NFT를 만들고 싶은지.
--> 하나의 NFT만 만들 예정입니다.
2. 이미 채워진 `metadata.json`  
3. 발행 정책이 어떠한 방식일지.
--> 하나의 서명만 허용됩니다.
--> 트랜잭션이 이루어진 이후 10000개의 슬롯이 경과한 후에는 더 이상 자산을 발행하거나 소각할 수 없습니다.
4. IPFS에 이미지를 업로드한 경우 해시. 
--> [링크](https://gateway.pinata.cloud/ipfs/QmRhTTbUrPYEw3mJGGhQqQST9k86v1DPBiTTWJGKDJsVFw)의 이미지를 사용할 것입니다.

:::note
가장 일반적인 분산 스토리지 서비스인 IPFS에 이미지를 업로드하는 것이 좋습니다. 여러 대안들도 존재하겠지만, IPFS는 발행된 NFT 수의 관점에서 가장 많이 채택된 서비스입니다.
:::

## 설정
네이티브 자산의 생성은 [발행](minting.md) 챕터에서 광범위하게 다루어졌으므로, 자세히 다루지는 않겠습니다. 
약간의 복습과 필요한 설정만 언급하도록 하겠습니다.

### 작업 디렉토리
먼저 새로운 작업 디렉토리를 설정하고 해당 디렉토리로 변경해보겠습니다.

```bash
mkdir nft
cd nft/
```

### 변수 설정하기
더 나은 가독성과 원활한 디버깅을 위해 더 읽기 쉬운 변수에 중요한 값을 설정할 것입니다.

cardano-node 버전 1.31.0부터 토큰 이름은 16진수 형식이어야 합니다. 변수 $realtokenname (utf-8 형태의 실제 이름)를 설정한 다음, $tokenname (16진수 형태)으로 이를 변환할 것입니다.
```bash
realtokenname="NFT1"
tokenname=$(echo -n $realtokenname | xxd -b -ps -c 80 | tr -d '\n')
tokenamount="1"
fee="0"
output="0"
ipfs_hash="please insert your ipfs hash here"
```
:::note
IPFS 해시는 핵심 요구 사항이며, 이미지를 IPFS에 업로드하면 찾을 수 있습니다. 다음은 이미지가 [pinata](https://pinata.cloud/)로 업로드될 때 IPFS가 어떻게 보이는지에 대한 예시입니다.
![img](../../static/img/nfts/pinata_pin.PNG)
:::


### 키와 주소 생성하기

새로운 키와 지불 주소를 설정하겠습니다.

```bash
cardano-cli address key-gen --verification-key-file payment.vkey --signing-key-file payment.skey
```

이제 이 두 키를 사용하여 주소를 생성할 수 있습니다.

```bash
cardano-cli address build --payment-verification-key-file payment.vkey --out-file payment.addr --mainnet
```

address라는 변수에 주소 해시를 저장합니다.

```bash
address=$(cat payment.addr)
```

### 주소에 자금 채우기

트랜잭션을 제출하려면 항상 수수료를 지불해야 합니다. 또한 네이티브 자산을 전송하려면 최소 1 ada가 필요합니다. 
따라서 발행 트랜잭션을 위한 입력으로 사용할 주소에 충분한 자금이 있는지 확인하세요.
이 예제에서는 새로 생성된 주소에 10 ada를 채웠습니다.

```bash
cardano-cli query utxo --address $address --mainnet
```

다음과 같은 것을 볼 수 있습니다.
```bash
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
974e98c4529f8fc75fa8baf5618f7b5ade81aa9ed29ce33cd1c2f2e70838180e     0        10000000 lovelace
```
### 프로토콜 매개변수 내보내기

트랜잭션 계산을 위해 현재 매개변수 중 일부가 필요합니다. 매개 변수는 다음과 같은 명령을 사용하여 `protocol.json` 이라는 파일에 저장할 수 있습니다. 

```bash
cardano-cli query protocol-parameters --mainnet --out-file protocol.json
```

### policyID 생성하기
네이티브 자산을 생성할 때와 마찬가지로, 키 쌍 및 정책 스크립트와 같은 일부 정책 관련 파일을 생성해야 합니다.

```bash
mkdir policy
```

:::note
우리는 이 디렉토리로 들어가지 않을 것이며, 모든 작업은 작업 디렉토리 내에서 수행됩니다.
:::

새 키 쌍을 생성합니다.

```bash
cardano-cli address key-gen \
    --verification-key-file policy/policy.vkey \
    --signing-key-file policy/policy.skey
```

단일 서명만 정의하는 대신(네이티브 자산 발행 가이드에서 했던 것처럼), 스크립트 파일은 다음 특성(위에서 정의했던 것)을 구현해야 합니다.

1. 하나의 서명만 허용됨.
2. 거래가 이루어진 후 10000개의 슬롯이 지난 후에는 더 이상 자산을 발행하거나 소각할 수 없습니다.

해당 목적의 `policy.script`은 다음과 같이 표시됩니다.

```json
{
  "type": "all",
  "scripts":
  [
    {
      "type": "before",
      "slot": <insert slot here>
    },
    {
      "type": "sig",
      "keyHash": "insert keyHash here"
    }
  ]
}
```

보시다시피, 여기서 두 가지 값인 `slot`과 `keyHash`를 조정해야 합니다.

한 번에 모든 것을 설정하고 복사/붙여넣기 하려면 다음 명령을 사용하세요:
**팁을 정확히 분석하려면 `jq` 를 설치해야 합니다!**

```bash
echo "{" >> policy/policy.script
echo "  \"type\": \"all\"," >> policy/policy.script 
echo "  \"scripts\":" >> policy/policy.script 
echo "  [" >> policy/policy.script 
echo "   {" >> policy/policy.script 
echo "     \"type\": \"before\"," >> policy/policy.script 
echo "     \"slot\": $(expr $(cardano-cli query tip --mainnet | jq .slot?) + 10000)" >> policy/policy.script
echo "   }," >> policy/policy.script 
echo "   {" >> policy/policy.script
echo "     \"type\": \"sig\"," >> policy/policy.script 
echo "     \"keyHash\": \"$(cardano-cli address key-hash --payment-verification-key-file policy/policy.vkey)\"" >> policy/policy.script 
echo "   }" >> policy/policy.script
echo "  ]" >> policy/policy.script 
echo "}" >> policy/policy.script
```

**이 명령이 제대로 동작하지 않으면, 수동으로 키 해시와 슬롯을 설정하세요.**

`keyHash`를 생성하려면, 다음 명령을 사용합니다.
```bash
cardano-cli address key-hash --payment-verification-key-file policy/policy.vkey
```

올바른 슬롯을 계산하려면 현재 슬롯을 쿼리하고 여기에 10000을 더합니다.
```bash
cardano-cli query tip --mainnet
```

정책 폴더에 policy.script라는 새 파일을 만듭니다.
```bash
touch policy/policy.script
```
`keyHash`와 `slot` 값을 넣은 JSON을 붙여넣습니다.
```bash
nano policy/policy.script
```

:::note
슬롯 번호는 정수이므로 큰따옴표가 필요하지 않지만, `keyHash`는 문자열로 정의되므로 큰따움표로 묶여야 합니다.
:::

슬롯 번호를 기록하고 이를 변수에 저장하세요.

```bash
slotnumber="Replace this with your slot number"
```

그런 다음 스크립트 파일의 위치도 변수에 저장합니다.

```bash
script="policy/policy.script"
```

마지막 단계는 policyID를 생성하는 것입니다.

```bash
cardano-cli transaction policyid --script-file ./policy/policy.script > policy/policyID
```

### 메타데이터
이제 정책과 `policyID`가 다 정의되어 있으므로, 메타데이터 정보도 조정해야 합니다.

다음은 이 가이드에서 사용할 metadata.json의 예시입니다.

```json
{
        "721": {
            "please_insert_policyID_here": {
              "NFT1": {
                "description": "This is my first NFT thanks to the Cardano foundation",
                "name": "Cardano foundation NFT guide token",
                "id": 1,
                "image": ""
              }
            }
        }
}
```

:::note
계층 구조의 세 번째 요소는 해당 NFT 네이티브 자산과 동일한 이름을 가져야 합니다.
:::

이 파일을 `metadata.json`으로 저장합니다. 

이를 "즉시" 생성하려면 다음 명령을 사용하세요.

```bash
echo "{" >> metadata.json
echo "  \"721\": {" >> metadata.json 
echo "    \"$(cat policy/policyID)\": {" >> metadata.json 
echo "      \"$(echo $realtokenname)\": {" >> metadata.json
echo "        \"description\": \"This is my first NFT thanks to the Cardano foundation\"," >> metadata.json
echo "        \"name\": \"Cardano foundation NFT guide token\"," >> metadata.json
echo "        \"id\": \"1\"," >> metadata.json
echo "        \"image\": \"ipfs://$(echo $ipfs_hash)\"" >> metadata.json
echo "      }" >> metadata.json
echo "    }" >> metadata.json 
echo "  }" >> metadata.json 
echo "}" >> metadata.json
```

:::note
이미지 값 / IPFS 해시가 올바른 프로토콜 접두사인 <i>ipfs://</i>  로 설정되었는지 확인하세요(예시: <i>"ipfs://QmRhTTbUrPYEw3mJGGhQqQST9k86v1DPBiTTWJGKDJsVFw"</i>).

:::
### 트랜잭션 만들기

트랜잭션 빌딩을 시작하겠습니다.
시작하기 전에, 트랜잭션 빌딩을 더 쉽게 하기 위해 몇 가지 설정이 다시 필요합니다. 지불 주소를 쿼리하고, 거기에 존재하는 다양한 값을 기록해 두겠습니다.

```bash
cardano-cli query utxo --address $address --mainnet
```

출력 결과는 다음과 같은 형태일 것입니다.

```bash
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
b35a4ba9ef3ce21adcd6879d08553642224304704d206c74d3ffb3e6eed3ca28     0        1000000000 lovelace
```

트랜잭션에서 각 값이 필요하므로, 해당하는 변수들에 각각 저장합니다.

```bash
txhash="insert your txhash here"
txix="insert your TxIx here"
funds="insert Amount in lovelace here"
policyid=$(cat policy/policyID)
output=1400000
```

여기서 `output` 값은 1.4 ada에 해당하는 `1400000` Lovelace로 설정합니다. 이렇게 설정해준 것은, 이 값이 최소 UTxO 요구사항이기 때문입니다.

확실하지 않은 경우, 트랜잭션에 필요한 다른 모든 변수가 설정되어 있는지 확인하세요.

```bash
echo $fee
echo $address
echo $output
echo $tokenamount
echo $policyid
echo $tokenname
echo $slotnumber
echo $script
```

모든 것이 설정되었으면, 다음 명령을 실행합니다.

```bash
cardano-cli transaction build \
--mainnet \
--alonzo-era \
--tx-in $txhash#$txix \
--tx-out $address+$output+"$tokenamount $policyid.$tokenname" \
--change-address $address \
--mint="$tokenamount $policyid.$tokenname" \
--minting-script-file $script \
--metadata-json-file metadata.json  \
--invalid-hereafter $slotnumber \
--witness-override 2 \
--out-file matx.raw
```

위 명령은 아래와 같은 출력을 생성할 것입니다.

```bash
Minimum required UTxO: Lovelace 1448244
```

이는 `$output` 변수의 값을 주어진 값으로 변경해야 함을 의미합니다.

```
output=1448244
```

우리가 얻은 출력으로 이 값을 사용해야 한다는 것을 잊지 마십시오.

최소값이 올바른 경우, 이 명령은 `matx.raw`을 생성하고 다음과 같은 출력을 제공합니다.

```bash
Estimated transaction fee: Lovelace 176677
```

__NOTE__: Lovelace 값은 다를 수 있습니다.

### 트랜잭션에 서명하기

```bash
cardano-cli transaction sign  \
--signing-key-file payment.skey  \
--signing-key-file policy/policy.skey  \
--mainnet --tx-body-file matx.raw  \
--out-file matx.signed
```

:::note
서명된 트랜잭션은 <i>matx.raw</i> 대신 <i>matx.signed</i> 라는 새 파일에 저장됩니다.
:::

이제 트랜잭션을 제출하여 네이티브 자산을 발행합니다.

```bash
cardano-cli transaction submit --tx-file matx.signed --mainnet
```

축하합니다. 이제 자체 토큰을 성공적으로 발행했습니다. 몇 초 후에 출력 주소를 확인할 수 있습니다.

```bash
cardano-cli query utxo --address $address --mainnet
```

다음과 같이 표시되어야 합니다.

### NFT 표시하기

가장 많이 채택된 NFT 브라우저 중 하나는 [pool.pm](https://pool.pm/tokens)입니다.
검색창에 주소를 입력하고 Enter 키를 누르면 NFT가 모든 속성 및 이미지와 함께 표시도비니다.

![img](../../static/img/nfts/poolpm_nft.png)

[여기](https://pool.pm/6574f051ee0c4cae35c0407b9e104ed8b3c9cab31dfb61308d69f33c.NFT1)에서 이 튜토리얼을 통해 생성된 NFT를 확인할 수 있습니다.

## 토큰 소각하기

무언가 문제가 생겨 다시 시작하려는 경우, 정책 스크립트에 정의된 슬롯이 아직 끝나지 않았다면 언제든지 토큰을 소각할 수 있습니다. 
모든 변수가 설정되어 있다고 가정하면, 이를 재설정해야 합니다.

```bash
burnfee="0"
burnoutput="0"
txhash="Insert your utxo holding the NFT"
txix="Insert your txix"
burnoutput=1400000
```

여기서 `output` 값을 `1.4` ada에 해당하는 `1400000` Lovelace로 설정합니다. 이 금액은 최소 UTxO 요구사항입니다.

트랜잭션은 다음과 같을 것입니다.

```bash
cardano-cli transaction build --mainnet --alonzo-era --tx-in $txhash#$txix --tx-out $address+$burnoutput --mint="-1 $policyid.$tokenname" --minting-script-file $script --change-address $address --invalid-hereafter $slot --witness-override 2 --out-file burning.raw
```

:::note
발행 매개변수는 이제 음수 값으로 호출됩니다.
:::


트랜잭션에 서명하세요.
```bash
cardano-cli transaction sign  --signing-key-file payment.skey  --signing-key-file policy/policy.skey --mainnet  --tx-body-file burning.raw --out-file burning.signed
```
트랜잭션을 전송하세요.
```bash
cardano-cli transaction submit --tx-file burning.signed --mainnet
```

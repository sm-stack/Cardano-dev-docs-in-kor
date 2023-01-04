---
id: kes_period
title:  KES Periods
sidebar_label:  KES periods
description: "Stake pool course: KES period assignment."
image: ../img/og/og-developer-portal.png
---

블록 생성 노드에 대한 운영 인증서를 생성하려면 KES 키 쌍이 필요합니다.

여기서 "KES"는 Key Evolving Signature를 의미하며, 일정 _기간_ 이 지나면 키가 새 키로 _진화_ 하고 이전 버전을 폐기한다는 의미입니다. 이는 공격자가 키를 손상시키고 서명 키에 액세스하더라도 지금부터 블록에 서명하는 데만 키를 사용할 수 있고 이전 기간 의 블록 은 사용할 수 없다는 점으로 인해 유용하게 사용됩니다. 즉, 공격자는 체인의 역사를 다시 쓰지 못한다는 것을 의미합니다. 새 KES 키 쌍을 생성하려면 아래를 참조하십시오.

KES 키는 특정 기간 동안만 진화할 수 있으며 이후에는 쓸모가 없게 됩니다. 즉, 해당 기간이 경과하기 전에 노드 운영자는 새 KES 키 쌍을 생성하고 해당 새 키 쌍으로 새 운영 노드 인증서를 발급하고 새 인증서로 노드를 다시 시작해야 합니다.

### KES 키 생성

```bash
cardano-cli node key-gen-KES \
  --verification-key-file kes.vkey \
  --signing-key-file kes.skey
```

한 기간이 얼마나 길고 키가 얼마나 오래 진화할 수 있는지 알아보려면 _제네시스 파일_ 을 살펴볼 수 있습니다 . 해당 파일의 이름이 `mainnet-shelley-genesis.json`라고 하면, 다음과 같이 입력할 수 있습니다.

```bash
cat mainnet-shelley-genesis.json | grep KES
"slotsPerKESPeriod": 129600,
"maxKESEvolutions": 62,
```

키는 129600 슬롯의 각 기간 후에 진화하며 갱신 전 최대 62번까지 진화할 수 있습니다.

우리 노드에 대한 운영 인증서를 생성하려면, KES 유효 기간의 시작, 즉 우리가 속한 KES 진화 기간을 파악해야 합니다.

블록체인의 현재 팁을 확인합니다.

```bash
cardano-cli query tip --mainnet
{
    "epoch": 259,
    "hash": "dbf5104ab91a7a0b405353ad31760b52b2703098ec17185bdd7ff1800bb61aca",
    "slot": 26633911,
    "block": 5580350
}
```
이 예에서 우리는 현재 슬롯 26633911에 있으며, 제네시스 파일에서 한 기간이 129600 슬롯 동안 지속된다는 것을 알고 있습니다. 따라서 현재 기간을 계산합니다.

```bash
expr 26633911 / 129600
> 205
```

### 운영 인증서 발급

```bash
cardano-cli node issue-op-cert \
  --kes-verification-key-file kes.vkey \
  --cold-signing-key-file cold.skey \
  --operational-certificate-issue-counter opcert.counter \
  --kes-period 205 \
  --out-file opcert.cert
```

**이 명령은 콜드 카운터를 1씩 증가시킵니다.**

## :warning: Vasil 하드 포크 변동 사항

Vasil 하드포크부터는 opcert.counter에 대한 새로운 규칙이 있습니다.

새로운 운영 인증서는 카운터 값에 있어 적어도 하나의 블록을 성공적으로 발행한 이전 운영 인증서보다 정확히 하나 더 큰 카운터 값을 가지는 경우에만 유효한 것으로 간주됩니다.

Vasil 이전에는 이전에 체인에서 사용된 것보다 더 큰 카운터 값을 얼마든지 사용할 수 있었지만 더 이상 허용되지 않습니다. 정확히 1씩 증가해야 합니다. 특히 이것은 현재 시간이나 슬롯 번호를 카운터 값으로 사용할 수 없음을 의미합니다.

### 온체인에서 사용되는 카운터 값 찾기

온체인에 등록된 현재 **운영 인증서 카운터**를 찾으려면 다음을 실행하세요.

```bash
> cardano-cli query kes-period-info --testnet-magic 42 --op-cert-file node-spo3/opcert.cert
```

```
✓ Operational certificate's KES period is within the correct KES period interval
✓ The operational certificate counter agrees with the node protocol state Operational Certificate
{
    "qKesCurrentKesPeriod": 15,
    "qKesEndKesInterval": 18,
    "qKesKesKeyExpiry": null,
    "qKesMaxKESEvolutions": 6,
    "qKesNodeStateOperationalCertificateNumber": 3,
    "qKesOnDiskOperationalCertificateNumber": 3,
    "qKesRemainingSlotsInKesPeriod": 690,
    "qKesSlotsPerKesPeriod": 300,
    "qKesStartKesInterval": 12
}
```

여기서

* `"qKesNodeStateOperationalCertificateNumber": 3`은 블록을 생성했을 때 **온체인**에 등록된 마지막 카운터 값입니다.

and

* `"qKesOnDiskOperationalCertificateNumber": 3` 는 현재 가지고 있는 운영 인증서의 카운터 값입니다.

풀이 이미 현재 운영 인증서로 블록을 생성한 경우 위의 값이 일치합니다.

풀이 아직 현재 작동 인증서로 블록을 위조 하지 않은 경우 `cardano-cli query kes-period-info`는 `"qKesOnDiskOperationalCertificateNumber"`가 `"qKesNodeStateOperationalCertificateNumber"`보다 정확히 1 큰 것으로 표시할 것입니다. 예를 들면 다음과 같습니다.

```json
"qKesNodeStateOperationalCertificateNumber": 2,
"qKesOnDiskOperationalCertificateNumber": 3,
```

풀이 블록을 생성하면  `qKesNodeStateOperationalCertificateNumber`는 이에 따라 **온체인에서** 증가할 것이고, 값은 같아질 것입니다.

### 유효하지 않은 운영 인증서를 발급했는지 확인하기

새 운영 인증서를 만든 직후 `cardano-cli query kes-period-info`를 실행하세요. 가지고 있는 것과 온체인 인증서의 카운터 값이 1보다 많이 차이나면, 당신의 인증서는 유효하지 않습니다. 다음은 그 예시입니다.

```json
"qKesNodeStateOperationalCertificateNumber": 2,
"qKesOnDiskOperationalCertificateNumber": 4,
```

이러한 인증서로 생성된 모든 블록은 유효하지 않은 블록 이 됩니다.

**유효하지 않은** 인증서를 발급 한 후 **유효한** 인증서 를 발급 하려면 새로운 **운영 인증서 카운터**와 새로운 운영 인증서가 필요합니다.

### 현재 운영 인증서로 생성된 블록이 없을 경우, 카운터는 어떻게 하나요?

새 규칙에서는, 카운터가 현재 체인에서 실제로 블록을 생성하는 데 사용된 마지막 카운터보다 **하나** 더 많아야 합니다.

**이전 운영 인증서의 카운터를 증가시켰지만 이를 사용하여 블록을 위조하지 않은 경우, 새 운영 인증서를 발행할 때 카운터를 다시 증가시키지 않아야 합니다. 즉, 카운터 값은 동일하게 유지됩니다. 이 경우 새 운영 인증서를 발급하기 전에 새 카운터를 발급해야 합니다.**

**참조: 아래에서 새 카운터 및 운영 인증서를 발급합니다.**

이 시나리오에서는 새 인증서 발급을 위해 `cardano-cli node issue-op-cert...`를 바로 쓸 수 **없습니다**. 이는 **가지고 있는 인증서**의 카운터가 1 더 증가시켜서 유효하지 않은 인증서로 만들 것이기 때문입니다. 예를 들면 다음과 같습니다.

```
"qKesNodeStateOperationalCertificateNumber": 2,
"qKesOnDiskOperationalCertificateNumber": 4,
```

이러한 카운터를 사용하여 인증서를 발급하면, 이를 사용하여 생성하는 모든 블록은 **유효하지 않은 블록**이 됩니다. 노드 로그에 다음과 같은 오류가 표시될 것입니다.

```
Invalid block 237602735e6b56985109480aefbc4821f57e6389736be238ffbec4c0188f9702 at slot 5206: ExtValidationErrorHeader (HeaderProtocolError (HardForkValidationErrFromEra S (S (S (S (S (Z (WrapValidationErr {unwrapValidationErr = CounterOverIncrementedOCERT 2 4}))))))))
```

### 새로운 카운터 및 운영 인증서 발행

**실행중인 노드에서:**

1. `kes-period-info`를 쿼리하세요. `--out-file` 플래그를 사용하여 json 출력을 파일에 저장할 수 있습니다.

```bash
> cardano-cli query kes-period-info --testnet-magic 42 --op-cert-file node-spo3/opcert.cert --out-file kes_period_info.json

> cat kes_period_info.json

>
{
    "qKesCurrentKesPeriod": 18,
    "qKesEndKesInterval": 18,
    "qKesKesKeyExpiry": null,
    "qKesMaxKESEvolutions": 6,
    "qKesNodeStateOperationalCertificateNumber": 2,
    "qKesOnDiskOperationalCertificateNumber": 4,
    "qKesRemainingSlotsInKesPeriod": 198,
    "qKesSlotsPerKesPeriod": 300,
    "qKesStartKesInterval": 12
}
```

**콜드 환경에서:**

2. 새 카운터 만들기

위에서 **온체인**에 저장된 카운터를 가져옵니다. 이 경우 `"qKesNodeStateOperationalCertificateNumber": 2`일 것이고, 새 카운터를 발행할 때 정확히 1만큼 증가시킵니다.  

```bash
cardano-cli node new-counter \
  --cold-verification-key-file cold.vkey \
  --counter-value $((2 + 1)) \
  --operational-certificate-issue-counter-file opcert.counter
```

3. 필요한 경우 새 KES 키를 생성합니다(MaxKESEvolutions 에 도달했기 때문에):

```bash
cardano-cli node key-gen-KES \
  --verification-key-file kes.vkey \
  --signing-key-file kes.skey
```

4. 새 운영 인증서를 발급합니다.

```bash
  cardano-cli node issue-op-cert --kes-verification-key-file kes.vkey \
  --cold-signing-key-file cold.skey \
  --operational-certificate-issue-counter-file opcert.counter \
  --kes-period 18 \
  --out-file opcert.cert
```

5. 새 `opcert.cert` 와 `kes.skey`를 블록 생산 노드에 복사하고 다시 시작하세요.

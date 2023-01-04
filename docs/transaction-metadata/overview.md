---
id: overview
slug: /transaction-metadata/
title: 트랜잭션 메타데이터로 빌딩하기
sidebar_label: 개요
description: The Cardano Transaction Metadata is a feature that allows anyone to embed metadata into transactions and ultimately storing metadata into the blockchain.
image: ../img/og/og-developer-portal.png
---

![Cardano Transaction Metadata](../../static/img/card-transaction-metadata-title.svg)

## Introduction

**Cardano 트랜잭션 메타데이터** 기능을 사용하면 누구나 트랜잭션에 메타데이터를 포함할 수 있으며, 이 메타데이터는 블록체인에 저장됩니다. 다음은 메타데이터의 가장 일반적인 네 가지 용도입니다. 

- **검사 및 검증**  
Cardano Foundation이 Scantrust 및 Baia's Wine을 통해 입증한 것처럼, 메타데이터를 활용하여 외부의 물리적인 객체와 적법한 컨텐츠를 검사하고 검증할 수 있습니다. 이를 위해서는 QR 코드와 같은 물리적 식별자와의 결합이 필요하지만, 빠르게 움직이는 소비재의 저비용 공급망 추적과 같은 일에 특히 유용합니다.

- **인증 및 증거**
교육 기관, 멤버십 그룹 등으로부터 받은 자격 증명의 진위를 확인하기 위한 물리적 식별자들이 종종 존재합니다. 이는 디지털 교육과정 및 인증의 경우 더 어렵습니다. 저렴한 비용으로, 메타데이터를 사용한 트랜잭션은 변경 불가능하고 항상 접근가능한 인증서의 증거 역할을 할 수 있습니다.   

- **안전한 정보 기록**
트랜잭션에 붙어서 Cardano 블록체인에서 확정된 메타데이터는 변경될 수 없습니다. 이는 아무도 이를 변경할 수 없으며, Cardano 블록체인이 존재하는 한 지속된다는 것을 의미합니다. 이것은 중요한 정보를 저장하고 백업하거나, 미래를 위해 유머러스한 메세지를 남기는 환상적인 방법입니다.  

- **타임스탬프**
특정 자산의 소유권 이력뿐만 아니라, 결제 데이터를 첨부해야 하는 모든 트랜잭션은 타임스탬프의 이점을 누릴 수 있습니다. 메타데이터는 트랜잭션 내에서 타임스탬프를 생성하는 데 사용할 수 있으므로, 누구나 구매/판매 또는 양도의 시간과 날짜를 확인할 수 있습니다.  

본질적으로 메타데이터는 트랜잭션에 얽힌 스토리를 전달하는 데 활용할 수 있습니다. 메타데이터는 물리적인 식별자와 같은 오프체인 인프라와 결합될 때 진위를 확인하거나 보증하는 역할을 할 수 있습니다.

## 메타데이터 워크샵
Cardano Foundation의 통합 팀은 2021년 1월 18일 트랜잭션 메타데이터에 대한 세션을 주최했습니다. Cardano 재단 통합 팀의 Jeremy Firster와 Mel McCann이 워크샵을 진행했습니다. Jeremy와 Mel은 트랜잭션 메타데이터에 대해 소개하였고, IOHK의 Alan McSherry 및 Ben O'Hanlon과 함께 Cardano 어플리케이션 생성에 있어 메타데이터의 가능성에 대해 논의하였습니다. [프레젠테이션의 슬라이드도 사용할 수 있습니다](https://docs.google.com/presentation/d/1KUy83TxpJwIxMHYoQQK6SYynTKrmokxgv_vRa3bpGw4/edit?usp=sharing).

<iframe width="100%" height="325" src="https://www.youtube.com/embed/LrN3ETZ3fRM" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture fullscreen"></iframe>

## 구조

메타데이터는 몇 가지 제한 사항이 있는 `JSON` 객체로 표현될 수 있습니다.

모든 최상위 키는 0에서 2^64 - 1 사이의 **정수**여야 합니다. 각 메타데이터 값에는 자료형 태그가 달립니다. **문자열**은 UTF-8이 인코딩된 경우 최대 64바이트여야 합니다. **바이트 문자열**은 최대 길이가 64바이트인 16진수로 인코딩됩니다. 메타데이터는 Cardano 블록체인에 `JSON` 형태로 저장되는게 아니라, 압축 바이너리 인코딩(**CBOR**)을 통해 저장됩니다.

메타데이터 값의 바이너리 인코딩은 세 가지 단순한 자료형을 지원합니다.

- `-(2^64 - 1) to 2^64 - 1` 범위에 있는 정수
- (`UTF-8` 인코딩된) 문자열
- 바이트 문자열
- 두 가지 복합 자료형:
    - 메타데이터 값의 리스트
    - 메타데이터 값에서 메타데이터 값으로의 맵핑

이 모든 JSON 객체를 이 형태로 변환할 수 있습니다.

그러나 요구 사항에 따라, 어플리케이션에서 부동 소수점 값을 사용하는 경우에는 어떻게든 이들을 변환해야 합니다. **null**이나 **bool** 값에 대해서도 마찬가지입니다. 또한, 체인에서 메타데이터를 읽을 때, **정수** 자료형이 선택한 프로그래밍 언어의 숫자 범위를 초과할 수 있고, 별도의 **bigint** 분석이 필요할 수도 있다는 점에 유의하세요.

**메타데이터 예시**:

```json
{
    "0": {
        "string": "cardano"
    },
    "1": {
        "int": 14
    },
    "2": {
        "bytes": "0x2512a00e9653fe49a44a5886202e24d77eeb998f"
    },
    "3": {
        "list": [
            {
                "string": "test"
            }
        ]
    },
    "4": {
        "map": [
            {
                "k": {
                    "string": "key"
                },
                "v": {
                    "string": "value"
                }
            }
        ]
    }
}
```

**이는 정규화된 JSON 버전과 동일합니다**:

```json
{
    "0": "cardano", // string
    "1": 14, // int
    "2": [53, 23, 53, 64, 23, 06], // bytes
    "3": ["test"], // list or array
    "4": { "key": "value" }  // Object
}
```

## 알아보기

우리는 개발자들이 **Cardano 트랜잭션 메타데이터**를 사용하여 실험하고 새로운 아이디어를 생각해내도록 이끌고 있습니다. 다음으로, 메타데이터를 포함하는 트랜잭션을 생성하는 다양한 방법을 살펴보겠습니다.

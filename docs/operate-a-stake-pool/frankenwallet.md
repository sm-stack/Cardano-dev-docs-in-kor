---
id: frankenwallet
title: Frankenwallet 시작하기
sidebar_label: Frankenwallet (USB 에어 갭)
description: An encrypted, air-gapped Linux bootable USB drive for Cardano transaction signing and airlocked access to & from the outside world
---

## Cardano(및 기타) 보안 작업을 위한 암호화된, 에어 갭 환경의 Linux USB 드라이브

Frankenwallet은 패키지, 라이브러리 또는 제품이 아니라 Cardano SPO, 토큰 채굴자, 기본 주소에 자금이 있는 사용자 및 스마트 계약 생성자가 레벨에 일반 USB 드라이브를 사용할 수 있도록 하는 일련의 설치 가이드, 보안 표준 및 템플릿입니다.

기본 컴퓨터가 이 이동식 드라이브에서 부팅되면, 보안("콜드") 구성 및 사용 프로토콜을 통해 사용자가 다음과 같은 것들을 수행할 수 있습니다.

  - 개인 키를 사용하여 안전하고 유연하게 저장 및 작업할 수 있습니다.
  - 트랜잭션에 서명하고 트랜잭션 세부 정보를 안전하게 보관할 수 있습니다.
  - 안전하지 않은 호스트 환경에서 키나 비밀번호를 공개하지 않고 암호화된 기록 및 백업을 유지할 수 있습니다.

:::warning 경고 - Linux 베테랑 전용

이러한 지침은 "이중 부팅" Linux 설치 및 기타 사용자 지정 OS 및 부팅 구성에 대한 경험이 없는 경우 따르기가 어렵거나 안전하지 않을 수 있습니다.

더 안전한 경로가 필요한 운영자는 [에어 갭 환경](/docs/get-started/air-gap) 페이지의 지침을 따를 수 있습니다.

:::

### 가이드 사용법

이 도구는 [COSD 지분 풀](https://cexplorer.io/pool/pool1e98xlcgj80c3rdmm27v5hnvrdtut52e65uk0ema7ctfag596vr2)에 의해 개발되었으며, 풀 서약을 잃거나 기존 [에어 갭 환경](/docs/get-started/air-gap)을 위한 두 번째 시스템으로 옮길 수 없는 상황에서 자신의 운영 환경을 공유하는 것으로 시작했습니다 (원본 이야기 참조: [Frankenwallet이 개발된 이유는 무엇인가요?](https://cosd.com/frankenwallet/intro/history) ).

이 글을 쓰는 시점에 다음에 대한 전체 지침은 다음과 같습니다.

  - 이 도구를 사용하려는 이유
  - 나만의 Frankenwallet을 프로비저닝하고 구축하는 방법
  - 스테이크 풀 운영 및 안전한 거래를 위한 도구 사용 방법

이러한 것들은 다음 링크에 더 자세히 설명되어 있습니다: [The Frankenwallet](https://cosd.com/frankenwallet)
이 자료에 문제가 있는 경우, 다음 링크를 통해 문제를 제출하세요.

  - [github:rphair/frankenwallet](https://github.com/rphair/frankenwallet): 이 웹 사이트의 자료에 오류가 있는 경우.
  - [github:cardano-foundation/developer-portal](https://github.com/cardano-foundation/developer-portal): 이 페이지 자체에 대한 업데이트 또는 수정 사항이 있을 경우.

이는 이러한 외부 지침에 대한 한 페이지 요약이므로, Frankenwallet이 워크플로에서 사용할 수 있는지 및 자신의 관심 및 전문 지식 수준에 따라 공식 지침을 사용할 수 있는지 확인할 수 있습니다.

### Frankenwallet의 사용 사례

➤ 개인 키 및 [안전한 트랜잭션 서명](/docs/get-started/secure-workflow), 시드 문구 또는 해커가 목표로 하는 기타 고가치 리소스(예: [지분 풀 키](/docs/operate-a-stake-pool/cardano-key-pairs))를 사용하여 작업하는 모든 사람.

➤ 두 번째 컴퓨터(예: 영구 여행자, 학생 및 하드웨어 미니멀리스트) 또는 하드웨어 지갑([하드웨어 지갑 을 원하지 않는 이유는 무엇인가요?](https://cosd.com/frankenwallet/intro/hardware-wallets)) 없이 이러한 리소스를 사용하여 높은 보안 수준 하의 작업을 원하는 사람.

➤ 에어 갭 환경에서 자신의 모든 파일에 대한 직접 액세스를 원하거나 필요로 하는 사람.

➤ 쉽게 얻을 수 있는 USB 드라이브에서 하드웨어 지갑과 동일한(또는 더 나은) 기능을 얻을 수 있는 방법을 궁금해하는 사람(암호화되고 풍부한 형식의 파일을 편집하고 암호화된 문서 아카이브를 준비할 수 있는 응용 프로그램을 갖춘 운영 체제 포함).

➤  개인 키를 저장하거나 백업하기 위해 메모리 스틱을 사용하는 중에, 암호화되지 않은 메모리 스틱의 분실 또는 도난에 대해 걱정하는 사람.

➤ AES 기반 암호화가 적절하게 사용되면 깨지지 않는 것으로 간주된다는 점을 감안할 때(즉, 네트워크에 연결된 컴퓨터에서 암호를 절대 입력하지 않는 경우), 오프사이트 또는 심지어 자신의 키, 지갑 시드 문구 및 기타 암호화폐 자산 기록의 네트워크 백업을 준비하려는 사람.

### 이렇게 보편적으로 유용하다면, 다운로드 가능한 ISO 이미지가 아닌 빌드 지침이 필요한 이유는 무엇인가요?

**세줄 요약** 왜냐하면 그러면 모든 Frankenwallet이 동일할 것이고, 그 중 하나에서 발견된 보안 결함으로 인해 응답이 마운트되기 전에 모든 Frankenwallet이 악용될 수 있기 때문입니다([Frankenwallet에 대한 ISO 이미지가 없는 이유](https://cosd.com/frankenwallet/intro/no-iso) 참조).

### 다른 사용 사례 & 이 자료의 한계점

➤ Frankenwallet 지침을 사용하여 전체 컴퓨터에서 에어 갭 노드를 설정할 *수는* 있습니다... 하지만 개발 당시부터 이 절차는 개발자 포털(앞서 언급한 [에어 갭 환경](/docs/get-started/air-gap)) 내 더 적절한 페이지에 맞게 조정되었습니다.

[Frankenwallet \> 기타 FAQ's](https://cosd.com/frankenwallet/intro/faq):

➤ 호스트 컴퓨터의 VirtualBox 또는 기타 VM 소프트웨어는 비활성화하더라도 네트워크에서 사용자를 격리 하지 않습니다... 화면이나 키보드도 격리된다고 가정할 수 없습니다... 따라서 VM은 일반적으로 에어 갭을 생성하거나 이러한 지침을 구현하기에 적합하지 않습니다.

➤ Ubuntu + GNOME은 무겁고 기본적으로 독점 소프트웨어이지만 OS 설치 및 이중 부팅 문제를 고려했을 때 범용 문서로 선택되었습니다.

➤ 호스트 컴퓨터의 BIOS를 손상시켜 Frankenwallet으로 무엇을 할 수 있는지 확인하려면 [Evil Maid](http://theinvisiblethings.blogspot.com/2009/01/why-do-i-miss-microsoft-bitlocker.html)에 대해 자세히 읽어보십시오.

## Frankenwallet 구축 준비

[Frankenwallet \> 준비](https://cosd.com/frankenwallet/prepare):

#### 호스트 컴퓨터에서 통신 준비

USB 장치 기반 운영 체제에서 부팅할 때 해당 컴퓨터의 기본 디스크도 외부 디스크인 것처럼 액세스할 수 있기 때문에, 메모리 스틱에서 파일을 이동하고 네트워크를 통해 파일을 전송하는 것을 피할 수 있습니다 (에어 갭 시스템에서는 불가능).

따라서 Frankenwallet이 암호화된 파일을 저장하는 데 사용하는 호스트 컴퓨터 내 영역(여기서는 호스트 폴더라고 함)을 계획하고 에어 갭 환경에서 준비할 트랜잭션의 미가공 데이터를 읽을 수 있습니다.

:::warning 경고

암호화된 문서 또는 아카이브를 저장하지 않은 호스트 컴퓨터에는 아무 것도 저장해서는 안 됩니다.

:::

### 하드웨어 조달

정기적으로 사용되는 Frankenwallet은 저렴하고 느린 USB 드라이브에 구축되었지만, 이 도구를 작업 흐름의 신뢰할 수 있는 일부로 만들려면 다음 중 하나를 얻어야 합니다.

  - 읽기 및 쓰기 속도 에 대한 높은 기준을 가진 메모리 스틱
  - (개인적으로 최상의 결과를 위해) SATA SSD 드라이브와 SATA-to-USB 어댑터 케이블.

이전에 이중 부팅 구성을 구축한 사용자는 동일한 유형의 설정을 예상해서 **컴퓨터의 BIOS 설정에 익숙해져야 함**을 깨달을 것입니다.

부팅 방법이 다르기 때문에 Mac을 호스트 컴퓨터로 사용하는 데는 제한이 있습니다([Frankenwallet \> What if I have a Mac?](https://cosd.com/frankenwallet/prepare/hardware) 참조).

### 비밀번호 선택

(Frankenwallet 비밀번호 \> [low security](https://cosd.com/frankenwallet/prepare/password-low) & [high security](https://cosd.com/frankenwallet/prepare/password-high))  

[낮은 보안 암호](https://cosd.com/frankenwallet/prepare/password-low)는 이미 호스트 컴퓨터에서 파일을 암호화하는 데 사용한 암호일 수 있습니다. 이는 네트워크를 통해 파일을 백업하는 데 편안하다고 느낄 만큼 강력합니다.

Frankenwallet의 비밀번호 자체라고 할 수 있는 [높은 보안 암호](https://cosd.com/frankenwallet/prepare/password-high)는 엄밀하게는 길고 복잡해야 하고, 네트워크 환경에서 사용해서는 안 되며 네트워크에 연결된 시스템에서도 사용해서는 안 됩니다. 만약 그렇지 않다면, 파일 저장 또는 호스트 컴퓨터에 파일을 백업하기 위해 Air Gap을 사용하는 그 목적성과 배치되는 것입니다.

일반적으로 암호화에 사용되는 Cardano 자산 및 지분 풀 파일을 확인하려면 이러한 각 웹 링크를 참조하십시오.

:::tip

사용 편의성을 위해 "낮은 보안" 및 "높은 보안" 스테이크 풀 파일을 두 개의 하위 디렉터리로 분리하여 두 개의 별도로 암호로 암호화된 아카이브로 백업할 수 있습니다.

::: 

## USB 장치에 OS 설치하기

([설치](https://cosd.com/frankenwallet/install) 섹션 마지막까지 [Frankenwallet \> Host computer & media](https://cosd.com/frankenwallet/prepare/computer))  

전체 지침은 주로 일반적인 "이중 부팅" 구성에서 [Ubuntu 설치](https://ubuntu.com/tutorials/install-ubuntu-desktop#1-overview)에 대해 설명합니다. 대상 청중이 편안하게 느껴야 하며, 설치 및 설정 또는 설치된 환경 중에 이러한 체크리스트를 따르면 아마도 스스로 즉흥적으로 할 수 있을 것입니다.

### 설치 참고 사항: 소프트웨어 

첫 번째 패키지 업데이트 및 소프트웨어 설치를 위해 인터넷을 사용할 것이기 때문에 아직 인터넷 연결을 끊을 필요가 없습니다.

  - 누군가는 인터넷 액세스 없이 이 작업을 수행하기를 원할 수 있습니다. 기본 OS(업그레이드 없음)만으로 편안함을 느끼고 패키지를 컴퓨터에 저장하고 거기에서 설치하여 가져오는 경우입니다.

최소 소프트웨어 설치(네트워크 필요 앱 및 게임 없음)를 선택하고 나중에 LibreOffice 패키지를 설치하면 됩니다.

이러한 블랙박스는 기관용 스파이웨어로 가득 차 있을 수 있으므로, **그래픽 및 WiFi에 대해 타사 하드웨어**를 선택 하지 마세요.

### 설치 참고 사항: 파티셔닝

**디스크 지우기 및 Ubuntu 설치**를 선택하면 고급 기능 아래에 다음과 같은 옵션이 표시됩니다.

  - LVM(Logical Volume Manager)을 사용하여 보다 유연한 디스크 사용 가능
  - 새 Ubuntu 설치 암호화를 선택
  - 드라이브 암호화 암호로 선택한 "높은 보안" 암호를 입력하십시오.

선택한 비밀번호는 이제 OS를 부팅하고 다른 장치에서 생성하는 파티션을 해독하는 데 필요합니다(따라서 부팅 하지 않을 때 드라이브가 안전함).

:::warning 경고

다음 화면에서 디스크를 지우고 Ubuntu를 설치합니다. 실수로 컴퓨터의 드라이브를 선택하지 않도록 주의하세요... 이는 매우 쉽습니다!
:::

### 설정 참고 사항: 운영 체제

  - 초기화 과정에서 Ubuntu가 온라인 계정과 연결되지 않도록 하세요: 위치 서비스, "livepatch" 등과 같은 모든 것을 거부하면 됩니다.
  - 정보를 유출할 수 있는 많은 작은 서비스 및 설정을 비활성화합니다([Frankenwallet > First boot: Secure system settings](https://cosd.com/frankenwallet/install/settings) 참조).

### 설정 참고 사항: 패키지

(세부 사항: [Frankenwallet \> First boot: Package installation](https://cosd.com/frankenwallet/install/packages))  

 - 모든 "스냅"을 제거하고 스냅을 비활성화합니다.
 - CUPS(네트워크 프린터 서비스)를 제거합니다.
 - 무인 업그레이드를 비활성화합니다.
 - 나머지 시스템을 업그레이드합니다(`apt update; apt upgrade; apt autoremove`).

### 문서 및 보안 지향 패키지 설치하기

  - `secure-delete` (실수로 암호화되지 않은 키를 쓰거나 호스트 컴퓨터 드라이브에 데이터를 보호하는 경우)
  - `LibreOffice` (AES256 암호화 문서 지원)
  - `p7zip` (AES256 암호화 아카이브 지원)

### 영원히 브라우저 조정 및 네트워크 액세스 끄기

사용하지 않을 것이라고 생각되더라도, 만일을 대비하여 브라우저 설정을 잠급니다([Frankenwallet \> Securing Firefox browser](https://cosd.com/frankenwallet/install/browser)).

이 시점에서, 시스템 설정에서 Wi-Fi 및 기타 모든 네트워크를 비활성화하고 새로운 환경에서 향후 인터넷에 연결하지 않고 계속 진행합니다.

## Frankenwallet의 용도

[Frankenwallet \> Usage](https://cosd.com/frankenwallet/usage)에서 더 많은 자료를 확인하세요.

### 안전한 트랜잭션을 준비하고 제출하기

이제 [안전한 트랜잭션 워크플로](/docs/get-started/secure-workflow)에서 권장하는 지침을 다음과 같이 수정하여 따를 수 있습니다.

  - 네트워크로 연결된 호스트 컴퓨터의 호스트 폴더에 낮은 보안 암호로 암호화된 파일을 만듭니다(인터넷을 통해 안전하게 백업할 수 있지만 거기에 키나 지갑 암호를 저장하지 않음).
  - 트랜잭션을 계획할 때, 트랜잭션 세부 정보와 잘라서 붙여넣기할 명령들을 이 파일에 저장합니다.
  - Frankenwallet으로 부팅하고 호스트 폴더로 이동합니다.
  - 트랜잭션 명령 및 트랜잭션 데이터를 복사하여 Frankenwallet 명령줄에 붙여넣습니다.
  - 결과 트랜잭션 파일을 호스트 폴더에 저장합니다.
  - 호스트 컴퓨터를 재부팅하고, 필요한 경우 거래 파일을 업로드하고 제출합니다.

기본 Cardano 거래를 위한 일부 복사-붙여넣기 모델 및 템플릿은 [Frankenwallet > 거래 템플릿](https://cosd.com/frankenwallet/cardano/templates)에서 조합되고 있습니다.


### 자산 및 키 백업을 만들고 검증하기

[Frankenwallet \> Backups to host machine](https://cosd.com/frankenwallet/usage/backups) 참조:

[매우 안전한 스테이크 풀 및 자산 파일](https://cosd.com/frankenwallet/prepare/password-high), 지갑 키 구문 또는 원시 개인 키 데이터를 저장하는 모든 문서의 경우:

  - 먼저 "높은 보안" 비밀번호를 사용하여 파일 아카이브(7z 사용) 또는 텍스트 문서(LibreOffice 사용)를 만듭니다.
  - 그런 다음 호스트 폴더에 복사하여 저장하거나 다른 모든 컴퓨터의 데이터와 함께 백업(원하는 경우 네트워크를 통해)할 수 있습니다.
  - **호스트 컴퓨터나 다른 컴퓨터에 Frankenwallet(높은 보안) 비밀번호를 입력한 적이 없고 앞으로도 입력하지 않을 것이기 때문에** 이는 안전합니다.
  - 즉, 이 백업 또는 다른 Frankenwallet에서만 이러한 백업을 확인할 수 있습니다. 호스트 컴퓨터 환경 자체에서는 절대 확인할 수 없습니다!

[덜 안전한 스테이크 풀 및 자산 파일](https://cosd.com/frankenwallet/prepare/password-low), 일반 거래 기록 및 소스 데이터가 포함된 문서의 경우:

  - 먼저 "높은 보안" 비밀번호를 사용하여 파일 아카이브(7z 사용) 또는 텍스트 문서(LibreOffice 사용)를 만듭니다.
  - 이러한 파일은 호스트 컴퓨터에서 편안하게 확인할 수 있습니다.
  - 덜 긴급한 스테이크 풀 파일(예: 확인 키, 노드 카운터)의 경우 일반 암호화 비밀번호와 "높은 보안" 비밀번호 사이에 "보안 수준"이 있는 두 번째 전용 비밀번호를 제공할 수 있습니다. 이를 자산 및 스테이크 풀 공개 키의 목적으로 사용하십시오.

### Frankenwallet: 크립토 지갑을 위한 샌드박스

[Frankenwallet \> Cool environments](https://cosd.com/frankenwallet/cool) 참조:

인터넷 환경을 완화하면(**이 장치를 더 이상 콜드, 암호화되지 않은 키 저장소로 사용해서는 안 된다는 것을 의미합니다**) 이 장치를 노드 또는 브라우저 기반 지갑으로 사용할 수 있습니다.

저대역폭 메모리 스틱도 리소스 집약적인 Daedalus 노드 지갑과 함께 사용하는 테스트를 거쳤으며, 여전히 작동합니다. 그러나 노드 지갑은 동기화가 매우 느립니다... 특히 Frankenwallet이 "일일 드라이버" 컴퓨터에서 부팅되고 그 동안 다른 용도로 사용할 수 없는 경우에 그렇습니다.

브라우저 기반 지갑의 경우 성능이 더 좋아질 것입니다. 하지만 Firefox(또는 다른 브라우저) 구성은 일부 기관 또는 확장 스파이웨어가 키를 손상시킬 가능성을 피하기 위해 필수적입니다.

두 경우 모두 Frankenwallet을 사용하여 **지갑 키 문구를 호스트 컴퓨터의 암호화된 파일에 복사**할 수 있습니다. 따라서 호스트 컴퓨터에 입력한 적이 없는 비밀번호로 키 문구를 기록할 수 있습니다.

또한 이 "멋진" 환경에서 인터넷 연결을 허용한 후에는 보안 격리가 완료된 것으로 간주할 수 없습니다. 그렇지만 이 "샌드박스"는 여전히 노드나 브라우저를 실행했을 때 발생할 수 있는 노출의 수준보다 낫습니다.

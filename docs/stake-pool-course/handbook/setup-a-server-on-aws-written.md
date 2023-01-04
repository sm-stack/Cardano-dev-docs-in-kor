---
id: setup-a-server-on-aws-written
title: AWS에서 Linux 서버 설정
sidebar_label: AWS에서 Linux 서버 설정
description: "Stake pool course: Learn how to setup Linux server on AWS."
image: ../img/og/og-developer-portal.png
--- 

Linux (또는 VirtualBox)를 실행하는 컴퓨터가 없는 경우, Amazon Web Services (AWS) 를 사용하여 Linux를 실행하는 클라우드 기반 가상 머신을 무료로 만들 수 있습니다. 이렇게 하려면 다음 단계를 따르세요.

* 아직 계정이 없다면 [Amazon Web Services \(AWS\)](https://aws.amazon.com/)로 이동하여 계정을 만드세요. 
*  _AWS Management Console_ 로 이동합니다.
* _EC2 Dashboard_ 로 이동합니다.

![img](../../../static/img/stake-pool-course/setup-aws-1.png)

* 실행 중인 인스턴스가 이미 있는 경우 9단계로 이동합니다.
*먼저 충분한 하드 드라이브 공간 ( 최소 24GB ) 을 확보해야 합니다. _Volumes_ 를 클릭합니다 .

![img](../../../static/img/stake-pool-course/setup-aws-2.png)

* _Actions_ 아래에 있는  _Modify Volume_ 을 선택합니다.

![img](../../../static/img/stake-pool-course/setup-aws-3.png)

* _Modify Volume_ 대화 상자에서 크기 24를 선택하고, _Modify_ 를 클릭합니다.

![img](../../../static/img/stake-pool-course/setup-aws-4.png)

* _EC2 대시보드_ 로 돌아갑니다.

![img](../../../static/img/stake-pool-course/setup-aws-5-dashboard.png)

* _Launch Instance_ 으로 이동합니다.

![img](../../../static/img/stake-pool-course/setup-aws-6-launch-instance.png)

* Amazon 머신 이미지로, _Amazon Linux 2 \(HVM\), SSD Volume Type_, 64-bit \(x86\) 를 선택합니다.

![img](../../../static/img/stake-pool-course/setup-aws-7-choose.png)

* 인스턴스 유형으로 _t2.medium_ 을 선택한 다음, _Review and Launch_ 를 클릭하고 마지막으로 다음 화면에서 _Launch_ 를 클릭합니다.

![img](../../../static/img/stake-pool-course/setup-aws-8-instance-type.png)

* 키 쌍을 만듭니다(또는 기존 것을 사용합니다).

![img](../../../static/img/stake-pool-course/setup-aws-9-key-pair.png)

* 인스턴스에 연결합니다(_Connect_).

![img](../../../static/img/stake-pool-course/setup-aws-10-connect.png)

* _EC2 Instance Connect_ 연결 방식을 선택합니다.

![img](../../../static/img/stake-pool-course/setup-aws-11-connect-2.png)

축하합니다! 이제 Linux를 실행하는 시스템에 액세스할 수 있습니다!

:::tip 질문이나 제안 사항
수업을 듣는 동안 질문이나 제안 사항이 있는 경우, [Cardano forum에 질문](https://forum.cardano.org/c/staking-delegation/setup-a-stake-pool/158)해 주시면 최대한 빨리 답변해 드리겠습니다.
:::
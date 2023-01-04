---
id: testnet-faucet
title: Testnet Faucet
sidebar_label: Testnet Faucet
description: Request some test ada (tAda) from the Cardano testnet faucet.
image: ../img/og/og-developer-portal.png
--- 

Testnet Faucet은 Cardano 테스트넷 사용자에게 test ada(tAda)를 제공하는 서비스입니다. 이러한 토큰은 가치가 없지만, 사용자가 메인넷에서 실제 ada를 지출하지 않고도 Cardano 테스트넷의 기능을 실험해볼 수 있도록 합니다. test ada를 사용하여 [네이티브 토큰을 발행](../native-tokens/minting)하거나, [Cardano 지갑의 기능을 실험하거나](creating-wallet-faucet) [스테이크 풀 운영을 배우는](../operate-a-stake-pool/) 등의 작업을 해볼 수 있습니다.

## Testnets faucet

이 포털을 통해 test ada를 지갑으로 보낼 수 있습니다. [여기](https://docs.cardano.org/cardano-testnet/tools/faucet)에서 액세스할 수 있습니다.

:::note test ada 반환
다음 주소로 test 토큰을 보내세요:  `addr_test1qqr585tvlc7ylnqvz8pyqwauzrdu0mxag3m7q56grgmgu7sxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknswgndm3`
:::

## test ada 얻는 방법
1. 환경을 정의하세요. `preview` 또는 `prepod testnet`에 대해 tAda를 얻을 수 있습니다.
2. 할 것을 정의하세요. 이 경우 `Receive test ada`를 누르면 됩니다. 만약 풀을 운영하고 있다면, `pool delegation`에 대해서도 요청할 수 있습니다([여기](https://developers.cardano.org/docs/operate-a-stake-pool/)에서 자세히 알아보세요).
3. 자금을 받으려는 계정의 주소를 입력하세요.
4. API 키를 발급받은 경우, 이를 입력하여 할당되었을 수 있는 추가 자금에 액세스할 수 있습니다.
5. 필요한 경우 `I'm not a robot` 박스를 클릭하고 캡챠를 풉니다.
6. `Request`를 클릭하면 자금이 몇 분 안에 지정한 테스트넷 계정에 입금됩니다. Cardano 테스트넷에서 트랜잭션을 확인하려면 [Cardano 테스트넷 익스플로러](https://explorer.cardano-testnet.iohkdev.io/)를 사용하세요.

<!-- Commented iframe, but please feel free to test the w x h to fit it to the browser -->
<!-- <div id="faucetcontainer">
<iframe name="iframe" height="500" width="150%" src="https://testnets.cardano.org/en/testnets/cardano/tools/faucet/" class="faucet"></iframe>
</div> -->





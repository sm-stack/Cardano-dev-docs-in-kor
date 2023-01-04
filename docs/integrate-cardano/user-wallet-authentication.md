---
id: user-wallet-authentication
title: Cardano 지갑으로 사용자 인증
sidebar_label: 사용자 지갑 인증
description: Full example on authenticating users on the web with their Cardano wallet.
image: ../img/og/og-developer-portal.png
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 개요

이 가이드는 [CIP-30](/docs/governance/cardano-improvement-proposals/CIP-0030)이 호환되는 지갑 앱으로 웹에서 사용자를 인증하기 위해 [CIP-08](/docs/governance/cardano-improvement-proposals/CIP-0008)에서 설명된 *메세지 서명* 을 구현하는 방법에 대한 설명입니다. 

:::note

이 안내서에는 프론트엔드와 백엔드라는 두 가지 구성 요소가 사용됩니다. 이 예제를 구현하여면 사용자가 제출한 서명된 메세지를 수신하고 처리할 백엔드 구성 요소를 실행하기 위해 [nodejs](https://nodejs.org) 서버가 필요합니다.

:::

## 사용 사례

다음은 이를 사용할 수 있는 몇 가지 예시입니다.

1. 독점 컨텐츠 혹은 서비스에 대한 액세스 권한을 부여하기 위해 특정 네이티브 토큰의 소유자인지 인증하는 경우
2. 일부 화이트리스트에 등록하기 위해 지갑 또는 스테이크 주소 소유자인지 인증하는 경우
3. 네이티브 토큰 보상 청구 시 지갑 또는 스테이크 주소 소유자인지 인증하는 경우

## 코딩 시간

위에서 언급했듯이, 이 예시에는 프론트엔드와 백엔드라는 두 가지 구성 요소가 있습니다. 프론트엔드 코드는 사용자와의 상호작용을 처리하여 지갑으로 서명하라는 메세지를 표시합니다. 서명된 메세지는 백엔드로 제출되어 구문분석 후 서명을 확인하는 작업을 거칩니다.

이 예시에서는, 사용자에게 `account: `라는 문자열과 지갑의 bech32 스테이크 주소를 담은 간단한 텍스트 메세지에 서명하라고 요청할 것입니다. 예를 들어:

`account: stake1uynpv0vlulhufm8txwry0da9qq6tn9wn42mxltq65pw403qvdcveh`

이 경우, 목적은 해당 사용자가 주어진 스테이크 주소의 소유자인지 증명하는 것입니다.

또한 단순함을 위해, 이 예시에서는 [Typhon 지갑](https://typhonwallet.io)과만 상호작용할 것입니다. 그러나 여기에 표시된 개념들은 다른 모든 [CIP-30](/docs/governance/cardano-improvement-proposals/CIP-0030) 호환 지갑 어플리케이션에서도 똑같이 동작해야 합니다.

### 프론트엔드

간결성을 위해, 우리의 프론트엔드는 사용자가 클릭하면 프로세스를 시작하는 단일 버튼을 포함하는 단순한 HTML 페이지입니다.

```html title="index.html"
<html>
    <head>
        <title>Authenticating users with their Cardano wallet</title>
        <script src="userWalletAuth.js"></script>
    </head>
    <body>
        <button id="login-btn">Login</button>        
    </body>
</html>
```

위 버튼의 클릭 이벤트를 처리하는 로직은 별도의 Javascript 파일에 있습니다. 이것이 우리가 프론트엔드에 대해 작업할 부분입니다. 다음과 같이 시작해 봅시다.

```js title="userWalletAuth.js"
window.addEventListener("load", () => {
    const loginBtn = document.querySelector("#login-btn");
    loginBtn.addEventListener("click", authenticate);
})

async function authenticate(){
    //
}
```

지금은, 버튼에 이벤트 수신자를 달아서 클릭하면 `authenticate` 함수를 호출하는 방식을 사용하였습니다.

`authenticate`에 기능을 추가하기 전에, 몇 가지 의존성을 가져와야 합니다. `userWalletAuth.js` 맨 위에 다음을 추가해 보겠습니다.

```js title="userWalletAuth.js"
import { Buffer } from "buffer";
let csl, wallet;

async function loadCsl(){
    csl = await import("@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib");
};
loadCsl();

...
```

위 줄을 사용하여 나머지 스크립트, [Buffer](https://www.npmjs.com/package/buffer) 패키지 및 [Cardano 직렬화 라이브러리](/docs/get-started/cardano-serialization-lib/overview)를 사용할 수 있도록 만들었습니다. 또한, 나중의 편의를 위해 변수 `wallet`을 선언하였습니다. 해당 변수의 값은 다음 단계에서 설정할 것입니다.

이제 `authenticate` 함수가 실제로 몇 가지 작업을 수행하도록 만들어 봅시다.

```js title="userWalletAuth.js"
...

async function authenticate(){
    if (!csl) await loadCsl(); // make sure CSL is loaded before doing anything else.

    wallet = await window.cardano.typhoncip30.enable();

    const [stakeAddrHex, stakeAddrBech32] = await getStakeAddress();
    const messageUtf = `account: ${stakeAddrBech32}`;
    const messageHex = Buffer.from(messageUtf).toString("hex");    
    const sigData = await wallet.signData(stakeAddrHex, messageHex);
    const result = await submitToBackend(sigData);
    alert(result.message);
}
```

이 `authenticate` 함수는 이제 hex 및 bech32 형식으로 사용자의 스테이크 주소를 가져옵니다. 그런 다음 사용자에게 서명을 요청하는 메세지를 함께 넣습니다. 메세지를 16진수 문자열로 변환한 후, 사용자의 지갑에 대해 `signData` 메서드를 호출하여 서명하라는 메세지를 표시합니다. 서명된 메세지를 받으면 처리 및 확인을 위해 백엔드 구성 요소로 보냅니다.

`authenticate` 함수에서 두 개의 함수를 더 호출했음을 눈치 채셨을 것입니다. 이를 코드에도 추가하여야 합니다.

```js title="userWalletAuth.js"
...

async function getStakeAddress(){
    const networkId = await wallet.getNetworkId();
    const changeAddrHex = await wallet.getChangeAddress();
    
    // derive the stake address from the change address to be sure we are getting
    // the stake address of the currently active account.
    const changeAddress = csl.Address.from_bytes( Buffer.from(changeAddrHex, 'hex') );
    const stakeCredential = csl.BaseAddress.from_address(changeAddress).stake_cred();
    const stakeAddress = csl.RewardAddress.new(networkId, stakeCredential).to_address();

    return [stakeAddress.to_hex(), stakeAddress.to_bech32()];
}

async function submitToBackend(sigData){
    const result = await fetch(`http://localhost:8081/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sigData),
    });
    return result.json();
}
```

이것으로 프론트엔트 코드가 완성됩니다. [여기](https://github.com/inimrod/cardano-message-signing-demo/blob/main/frontend/js/userWalletAuth.js)에서 전체 내용을 볼 수 있습니다.
That completes our front-end code. It can be viewed in full [here](https://github.com/inimrod/cardano-message-signing-demo/blob/main/frontend/js/userWalletAuth.js).


### 백엔드

백엔드의 경우, `server.js`로 이름이 지정된 파일을 만들고 필요한 의존성을 가져옵니다.

```js title="server.js"
const { Buffer } = require("buffer");
const { COSESign1, COSEKey, BigNum, Label, Int } = require("@emurgo/cardano-message-signing-nodejs");
const { Ed25519Signature, RewardAddress, PublicKey, Address } = require("@emurgo/cardano-serialization-lib-nodejs");
const express = require("express");
const cors = require("cors");
```

여기서는 프론트엔드에서 `POST` 요청을 받을 수 있는 간단한 [Express JS](https://expressjs.com) 서버를 만들 것입니다. 다른 것들과 마찬가지로, `cardano-message-signing` 및 `cardano-serialization-lib` 패키지에서 몇 가지 필수 클래스를 가져왔습니다.

이제 스테이크 주소로 식별되는 앱 내 "등록된 사용자"의 샘플 목록을 만들어 보겠습니다.

```js title="server.js"
...

const registeredUsers = [
    "stake1uyzu7upg082rqajwasmwgam09fe7yj2cm3fkdfecqgptg8cwuze7s",
    "stake1u8k7mwu8gdqyvgved89996cy6g8d9vw36w7j05qy2etanxgmgl5s7",
    "stake1uynpv0vlulhufm8txwry0da9qq6tn9wn42mxltq65pw403qvdcveh",
    "stake1uxa2x4andawqtcqxw9gy4mamdx6extq5g5grqq6pf7zpxxge4aa7l",
    "stake1ux8yttnhy6qm9lkehvnmlhufnx38ef2q8vl6xyu8gyk0zwc83nvxh",
    "stake1uykkptznwz0jd3flwa442a0cdmfrpwhg8pa9ypytf4cwacqw2085c"
]
```

다름으로, 프론트엔드에서 요청을 수신할 한 개의 엔드포인트가 있는 `express` 서버를 만듭니다.

```js title="server.js"
...

const app = express();
app.use(express.json());
app.options("*", cors());
app.use(cors({
    origin: "*"
}));

app.post("/login", authenticate);
app.listen(8081, () =>
  console.log("Backend component listening on port 8081!"),
);
```

위 코드는 `authenticate` 핸들러 함수를 실행하는 `/login` 엔드포인트를 추가합니다. 이제 해당 함수를 추가해보겠습니다.

```js title="server.js"
...

async function authenticate(req, res) {
    const sigData = req.body;
    const decoded = COSESign1.from_bytes( Buffer.from(sigData.signature, "hex") );
    const headermap = decoded.headers().protected().deserialized_headers();
    const addressHex = Buffer.from( headermap.header( Label.new_text("address") ).to_bytes() )
        .toString("hex")
        .substring(4);
    const address = Address.from_bytes( Buffer.from(addressHex, "hex") );

    const key = COSEKey.from_bytes( Buffer.from(sigData.key, "hex") );
    const pubKeyBytes = key.header( Label.new_int( Int.new_negative(BigNum.from_str("2")) ) ).as_bytes();
    const publicKey = PublicKey.from_bytes(pubKeyBytes);

    const payload = decoded.payload();
    const signature = Ed25519Signature.from_bytes(decoded.signature());
    const receivedData = decoded.signed_data().to_bytes();

    const signerStakeAddrBech32 = RewardAddress.from_address(address).to_address().to_bech32();
    const utf8Payload = Buffer.from(payload).toString("utf8");
    const expectedPayload = `account: ${signerStakeAddrBech32}`; // reconstructed message

    // verify:
    const isVerified = publicKey.verify(receivedData, signature);
    const payloadAsExpected = utf8Payload == expectedPayload;
    const signerIsRegistered = registeredUsers.includes(signerStakeAddrBech32);

    const isAuthSuccess = isVerified && payloadAsExpected && signerIsRegistered;

    res.send({
        success: isAuthSuccess,
        message: isAuthSuccess ? "✅ Authentication success!" : "❌ Authentication failed."
    })
}
```

여기서 일어난 일을 알아봅시다.

먼저 사용자가 제출한 직렬화된 서명을 디코딩했습니다. 이 디코딩된 데이터의 헤더에서 사용자의 주소를 얻을 수 있습니다. 이를 나중에 다시 bech32 형식으로 변환하여 예상되는 메세지 문자열을 재구성할 것입니다.

그런 다음 사용자의 서명과 함께 제공된 `key`의 `PublicKey` 인스턴스를 생성했습니다. 나중에 이를 사용하여 제출된 서명을 확인합니다.

또한 디코딩된 서명 데이터에서 `payload`도 분석하였습니다. 예상된 메세지 문자열을 재구성한 뒤, 이를 실제로 받은 `payload`와 비교합니다.

이미 서명자의 스테이크 주소를 가지고 있기 때문에, `registeredUsers` 목록과 대조하여 확인합니다.

마지막으로, 세 가지 검사가 모두 통과되면 성공 메세지와 함께 사용자에게 응답을 보내고, 그렇지 않다면 실패 메세지를 보냅니다.

그러면 백엔드 구성 요소가 완성됩니다. 전체 코드는 [여기](https://github.com/inimrod/cardano-message-signing-demo/blob/main/backend/server.js)에서 볼 수 있습니다.


### 데모 프로젝트 레퍼지토리

위 코드를 빠르고 편리하게 테스트하기 위해, [여기](https://github.com/inimrod/cardano-message-signing-demo)에서 복제하고 빠르게 실행할 수 있는 데모 프로젝트를 사용할 수 있습니다.

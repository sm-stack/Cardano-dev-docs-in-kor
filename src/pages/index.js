import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import PortalHero from "./portalhero";
import OpenStickyButton from "../components/buttons/openStickyButton";

const features = [
  {
    title: "시작하기",
    imageUrl: "img/card-get-started.svg",
    targetUrl: "docs/get-started/",
    description: (
      <>
        Cardano의 개요 정보를 얻고, 구성 요소를 이해하며, 개발자 도구를 발견하고,
        기술 개념을 배우며 개발자 커뮤니티에 참여하세요.
      </>
    ),
  },
  {
    title: "Cardano 통합하기",
    imageUrl: "img/card-integrate-cardano.svg",
    targetUrl: "docs/integrate-cardano/",
    description: (
      <>
        Cardano 지갑을 알아보고 어플리케이션과 웹사이트에 Cardano를 통합하는
        방법에 대해 알아보세요.
      </>
    ),
  },
  {
    title: "트랜잭션 메타데이터 빌딩하기",
    imageUrl: "img/card-transaction-metadata.svg",
    targetUrl: "docs/transaction-metadata/",
    description: (
      <>
        트랜잭션 메타데이터가 무엇인지, 이를 트랜잭션에 어떻게 추가하는지, 그리고
        메타데이터를 보는 방법은 무엇이고 사용 사례는 무엇이 있는지 알아보세요.
      </>
    ),
  },
  {
    title: "네이티브 토큰 알아보기",
    imageUrl: "img/card-native-tokens.svg",
    targetUrl: "docs/native-tokens/",
    description: (
      <>
        네이티브 토큰이 무엇인지, 어떻게 발행하는지, NFT는 어떻게 생성하는지, 그리고
        왜 이를 위한 스마트 컨트랙트가 필요없는지 읽어보세요.
      </>
    ),
  },
  {
    title: "스마트 컨트랙트 생성하기",
    imageUrl: "img/card-smart-contracts.svg",
    targetUrl: "docs/smart-contracts/",
    description: (
      <>
        Marlowe와 Plutus에 대해 알아보고 Cardano에서 스마트 컨트랙트를 생성하는 방법에 대해 알아보세요.
      </>
    ),
  },
  {
    title: "거버넌스 참여하기",
    imageUrl: "img/card-governance.svg",
    targetUrl: "docs/governance/",
    description: (
      <>
        거버넌스는 Cardano 개선 제안(CIP), 프로젝트 자금 지원 및 네트워크 매개변수를 포함하는 
        필수 주제입니다.
      </>
    ),
  },
  {
    title: "스테이크 풀 운영하기",
    imageUrl: "img/card-operate-a-stake-pool.svg",
    targetUrl: "docs/operate-a-stake-pool/",
    description: (
      <>
        기술 및 마케팅 관점에서 스테이크 풀 운영자가 되기 위해 필요한 것들을 알아보세요.
      </>
    ),
  },
];

function Feature({ imageUrl, title, description, targetUrl }) {
  const imgUrl = useBaseUrl(imageUrl); // not used right now
  const trgUrl = useBaseUrl(targetUrl);
  return (
    <div className={clsx("col col--4", styles.featurePadding)}>
      {targetUrl && (
        <Link className="navbar__link" to={trgUrl}>
          <div className="card">
            <div className="card__header">
              {imgUrl && (
                <div className="text--center">
                  <img
                    className={styles.featureImage}
                    src={imgUrl}
                    alt={title}
                  />
                </div>
              )}
              <h3>{title}</h3>
            </div>
            <div className="card__body">
              <p>{description}</p>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout description="Cardano 개발자 포털">
      <PortalHero
        title={siteConfig.title}
        description={siteConfig.tagline}
        cta={'시작하기'}
        url={useBaseUrl("docs/get-started/")}
      />
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <OpenStickyButton/>
    </Layout>
  );
}

export default Home;

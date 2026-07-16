import type { Metadata } from "next";
import Link from "next/link";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Disclaimer · XingAI Engineering Communication Coach",
  description:
    "Disclaimer for XingAI Engineering Communication Coach — practice only, not certified assessment.",
  alternates: { canonical: "/legal/disclaimer" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="legal-section">
      <h2>{title}</h2>
      <div className="legal-body">{children}</div>
    </section>
  );
}

export default function DisclaimerPage() {
  const updated = "2026-07-16";
  return (
    <main className="legal-page">
      <p className="legal-back">
        <Link href="/">← Engineering Communication Coach</Link>
      </p>

      <article className="legal-article" lang="en">
        <h1>Disclaimer</h1>
        <p className="legal-updated">Last updated: {updated}</p>
        <Section title="1. Educational practice only">
          <p>
            Reviews, polished rewrites, scores, and phrases are AI- or rule-generated
            suggestions for communication practice. They are not a certified language
            exam, immigration evidence, or professional career coaching.
          </p>
        </Section>
        <Section title="2. Verify before you send">
          <p>
            Always review suggested wording before posting to coworkers, managers, or
            external partners. You remain responsible for accuracy, tone, and any
            confidential content you choose to include.
          </p>
        </Section>
        <Section title="3. AI limitations">
          <p>
            Models and heuristics can be wrong, incomplete, or culturally mismatched.
            Prefer your judgment for high-stakes messages.
          </p>
        </Section>
        <Section title="4. No warranty">
          <p>Provided “as is” without warranty. XingAI accepts no liability for reliance on outputs.</p>
        </Section>
        <Section title="5. Contact">
          <p>
            <a href="mailto:contact@xingai.app">contact@xingai.app</a>
          </p>
        </Section>
      </article>

      <hr className="legal-hr" />

      <article className="legal-article" lang="zh-Hans">
        <h1>免责声明</h1>
        <p className="legal-updated">最后更新：{updated}</p>
        <Section title="1. 仅供练习">
          <p>评审、润色、评分与短语均为练习建议，不是认证考试、移民证明或职业辅导。</p>
        </Section>
        <Section title="2. 发送前请自行核对">
          <p>向同事、经理或外部伙伴发送前，请自行审阅建议措辞。你对准确性、语气与机密内容负责。</p>
        </Section>
        <Section title="3. AI 局限">
          <p>模型与规则可能出错或不完整。高风险邮件请以你的判断为准。</p>
        </Section>
        <Section title="4. 无担保">
          <p>按“现状”提供。XingAI 不对依赖输出造成的后果承担责任。</p>
        </Section>
      </article>

      <hr className="legal-hr" />

      <article className="legal-article" lang="ko">
        <h1>면책조항</h1>
        <p className="legal-updated">최종 업데이트: {updated}</p>
        <Section title="1. 연습 목적만">
          <p>리뷰·교정·점수·표현은 커뮤니케이션 연습용 제안이며, 공인 시험·이민 증빙·전문 커리어 코칭이 아닙니다.</p>
        </Section>
        <Section title="2. 전송 전 확인">
          <p>동료·매니저·외부에 보내기 전에 반드시 검토하세요. 정확성·톤·기밀 포함 여부는 사용자 책임입니다.</p>
        </Section>
        <Section title="3. AI 한계">
          <p>모델·규칙은 틀리거나 불완전할 수 있습니다. 중요한 메시지는 본인 판단을 우선하세요.</p>
        </Section>
        <Section title="4. 보증 없음">
          <p>“있는 그대로” 제공되며 출력 의존으로 인한 결과에 대해 XingAI는 책임지지 않습니다.</p>
        </Section>
      </article>

      <nav className="legal-nav">
        <Link href="/legal/privacy">Privacy</Link>
        <Link href="/legal/terms">Terms</Link>
      </nav>
    </main>
  );
}

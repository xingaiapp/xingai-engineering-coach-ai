import type { Metadata } from "next";
import Link from "next/link";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Terms of Service · XingAI Engineering Communication Coach",
  description: "Terms of Service for XingAI Engineering Communication Coach.",
  alternates: { canonical: "/legal/terms" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="legal-section">
      <h2>{title}</h2>
      <div className="legal-body">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  const updated = "2026-07-16";
  return (
    <main className="legal-page">
      <p className="legal-back">
        <Link href="/">← Engineering Communication Coach</Link>
      </p>

      <article className="legal-article" lang="en">
        <h1>Terms of Service</h1>
        <p className="legal-updated">Last updated: {updated}</p>
        <Section title="1. Service">
          <p>
            XingAI Engineering Communication Coach provides educational communication
            practice for engineers. Outputs are suggestions, not certified language
            assessment or professional career advice.
          </p>
        </Section>
        <Section title="2. Acceptable use">
          <p>
            Do not use the service to harass others, exfiltrate confidential data, or
            generate content you intend to present as certified professional advice.
          </p>
        </Section>
        <Section title="3. Accounts and sessions">
          <p>
            The current scaffold uses local/session storage. Operators who add
            accounts must document auth and data handling separately.
          </p>
        </Section>
        <Section title="4. No warranty">
          <p>
            The service is provided “as is” without warranties of fitness for a
            particular purpose. XingAI is not liable for decisions you make based on
            practice feedback.
          </p>
        </Section>
        <Section title="5. Contact">
          <p>
            <a href="mailto:contact@xingai.app">contact@xingai.app</a>
          </p>
        </Section>
      </article>

      <hr className="legal-hr" />

      <article className="legal-article" lang="zh-Hans">
        <h1>服务条款</h1>
        <p className="legal-updated">最后更新：{updated}</p>
        <Section title="1. 服务">
          <p>本产品提供工程师沟通练习，输出为建议，不是认证语言测评或职业建议。</p>
        </Section>
        <Section title="2. 合理使用">
          <p>请勿用于骚扰他人、外泄机密，或把输出当作认证专业意见。</p>
        </Section>
        <Section title="3. 无担保">
          <p>服务按“现状”提供。XingAI 不对基于练习反馈做出的决定承担责任。</p>
        </Section>
        <Section title="4. 联系">
          <p>
            <a href="mailto:contact@xingai.app">contact@xingai.app</a>
          </p>
        </Section>
      </article>

      <hr className="legal-hr" />

      <article className="legal-article" lang="ko">
        <h1>이용약관</h1>
        <p className="legal-updated">최종 업데이트: {updated}</p>
        <Section title="1. 서비스">
          <p>엔지니어 커뮤니케이션 연습용 교육 도구이며, 인증 시험이나 전문 커리어 조언이 아닙니다.</p>
        </Section>
        <Section title="2. 이용">
          <p>괴롭힘, 기밀 유출, 인증된 전문 의견으로의 오용을 금지합니다.</p>
        </Section>
        <Section title="3. 보증 없음">
          <p>서비스는 “있는 그대로” 제공되며, 연습 피드백에 따른 결정에 대해 XingAI는 책임지지 않습니다.</p>
        </Section>
        <Section title="4. 문의">
          <p>
            <a href="mailto:contact@xingai.app">contact@xingai.app</a>
          </p>
        </Section>
      </article>

      <nav className="legal-nav">
        <Link href="/legal/privacy">Privacy</Link>
        <Link href="/legal/disclaimer">Disclaimer</Link>
      </nav>
    </main>
  );
}

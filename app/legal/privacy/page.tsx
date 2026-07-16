import type { Metadata } from "next";
import Link from "next/link";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Privacy Policy · XingAI Engineering Communication Coach",
  description: "Privacy Policy for XingAI Engineering Communication Coach.",
  alternates: { canonical: "/legal/privacy" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="legal-section">
      <h2>{title}</h2>
      <div className="legal-body">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  const updated = "2026-07-16";
  return (
    <main className="legal-page">
      <p className="legal-back">
        <Link href="/">← Engineering Communication Coach</Link>
      </p>

      <article className="legal-article" lang="en">
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: {updated}</p>
        <Section title="1. What we collect">
          <p>
            Practice text you submit, profile settings you enter, and session-scoped
            decision records used to show reviews and recurring weak areas. Optional
            Anthropic API calls process exercise text only when an API key is
            configured by the operator.
          </p>
        </Section>
        <Section title="2. Cookies and local storage">
          <p>
            The app may store language, theme, and an anonymous session id in
            browser storage so your preferences and local practice history persist
            on this device.
          </p>
        </Section>
        <Section title="3. Sharing">
          <p>
            We do not sell personal data. If an LLM provider is configured, exercise
            content is sent to that provider solely to generate reviews. Do not
            paste secrets, credentials, or confidential employer data into practice
            responses.
          </p>
        </Section>
        <Section title="4. Retention">
          <p>
            Default scaffold storage is in-memory / browser-local. Operators who
            deploy persistent storage should document retention separately.
          </p>
        </Section>
        <Section title="5. Contact">
          <p>
            Questions:{" "}
            <a href="mailto:contact@xingai.app">contact@xingai.app</a>
          </p>
        </Section>
      </article>

      <hr className="legal-hr" />

      <article className="legal-article" lang="zh-Hans">
        <h1>隐私政策</h1>
        <p className="legal-updated">最后更新：{updated}</p>
        <Section title="1. 我们收集什么">
          <p>
            你提交的练习文本、你填写的档案设置，以及用于展示评审与反复弱点的会话级决策记录。若运营方配置了 Anthropic API，练习文本才会被发送以生成评审。
          </p>
        </Section>
        <Section title="2. Cookie 与本地存储">
          <p>应用可能在浏览器中保存语言、主题与匿名会话 ID，以便在本设备保留偏好与本地练习历史。</p>
        </Section>
        <Section title="3. 共享">
          <p>我们不出售个人数据。请勿在练习回复中粘贴密钥、凭证或雇主机密信息。</p>
        </Section>
        <Section title="4. 联系">
          <p>
            联系：<a href="mailto:contact@xingai.app">contact@xingai.app</a>
          </p>
        </Section>
      </article>

      <hr className="legal-hr" />

      <article className="legal-article" lang="ko">
        <h1>개인정보 처리방침</h1>
        <p className="legal-updated">최종 업데이트: {updated}</p>
        <Section title="1. 수집 항목">
          <p>
            제출한 연습 텍스트, 프로필 설정, 세션 범위의 의사결정 기록. 운영자가 Anthropic API를 구성한 경우에만 리뷰 생성을 위해 내용이 전송됩니다.
          </p>
        </Section>
        <Section title="2. 쿠키·로컬 저장소">
          <p>언어, 테마, 익명 세션 ID가 이 기기에 저장될 수 있습니다.</p>
        </Section>
        <Section title="3. 공유">
          <p>개인정보를 판매하지 않습니다. 연습 응답에 비밀·자격증명·기밀 정보를 넣지 마세요.</p>
        </Section>
        <Section title="4. 문의">
          <p>
            문의: <a href="mailto:contact@xingai.app">contact@xingai.app</a>
          </p>
        </Section>
      </article>

      <nav className="legal-nav">
        <Link href="/legal/terms">Terms</Link>
        <Link href="/legal/disclaimer">Disclaimer</Link>
      </nav>
    </main>
  );
}

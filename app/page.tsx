"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LANG_STORAGE_KEY,
  THEME_STORAGE_KEY,
  langLabel,
  nextLang,
  tr,
  type Lang,
} from "../lib/i18n";
import {
  DEFAULT_PROFILE,
  type DailyExercise,
  type Difficulty,
  type EnglishLevel,
  type ExerciseReview,
  type FeedbackLanguage,
  type UserLearningProfile,
} from "../lib/types";

type IconName =
  | "book"
  | "check"
  | "chevron"
  | "close"
  | "edit"
  | "flame"
  | "globe"
  | "menu"
  | "moon"
  | "panel"
  | "profile"
  | "refresh"
  | "sparkles"
  | "sun"
  | "target"
  | "trend";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z" />
      </>
    ),
    flame: (
      <path d="M12 22c4 0 7-3 7-7 0-3-1.5-5.5-4.5-8.5.2 2-1 3.5-2 4.5.2-4-2-7-5-9 0 4-2.5 6-2.5 10 0 5.5 3 10 7 10z" />
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    moon: <path d="M21 12.8A8.8 8.8 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />,
    panel: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M9 4v16" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 7v5h-5" />
        <path d="M4 17v-5h5" />
        <path d="M6.1 9A7 7 0 0 1 18 7l2 5M18 15a7 7 0 0 1-12 2l-2-5" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2z" />
        <path d="m5 15 .8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8zM19 13l.6 1.4L21 15l-1.4.6L19 17l-.6-1.4L17 15l1.4-.6z" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v3M21 12h-3" />
      </>
    ),
    trend: (
      <>
        <path d="m3 17 6-6 4 4 7-8" />
        <path d="M15 7h5v5" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function getSessionId(): string {
  if (typeof window === "undefined") return "anonymous";
  const key = "xingai_eec_session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

const englishLevels: EnglishLevel[] = ["beginner", "intermediate", "advanced"];
const difficulties: Difficulty[] = ["auto", "basic", "intermediate", "advanced"];
const feedbackLanguages: FeedbackLanguage[] = ["en", "zh", "bilingual"];

export default function Page() {
  const [lang, setLang] = useState<Lang>("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [profile, setProfile] = useState<UserLearningProfile>(DEFAULT_PROFILE);
  const [recentCategories, setRecentCategories] = useState<string[]>([]);
  const [exercise, setExercise] = useState<DailyExercise | null>(null);
  const [userResponse, setUserResponse] = useState("");
  const [review, setReview] = useState<ExerciseReview | null>(null);
  const [loadingExercise, setLoadingExercise] = useState(false);
  const [loadingReview, setLoadingReview] = useState(false);
  const [streak, setStreak] = useState(0);
  const [actionTaken, setActionTaken] = useState<"followed" | "modified" | "ignored" | null>(
    null,
  );
  const [weakAreas, setWeakAreas] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopNavOpen, setDesktopNavOpen] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const sessionId = useMemo(() => getSessionId(), []);

  useEffect(() => {
    const storedLang = localStorage.getItem(LANG_STORAGE_KEY) as Lang | null;
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as "dark" | "light" | null;
    const storedDay = Number(localStorage.getItem("xingai_eec_day") || "1");
    if (storedLang === "en" || storedLang === "zh" || storedLang === "ko") setLang(storedLang);
    if (storedTheme === "dark" || storedTheme === "light") setTheme(storedTheme);
    if (Number.isFinite(storedDay) && storedDay >= 1) {
      setProfile((p) => ({ ...p, curriculumDay: storedDay }));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = lang === "zh" ? "zh-Hans" : lang;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#1a1f2e" : "#f7f8fc");
    }
  }, [theme, lang, hydrated]);

  async function fetchExercise() {
    setLoadingExercise(true);
    setReview(null);
    setUserResponse("");
    setActionTaken(null);
    try {
      const res = await fetch("/api/exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, recentCategories }),
      });
      const data: DailyExercise = await res.json();
      setExercise(data);
      setRecentCategories((prev) => [data.category, ...prev].slice(0, 5));
    } finally {
      setLoadingExercise(false);
    }
  }

  async function submitForReview() {
    if (!exercise || !userResponse.trim()) return;
    setLoadingReview(true);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exercise, userResponse, profile, session_id: sessionId }),
      });
      const data: ExerciseReview = await res.json();
      setReview(data);
      await refreshWeakAreas();
    } finally {
      setLoadingReview(false);
    }
  }

  async function refreshWeakAreas() {
    const res = await fetch(`/api/decisions?session_id=${sessionId}&weak_areas=1&limit=30`);
    const data = await res.json();
    setWeakAreas(data.weakAreas ?? []);
  }

  async function recordAction(action: "followed" | "modified" | "ignored") {
    if (!review?.decisionId) return;
    setActionTaken(action);
    if (action !== "ignored") {
      setStreak((s) => s + 1);
      const nextDay = (profile.curriculumDay || 1) + 1;
      setProfile((p) => ({ ...p, curriculumDay: nextDay }));
      localStorage.setItem("xingai_eec_day", String(nextDay));
    }
    await fetch("/api/decisions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        id: review.decisionId,
        action_taken: action,
      }),
    }).catch(() => {});
  }

  const navItems = [
    {
      href: "#profile",
      icon: "profile" as const,
      label: tr(lang, "Profile", "设置", "설정"),
    },
    {
      href: "#practice",
      icon: "target" as const,
      label: tr(lang, "Practice", "练习", "연습"),
      primary: true,
    },
    {
      href: weakAreas.length ? "#progress" : "#practice",
      icon: "trend" as const,
      label: tr(lang, "Progress", "进度", "진행"),
    },
  ];

  return (
    <div className={`app-shell ${desktopNavOpen ? "nav-open" : "nav-collapsed"}`}>
      <aside className="desktop-side" aria-label={tr(lang, "Side navigation", "侧边导航", "측면 탐색")}>
        <button
          className="circle-select side-toggle"
          aria-label={
            desktopNavOpen
              ? tr(lang, "Collapse menu", "收起菜单", "메뉴 접기")
              : tr(lang, "Expand menu", "展开菜单", "메뉴 펼치기")
          }
          onClick={() => setDesktopNavOpen((v) => !v)}
        >
          <Icon name="panel" />
        </button>
        <nav className="desktop-side-links">
          {navItems.map((item) => (
            <a
              key={item.href + item.label}
              href={item.href}
              className={item.primary ? "primary-tab" : undefined}
              title={item.label}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="desktop-side-foot">
          <a href="/legal/privacy">{tr(lang, "Privacy", "隐私", "개인정보")}</a>
          <a href="/legal/terms">{tr(lang, "Terms", "条款", "약관")}</a>
          <a href="/legal/disclaimer">{tr(lang, "Disclaimer", "免责", "면책")}</a>
        </div>
      </aside>

      <div className="app-main-column">
        <header className="app-header">
          <button
            className="circle-select menu-trigger"
            aria-label={tr(lang, "Open menu", "打开菜单", "메뉴 열기")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Icon name="menu" />
          </button>
          <div className="brand">
            <span className="brand-mark" aria-hidden>
              <Icon name="book" size={18} />
            </span>
            <span className="brand-title">
              {tr(lang, "Engineering Communication Coach", "工程沟通教练", "엔지니어링 커뮤니케이션 코치")}
            </span>
          </div>
          <div className="header-controls">
            <button
              className="circle-select"
              aria-label={tr(lang, "Change language", "切换语言", "언어 변경")}
              onClick={() => setLang(nextLang(lang))}
            >
              {langLabel(lang)}
            </button>
            <button
              className="circle-select"
              aria-label={tr(lang, "Change theme", "切换主题", "테마 변경")}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Icon name={theme === "dark" ? "moon" : "sun"} />
            </button>
            {streak > 0 ? (
              <span className="streak-badge">
                <Icon name="flame" size={15} />
                {tr(lang, `${streak}-day streak`, `连续 ${streak} 天`, `${streak}일 연속`)}
              </span>
            ) : null}
          </div>
        </header>

        <main className="page-shell">
          <section className="hero">
            <div className="hero-copy">
              <p className="eyebrow">
                {tr(
                  lang,
                  "XingAI Engineering Communication Coach",
                  "XingAI 工程沟通与魅力教练",
                  "XingAI 엔지니어링 커뮤니케이션 코치",
                )}
              </p>
              <h1>
                {tr(
                  lang,
                  "Communicate like a senior engineer.",
                  "像资深工程师一样沟通。",
                  "시니어 엔지니어처럼 소통하세요.",
                )}
              </h1>
              <p className="hero-text">
                {tr(
                  lang,
                  "Not grammar drills — charisma, trust, conflict, and leadership English for real Azure/.NET engineering work. 10–15 minutes a day.",
                  "不是语法课——而是真实 Azure/.NET 工程场景里的信任、冲突、反馈与领导力英语。每天 10–15 分钟。",
                  "문법 드릴이 아니라 Azure/.NET 현장의 신뢰·갈등·피드백·리더십 영어. 하루 10–15분.",
                )}
              </p>
              <div className="btn-row hero-cta">
                <a className="btn btn-primary" href="#practice">
                  <Icon name="sparkles" />
                  {tr(lang, "Start today's practice", "开始今日练习", "오늘 연습 시작")}
                </a>
                <a className="btn" href="#profile">
                  <Icon name="profile" />
                  {tr(lang, "Set profile", "设置档案", "프로필 설정")}
                </a>
              </div>
            </div>
            <div className="hero-visual" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="hero-img hero-img-light"
                src="/brand/hero-bg-light-visual.png"
                alt=""
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hero-img hero-img-dark" src="/brand/hero-bg-visual.png" alt="" />
            </div>
          </section>

          <section className="card" id="profile" aria-label="Profile settings">
            <h2>
              <Icon name="profile" />
              {tr(lang, "Your profile", "你的设置", "내 설정")}
            </h2>
            <div className="form-grid">
              <label className="field">
                <span>{tr(lang, "Native language", "母语", "모국어")}</span>
                <input
                  value={profile.nativeLanguage}
                  onChange={(e) => setProfile({ ...profile, nativeLanguage: e.target.value })}
                />
              </label>
              <label className="field">
                <span>{tr(lang, "English level", "英语水平", "영어 수준")}</span>
                <select
                  value={profile.englishLevel}
                  onChange={(e) =>
                    setProfile({ ...profile, englishLevel: e.target.value as EnglishLevel })
                  }
                >
                  {englishLevels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>{tr(lang, "Current role", "当前角色", "현재 역할")}</span>
                <input
                  value={profile.currentRole}
                  onChange={(e) => setProfile({ ...profile, currentRole: e.target.value })}
                />
              </label>
              <label className="field">
                <span>{tr(lang, "Target role", "目标角色", "목표 역할")}</span>
                <input
                  value={profile.targetRole}
                  onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
                />
              </label>
              <label className="field">
                <span>{tr(lang, "Feedback language", "反馈语言", "피드백 언어")}</span>
                <select
                  value={profile.preferredFeedbackLanguage}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      preferredFeedbackLanguage: e.target.value as FeedbackLanguage,
                    })
                  }
                >
                  {feedbackLanguages.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>{tr(lang, "Difficulty", "难度", "난이도")}</span>
                <select
                  value={profile.difficulty}
                  onChange={(e) =>
                    setProfile({ ...profile, difficulty: e.target.value as Difficulty })
                  }
                >
                  {difficulties.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>{tr(lang, "Curriculum day", "课程天数", "커리큘럼 일차")}</span>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={profile.curriculumDay}
                  onChange={(e) => {
                    const day = Math.max(1, Number(e.target.value) || 1);
                    setProfile({ ...profile, curriculumDay: day });
                    localStorage.setItem("xingai_eec_day", String(day));
                  }}
                />
              </label>
            </div>
            <p className="field-hint">
              {tr(
                lang,
                "Days 1–14 follow the core curriculum; day 15+ cycles advanced topics (executive, architecture influence, incidents…).",
                "第 1–14 天为核心课程；第 15 天起进入进阶主题（高管汇报、架构影响、事故领导力等）。",
                "1–14일은 핵심 커리큘럼, 15일부터는 고급 주제(임원 보고·아키텍처 영향·장애 리더십 등)를 순환합니다.",
              )}
            </p>
          </section>

          <section className="card" id="practice" aria-label="Today's exercise">
            <h2>
              <Icon name="target" />
              {tr(lang, "Today's training", "今日训练", "오늘의 훈련")}
            </h2>
            {!exercise ? (
              <button className="btn btn-primary" onClick={fetchExercise} disabled={loadingExercise}>
                <Icon name="sparkles" />
                {loadingExercise
                  ? tr(lang, "Generating…", "生成中…", "생성 중…")
                  : tr(
                      lang,
                      `Start Day ${profile.curriculumDay}`,
                      `开始第 ${profile.curriculumDay} 天`,
                      `${profile.curriculumDay}일차 시작`,
                    )}
              </button>
            ) : (
              <>
                <div className="scenario-meta">
                  <span className={`source-badge ${exercise.source}`}>{exercise.source}</span>
                  <span>
                    Day {exercise.dayNumber}
                  </span>
                  <span>{exercise.scenarioType}</span>
                  <span>
                    {tr(lang, "difficulty", "难度", "난이도")} {exercise.difficulty}/5
                  </span>
                </div>

                <h3 style={{ marginTop: 0 }}>
                  Day {exercise.dayNumber} — {exercise.skillTitle}
                </h3>
                <p className="skill-why">
                  <strong>{tr(lang, "Today's goal: ", "今天的目标：", "오늘 목표: ")}</strong>
                  {lang === "en" ? exercise.skillTitle : exercise.skillTitleZh}
                  {" — "}
                  {exercise.skillWhyZh}
                </p>

                <p>
                  <strong>{tr(lang, "Real scenario: ", "真实场景：", "실제 시나리오: ")}</strong>
                  {exercise.scenario}
                </p>
                <p>
                  <strong>{tr(lang, "Your role: ", "你的角色：", "역할: ")}</strong>
                  {exercise.role} ·{" "}
                  <strong>{tr(lang, "Audience: ", "对方：", "청중: ")}</strong>
                  {exercise.audience}
                </p>
                <p>
                  <strong>{tr(lang, "Problem: ", "当前问题：", "문제: ")}</strong>
                  {exercise.problem}
                </p>
                <p>
                  <strong>{tr(lang, "Goal: ", "沟通目标：", "목표: ")}</strong>
                  {exercise.communicationGoal}
                </p>
                <p>
                  <strong>{tr(lang, "Risk / conflict: ", "潜在风险：", "리스크/갈등: ")}</strong>
                  {exercise.potentialRisk}
                </p>

                <p>
                  <strong>{tr(lang, "Your task: ", "你的任务：", "과제: ")}</strong>
                  {tr(
                    lang,
                    "Write 5–10 English sentences for this situation.",
                    "用英文写 5–10 句应对此场景。",
                    "이 상황에 맞는 영어 5–10문장을 작성하세요.",
                  )}
                </p>

                <div className="hints-box">
                  <div className="label">{tr(lang, "Hints", "提示", "힌트")}</div>
                  <ul className="required-points">
                    {(exercise.hints?.length ? exercise.hints : exercise.requiredPoints).map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>

                {exercise.optionalOpeningSentence ? (
                  <p className="opening-line">
                    {tr(lang, "Optional opening: ", "开头句(可选)：", "시작 문장(선택): ")}
                    {exercise.optionalOpeningSentence}
                  </p>
                ) : null}

                <p className="closing-prompt">{exercise.closingPrompt}</p>

                <label className="field" style={{ marginTop: 14 }}>
                  <span>{tr(lang, "Write 5–10 sentences", "写 5–10 句英文", "영어 5–10문장 작성")}</span>
                  <textarea
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    placeholder={tr(
                      lang,
                      "Write your response here…",
                      "在这里写下你的回答…",
                      "여기에 답변을 작성하세요…",
                    )}
                  />
                </label>

                <div className="btn-row">
                  <button
                    className="btn btn-primary"
                    onClick={submitForReview}
                    disabled={loadingReview || !userResponse.trim()}
                  >
                    <Icon name="check" />
                    {loadingReview
                      ? tr(lang, "Reviewing…", "评审中…", "리뷰 중…")
                      : tr(lang, "Submit for review", "提交评审", "리뷰 제출")}
                  </button>
                  <button className="btn" onClick={fetchExercise} disabled={loadingExercise}>
                    <Icon name="refresh" />
                    {tr(lang, "Reload day", "重新加载今日", "오늘 다시 불러오기")}
                  </button>
                </div>
              </>
            )}
          </section>

          {review ? (
            <section className="card" id="review" aria-label="Review">
              <h2>
                <Icon name="edit" />
                {tr(lang, "Line-by-line review", "逐句评审", "문장별 리뷰")}
              </h2>
              <div className="sentence-stack">
                {review.sentenceReviews.map((s, i) => (
                  <article className="sentence-review" key={i}>
                    <div className="label">{tr(lang, "Original", "用户原句", "원문")}</div>
                    <p className="original">{s.original}</p>
                    <div className="label">{tr(lang, "Improved", "改进版本", "개선")}</div>
                    <p className="improved">{s.improved}</p>
                    <div className="label">{tr(lang, "Issue", "问题", "이슈")}</div>
                    <p className="issue">{s.issue}</p>
                    <div className="label">{tr(lang, "Why more natural", "为什么更自然", "왜 더 자연스러운지")}</div>
                    <p className="why">{s.explanation}</p>
                  </article>
                ))}
              </div>

              <h2 style={{ marginTop: 18 }}>
                {tr(lang, "Three levels of improvement", "三层改进", "3단계 개선")}
              </h2>
              <div className="levels-grid">
                <div className="level-card">
                  <div className="label">Level 1 — Correct</div>
                  <p>{review.levels?.correct ?? review.polishedVersion}</p>
                </div>
                <div className="level-card">
                  <div className="label">Level 2 — Natural</div>
                  <p>{review.levels?.natural ?? review.polishedVersion}</p>
                </div>
                <div className="level-card">
                  <div className="label">Level 3 — Senior / Leadership</div>
                  <p>{review.levels?.senior ?? review.polishedVersion}</p>
                </div>
              </div>

              <h2 style={{ marginTop: 18 }}>
                {tr(lang, "Final professional version", "最终专业版本", "최종 전문 버전")}
              </h2>
              <div className="polished-box">{review.polishedVersion}</div>

              <h2 style={{ marginTop: 18 }}>
                {tr(lang, "Reusable expressions", "可复用表达", "재사용 표현")}
              </h2>
              <div className="weak-areas-table-wrap">
                <table className="review-table">
                  <thead>
                    <tr>
                      <th>English Expression</th>
                      <th>{tr(lang, "Meaning", "中文意思", "의미")}</th>
                      <th>{tr(lang, "Use when", "使用场景", "사용 장면")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(review.reusableExpressions?.length
                      ? review.reusableExpressions
                      : review.reusablePhrases.map((p) => ({
                          english: p,
                          meaningZh: "",
                          useWhen: "",
                        }))
                    ).map((e) => (
                      <tr key={e.english}>
                        <td>{e.english}</td>
                        <td>{e.meaningZh}</td>
                        <td>{e.useWhen}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 style={{ marginTop: 18 }}>
                {tr(lang, "Voice & delivery", "声音与表达", "보이스 & 전달")}
              </h2>
              <div className="polished-box voice-box">{review.voiceCoaching}</div>

              <h2 style={{ marginTop: 18 }}>
                {tr(lang, "Micro practice", "微练习", "마이크로 연습")}
              </h2>
              <p>{review.microPractice}</p>

              <h2 style={{ marginTop: 18 }}>
                {tr(lang, "Progress", "进度跟踪", "진행 추적")}
              </h2>
              <ul className="area-list">
                <li>
                  <strong>{tr(lang, "Went well: ", "今天做得好：", "잘한 점: ")}</strong>
                  {review.progress?.wentWell}
                </li>
                <li>
                  <strong>{tr(lang, "Focus: ", "最需改进：", "집중 개선: ")}</strong>
                  {review.progress?.focusArea}
                </li>
                <li>
                  <strong>{tr(lang, "Next: ", "明天建议：", "다음: ")}</strong>
                  {review.progress?.nextSkill}
                </li>
              </ul>

              <h2 style={{ marginTop: 18 }}>{tr(lang, "Score", "评分", "점수")}</h2>
              <div className="score-grid">
                {Object.entries(review.score).map(([k, v]) => (
                  <div className="score-card" key={k}>
                    <strong>{Math.round(v * 100)}%</strong>
                    <span>{k}</span>
                  </div>
                ))}
              </div>

              <div className="action-row">
                <button
                  className="btn btn-primary"
                  onClick={() => recordAction("followed")}
                  disabled={actionTaken !== null}
                >
                  {tr(lang, "Accept & advance day", "采纳并进入下一天", "수락 후 다음 날")}
                </button>
                <button
                  className="btn"
                  onClick={() => recordAction("modified")}
                  disabled={actionTaken !== null}
                >
                  {tr(lang, "Edit", "修改", "수정")}
                </button>
                <button
                  className="btn"
                  onClick={() => recordAction("ignored")}
                  disabled={actionTaken !== null}
                >
                  {tr(lang, "Reject", "拒绝", "거절")}
                </button>
              </div>
              {actionTaken ? (
                <p style={{ marginTop: 10, color: "var(--muted)", fontSize: "0.86rem" }}>
                  {tr(lang, "Recorded: ", "已记录:", "기록됨: ")}
                  {actionTaken}
                  {actionTaken !== "ignored"
                    ? tr(
                        lang,
                        ` · Next curriculum day: ${profile.curriculumDay}`,
                        ` · 下一课程日：${profile.curriculumDay}`,
                        ` · 다음 커리큘럼: ${profile.curriculumDay}일`,
                      )
                    : ""}
                </p>
              ) : null}
            </section>
          ) : null}

          {weakAreas.length > 0 ? (
            <section className="card" id="progress" aria-label="Weak areas">
              <h2>
                <Icon name="trend" />
                {tr(lang, "Recurring weak areas", "反复出现的弱点", "반복되는 약점")}
              </h2>
              <div className="weak-areas-table-wrap">
                <table className="weak-areas">
                  <thead>
                    <tr>
                      <th>{tr(lang, "Pattern", "模式", "패턴")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weakAreas.map((w) => (
                      <tr key={w}>
                        <td>{w.replaceAll("_", " ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          <section className="card" id="faq" aria-label="FAQ">
            <h2>
              <Icon name="book" />
              {tr(lang, "FAQ", "常见问题", "FAQ")}
            </h2>
            <div className="faq-list">
              <details className="faq-item" open>
                <summary>
                  {tr(
                    lang,
                    "How is this different from Grammarly?",
                    "和 Grammarly 有什么不同？",
                    "Grammarly와 무엇이 다른가요?",
                  )}
                </summary>
                <p>
                  {tr(
                    lang,
                    "Grammarly fixes grammar. This coach trains senior workplace communication: trust, conflict, feedback, and next steps in real engineering scenarios.",
                    "Grammarly 纠正语法。本教练训练资深职场沟通：信任、冲突、反馈与下一步，场景来自真实工程工作。",
                    "Grammarly는 문법을 고칩니다. 이 코치는 신뢰·갈등·피드백·다음 단계 등 시니어 직장 소통을 실제 엔지니어링 시나리오로 훈련합니다.",
                  )}
                </p>
              </details>
              <details className="faq-item">
                <summary>
                  {tr(
                    lang,
                    "How long does daily practice take?",
                    "每天练习多久？",
                    "매일 연습은 얼마나 걸리나요?",
                  )}
                </summary>
                <p>
                  {tr(
                    lang,
                    "About 10–15 minutes: one skill, one scenario, 5–10 sentences, then Level 1/2/3 review.",
                    "大约 10–15 分钟：一个技能、一个场景、写 5–10 句，再看 Correct / Natural / Senior 三层评审。",
                    "약 10–15분: 스킬 하나, 시나리오 하나, 5–10문장 작성 후 Level 1/2/3 리뷰.",
                  )}
                </p>
              </details>
              <details className="faq-item">
                <summary>
                  {tr(
                    lang,
                    "Which languages are supported?",
                    "支持哪些语言？",
                    "어떤 언어를 지원하나요?",
                  )}
                </summary>
                <p>
                  {tr(
                    lang,
                    "UI: English, 中文, 한국어. Explanations can be English, Chinese, or bilingual.",
                    "界面：English / 中文 / 한국어。讲解可为英文、中文或双语。",
                    "UI: English / 中文 / 한국어. 설명은 영어, 중국어 또는 이중 언어.",
                  )}
                </p>
              </details>
              <details className="faq-item">
                <summary>
                  {tr(
                    lang,
                    "Do I need an API key?",
                    "需要 API key 吗？",
                    "API 키가 필요한가요?",
                  )}
                </summary>
                <p>
                  {tr(
                    lang,
                    "No. A 14-day scenario bank and rule-based reviewer run offline. An Anthropic key optionally upgrades quality.",
                    "不需要。14 天场景库与规则评审可离线运行。配置 Anthropic key 可升级质量。",
                    "아니요. 14일 시나리오 뱅크와 규칙 기반 리뷰가 오프라인으로 동작합니다. Anthropic 키는 선택적으로 품질을 올립니다.",
                  )}
                </p>
              </details>
              <details className="faq-item">
                <summary>
                  {tr(
                    lang,
                    "Is this certified language assessment?",
                    "这是认证语言测评吗？",
                    "공인 언어 평가인가요?",
                  )}
                </summary>
                <p>
                  {tr(
                    lang,
                    "No. Communication practice only — not a certified exam or career advice. Verify wording before sending it.",
                    "不是。仅供沟通练习——非认证考试或职业建议。发送前请自行核实措辞。",
                    "아닙니다. 커뮤니케이션 연습용이며 공인 시험이나 커리어 조언이 아닙니다. 보내기 전 문장을 확인하세요.",
                  )}
                </p>
              </details>
            </div>
          </section>

          <p className="disclaimer">
            {tr(
              lang,
              "XingAI Engineering Communication Coach provides communication practice, not certified language assessment. Reviews may come from an offline rule-based engine or an LLM. Verify before sending suggested wording.",
              "XingAI 工程沟通教练提供的是沟通练习，不是认证语言测评。评审可能来自规则引擎或 LLM。发送建议措辞前请自行核对。",
              "XingAI 엔지니어링 커뮤니케이션 코치는 연습용이며 공인 평가가 아닙니다. 제안 문장을 보내기 전에 확인하세요.",
            )}
          </p>

          <footer className="site-footer">
            <a href="/legal/privacy">{tr(lang, "Privacy", "隐私政策", "개인정보")}</a>
            <a href="/legal/terms">{tr(lang, "Terms", "服务条款", "이용약관")}</a>
            <a href="/legal/disclaimer">{tr(lang, "Disclaimer", "免责声明", "면책조항")}</a>
            <a href="https://xingai.app">{tr(lang, "XingAI", "XingAI", "XingAI")}</a>
          </footer>
        </main>

        <nav className="bottom-nav" aria-label={tr(lang, "Primary navigation", "主导航", "주요 탐색")}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className={item.primary ? "primary-tab" : undefined}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>

      {menuOpen ? (
        <div className="drawer-layer" role="presentation" onClick={() => setMenuOpen(false)}>
          <aside
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={tr(lang, "Menu", "菜单", "메뉴")}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="drawer-header">
              <div className="brand">
                <span className="brand-mark">
                  <Icon name="book" size={18} />
                </span>
                <span>{tr(lang, "Engineering Coach", "工程教练", "엔지니어링 코치")}</span>
              </div>
              <button
                className="circle-select"
                aria-label={tr(lang, "Close menu", "关闭菜单", "메뉴 닫기")}
                onClick={() => setMenuOpen(false)}
              >
                <Icon name="close" />
              </button>
            </div>
            <nav className="drawer-links">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                  <Icon name="chevron" />
                </a>
              ))}
            </nav>
            <div className="drawer-settings">
              <button className="btn" onClick={() => setLang(nextLang(lang))}>
                <Icon name="globe" />
                {langLabel(nextLang(lang))}
              </button>
              <button
                className="btn"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Icon name={theme === "dark" ? "moon" : "sun"} />
                {tr(lang, "Theme", "主题", "테마")}
              </button>
            </div>
            <div className="drawer-legal">
              <a href="/legal/privacy" onClick={() => setMenuOpen(false)}>
                {tr(lang, "Privacy", "隐私", "개인정보")}
              </a>
              <a href="/legal/terms" onClick={() => setMenuOpen(false)}>
                {tr(lang, "Terms", "条款", "약관")}
              </a>
              <a href="/legal/disclaimer" onClick={() => setMenuOpen(false)}>
                {tr(lang, "Disclaimer", "免责", "면책")}
              </a>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

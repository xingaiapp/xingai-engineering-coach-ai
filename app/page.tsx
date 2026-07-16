"use client";

import { useEffect, useMemo, useState } from "react";
import { tr, type Lang } from "../lib/i18n";
import {
  DEFAULT_PROFILE,
  type DailyExercise,
  type Difficulty,
  type EnglishLevel,
  type ExerciseReview,
  type FeedbackLanguage,
  type UserLearningProfile,
} from "../lib/types";

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
  const [actionTaken, setActionTaken] = useState<"followed" | "modified" | "ignored" | null>(null);
  const [weakAreas, setWeakAreas] = useState<string[]>([]);

  const sessionId = useMemo(() => getSessionId(), []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

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
    const res = await fetch(
      `/api/decisions?session_id=${sessionId}&weak_areas=1&limit=30`,
    );
    const data = await res.json();
    setWeakAreas(data.weakAreas ?? []);
  }

  async function recordAction(action: "followed" | "modified" | "ignored") {
    if (!review?.decisionId) return;
    setActionTaken(action);
    if (action !== "ignored") {
      setStreak((s) => s + 1);
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

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden>
            E
          </span>
          <span>{tr(lang, "Engineering English Coach", "工程英语教练")}</span>
        </div>
        <div className="header-controls">
          <button className="circle-select" onClick={() => setLang(lang === "en" ? "zh" : "en")}>
            {lang === "en" ? "EN" : "中"}
          </button>
          <button
            className="circle-select"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "☾" : "☀"}
          </button>
          {streak > 0 ? (
            <span className="streak-badge">
              {tr(lang, `${streak}-day streak`, `连续 ${streak} 天`)}
            </span>
          ) : null}
        </div>
      </header>

      <main className="page-shell">
        <section className="hero">
          <p className="eyebrow">{tr(lang, "XingAI Engineering English Coach", "XingAI 工程英语教练")}</p>
          <h1>
            {tr(
              lang,
              "Communicate like a senior engineer.",
              "像资深工程师一样沟通。",
            )}
          </h1>
          <p className="hero-text">
            {tr(
              lang,
              "Not just fluent English — the language of engineering risk, decisions, ownership, and next steps. 10 minutes a day.",
              "不只是流利的英语——而是工程师表达风险、决策、责任和下一步的方式。每天 10 分钟。",
            )}
          </p>
        </section>

        <section className="card" aria-label="Profile settings">
          <h2>{tr(lang, "Your profile", "你的设置")}</h2>
          <div className="form-grid">
            <label className="field">
              <span>{tr(lang, "Native language", "母语")}</span>
              <input
                value={profile.nativeLanguage}
                onChange={(e) => setProfile({ ...profile, nativeLanguage: e.target.value })}
              />
            </label>
            <label className="field">
              <span>{tr(lang, "English level", "英语水平")}</span>
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
              <span>{tr(lang, "Current role", "当前角色")}</span>
              <input
                value={profile.currentRole}
                onChange={(e) => setProfile({ ...profile, currentRole: e.target.value })}
              />
            </label>
            <label className="field">
              <span>{tr(lang, "Target role", "目标角色")}</span>
              <input
                value={profile.targetRole}
                onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
              />
            </label>
            <label className="field">
              <span>{tr(lang, "Feedback language", "反馈语言")}</span>
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
              <span>{tr(lang, "Difficulty", "难度")}</span>
              <select
                value={profile.difficulty}
                onChange={(e) => setProfile({ ...profile, difficulty: e.target.value as Difficulty })}
              >
                {difficulties.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="card" aria-label="Today's exercise">
          <h2>{tr(lang, "Today's exercise", "今日练习")}</h2>
          {!exercise ? (
            <button className="btn btn-primary" onClick={fetchExercise} disabled={loadingExercise}>
              {loadingExercise
                ? tr(lang, "Generating…", "生成中…")
                : tr(lang, "Generate today's exercise", "生成今日练习")}
            </button>
          ) : (
            <>
              <div className="scenario-meta">
                <span className={`source-badge ${exercise.source}`}>{exercise.source}</span>
                <span>{exercise.category.replaceAll("_", " ")}</span>
                <span>
                  {tr(lang, "difficulty", "难度")} {exercise.difficulty}/5
                </span>
              </div>
              <h3 style={{ marginTop: 0 }}>{exercise.title}</h3>
              <p>{exercise.scenario}</p>
              <p>
                <strong>{tr(lang, "Your role: ", "你的角色:")}</strong>
                {exercise.role} · <strong>{tr(lang, "Audience: ", "受众:")}</strong>
                {exercise.audience}
              </p>
              <p>
                <strong>{tr(lang, "Goal: ", "目标:")}</strong>
                {exercise.communicationGoal}
              </p>
              <ul className="required-points">
                {exercise.requiredPoints.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              {exercise.optionalOpeningSentence ? (
                <p className="opening-line">
                  {tr(lang, "Optional opening: ", "开头句(可选):")}
                  {exercise.optionalOpeningSentence}
                </p>
              ) : null}

              <label className="field" style={{ marginTop: 14 }}>
                <span>
                  {tr(lang, "Write 5–10 sentences", "写 5–10 句英文")}
                </span>
                <textarea
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder={tr(
                    lang,
                    "Write your response here…",
                    "在这里写下你的回答…",
                  )}
                />
              </label>

              <div className="btn-row">
                <button
                  className="btn btn-primary"
                  onClick={submitForReview}
                  disabled={loadingReview || !userResponse.trim()}
                >
                  {loadingReview
                    ? tr(lang, "Reviewing…", "评审中…")
                    : tr(lang, "Submit for review", "提交评审")}
                </button>
                <button className="btn" onClick={fetchExercise} disabled={loadingExercise}>
                  {tr(lang, "New scenario", "换一个场景")}
                </button>
              </div>
            </>
          )}
        </section>

        {review ? (
          <section className="card" aria-label="Review">
            <h2>{tr(lang, "Line-by-line review", "逐句评审")}</h2>
            {review.sentenceReviews.map((s, i) => (
              <div className="sentence-review" key={i}>
                <div className="label">{tr(lang, "Original", "原句")}</div>
                <p className="original">{s.original}</p>
                <div className="label">{tr(lang, "Improved", "修改后")}</div>
                <p className="improved">{s.improved}</p>
                <p className="why">{s.explanation}</p>
              </div>
            ))}

            <h2 style={{ marginTop: 18 }}>
              {tr(lang, "Professional polished version", "专业润色版本")}
            </h2>
            <div className="polished-box">{review.polishedVersion}</div>

            <h2 style={{ marginTop: 18 }}>{tr(lang, "Reusable phrases", "可复用表达")}</h2>
            <ul className="phrase-list">
              {review.reusablePhrases.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>

            <h2 style={{ marginTop: 18 }}>
              {tr(lang, "Today's improvement areas", "今日改进点")}
            </h2>
            <ul className="area-list">
              {review.improvementAreas.map((a) => (
                <li key={a}>{a.replaceAll("_", " ")}</li>
              ))}
            </ul>

            <h2 style={{ marginTop: 18 }}>{tr(lang, "Score", "评分")}</h2>
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
                {tr(lang, "Accept", "采纳")}
              </button>
              <button
                className="btn"
                onClick={() => recordAction("modified")}
                disabled={actionTaken !== null}
              >
                {tr(lang, "Edit", "修改")}
              </button>
              <button
                className="btn"
                onClick={() => recordAction("ignored")}
                disabled={actionTaken !== null}
              >
                {tr(lang, "Reject", "拒绝")}
              </button>
            </div>
            {actionTaken ? (
              <p style={{ marginTop: 10, color: "var(--muted)", fontSize: "0.86rem" }}>
                {tr(lang, "Recorded: ", "已记录:")}
                {actionTaken}
              </p>
            ) : null}
          </section>
        ) : null}

        {weakAreas.length > 0 ? (
          <section className="card" aria-label="Weak areas">
            <h2>{tr(lang, "Recurring weak areas", "反复出现的弱点")}</h2>
            <div className="weak-areas-table-wrap">
              <table className="weak-areas">
                <thead>
                  <tr>
                    <th>{tr(lang, "Pattern", "模式")}</th>
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

        <p className="disclaimer">
          {tr(
            lang,
            "XingAI Engineering English Coach provides communication practice, not certified language assessment. Reviews may be generated by an offline rule-based engine or an LLM, depending on configuration.",
            "XingAI 工程英语教练提供的是沟通练习,不是认证语言测评。评审内容可能来自离线规则引擎或 LLM,取决于当前配置。",
          )}
        </p>
      </main>
    </div>
  );
}

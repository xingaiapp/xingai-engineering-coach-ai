import type { ExerciseCategory } from "./types";

export interface ScenarioTemplate {
  category: ExerciseCategory;
  title: string;
  scenario: string;
  role: string;
  audience: string;
  communicationGoal: string;
  requiredPoints: string[];
  optionalOpeningSentence: string;
  difficulty: number; // 1-5
}

/**
 * Deterministic scenario bank — the offline fallback for exercise
 * generation (see lib/exercise-engine.ts). Written by hand rather than
 * generated, so this product runs locally with zero API keys. When an LLM
 * key is configured, prompts.dailyExercisePrompt() can generate fresh
 * scenarios instead of rotating this fixed bank.
 */
export const SCENARIO_BANK: ScenarioTemplate[] = [
  {
    category: "bug_investigation",
    title: "Reporting an Intermittent Production Bug",
    scenario:
      "You've spent two days investigating an intermittent 500 error in the payment service. You have a strong hypothesis (a race condition under high concurrency) but no full repro yet. Your tech lead is asking for an update in today's standup.",
    role: "Backend Engineer",
    audience: "Tech Lead and team",
    communicationGoal:
      "Explain what you know, what you don't know yet, and what you need to confirm the hypothesis.",
    requiredPoints: [
      "State the current hypothesis clearly",
      "Distinguish confirmed facts from suspicion",
      "Ask for what you need (time, access, or a second pair of eyes)",
    ],
    optionalOpeningSentence: "I've made progress narrowing down the payment-service errors, but I want to walk through what's confirmed and what's still a hypothesis.",
    difficulty: 2,
  },
  {
    category: "work_item_comment",
    title: "Explaining a Scope Change on a Jira Ticket",
    scenario:
      "While implementing a ticket, you discovered the original approach won't scale past 10k rows and needs a different design. You need to update the ticket so the PM and reviewer understand why the estimate is changing.",
    role: "Software Engineer",
    audience: "PM and code reviewer (via ticket comment)",
    communicationGoal: "Justify a scope/estimate change without sounding like an excuse.",
    requiredPoints: [
      "State what changed and why",
      "Quantify the impact (time, risk)",
      "Propose next steps",
    ],
    optionalOpeningSentence: "While implementing this, I found a constraint that changes the approach — here's what I found and what I recommend.",
    difficulty: 2,
  },
  {
    category: "pr_description",
    title: "Writing a Pull Request Description for a Risky Change",
    scenario:
      "You are opening a PR that changes the retry logic for an external payment API call. The change is low-risk in testing but touches a critical path. Reviewers need enough context to review quickly and confidently.",
    role: "Senior Engineer (candidate)",
    audience: "Code reviewers",
    communicationGoal: "Give reviewers exactly what they need to assess risk fast.",
    requiredPoints: [
      "Summarize what changed and why",
      "Call out the risk area explicitly",
      "Describe how it was tested",
    ],
    optionalOpeningSentence: "This PR updates the retry logic for the payment gateway client. Here's what changed and how I tested it.",
    difficulty: 3,
  },
  {
    category: "code_review",
    title: "Giving Direct but Respectful Code Review Feedback",
    scenario:
      "A teammate submitted a PR with a database query inside a loop (N+1 pattern) that will cause performance problems at scale. You want to flag this clearly without sounding like you're attacking their competence.",
    role: "Senior Engineer",
    audience: "Teammate (PR author)",
    communicationGoal: "Flag a real risk clearly, suggest a fix, and stay collaborative.",
    requiredPoints: [
      "Name the specific issue (N+1 queries)",
      "Explain the impact at scale",
      "Suggest a concrete alternative",
    ],
    optionalOpeningSentence: "Nice work overall — one thing I want to flag before this merges is the query pattern here.",
    difficulty: 3,
  },
  {
    category: "architecture_review",
    title: "Presenting a Tradeoff in an Architecture Review",
    scenario:
      "You're proposing to use an event bus for a new notification feature instead of direct synchronous calls. The architecture review board wants to understand the tradeoff, not just the diagram.",
    role: "Software Architect (candidate)",
    audience: "Architecture review board",
    communicationGoal: "Present a tradeoff honestly, including the downside of your own recommendation.",
    requiredPoints: [
      "State the recommendation",
      "Name at least one real tradeoff or risk",
      "Explain why the tradeoff is acceptable here",
    ],
    optionalOpeningSentence: "I'm recommending an event-bus approach for this feature. Before the diagram, I want to walk through the tradeoff.",
    difficulty: 4,
  },
  {
    category: "production_incident",
    title: "Giving a Mid-Incident Status Update",
    scenario:
      "A production incident has been ongoing for 40 minutes. You are the incident commander. Leadership is asking for an update in the incident channel. You don't have a root cause yet, but you have a mitigation in progress.",
    role: "Incident Commander",
    audience: "Leadership and stakeholders (incident channel)",
    communicationGoal: "Give a calm, factual status update without over-promising or panicking.",
    requiredPoints: [
      "State current impact and severity",
      "State what is being done right now",
      "Give a realistic next update time",
    ],
    optionalOpeningSentence: "Status update: here's what we know, what we're doing, and when we'll update again.",
    difficulty: 3,
  },
  {
    category: "delivery_risk",
    title: "Raising a Delivery Risk Before a Deadline",
    scenario:
      "Your team plans to release a claims-processing feature in three weeks. The API integration is still unstable, performance testing has not started, and several external dependencies remain incomplete.",
    role: "Software Architect",
    audience: "Engineering leadership",
    communicationGoal: "Raise the risk clearly, connect it to business impact, and ask for a decision.",
    requiredPoints: [
      "Acknowledge the team's progress",
      "Explain the primary risks and business impact",
      "Ask leadership for a clear decision",
    ],
    optionalOpeningSentence: "The team has made solid progress, but I want to highlight a few risks that could affect the current delivery date.",
    difficulty: 3,
  },
  {
    category: "cross_team_dependency",
    title: "Escalating a Blocking Cross-Team Dependency",
    scenario:
      "Your feature is blocked waiting on an API contract change from another team. They haven't responded in a week and your sprint is at risk. You need to escalate without sounding like you're blaming them.",
    role: "Engineer",
    audience: "Both team leads",
    communicationGoal: "Escalate a blocker clearly while staying collaborative.",
    requiredPoints: [
      "State the dependency and current blocker",
      "State the impact on your timeline",
      "Propose a concrete next step or meeting",
    ],
    optionalOpeningSentence: "I want to flag a dependency that's now blocking our sprint, and propose a quick sync to unblock it.",
    difficulty: 3,
  },
  {
    category: "technical_disagreement",
    title: "Disagreeing With a Tech Lead's Design Decision",
    scenario:
      "Your tech lead wants to store computed values directly instead of recomputing them on read. You believe this will cause data-consistency bugs. You need to disagree respectfully and back it with reasoning.",
    role: "Engineer",
    audience: "Tech Lead",
    communicationGoal: "Disagree without being combative, using evidence and questions.",
    requiredPoints: [
      "State the disagreement clearly, not vaguely",
      "Explain the specific risk with reasoning",
      "Propose an alternative or ask a clarifying question",
    ],
    optionalOpeningSentence: "I want to raise a concern about the caching approach before we commit to it.",
    difficulty: 4,
  },
  {
    category: "stakeholder_update",
    title: "Explaining a Technical Delay to a Non-Technical Stakeholder",
    scenario:
      "A non-technical product stakeholder is asking why a 'simple' feature is taking two extra weeks. The real reason is a legacy data-migration issue. You need to explain this in plain language.",
    role: "Engineer",
    audience: "Non-technical Product Stakeholder",
    communicationGoal: "Explain a technical delay in business terms, without jargon or condescension.",
    requiredPoints: [
      "Explain the delay in plain language",
      "Connect it to what the stakeholder cares about (timeline, risk)",
      "Give a revised, realistic estimate",
    ],
    optionalOpeningSentence: "I want to give you a clear picture of why this is taking longer than expected, in plain terms.",
    difficulty: 2,
  },
  {
    category: "teams_message",
    title: "Asking for Help Without Sounding Unsure of Yourself",
    scenario:
      "You've been stuck on a deployment issue for an hour. You want to ask a senior colleague for help over Teams/Slack, in a way that sounds professional and specific, not like you're panicking.",
    role: "Engineer",
    audience: "Senior colleague (Teams/Slack)",
    communicationGoal: "Ask for help efficiently, respecting the other person's time.",
    requiredPoints: [
      "State what you're trying to do",
      "State what you've already tried",
      "Ask a specific, answerable question",
    ],
    optionalOpeningSentence: "Quick question when you have a minute — I'm stuck on a deployment issue and could use a second pair of eyes.",
    difficulty: 1,
  },
  {
    category: "professional_email",
    title: "Writing a Follow-Up Email After a Missed Meeting",
    scenario:
      "An important stakeholder missed a design review meeting where a decision was made. You need to email them a clear, concise summary and ask for their sign-off without sounding passive-aggressive.",
    role: "Engineer",
    audience: "Stakeholder (email)",
    communicationGoal: "Summarize a decision and request sign-off professionally.",
    requiredPoints: [
      "Summarize the decision made",
      "State what you need from them and by when",
      "Keep the tone neutral, not passive-aggressive",
    ],
    optionalOpeningSentence: "Since you weren't able to join today's review, I wanted to send a quick summary of what we decided.",
    difficulty: 2,
  },
  {
    category: "meeting_discussion",
    title: "Pushing Back in Sprint Planning on an Unrealistic Estimate",
    scenario:
      "During sprint planning, your manager suggests a two-day estimate for a task you believe needs at least five days, given hidden complexity you're aware of. You need to push back in the meeting, live.",
    role: "Engineer",
    audience: "Manager and team (live meeting)",
    communicationGoal: "Push back on an estimate with reasoning, in real time, without being confrontational.",
    requiredPoints: [
      "State your estimate and the reasoning",
      "Name the hidden complexity specifically",
      "Suggest a way to reduce risk (spike, split the task)",
    ],
    optionalOpeningSentence: "I want to flag that this might take longer than two days — here's the complexity I'm seeing.",
    difficulty: 3,
  },
  {
    category: "project_planning",
    title: "Communicating Options and Tradeoffs to Leadership",
    scenario:
      "Leadership asked for 'the fastest way' to ship a feature. You have two options: a fast, riskier path and a slower, safer path. You need to present both honestly instead of just picking one silently.",
    role: "Senior Engineer",
    audience: "Engineering leadership",
    communicationGoal: "Present options and tradeoffs, and make a recommendation without hiding the downside.",
    requiredPoints: [
      "Present both options briefly",
      "State the tradeoff for each",
      "Make a clear recommendation",
    ],
    optionalOpeningSentence: "There are two realistic paths here — let me walk through the tradeoff of each before recommending one.",
    difficulty: 3,
  },
  {
    category: "engineering_management",
    title: "Giving Constructive Feedback to a Direct Report",
    scenario:
      "As an engineering manager, you need to tell a direct report that their recent PRs have been taking much longer to review than expected due to scope creep, without discouraging them.",
    role: "Engineering Manager",
    audience: "Direct report (1:1)",
    communicationGoal: "Give constructive, specific feedback that focuses on the pattern, not the person.",
    requiredPoints: [
      "Name the specific, observable pattern",
      "Explain the impact on the team",
      "Offer a concrete suggestion going forward",
    ],
    optionalOpeningSentence: "I wanted to talk through something I've noticed in your last few PRs — not a criticism, just a pattern worth adjusting.",
    difficulty: 4,
  },
];

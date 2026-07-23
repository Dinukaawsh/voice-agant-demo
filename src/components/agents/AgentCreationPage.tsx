"use client";

import { useState, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  Globe,
  MessageSquare,
  Phone,
  Play,
  Plus,
  Save,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Volume2,
  ClipboardList,
  GitBranch,
  AlertTriangle,
  X,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

/* ─── Types ─── */

type AnswerType = "yesno" | "choice";

type AnswerOption = {
  id: string;
  label: string;
  route: "positive" | "negative";
};

type Recording = {
  name: string;
  duration: number;
};

type QuestionNode = {
  id: string;
  label: string;
  script: string;
  variation: string;
  answerType: AnswerType;
  answers: AnswerOption[];
  rule: string;
  failScript: string;
  recording: Recording | null;
  variationRecording: Recording | null;
  failRecording: Recording | null;
};

type OpeningSubstage = {
  id: string;
  label: string;
  script: string;
  isQuestion: boolean;
  recording: Recording | null;
};

type EdgeCaseEntry = {
  id: string;
  name: string;
  script: string;
  recording: Recording | null;
};

type AgentState = {
  name: string;
  language: string;
  description: string;
  openingSubstages: OpeningSubstage[];
  openingVariation: string;
  openingVariationRecording: Recording | null;
  retainClipScript: string;
  retainClipExitScript: string;
  retainClipRecording: Recording | null;
  questions: QuestionNode[];
  eligibilityScript: string;
  eligibilityRecording: Recording | null;
  successScript: string;
  successRecording: Recording | null;
  edgeCases: EdgeCaseEntry[];
  silenceScript: string;
  silenceRecording: Recording | null;
  extractionFields: { key: string; type: string; description: string }[];
};

type ChatMessage = {
  id: string;
  role: "user" | "agent";
  text: string;
};

/* ─── Constants ─── */

const LANGUAGES = [
  { code: "French", flag: "\u{1F1EB}\u{1F1F7}", label: "French" },
  { code: "English", flag: "\u{1F1EC}\u{1F1E7}", label: "English" },
  { code: "Spanish", flag: "\u{1F1EA}\u{1F1F8}", label: "Spanish" },
  { code: "German", flag: "\u{1F1E9}\u{1F1EA}", label: "German" },
  { code: "Italian", flag: "\u{1F1EE}\u{1F1F9}", label: "Italian" },
];

const CHAT_SUGGESTIONS = [
  "Write the opening for a senior insurance campaign",
  "Suggest 6 qualification questions",
  "Draft edge case responses",
  "Review my flow for gaps",
];

const AGENT_REPLIES = [
  "Got it — I've drafted that for you. Open the Form view to review and tweak the wording, then check the Diagram to see how the flow routes.",
  "Done. I updated the scripts to match your campaign tone. The repeat variations are filled in too — each plays once when the answer is unclear.",
  "I've made those changes. Anything routed as negative will exit through NOT ELIGIBLE; unclear answers repeat the question once with the variation.",
  "Updated! Take a look at the Diagram view — the flow now reflects your latest changes.",
];

function createDefaultYesNo(): AnswerOption[] {
  return [
    { id: "yes", label: "Yes", route: "positive" },
    { id: "no", label: "No", route: "negative" },
  ];
}

function markLastAsQuestion(subs: OpeningSubstage[]): OpeningSubstage[] {
  return subs.map((s, i) => ({ ...s, isQuestion: i === subs.length - 1 }));
}

function createQuestion(n: number): QuestionNode {
  return {
    id: `q${n}-${Date.now()}`,
    label: `Question ${n}`,
    script: "",
    variation: "",
    answerType: "yesno",
    answers: createDefaultYesNo(),
    rule: "",
    failScript: "",
    recording: null,
    variationRecording: null,
    failRecording: null,
  };
}

function createInitialState(): AgentState {
  return {
    name: "Mutuelle Senior FR",
    language: "French",
    description: "Qualifies French senior leads for individual health insurance (mutuelle santé).",
    openingSubstages: markLastAsQuestion([
      { id: "o1", label: "Greeting", script: "Bonjour, je suis Claire, conseillère mutuelle santé chez Twist Assurance.", isQuestion: false, recording: { name: "opening_greeting.wav", duration: 6 } },
      { id: "o2", label: "Context", script: "Nous avons reçu votre demande d'information concernant une complémentaire santé pour les seniors.", isQuestion: false, recording: { name: "opening_context.wav", duration: 8 } },
      { id: "o3", label: "Permission", script: "Vous avez deux minutes pour en parler ?", isQuestion: true, recording: { name: "opening_permission.wav", duration: 4 } },
    ]),
    openingVariation: "Est-ce que vous auriez un petit moment pour en discuter maintenant ?",
    openingVariationRecording: { name: "opening_variation.wav", duration: 5 },
    retainClipScript: "Je comprends, mais permettez-moi juste 30 secondes — vous pourriez économiser sur votre cotisation actuelle.",
    retainClipExitScript: "Très bien, je ne vous dérange pas plus. Excellente journée !",
    retainClipRecording: { name: "retain_clip.wav", duration: 9 },
    questions: [
      {
        id: "q1",
        label: "Q1 · Type of insurance",
        script: "Actuellement, avez-vous une mutuelle d'entreprise, la CMU, ou une mutuelle individuelle ?",
        variation: "Pour être sûr de bien comprendre : votre mutuelle actuelle est-elle individuelle, d'entreprise, ou la CMU ?",
        answerType: "choice",
        answers: [
          { id: "q1-a1", label: "individuelle", route: "positive" },
          { id: "q1-a2", label: "entreprise", route: "negative" },
          { id: "q1-a3", label: "CMU", route: "negative" },
        ],
        rule: 'must answer "individuelle"',
        failScript: "Malheureusement, cette offre est réservée aux personnes ayant une mutuelle individuelle. Merci de votre temps !",
        recording: { name: "q1_insurance_type.wav", duration: 7 },
        variationRecording: { name: "q1_variation.wav", duration: 8 },
        failRecording: { name: "q1_fail.wav", duration: 6 },
      },
      {
        id: "q2",
        label: "Q2 · Age",
        script: "Avez-vous plus de 55 ans ?",
        variation: "Puis-je vous demander si vous avez dépassé les 55 ans ?",
        answerType: "yesno",
        answers: [
          { id: "q2-yes", label: "Yes", route: "positive" },
          { id: "q2-no", label: "No", route: "negative" },
        ],
        rule: "age > 55",
        failScript: "Cette offre est réservée aux personnes de plus de 55 ans. Merci de votre temps !",
        recording: { name: "q2_age.wav", duration: 4 },
        variationRecording: { name: "q2_variation.wav", duration: 5 },
        failRecording: { name: "q2_fail.wav", duration: 5 },
      },
      {
        id: "q3",
        label: "Q3 · Preferred coverage",
        script: "Quelles couvertures vous intéressent le plus : dentaires, optiques, hospitalisations, ou soins courants ?",
        variation: "Parmi dentaire, optique, hospitalisation ou soins courants, qu'est-ce qui compte le plus pour vous ?",
        answerType: "choice",
        answers: [
          { id: "q3-a1", label: "dentaires", route: "positive" },
          { id: "q3-a2", label: "optiques", route: "positive" },
          { id: "q3-a3", label: "hospitalisations", route: "positive" },
          { id: "q3-a4", label: "soins courants", route: "positive" },
        ],
        rule: "",
        failScript: "",
        recording: null,
        variationRecording: null,
        failRecording: null,
      },
      {
        id: "q4",
        label: "Q4 · Family status",
        script: "Êtes-vous célibataire, marié(e) ou divorcé(e) ?",
        variation: "Quelle est votre situation familiale actuelle ?",
        answerType: "choice",
        answers: [
          { id: "q4-a1", label: "célibataire", route: "positive" },
          { id: "q4-a2", label: "marié(e)", route: "positive" },
          { id: "q4-a3", label: "divorcé(e)", route: "positive" },
        ],
        rule: "",
        failScript: "",
        recording: null,
        variationRecording: { name: "q4_variation.wav", duration: 4 },
        failRecording: null,
      },
      {
        id: "q5",
        label: "Q5 · Billing",
        script: "Votre cotisation actuelle dépasse-t-elle les 100 euros par mois ?",
        variation: "Payez-vous plus de 100 euros par mois pour votre mutuelle actuelle ?",
        answerType: "yesno",
        answers: [
          { id: "q5-yes", label: "Yes", route: "positive" },
          { id: "q5-no", label: "No", route: "negative" },
        ],
        rule: "> 100€ / month",
        failScript: "Cette offre concerne les cotisations supérieures à 100€ par mois. Merci de votre temps !",
        recording: { name: "q5_billing.wav", duration: 5 },
        variationRecording: { name: "q5_variation.wav", duration: 5 },
        failRecording: { name: "q5_fail.wav", duration: 5 },
      },
    ],
    eligibilityScript: "Bonne nouvelle, vous pouvez bénéficier de notre offre ! Un expert vous rappellera sous 48h pour finaliser. Ça vous va ?",
    eligibilityRecording: { name: "eligibility.wav", duration: 10 },
    successScript: "Merci beaucoup pour votre temps. Un expert vous recontactera très vite. Au revoir !",
    successRecording: { name: "final_goodbye.wav", duration: 6 },
    edgeCases: [
      { id: "ec-1", name: "Not interested", script: "Je comprends tout à fait. Merci de votre temps, et bonne journée !", recording: { name: "ec_not_interested.wav", duration: 5 } },
      { id: "ec-2", name: "Busy / call back later", script: "Pas de souci, à quel moment puis-je vous rappeler ?", recording: { name: "ec_busy.wav", duration: 4 } },
      { id: "ec-3", name: "Asks who is calling", script: "Je suis Claire, de Twist Assurance, votre conseillère mutuelle santé.", recording: { name: "ec_who.wav", duration: 5 } },
      { id: "ec-4", name: "Already has good coverage", script: "C'est une bonne chose ! Notre offre permet souvent d'économiser — puis-je vous poser deux questions rapides ?", recording: null },
      { id: "ec-5", name: "Wants email / written info", script: "Bien sûr, nous pouvons vous envoyer les détails par écrit. Quelle est votre adresse email ?", recording: null },
      { id: "ec-6", name: "How did you get my number?", script: "Vous avez rempli un formulaire de demande d'information sur nos offres santé.", recording: null },
    ],
    silenceScript: "Allô ? Vous êtes toujours là ?",
    silenceRecording: { name: "silence_prompt.wav", duration: 3 },
    extractionFields: [
      { key: "insurance_type", type: "text", description: "" },
      { key: "age_over_55", type: "boolean", description: "" },
      { key: "preferred_coverage", type: "text", description: "" },
      { key: "family_status", type: "text", description: "" },
      { key: "premium_over_100", type: "boolean", description: "" },
    ],
  };
}

/* ─── Helpers ─── */

const inputClass =
  "w-full rounded-lg border border-[#d0d5e4] bg-white px-3 py-2 text-[13px] text-[#0A2353] transition-all placeholder:text-[#7b89a8] focus:border-[#5B58EB]/40 focus:outline-none focus:ring-2 focus:ring-[#5B58EB]/10";

function SectionHeader({
  title,
  icon: Icon,
  color,
  open,
  onToggle,
  badge,
}: {
  title: string;
  icon: typeof Phone;
  color: string;
  open: boolean;
  onToggle: () => void;
  badge?: string;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[#f0f2f8]"
    >
      <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", color)}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <span className="flex-1 text-[13px] font-semibold text-[#0A2353]">{title}</span>
      {badge && (
        <span className="rounded-full bg-[#5B58EB]/10 px-2 py-0.5 text-[10px] font-bold text-[#5B58EB]">
          {badge}
        </span>
      )}
      <ChevronRight className={cn("h-3.5 w-3.5 text-[#7b89a8] transition-transform", open && "rotate-90")} />
    </button>
  );
}

/* ── Recording Controls ── */

function RecordingControls({
  recording,
  onUpload,
  onDelete,
}: {
  recording: Recording | null;
  onUpload: () => void;
  onDelete: () => void;
}) {
  if (!recording) {
    return (
      <button
        onClick={onUpload}
        className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-amber-300 bg-amber-50/60 px-2.5 py-1.5 text-[10px] font-semibold text-amber-700 transition-colors hover:bg-amber-100"
      >
        <Upload className="h-3 w-3" />
        No recording yet — upload
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-[10px] text-[#5a6785]">
      <button className="text-[#5B58EB] hover:text-[#4340c9]" title="Play">
        <Play className="h-3 w-3" />
      </button>
      <span>{recording.name} · {recording.duration}s</span>
      <button onClick={onDelete} className="text-[#c3cad9] hover:text-red-500" title="Delete">
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SVG FLOW DIAGRAM — flow-board style
   - Repeat node BESIDE (left of) each question
   - Repeat: positive/unclear-again → next question, negative → fail rail
   - Shared red fail rail on the right feeding NOT ELIGIBLE
   - No edge cases on the diagram
   ═══════════════════════════════════════════════ */

function FlowDiagramSVG({
  agent,
  onClickNode,
}: {
  agent: AgentState;
  onClickNode: (id: string) => void;
}) {
  const questions = agent.questions;

  /* columns */
  const repW = 150;
  const repX = 24; // repeat boxes 24..174
  const railX = 10; // green return rail
  const nodeX = 240;
  const nodeW = 300; // main col 240..540, mid 390
  const midX = nodeX + nodeW / 2;
  const exitX = 610;
  const exitW = 160; // right col 610..770
  const neX = 620;
  const neW = 150; // NOT ELIGIBLE 620..770
  const failRailX = 695;

  const nodeH = 56;
  const qGap = 66;
  const openGap = 92; // extra room under the opening for the repeat-negative line + EXIT clearance

  /* vertical layout */
  const startY = 16;
  const openingY = startY + 56;
  const subCount = agent.openingSubstages.length;
  const openingH = 26 + subCount * 13 + 8;

  const firstQY = openingY + openingH + openGap;
  const qPositions = questions.map((_, i) => firstQY + i * (nodeH + qGap));
  const lastQBottom = qPositions.length > 0 ? qPositions[qPositions.length - 1] + nodeH : firstQY;

  const eligY = lastQBottom + qGap;
  const eligH = 48;
  const successY = eligY + eligH + qGap * 0.75;
  const successH = 44;
  const endY = successY + successH + 34;

  const retainY = openingY;
  const retainH = 64;
  const exitBoxY = retainY + retainH + 26;
  const exitBoxH = 40;

  const neY = firstQY - 6;
  const neH = 50;

  const qHasNegative = (q: QuestionNode) =>
    q.answers.some((a) => a.route === "negative") || Boolean(q.rule);
  const hasNotEligible = questions.some(qHasNegative);

  /* fail rail extent — lowest junction */
  const negativeJunctions: number[] = [];
  questions.forEach((q, i) => {
    if (!qHasNegative(q)) return;
    if (i > 0) negativeJunctions.push(qPositions[i] + nodeH / 2); // direct fail joins
    negativeJunctions.push(qPositions[i] + nodeH + 20); // repeat negative joins
  });
  const railBottom = negativeJunctions.length > 0 ? Math.max(...negativeJunctions) : neY + neH;

  const totalH = endY + 60;
  const totalW = 790;

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      width="100%"
      preserveAspectRatio="xMidYMin meet"
      className="mx-auto block min-w-[700px] max-w-[1080px]"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
    >
      <defs>
        <marker id="mg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#10b981" /></marker>
        <marker id="mr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#ef4444" /></marker>
        <marker id="mi" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#6366f1" /></marker>
        <marker id="mx" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#94a3b8" /></marker>
        <filter id="ds"><feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#0A2353" floodOpacity="0.06" /></filter>
      </defs>

      {/* Legend */}
      {[
        { color: "#10b981", label: "Positive / Valid" },
        { color: "#ef4444", label: "Negative / Fail" },
        { color: "#6366f1", label: "Unclear → Repeat" },
      ].map((item, i) => (
        <g key={item.label}>
          <rect x={nodeX + i * 130} y={startY - 6} width={12} height={4} rx={2} fill={item.color} />
          <text x={nodeX + i * 130 + 16} y={startY - 2} fill="#5a6785" fontSize={7} fontWeight={600}>{item.label}</text>
        </g>
      ))}

      {/* Call Starts */}
      <rect x={midX - 50} y={startY + 4} width={100} height={26} rx={13} fill="#5B58EB" />
      <text x={midX} y={startY + 21} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}>Call Starts</text>
      <line x1={midX} y1={startY + 30} x2={midX} y2={openingY} stroke="#94a3b8" strokeWidth={1.5} markerEnd="url(#mx)" />

      {/* ══ OPENING ══ */}
      <g onClick={() => onClickNode("opening")} style={{ cursor: "pointer" }}>
        <rect x={nodeX} y={openingY} width={nodeW} height={openingH} rx={7} fill="#fff" stroke="#06b6d4" strokeWidth={1.6} filter="url(#ds)" />
        <rect x={nodeX} y={openingY} width={nodeW} height={20} rx={7} fill="#ecfeff" />
        <rect x={nodeX} y={openingY + 12} width={nodeW} height={8} fill="#ecfeff" />
        <text x={nodeX + 12} y={openingY + 14} fill="#06b6d4" fontSize={9} fontWeight={800}>OPENING</text>
        <text x={nodeX + nodeW - 12} y={openingY + 14} textAnchor="end" fill="#64748b" fontSize={7} fontWeight={600}>
          {subCount} substages · Y/N
        </text>
        {agent.openingSubstages.map((sub, i) => (
          <g key={sub.id}>
            <text x={nodeX + 12} y={openingY + 32 + i * 13} fill={sub.isQuestion ? "#06b6d4" : "#475569"} fontSize={7.5} fontWeight={sub.isQuestion ? 700 : 400}>
              {i + 1}. {sub.label || "…"}{sub.isQuestion ? " (Y/N question)" : ""}
            </text>
            {sub.recording && <circle cx={nodeX + nodeW - 18} cy={openingY + 29 + i * 13} r={3} fill="#10b981" />}
          </g>
        ))}
      </g>

      {/* Opening YES → Q1 */}
      <line x1={midX} y1={openingY + openingH} x2={midX} y2={firstQY} stroke="#10b981" strokeWidth={1.8} markerEnd="url(#mg)" />
      <text x={midX + 7} y={firstQY - 26} fill="#10b981" fontSize={7.5} fontWeight={700}>YES</text>

      {/* Opening NO → Retain Clip */}
      <line x1={nodeX + nodeW} y1={openingY + 24} x2={exitX} y2={openingY + 24} stroke="#ef4444" strokeWidth={1.4} markerEnd="url(#mr)" />
      <text x={nodeX + nodeW + 14} y={openingY + 18} fill="#ef4444" fontSize={7} fontWeight={600}>NO</text>

      {/* Opening unclear → REPEAT OPENING (beside) */}
      <line x1={nodeX} y1={openingY + openingH / 2} x2={repX + repW + 5} y2={openingY + openingH / 2} stroke="#6366f1" strokeWidth={1.2} strokeDasharray="4,3" markerEnd="url(#mi)" />
      <text x={repX + repW + 10} y={openingY + openingH / 2 - 5} fill="#6366f1" fontSize={6.5} fontWeight={700}>unclear</text>
      {(() => {
        const ry = openingY + openingH / 2 - 16;
        return (
          <g>
            <rect x={repX} y={ry} width={repW} height={34} rx={5} fill="#eef2ff" stroke="#a5b4fc" strokeWidth={1.1} filter="url(#ds)" />
            <text x={repX + repW / 2} y={ry + 14} textAnchor="middle" fill="#6366f1" fontSize={7.5} fontWeight={800}>REPEAT OPENING</text>
            <text x={repX + repW / 2} y={ry + 26} textAnchor="middle" fill="#6366f1" fontSize={6.5}>variation (1x only)</text>
            {agent.openingVariationRecording && <circle cx={repX + repW - 10} cy={ry + 10} r={2.5} fill="#10b981" />}
            {/* positive / unclear again → Q1 */}
            <path d={`M ${repX} ${ry + 17} L ${railX} ${ry + 17} L ${railX} ${firstQY - 14} L ${nodeX + 55} ${firstQY - 14} L ${nodeX + 55} ${firstQY}`} stroke="#10b981" strokeWidth={1.3} fill="none" markerEnd="url(#mg)" />
            <text x={railX + 8} y={firstQY - 18} fill="#10b981" fontSize={6.5} fontWeight={700}>positive / unclear again</text>
            {/* negative → EXIT (hops over the YES and CONVINCED lines, enters EXIT from the left) */}
            {(() => {
              const redY = Math.max(exitBoxY + 10, Math.min(openingY + openingH + 30, exitBoxY + exitBoxH - 10));
              const convX = nodeX + nodeW - 60;
              return (
                <>
                  <path d={`M ${repX + 70} ${ry + 34} L ${repX + 70} ${redY} L ${midX - 6} ${redY} A 6 6 0 0 1 ${midX + 6} ${redY} L ${convX - 6} ${redY} A 6 6 0 0 1 ${convX + 6} ${redY} L ${exitX + 15} ${redY}`} stroke="#ef4444" strokeWidth={1.1} fill="none" markerEnd="url(#mr)" />
                  <text x={midX + 16} y={redY - 5} fill="#ef4444" fontSize={6.5} fontWeight={600}>negative</text>
                </>
              );
            })()}
          </g>
        );
      })()}

      {/* ══ RETAIN CLIP ══ */}
      <g onClick={() => onClickNode("opening")} style={{ cursor: "pointer" }}>
        <rect x={exitX} y={retainY} width={exitW} height={retainH} rx={6} fill="#fff" stroke="#f59e0b" strokeWidth={1.6} filter="url(#ds)" />
        <rect x={exitX} y={retainY} width={exitW} height={18} rx={6} fill="#fffbeb" />
        <rect x={exitX} y={retainY + 11} width={exitW} height={7} fill="#fffbeb" />
        <text x={exitX + 10} y={retainY + 13} fill="#d97706" fontSize={8} fontWeight={800}>RETAIN CLIP</text>
        <text x={exitX + 10} y={retainY + 34} fill="#475569" fontSize={6.5} fontStyle="italic">Persuasion script</text>
        <text x={exitX + 10} y={retainY + 48} fill="#d97706" fontSize={6.5} fontWeight={600}>plays once, then re-asks</text>
        {agent.retainClipRecording && <circle cx={exitX + exitW - 12} cy={retainY + 12} r={3} fill="#10b981" />}
      </g>

      {/* STILL NO → EXIT */}
      <line x1={exitX + exitW / 2} y1={retainY + retainH} x2={exitX + exitW / 2} y2={exitBoxY} stroke="#ef4444" strokeWidth={1.4} markerEnd="url(#mr)" />
      <text x={exitX + exitW / 2 + 8} y={retainY + retainH + 20} fill="#ef4444" fontSize={6.5} fontWeight={600}>STILL NO</text>
      <rect x={exitX + 15} y={exitBoxY} width={exitW - 30} height={exitBoxH} rx={5} fill="#fef2f2" stroke="#ef4444" strokeWidth={1.4} />
      <text x={exitX + exitW / 2} y={exitBoxY + 17} textAnchor="middle" fill="#ef4444" fontSize={8.5} fontWeight={800}>EXIT</text>
      <text x={exitX + exitW / 2} y={exitBoxY + 30} textAnchor="middle" fill="#ef4444" fontSize={6.5} fontWeight={700}>END CALL</text>

      {/* CONVINCED → Q1 (enters top, right of YES) */}
      <path d={`M ${exitX} ${retainY + 40} L ${nodeX + nodeW - 60} ${retainY + 40} L ${nodeX + nodeW - 60} ${firstQY}`} stroke="#10b981" strokeWidth={1.6} fill="none" markerEnd="url(#mg)" />
      <text x={nodeX + nodeW - 54} y={firstQY - 22} fill="#10b981" fontSize={6.5} fontWeight={700}>CONVINCED</text>

      {/* ══ NOT ELIGIBLE + fail rail ══ */}
      {hasNotEligible && (
        <g>
          <rect x={neX} y={neY} width={neW} height={neH} rx={6} fill="#fef2f2" stroke="#ef4444" strokeWidth={1.6} filter="url(#ds)" />
          <text x={neX + neW / 2} y={neY + 19} textAnchor="middle" fill="#ef4444" fontSize={9} fontWeight={800}>NOT ELIGIBLE</text>
          <text x={neX + neW / 2} y={neY + 33} textAnchor="middle" fill="#ef4444" fontSize={7} fontWeight={700}>END CALL</text>
          {railBottom > neY + neH && (
            <line x1={failRailX} y1={railBottom} x2={failRailX} y2={neY + neH + 5} stroke="#ef4444" strokeWidth={1.5} markerEnd="url(#mr)" />
          )}
        </g>
      )}

      {/* ══ QUESTIONS + REPEAT BESIDE ══ */}
      {questions.map((q, qi) => {
        const y = qPositions[qi];
        const isLast = qi === questions.length - 1;
        const nextTop = isLast ? eligY : qPositions[qi + 1];
        const hasNeg = qHasNegative(q);
        const positiveAnswers = q.answers.filter((a) => a.route === "positive");
        const negativeAnswers = q.answers.filter((a) => a.route === "negative");
        const positiveLabel = q.answerType === "yesno"
          ? positiveAnswers.map((a) => a.label).join(" / ") || "YES"
          : `positive (${positiveAnswers.map((a) => a.label).filter(Boolean).join(", ") || "…"})`;
        const negativeLabel = negativeAnswers.map((a) => a.label).filter(Boolean).join(" / ") || "fail";
        const repY = y + nodeH / 2 - 17;
        const redJoinY = y + nodeH + 20;

        return (
          <g key={q.id}>
            {/* Question node */}
            <g onClick={() => onClickNode(q.id)} style={{ cursor: "pointer" }}>
              <rect x={nodeX} y={y} width={nodeW} height={nodeH} rx={7} fill="#fff" stroke="#5B58EB" strokeWidth={1.6} filter="url(#ds)" />
              <rect x={nodeX} y={y} width={nodeW} height={20} rx={7} fill="#eeedfd" />
              <rect x={nodeX} y={y + 12} width={nodeW} height={8} fill="#eeedfd" />
              <text x={nodeX + 12} y={y + 14} fill="#5B58EB" fontSize={9} fontWeight={800}>{q.label.toUpperCase()}</text>
              <text x={nodeX + nodeW - 12} y={y + 14} textAnchor="end" fill="#8B63FF" fontSize={7} fontWeight={600}>
                {q.answerType === "yesno" ? "Y/N" : "MULTI-CHOICE"}
              </text>
              {q.answers.slice(0, 4).map((a, ai) => {
                const pillX = nodeX + 12 + ai * 70;
                const pillY = y + 25;
                const isPos = a.route === "positive";
                return a.label ? (
                  <g key={a.id}>
                    <rect x={pillX} y={pillY} width={64} height={12} rx={3} fill={isPos ? "#ecfdf5" : "#fef2f2"} stroke={isPos ? "#a7f3d0" : "#fecaca"} strokeWidth={0.6} />
                    <text x={pillX + 6} y={pillY + 9} fill={isPos ? "#10b981" : "#ef4444"} fontSize={6} fontWeight={600}>{isPos ? "✓" : "✗"} {a.label}</text>
                  </g>
                ) : null;
              })}
              {q.rule && (
                <g>
                  <rect x={nodeX + 12} y={y + 41} width={nodeW - 24} height={11} rx={2} fill="#fffbeb" stroke="#fde68a" strokeWidth={0.5} />
                  <text x={nodeX + 17} y={y + 49} fill="#d97706" fontSize={6} fontWeight={600}>Rule: {q.rule}</text>
                </g>
              )}
              {q.recording && <circle cx={nodeX + nodeW - 14} cy={y + 30} r={3} fill="#10b981" />}
            </g>

            {/* unclear → repeat (beside, left) */}
            <line x1={nodeX} y1={y + nodeH / 2} x2={repX + repW + 5} y2={y + nodeH / 2} stroke="#6366f1" strokeWidth={1.2} strokeDasharray="4,3" markerEnd="url(#mi)" />
            <text x={repX + repW + 10} y={y + nodeH / 2 - 5} fill="#6366f1" fontSize={6.5} fontWeight={700}>unclear</text>

            {/* Repeat node */}
            <rect x={repX} y={repY} width={repW} height={34} rx={5} fill="#eef2ff" stroke="#a5b4fc" strokeWidth={1.1} filter="url(#ds)" />
            <text x={repX + repW / 2} y={repY + 14} textAnchor="middle" fill="#6366f1" fontSize={7.5} fontWeight={800}>REPEAT Q{qi + 1}</text>
            <text x={repX + repW / 2} y={repY + 26} textAnchor="middle" fill="#6366f1" fontSize={6.5}>variation (1x only)</text>
            {q.variationRecording && <circle cx={repX + repW - 10} cy={repY + 10} r={2.5} fill="#10b981" />}

            {/* repeat positive / unclear again → next node */}
            <path d={`M ${repX} ${repY + 17} L ${railX} ${repY + 17} L ${railX} ${nextTop - 14} L ${nodeX + 55} ${nextTop - 14} L ${nodeX + 55} ${nextTop}`} stroke="#10b981" strokeWidth={1.3} fill="none" markerEnd="url(#mg)" />
            <text x={railX + 8} y={nextTop - 18} fill="#10b981" fontSize={6.5} fontWeight={700}>positive / unclear again</text>

            {/* repeat negative → fail rail (only if question has a negative route) */}
            {hasNeg && hasNotEligible && (
              <>
                <path d={`M ${repX + 70} ${repY + 34} L ${repX + 70} ${redJoinY} L ${midX - 6} ${redJoinY} A 6 6 0 0 1 ${midX + 6} ${redJoinY} L ${failRailX} ${redJoinY}`} stroke="#ef4444" strokeWidth={1.1} fill="none" />
                <circle cx={failRailX} cy={redJoinY} r={2.5} fill="#ef4444" />
                <text x={midX + 16} y={redJoinY - 5} fill="#ef4444" fontSize={6.5} fontWeight={600}>negative</text>
              </>
            )}

            {/* question fail → NOT ELIGIBLE (first q direct, others via rail) */}
            {hasNeg && hasNotEligible && (
              qi === 0 ? (
                <>
                  <line x1={nodeX + nodeW} y1={y + nodeH / 2} x2={neX} y2={y + nodeH / 2} stroke="#ef4444" strokeWidth={1.4} markerEnd="url(#mr)" />
                  <text x={nodeX + nodeW + 8} y={y + nodeH / 2 - 5} fill="#ef4444" fontSize={6.5} fontWeight={600}>{negativeLabel}</text>
                </>
              ) : (
                <>
                  <line x1={nodeX + nodeW} y1={y + nodeH / 2} x2={failRailX} y2={y + nodeH / 2} stroke="#ef4444" strokeWidth={1.4} />
                  <circle cx={failRailX} cy={y + nodeH / 2} r={2.5} fill="#ef4444" />
                  <text x={nodeX + nodeW + 8} y={y + nodeH / 2 - 5} fill="#ef4444" fontSize={6.5} fontWeight={600}>{negativeLabel}</text>
                </>
              )
            )}

            {/* positive → next node (main line) */}
            <line x1={midX} y1={y + nodeH} x2={midX} y2={nextTop} stroke="#10b981" strokeWidth={1.8} markerEnd="url(#mg)" />
            <text x={midX + 7} y={y + nodeH + qGap / 2 + 8} fill="#10b981" fontSize={7.5} fontWeight={700}>{positiveLabel}</text>
          </g>
        );
      })}

      {/* ══ ELIGIBILITY ══ */}
      <g onClick={() => onClickNode("eligibility")} style={{ cursor: "pointer" }}>
        <rect x={nodeX} y={eligY} width={nodeW} height={eligH} rx={7} fill="#fff" stroke="#8B63FF" strokeWidth={1.6} filter="url(#ds)" />
        <rect x={nodeX} y={eligY} width={nodeW} height={20} rx={7} fill="#f5f0ff" />
        <rect x={nodeX} y={eligY + 12} width={nodeW} height={8} fill="#f5f0ff" />
        <text x={nodeX + 12} y={eligY + 14} fill="#8B63FF" fontSize={9} fontWeight={800}>ELIGIBILITY</text>
        <text x={nodeX + nodeW - 12} y={eligY + 14} textAnchor="end" fill="#8B63FF" fontSize={7} fontWeight={600}>Y/N</text>
        <text x={nodeX + 12} y={eligY + 34} fill="#94a3b8" fontSize={7}>Confirmation &amp; callback scheduling</text>
        {agent.eligibilityRecording && <circle cx={nodeX + nodeW - 14} cy={eligY + 34} r={3} fill="#10b981" />}
      </g>

      <line x1={midX} y1={eligY + eligH} x2={midX} y2={successY} stroke="#10b981" strokeWidth={1.8} markerEnd="url(#mg)" />
      <text x={midX + 7} y={eligY + eligH + (successY - eligY - eligH) / 2 + 3} fill="#10b981" fontSize={7.5} fontWeight={700}>YES</text>

      {/* ══ FINAL RECORDING ══ */}
      <g onClick={() => onClickNode("success")} style={{ cursor: "pointer" }}>
        <rect x={nodeX + 55} y={successY} width={190} height={successH} rx={7} fill="#fff" stroke="#10b981" strokeWidth={1.6} filter="url(#ds)" />
        <rect x={nodeX + 55} y={successY} width={190} height={18} rx={7} fill="#ecfdf5" />
        <rect x={nodeX + 55} y={successY + 11} width={190} height={7} fill="#ecfdf5" />
        <text x={nodeX + 67} y={successY + 13} fill="#10b981" fontSize={9} fontWeight={800}>FINAL RECORDING</text>
        <text x={nodeX + 67} y={successY + 33} fill="#10b981" fontSize={7} fontWeight={700}>{"→"} End call</text>
        {agent.successRecording && <circle cx={nodeX + 55 + 176} cy={successY + 12} r={3} fill="#10b981" />}
      </g>

      {/* Call Ends */}
      <line x1={nodeX + 150} y1={successY + successH} x2={nodeX + 150} y2={endY} stroke="#94a3b8" strokeWidth={1.5} markerEnd="url(#mx)" />
      <rect x={nodeX + 100} y={endY} width={100} height={26} rx={13} fill="#0A2353" />
      <text x={nodeX + 150} y={endY + 17} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}>Call Ends</text>
    </svg>
  );
}

/* ═══════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════ */

export function AgentCreationPage() {
  const [agent, setAgent] = useState<AgentState>(createInitialState);
  const [savedDraft, setSavedDraft] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  const [view, setView] = useState<"form" | "diagram">("form");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<string>("");

  /* chat */
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-0",
      role: "agent",
      text: "Hi! I'm your Flow Agent. Tell me about your campaign and I'll build the flow with you — opening, questions, routing, edge cases. What are we creating today?",
    },
    {
      id: "m-1",
      role: "user",
      text: "We're calling French seniors about mutuelle santé. Qualify leads over 55 with an individual insurance paying more than 100€/month.",
    },
    {
      id: "m-2",
      role: "agent",
      text: "Done! I built the full flow: a 3-part opening with a retain clip, 5 qualification questions with repeat variations and routing, edge case responses, and a silence prompt. Review everything in the Form view, and check the Diagram to see how the routes connect. Just tell me what to change.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [agentTyping, setAgentTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [sections, setSections] = useState({
    details: true,
    opening: true,
    questions: true,
    edgeCases: false,
    silence: false,
    extraction: false,
    settings: false,
  });

  const toggleSection = (key: keyof typeof sections) =>
    setSections((p) => ({ ...p, [key]: !p[key] }));

  const currentLang = LANGUAGES.find((l) => l.code === agent.language) || LANGUAGES[0];

  /* ─ chat ─ */

  function sendChat(text: string) {
    const trimmed = text.trim();
    if (!trimmed || agentTyping) return;
    setMessages((p) => [...p, { id: `m-${Date.now()}`, role: "user", text: trimmed }]);
    setChatInput("");
    setAgentTyping(true);
    setTimeout(() => {
      setMessages((p) => [
        ...p,
        { id: `m-${Date.now()}-a`, role: "agent", text: AGENT_REPLIES[(p.length / 2) % AGENT_REPLIES.length | 0] },
      ]);
      setAgentTyping(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }, 1100);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  /* ─ Recording upload mock ─ */

  function triggerUpload(target: string) {
    setUploadTarget(target);
    fileInputRef.current?.click();
  }

  function handleFileSelected() {
    const mockRec: Recording = { name: "recording.wav", duration: Math.floor(Math.random() * 10) + 3 };

    if (uploadTarget.startsWith("opening-")) {
      const subId = uploadTarget.replace("opening-", "");
      setAgent((p) => ({
        ...p,
        openingSubstages: p.openingSubstages.map((s) => (s.id === subId ? { ...s, recording: mockRec } : s)),
      }));
    } else if (uploadTarget === "openingvar") {
      updateAgent({ openingVariationRecording: mockRec });
    } else if (uploadTarget === "retain") {
      updateAgent({ retainClipRecording: mockRec });
    } else if (uploadTarget === "eligibility") {
      updateAgent({ eligibilityRecording: mockRec });
    } else if (uploadTarget === "success") {
      updateAgent({ successRecording: mockRec });
    } else if (uploadTarget === "silence") {
      updateAgent({ silenceRecording: mockRec });
    } else if (uploadTarget.startsWith("qvar-")) {
      const qId = uploadTarget.replace("qvar-", "");
      updateQuestion(qId, { variationRecording: mockRec });
    } else if (uploadTarget.startsWith("qfail-")) {
      const qId = uploadTarget.replace("qfail-", "");
      updateQuestion(qId, { failRecording: mockRec });
    } else if (uploadTarget.startsWith("q-")) {
      const qId = uploadTarget.replace("q-", "");
      updateQuestion(qId, { recording: mockRec });
    } else if (uploadTarget.startsWith("ec-")) {
      updateEdgeCase(uploadTarget, { recording: mockRec });
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function deleteRecording(target: string) {
    if (target.startsWith("opening-")) {
      const subId = target.replace("opening-", "");
      setAgent((p) => ({
        ...p,
        openingSubstages: p.openingSubstages.map((s) => (s.id === subId ? { ...s, recording: null } : s)),
      }));
    } else if (target === "openingvar") {
      updateAgent({ openingVariationRecording: null });
    } else if (target === "retain") {
      updateAgent({ retainClipRecording: null });
    } else if (target === "eligibility") {
      updateAgent({ eligibilityRecording: null });
    } else if (target === "success") {
      updateAgent({ successRecording: null });
    } else if (target === "silence") {
      updateAgent({ silenceRecording: null });
    } else if (target.startsWith("qvar-")) {
      const qId = target.replace("qvar-", "");
      updateQuestion(qId, { variationRecording: null });
    } else if (target.startsWith("qfail-")) {
      const qId = target.replace("qfail-", "");
      updateQuestion(qId, { failRecording: null });
    } else if (target.startsWith("q-")) {
      const qId = target.replace("q-", "");
      updateQuestion(qId, { recording: null });
    } else if (target.startsWith("ec-")) {
      updateEdgeCase(target, { recording: null });
    }
  }

  /* ─ mutations ─ */

  function updateAgent(patch: Partial<AgentState>) {
    setAgent((p) => ({ ...p, ...patch }));
  }

  function updateQuestion(id: string, patch: Partial<QuestionNode>) {
    setAgent((p) => ({
      ...p,
      questions: p.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    }));
  }

  function addQuestion() {
    const n = agent.questions.length + 1;
    setAgent((p) => ({ ...p, questions: [...p.questions, createQuestion(n)] }));
  }

  function removeQuestion(id: string) {
    setAgent((p) => ({ ...p, questions: p.questions.filter((q) => q.id !== id) }));
  }

  function addAnswer(qId: string) {
    setAgent((p) => ({
      ...p,
      questions: p.questions.map((q) =>
        q.id === qId
          ? { ...q, answers: [...q.answers, { id: `a-${Date.now()}`, label: "", route: "negative" as const }] }
          : q,
      ),
    }));
  }

  function updateAnswer(qId: string, aId: string, patch: Partial<AnswerOption>) {
    setAgent((p) => ({
      ...p,
      questions: p.questions.map((q) =>
        q.id === qId
          ? { ...q, answers: q.answers.map((a) => (a.id === aId ? { ...a, ...patch } : a)) }
          : q,
      ),
    }));
  }

  function removeAnswer(qId: string, aId: string) {
    setAgent((p) => ({
      ...p,
      questions: p.questions.map((q) =>
        q.id === qId ? { ...q, answers: q.answers.filter((a) => a.id !== aId) } : q,
      ),
    }));
  }

  function switchAnswerType(qId: string, type: AnswerType) {
    const answers = type === "yesno" ? createDefaultYesNo() : [];
    updateQuestion(qId, { answerType: type, answers });
  }

  function addEdgeCase() {
    setAgent((p) => ({
      ...p,
      edgeCases: [...p.edgeCases, { id: `ec-${Date.now()}`, name: "", script: "", recording: null }],
    }));
    if (!sections.edgeCases) setSections((p) => ({ ...p, edgeCases: true }));
  }

  function updateEdgeCase(id: string, patch: Partial<EdgeCaseEntry>) {
    setAgent((p) => ({
      ...p,
      edgeCases: p.edgeCases.map((ec) => (ec.id === id ? { ...ec, ...patch } : ec)),
    }));
  }

  function removeEdgeCase(id: string) {
    setAgent((p) => ({ ...p, edgeCases: p.edgeCases.filter((ec) => ec.id !== id) }));
  }

  function handleDiagramClick(nodeId: string) {
    setView("form");
    if (nodeId === "opening") setSections((p) => ({ ...p, opening: true }));
    else setSections((p) => ({ ...p, questions: true }));
    setFocusedNode(nodeId);
    setTimeout(() => {
      const el = document.getElementById(`node-${nodeId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
    setTimeout(() => setFocusedNode(null), 2200);
  }

  function handleSaveDraft() {
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 3000);
  }

  function updateOpeningSubstages(newSubs: OpeningSubstage[]) {
    setAgent((p) => ({ ...p, openingSubstages: markLastAsQuestion(newSubs) }));
  }

  /* ─── render ─── */

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={handleFileSelected} />

      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[#d0d5e4] bg-white px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link href="/agents" className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-medium text-[#7b89a8] transition-colors hover:bg-[#f0f2f8] hover:text-[#0A2353]">
            <ArrowLeft className="h-3.5 w-3.5" />
            Agents
          </Link>
          <div className="h-5 w-px bg-[#d0d5e4]" />
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#5B58EB] to-[#8B63FF] text-white shadow-sm">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold text-[#0A2353]">{agent.name || "New Agent"}</h1>
              <div className="flex items-center gap-2">
                <span className="rounded bg-[#5B58EB]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#5B58EB]">Draft</span>
                <div className="relative">
                  <button onClick={() => setShowLangDropdown(!showLangDropdown)} className="flex items-center gap-1 rounded-md border border-[#d0d5e4] bg-white px-2 py-0.5 text-[10px] font-medium text-[#0A2353] hover:border-[#5B58EB]/40">
                    <Globe className="h-3 w-3 text-[#7b89a8]" />
                    <span>{currentLang.flag}</span>
                    <span>{currentLang.label}</span>
                    <ChevronDown className="h-2.5 w-2.5 text-[#7b89a8]" />
                  </button>
                  {showLangDropdown && (
                    <>
                      <button className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)} />
                      <div className="absolute left-0 top-full z-50 mt-1 w-36 rounded-lg border border-[#d0d5e4] bg-white py-1 shadow-lg">
                        {LANGUAGES.map((lang) => (
                          <button key={lang.code} onClick={() => { updateAgent({ language: lang.code }); setShowLangDropdown(false); }} className={cn("flex w-full items-center gap-2 px-3 py-1.5 text-left text-[11px] hover:bg-[#f0f2f8]", agent.language === lang.code ? "font-semibold text-[#5B58EB]" : "text-[#0A2353]")}>
                            <span>{lang.flag}</span><span>{lang.label}</span>
                            {agent.language === lang.code && <Check className="ml-auto h-3 w-3 text-[#5B58EB]" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {savedDraft && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
              <Check className="h-3.5 w-3.5" /> Saved
            </div>
          )}
          <Button variant="secondary" color="brand" className="text-[12px]" onClick={handleSaveDraft}>
            <Save className="mr-1.5 h-3.5 w-3.5" /> Save draft
          </Button>
          <Button variant="primary" color="brand" className="text-[12px]">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Finalize agent
          </Button>
        </div>
      </div>

      {/* Split pane: chat left, board right */}
      <div className="flex min-h-0 flex-1 overflow-hidden">

        {/* ══ LEFT — Flow Agent chat ══ */}
        <div className="flex w-[320px] shrink-0 flex-col border-r border-[#d0d5e4] bg-white">
          <div className="flex items-center gap-2 border-b border-[#d0d5e4] px-4 py-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#5B58EB] to-[#8B63FF] text-white">
              <MessageSquare className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-[#0A2353]">Flow Agent</div>
              <div className="text-[9px] text-[#7b89a8]">Builds the flow with you</div>
            </div>
            <span className="ml-auto flex h-2 w-2 rounded-full bg-emerald-400" />
          </div>

          {/* Messages */}
          <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-[12px] leading-relaxed",
                    m.role === "user"
                      ? "rounded-br-md bg-[#5B58EB] text-white"
                      : "rounded-bl-md bg-[#f0f2f8] text-[#0A2353]",
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {agentTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-[#f0f2f8] px-3.5 py-2.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#7b89a8] [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#7b89a8] [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#7b89a8] [animation-delay:300ms]" />
                </div>
              </div>
            )}
            {messages.length === 1 && (
              <div className="space-y-1.5 pt-1">
                {CHAT_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendChat(s)}
                    className="block w-full rounded-lg border border-[#5B58EB]/20 bg-[#5B58EB]/5 px-3 py-2 text-left text-[11px] font-medium text-[#5B58EB] transition-colors hover:bg-[#5B58EB]/10"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#d0d5e4] p-3">
            <div className="flex items-end gap-2 rounded-xl border border-[#d0d5e4] bg-white p-2 focus-within:border-[#5B58EB]/40 focus-within:ring-2 focus-within:ring-[#5B58EB]/10">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendChat(chatInput);
                  }
                }}
                rows={2}
                placeholder="Describe your campaign or ask for changes..."
                className="flex-1 resize-none bg-transparent text-[12px] text-[#0A2353] outline-none placeholder:text-[#7b89a8]"
              />
              <button
                onClick={() => sendChat(chatInput)}
                disabled={!chatInput.trim() || agentTyping}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#5B58EB] text-white transition-opacity disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ══ MAIN BOARD — Form / Diagram switch ══ */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#f8f9fc]">
          {/* Board toolbar */}
          <div className="flex items-center gap-3 border-b border-[#d0d5e4] bg-white px-4 py-2">
            <div className="flex items-center gap-0.5 rounded-lg bg-[#f0f2f8] p-0.5">
              <button
                onClick={() => setView("form")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors",
                  view === "form" ? "bg-white text-[#5B58EB] shadow-sm" : "text-[#7b89a8] hover:text-[#0A2353]",
                )}
              >
                <ClipboardList className="h-3.5 w-3.5" /> Form
              </button>
              <button
                onClick={() => setView("diagram")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors",
                  view === "diagram" ? "bg-white text-[#5B58EB] shadow-sm" : "text-[#7b89a8] hover:text-[#0A2353]",
                )}
              >
                <GitBranch className="h-3.5 w-3.5" /> Diagram
              </button>
            </div>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">Live</span>
            {view === "diagram" && (
              <span className="ml-auto text-[10px] text-[#7b89a8]">Click any node to edit it in the form</span>
            )}
          </div>

          {/* ── FORM VIEW ── */}
          {view === "form" && (
            <div className="custom-scrollbar flex-1 overflow-y-auto">
              <div className="mx-auto max-w-[620px] space-y-1 p-5">

                {/* Details */}
                <SectionHeader title="Agent Details" icon={Bot} color="bg-[#5B58EB]/10 text-[#5B58EB]" open={sections.details} onToggle={() => toggleSection("details")} />
                {sections.details && (
                  <div className="space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-[#d0d5e4]/60">
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-[#0A2353]">Agent name</label>
                      <input value={agent.name} onChange={(e) => updateAgent({ name: e.target.value })} placeholder="e.g. Mutuelle Senior FR" className={inputClass} />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-[#0A2353]">Description</label>
                      <textarea value={agent.description} onChange={(e) => updateAgent({ description: e.target.value })} rows={2} placeholder="Short summary..." className={cn(inputClass, "resize-none")} />
                    </div>
                  </div>
                )}

                {/* Opening */}
                <SectionHeader title="Opening" icon={Phone} color="bg-cyan-100 text-cyan-600" open={sections.opening} onToggle={() => toggleSection("opening")} badge={`${agent.openingSubstages.length} parts`} />
                {sections.opening && (
                  <div id="node-opening" className={cn("space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-[#d0d5e4]/60", focusedNode === "opening" && "ring-2 ring-cyan-400/50")}>
                    {agent.openingSubstages.map((sub) => (
                      <div key={sub.id} className={cn("rounded-lg border bg-white p-3", sub.isQuestion ? "border-cyan-400" : "border-[#d0d5e4]")}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input
                              value={sub.label}
                              onChange={(e) => {
                                const newSubs = agent.openingSubstages.map((s) => (s.id === sub.id ? { ...s, label: e.target.value } : s));
                                updateOpeningSubstages(newSubs);
                              }}
                              className="w-28 bg-transparent text-[11px] font-semibold text-cyan-600 outline-none placeholder:text-cyan-300"
                              placeholder="Stage name"
                            />
                            {sub.isQuestion && (
                              <span className="rounded-full bg-cyan-100 px-1.5 py-0.5 text-[8px] font-bold text-cyan-700">Y/N QUESTION</span>
                            )}
                          </div>
                          {agent.openingSubstages.length > 1 && (
                            <button onClick={() => updateOpeningSubstages(agent.openingSubstages.filter((s) => s.id !== sub.id))} className="rounded p-1 text-[#7b89a8] hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
                          )}
                        </div>
                        <textarea
                          value={sub.script}
                          onChange={(e) => {
                            const newSubs = agent.openingSubstages.map((s) => (s.id === sub.id ? { ...s, script: e.target.value } : s));
                            updateOpeningSubstages(newSubs);
                          }}
                          rows={2}
                          placeholder={sub.isQuestion ? "Y/N question script (e.g. 'Vous avez 2 min ?')" : `Script for ${sub.label || "this part"}...`}
                          className={cn(inputClass, "resize-none text-[12px]")}
                        />
                        <div className="mt-2">
                          <RecordingControls
                            recording={sub.recording}
                            onUpload={() => triggerUpload(`opening-${sub.id}`)}
                            onDelete={() => deleteRecording(`opening-${sub.id}`)}
                          />
                        </div>

                        {/* Routing table for the opening question — mirrors the diagram */}
                        {sub.isQuestion && (
                          <div className="mt-2 overflow-hidden rounded-lg border border-[#d0d5e4]">
                            <div className="border-b border-[#d0d5e4] bg-[#f8f9fc] px-2.5 py-1.5">
                              <span className="text-[10px] font-semibold text-[#7b89a8]">Expected answers &amp; routing</span>
                            </div>
                            <div className="flex items-center gap-2 border-b border-[#f0f2f8] px-2.5 py-1.5">
                              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                              <span className="min-w-0 flex-1 text-[11px] font-medium text-[#0A2353]">Yes</span>
                              <ArrowRight className="h-3 w-3 shrink-0 text-[#d0d5e4]" />
                              <span className="shrink-0 rounded-md border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">question 1</span>
                            </div>
                            <div className="flex items-center gap-2 border-b border-[#f0f2f8] px-2.5 py-1.5">
                              <span className="h-2 w-2 shrink-0 rounded-full bg-red-400" />
                              <span className="min-w-0 flex-1 text-[11px] font-medium text-[#0A2353]">No</span>
                              <ArrowRight className="h-3 w-3 shrink-0 text-[#d0d5e4]" />
                              <span className="shrink-0 rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700">retain clip → convinced or exit</span>
                            </div>
                            <div className="flex items-center gap-2 bg-indigo-50/40 px-2.5 py-1.5">
                              <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
                              <span className="min-w-0 flex-1 text-[11px] font-medium text-indigo-600">Unclear / no answer</span>
                              <ArrowRight className="h-3 w-3 shrink-0 text-indigo-200" />
                              <span className="shrink-0 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-600">repeat variation · 1x</span>
                            </div>
                          </div>
                        )}

                        {/* Repeat variation lives inside the question substage itself */}
                        {sub.isQuestion && (
                          <div className="mt-2 rounded-lg border border-indigo-200 bg-indigo-50/50 p-2.5">
                            <div className="mb-1 flex items-center gap-1.5">
                              <RotateCcw className="h-3 w-3 text-indigo-500" />
                              <span className="text-[10px] font-semibold text-indigo-600">Repeat variation — plays once if answer is unclear</span>
                            </div>
                            <textarea
                              value={agent.openingVariation}
                              onChange={(e) => updateAgent({ openingVariation: e.target.value })}
                              rows={2}
                              placeholder="Rephrased version of the question..."
                              className={cn(inputClass, "resize-none border-indigo-200 text-[11px]")}
                            />
                            <div className="mt-1.5">
                              <RecordingControls recording={agent.openingVariationRecording} onUpload={() => triggerUpload("openingvar")} onDelete={() => deleteRecording("openingvar")} />
                            </div>
                            <p className="mt-1.5 text-[9px] text-indigo-400">On the repeat: unclear or irrelevant counts as positive.</p>
                          </div>
                        )}
                      </div>
                    ))}
                    <button onClick={() => updateOpeningSubstages([...agent.openingSubstages, { id: `o-${Date.now()}`, label: "", script: "", isQuestion: false, recording: null }])} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-cyan-300/60 py-2 text-[11px] font-semibold text-cyan-600 hover:bg-cyan-50">
                      <Plus className="h-3 w-3" /> Add opening part
                    </button>

                    {/* Retain clip */}
                    <div className="rounded-lg border border-amber-300/60 bg-amber-50/50 p-3">
                      <div className="mb-1.5 flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                        <span className="text-[11px] font-semibold text-amber-700">Retain Clip (if opening = NO)</span>
                      </div>
                      <textarea value={agent.retainClipScript} onChange={(e) => updateAgent({ retainClipScript: e.target.value })} rows={2} placeholder="Persuasion script when lead says no..." className={cn(inputClass, "resize-none border-amber-200 text-[12px]")} />
                      <div className="mt-2">
                        <RecordingControls recording={agent.retainClipRecording} onUpload={() => triggerUpload("retain")} onDelete={() => deleteRecording("retain")} />
                      </div>
                      <label className="mt-2 block text-[10px] font-semibold text-red-600">Exit script (if still no)</label>
                      <textarea value={agent.retainClipExitScript} onChange={(e) => updateAgent({ retainClipExitScript: e.target.value })} rows={1} placeholder="Goodbye script..." className={cn(inputClass, "resize-none border-red-200 text-[11px]")} />
                    </div>
                  </div>
                )}

                {/* Questions */}
                <SectionHeader title="Questions" icon={MessageSquare} color="bg-[#5B58EB]/10 text-[#5B58EB]" open={sections.questions} onToggle={() => toggleSection("questions")} badge={`${agent.questions.length}`} />
                {sections.questions && (
                  <div className="space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-[#d0d5e4]/60">
                    {agent.questions.map((q, qi) => (
                      <div key={q.id} id={`node-${q.id}`} className={cn("overflow-hidden rounded-xl border-2 border-[#5B58EB]/25 bg-white", focusedNode === q.id && "ring-2 ring-[#5B58EB]/40")}>
                        {/* Question header — numbered, easy to spot */}
                        <div className="flex items-center gap-2 border-b border-[#5B58EB]/15 bg-[#5B58EB]/5 px-3 py-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#5B58EB] text-[10px] font-bold text-white">
                            {qi + 1}
                          </span>
                          <input value={q.label} onChange={(e) => updateQuestion(q.id, { label: e.target.value })} placeholder="Question name" className="min-w-0 flex-1 bg-transparent text-[12px] font-bold text-[#0A2353] outline-none placeholder:text-[#c3cad9]" />
                          <span className="shrink-0 rounded-full bg-[#8B63FF]/10 px-2 py-0.5 text-[9px] font-bold text-[#8B63FF]">
                            {q.answerType === "yesno" ? "Y/N" : "MULTI-CHOICE"}
                          </span>
                          {agent.questions.length > 1 && (
                            <button onClick={() => removeQuestion(q.id)} className="rounded p-1 text-[#7b89a8] hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
                          )}
                        </div>

                        <div className="p-3">
                        {/* Script */}
                        <textarea value={q.script} onChange={(e) => updateQuestion(q.id, { script: e.target.value })} rows={2} placeholder="Question script..." className={cn(inputClass, "resize-none text-[12px]")} />
                        <div className="mt-2">
                          <RecordingControls recording={q.recording} onUpload={() => triggerUpload(`q-${q.id}`)} onDelete={() => deleteRecording(`q-${q.id}`)} />
                        </div>

                        {/* Answer type toggle */}
                        <div className="mt-2">
                          <label className="mb-1 block text-[10px] font-semibold text-[#7b89a8]">Answer type</label>
                          <div className="flex gap-1.5">
                            {(["yesno", "choice"] as const).map((type) => (
                              <button key={type} onClick={() => switchAnswerType(q.id, type)} className={cn("rounded-md border px-2.5 py-1 text-[10px] font-medium", q.answerType === type ? "border-[#5B58EB] bg-[#5B58EB]/10 text-[#5B58EB]" : "border-[#d0d5e4] text-[#7b89a8] hover:border-[#5B58EB]/30")}>
                                {type === "yesno" ? "Yes / No" : "Multiple Choice"}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Routing table — mirrors the diagram */}
                        <div className="mt-2 overflow-hidden rounded-lg border border-[#d0d5e4]">
                          <div className="flex items-center justify-between border-b border-[#d0d5e4] bg-[#f8f9fc] px-2.5 py-1.5">
                            <span className="text-[10px] font-semibold text-[#7b89a8]">Expected answers &amp; routing</span>
                            {q.answerType === "choice" && (
                              <button onClick={() => addAnswer(q.id)} className="flex items-center gap-1 text-[10px] font-semibold text-[#5B58EB] hover:underline">
                                <Plus className="h-3 w-3" /> Add answer
                              </button>
                            )}
                          </div>
                          {q.answers.map((a) => (
                            <div key={a.id} className="flex items-center gap-2 border-b border-[#f0f2f8] px-2.5 py-1.5">
                              <span className={cn("h-2 w-2 shrink-0 rounded-full", a.route === "positive" ? "bg-emerald-400" : "bg-red-400")} />
                              <input value={a.label} onChange={(e) => updateAnswer(q.id, a.id, { label: e.target.value })} placeholder="Answer" readOnly={q.answerType === "yesno"} className="min-w-0 flex-1 bg-transparent text-[11px] font-medium text-[#0A2353] outline-none placeholder:text-[#c3cad9]" />
                              <ArrowRight className="h-3 w-3 shrink-0 text-[#d0d5e4]" />
                              <button
                                onClick={() => updateAnswer(q.id, a.id, { route: a.route === "positive" ? "negative" : "positive" })}
                                title="Click to switch route"
                                className={cn(
                                  "shrink-0 rounded-md border px-2 py-0.5 text-[9px] font-bold transition-colors",
                                  a.route === "positive"
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                    : "border-red-300 bg-red-50 text-red-600 hover:bg-red-100",
                                )}
                              >
                                {a.route === "positive" ? "next question" : "not eligible · end"}
                              </button>
                              {q.answerType === "choice" && (
                                <button onClick={() => removeAnswer(q.id, a.id)} className="rounded p-0.5 text-[#c3cad9] hover:text-red-500"><X className="h-3 w-3" /></button>
                              )}
                            </div>
                          ))}
                          <div className="flex items-center gap-2 bg-indigo-50/40 px-2.5 py-1.5">
                            <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
                            <span className="min-w-0 flex-1 text-[11px] font-medium text-indigo-600">Unclear / no answer</span>
                            <ArrowRight className="h-3 w-3 shrink-0 text-indigo-200" />
                            <span className="shrink-0 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-600">repeat variation · 1x</span>
                          </div>
                        </div>

                        {/* Rule */}
                        <div className="mt-2">
                          <label className="mb-1 block text-[10px] font-semibold text-[#7b89a8]">Rule (optional)</label>
                          <input value={q.rule} onChange={(e) => updateQuestion(q.id, { rule: e.target.value })} placeholder='e.g. must answer "individuelle"' className={cn(inputClass, "text-[11px]")} />
                        </div>

                        {/* Fail script */}
                        {q.rule && (
                          <div className="mt-2">
                            <label className="mb-1 block text-[10px] font-semibold text-red-600">Fail script (negative exit)</label>
                            <textarea value={q.failScript} onChange={(e) => updateQuestion(q.id, { failScript: e.target.value })} rows={2} placeholder="What to say when rule fails..." className={cn(inputClass, "resize-none border-red-200 text-[11px] focus:border-red-400 focus:ring-red-100")} />
                            <div className="mt-1.5">
                              <RecordingControls recording={q.failRecording} onUpload={() => triggerUpload(`qfail-${q.id}`)} onDelete={() => deleteRecording(`qfail-${q.id}`)} />
                            </div>
                          </div>
                        )}

                        {/* Repeat variation — always last in the question settings */}
                        <div className="mt-2 rounded-lg border border-indigo-200 bg-indigo-50/50 p-2.5">
                          <div className="mb-1 flex items-center gap-1.5">
                            <RotateCcw className="h-3 w-3 text-indigo-500" />
                            <span className="text-[10px] font-semibold text-indigo-600">Repeat variation — plays once if answer is unclear</span>
                          </div>
                          <textarea
                            value={q.variation}
                            onChange={(e) => updateQuestion(q.id, { variation: e.target.value })}
                            rows={2}
                            placeholder="Rephrased version of the question..."
                            className={cn(inputClass, "resize-none border-indigo-200 text-[11px]")}
                          />
                          <div className="mt-1.5">
                            <RecordingControls recording={q.variationRecording} onUpload={() => triggerUpload(`qvar-${q.id}`)} onDelete={() => deleteRecording(`qvar-${q.id}`)} />
                          </div>
                          <p className="mt-1.5 text-[9px] text-indigo-400">On the repeat: unclear or irrelevant counts as positive.</p>
                        </div>
                        </div>
                      </div>
                    ))}

                    <button onClick={addQuestion} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#8B63FF]/30 py-2.5 text-[11px] font-semibold text-[#8B63FF] hover:bg-[#8B63FF]/5">
                      <Plus className="h-3 w-3" /> Add question
                    </button>

                    {/* Eligibility */}
                    <div id="node-eligibility" className={cn("rounded-lg border border-[#d0d5e4] bg-white p-3", focusedNode === "eligibility" && "ring-2 ring-[#8B63FF]/40")}>
                      <div className="mb-1.5 flex items-center gap-2">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#8B63FF]" />
                        <span className="text-[12px] font-semibold text-[#8B63FF]">Eligibility</span>
                      </div>
                      <textarea value={agent.eligibilityScript} onChange={(e) => updateAgent({ eligibilityScript: e.target.value })} rows={2} placeholder="Eligibility confirmation script..." className={cn(inputClass, "resize-none text-[12px]")} />
                      <div className="mt-2">
                        <RecordingControls recording={agent.eligibilityRecording} onUpload={() => triggerUpload("eligibility")} onDelete={() => deleteRecording("eligibility")} />
                      </div>
                    </div>

                    {/* Final Recording */}
                    <div id="node-success" className={cn("rounded-lg border border-[#d0d5e4] bg-white p-3", focusedNode === "success" && "ring-2 ring-emerald-400/40")}>
                      <div className="mb-1.5 flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-[12px] font-semibold text-emerald-700">Final Recording</span>
                      </div>
                      <textarea value={agent.successScript} onChange={(e) => updateAgent({ successScript: e.target.value })} rows={2} placeholder="Closing script..." className={cn(inputClass, "resize-none text-[12px]")} />
                      <div className="mt-2">
                        <RecordingControls recording={agent.successRecording} onUpload={() => triggerUpload("success")} onDelete={() => deleteRecording("success")} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Edge Cases — form only, not on the diagram */}
                <SectionHeader title="Edge Cases" icon={GitBranch} color="bg-orange-100 text-orange-600" open={sections.edgeCases} onToggle={() => toggleSection("edgeCases")} badge={`${agent.edgeCases.length}`} />
                {sections.edgeCases && (
                  <div className="space-y-2 rounded-xl bg-white p-4 shadow-sm ring-1 ring-[#d0d5e4]/60">
                    <p className="text-[10px] text-[#7b89a8]">Handled at any point during the call — separate from the question flow.</p>
                    {agent.edgeCases.map((ec) => (
                      <div key={ec.id} className="rounded-lg border border-[#d0d5e4] bg-white p-2.5">
                        <div className="mb-1 flex items-center justify-between">
                          <input value={ec.name} onChange={(e) => updateEdgeCase(ec.id, { name: e.target.value })} placeholder="Edge case name" className="w-full bg-transparent text-[11px] font-semibold text-orange-700 outline-none placeholder:text-orange-300" />
                          <button onClick={() => removeEdgeCase(ec.id)} className="rounded p-1 text-[#7b89a8] hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
                        </div>
                        <textarea value={ec.script} onChange={(e) => updateEdgeCase(ec.id, { script: e.target.value })} rows={1} placeholder="Response script..." className={cn(inputClass, "resize-none text-[11px]")} />
                        <div className="mt-1.5">
                          <RecordingControls recording={ec.recording} onUpload={() => triggerUpload(ec.id)} onDelete={() => deleteRecording(ec.id)} />
                        </div>
                      </div>
                    ))}
                    <button onClick={addEdgeCase} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-orange-300/60 py-2 text-[11px] font-semibold text-orange-600 hover:bg-orange-50">
                      <Plus className="h-3 w-3" /> Add edge case
                    </button>
                  </div>
                )}

                {/* Silence */}
                <SectionHeader title="Silence Prompt" icon={Volume2} color="bg-pink-100 text-pink-600" open={sections.silence} onToggle={() => toggleSection("silence")} />
                {sections.silence && (
                  <div className="space-y-2 rounded-xl bg-white p-4 shadow-sm ring-1 ring-[#d0d5e4]/60">
                    <label className="text-[11px] font-semibold text-[#0A2353]">Script</label>
                    <textarea value={agent.silenceScript} onChange={(e) => updateAgent({ silenceScript: e.target.value })} rows={2} placeholder='"Allô ? Vous êtes toujours là ?"' className={cn(inputClass, "resize-none text-[12px]")} />
                    <RecordingControls recording={agent.silenceRecording} onUpload={() => triggerUpload("silence")} onDelete={() => deleteRecording("silence")} />
                  </div>
                )}

                {/* Extraction */}
                <SectionHeader title="Extraction Fields" icon={ClipboardList} color="bg-rose-100 text-rose-600" open={sections.extraction} onToggle={() => toggleSection("extraction")} badge={agent.extractionFields.length > 0 ? `${agent.extractionFields.length}` : undefined} />
                {sections.extraction && (
                  <div className="space-y-2 rounded-xl bg-white p-4 shadow-sm ring-1 ring-[#d0d5e4]/60">
                    {agent.extractionFields.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg border border-[#d0d5e4] bg-white p-2.5">
                        <input value={f.key} onChange={(e) => { const fields = [...agent.extractionFields]; fields[i] = { ...f, key: e.target.value }; updateAgent({ extractionFields: fields }); }} placeholder="Field name" className={cn(inputClass, "flex-1 text-[11px]")} />
                        <select value={f.type} onChange={(e) => { const fields = [...agent.extractionFields]; fields[i] = { ...f, type: e.target.value }; updateAgent({ extractionFields: fields }); }} className={cn(inputClass, "w-24 text-[11px]")}>
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="date">Date</option>
                          <option value="boolean">Y/N</option>
                        </select>
                        <button onClick={() => updateAgent({ extractionFields: agent.extractionFields.filter((_, j) => j !== i) })} className="rounded p-1 text-[#7b89a8] hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
                      </div>
                    ))}
                    <button onClick={() => updateAgent({ extractionFields: [...agent.extractionFields, { key: "", type: "text", description: "" }] })} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-rose-300/60 py-2 text-[11px] font-semibold text-rose-600 hover:bg-rose-50">
                      <Plus className="h-3 w-3" /> Add field
                    </button>
                  </div>
                )}

                {/* Settings */}
                <SectionHeader title="Settings" icon={Settings} color="bg-indigo-100 text-indigo-600" open={sections.settings} onToggle={() => toggleSection("settings")} />
                {sections.settings && (
                  <div className="space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-[#d0d5e4]/60">
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-[#0A2353]">Agent context</label>
                      <textarea rows={3} placeholder="Business context for natural objection handling..." className={cn(inputClass, "resize-none text-[12px]")} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── DIAGRAM VIEW ── */}
          {view === "diagram" && (
            <div className="custom-scrollbar flex-1 overflow-auto p-5">
              <FlowDiagramSVG agent={agent} onClickNode={handleDiagramClick} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

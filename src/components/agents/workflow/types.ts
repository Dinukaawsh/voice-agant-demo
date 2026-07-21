export type AnswerType = "yesno" | "open" | "choice";

export type FlowNode = {
  id: string;
  type: "opening" | "question" | "eligibility" | "success" | "exit";
  label: string;
  script: string;
  answerType?: AnswerType;
  rule?: string;
  failScript?: string;
  hasRecording: boolean;
  substages?: { id: string; label: string; script: string; hasRecording: boolean }[];
};

export type EdgeCase = {
  id: string;
  name: string;
  script: string;
  hasRecording: boolean;
};

export type Variation = {
  id: string;
  questionId: string;
  questionLabel: string;
  script: string;
  hasRecording: boolean;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "help";
  text: string;
  timestamp: Date;
};

export type WorkflowState = {
  agentName: string;
  language: string;
  nodes: FlowNode[];
  edgeCases: EdgeCase[];
  silencePrompt: { script: string; hasRecording: boolean };
  variations: Variation[];
  extractionFields: { key: string; type: string; description: string }[];
};

import type { WorkflowState, ChatMessage } from "./types";

export const MOCK_WORKFLOW: WorkflowState = {
  agentName: "Insurance Qualifier FR",
  language: "French",
  nodes: [
    {
      id: "opening",
      type: "opening",
      label: "Opening",
      script: "",
      hasRecording: false,
      substages: [
        {
          id: "open-1",
          label: "Opening 1",
          script:
            "Bonjour, je suis Lior de la mutuelle SantéPlus. Je vous appelle suite à votre demande de devis.",
          hasRecording: true,
        },
        {
          id: "open-2",
          label: "Opening 2",
          script:
            "Vous avez quelques minutes pour que je vous pose des questions rapides ?",
          hasRecording: true,
        },
      ],
    },
    {
      id: "q1",
      type: "question",
      label: "Question 1",
      script: "Quel est votre code postal, s’il vous plaît ?",
      answerType: "open",
      hasRecording: true,
    },
    {
      id: "q2",
      type: "question",
      label: "Question 2",
      script: "Quelle est votre date de naissance ?",
      answerType: "open",
      hasRecording: true,
    },
    {
      id: "q3",
      type: "question",
      label: "Question 3",
      script:
        "Avez-vous actuellement une mutuelle santé en cours ?",
      answerType: "yesno",
      rule: "Must answer yes or no clearly",
      failScript:
        "Je comprends, malheureusement nous ne pouvons pas continuer sans cette information. Merci et bonne journée.",
      hasRecording: true,
    },
    {
      id: "q4",
      type: "question",
      label: "Question 4",
      script:
        "Combien payez-vous par mois pour votre mutuelle actuelle ?",
      answerType: "open",
      hasRecording: false,
    },
    {
      id: "eligibility",
      type: "eligibility",
      label: "Eligibility",
      script:
        "Parfait, vous êtes éligible à nos offres. Laissez-moi vous transférer à un conseiller qui pourra vous proposer un devis personnalisé.",
      hasRecording: true,
    },
    {
      id: "success",
      type: "success",
      label: "Success",
      script:
        "Merci beaucoup pour votre temps. Un conseiller va vous recontacter très prochainement. Bonne journée !",
      hasRecording: false,
    },
  ],
  edgeCases: [
    {
      id: "ec-1",
      name: "Not interested",
      script:
        "Je comprends tout à fait. Je vous souhaite une excellente journée. Au revoir.",
      hasRecording: true,
    },
    {
      id: "ec-2",
      name: "Busy / call back later",
      script:
        "Pas de souci, à quel moment serait-il plus pratique de vous rappeler ?",
      hasRecording: true,
    },
    {
      id: "ec-3",
      name: "Asks who is calling",
      script:
        "Bien sûr, je suis Lior, de la mutuelle SantéPlus. Nous avons reçu votre demande de comparaison.",
      hasRecording: false,
    },
    {
      id: "ec-4",
      name: "Already has good coverage",
      script:
        "Je comprends. Nous pourrions quand même vérifier si nous pouvons améliorer vos garanties au même tarif. Cela vous intéresse ?",
      hasRecording: false,
    },
  ],
  silencePrompt: {
    script: "Allô ? Vous êtes toujours là ?",
    hasRecording: true,
  },
  variations: [
    {
      id: "var-1",
      questionId: "q1",
      questionLabel: "Question 1",
      script:
        "Pourriez-vous me donner votre code postal ?",
      hasRecording: false,
    },
    {
      id: "var-2",
      questionId: "q2",
      questionLabel: "Question 2",
      script:
        "Et votre date de naissance, c’est quand ?",
      hasRecording: false,
    },
    {
      id: "var-3",
      questionId: "q3",
      questionLabel: "Question 3",
      script:
        "Est-ce que vous bénéficiez d’une couverture santé actuellement ?",
      hasRecording: true,
    },
  ],
  extractionFields: [
    { key: "zip_code", type: "text", description: "Postal code" },
    { key: "date_of_birth", type: "date", description: "Date of birth" },
    { key: "has_current_coverage", type: "boolean", description: "Has existing health insurance" },
    { key: "monthly_premium", type: "number", description: "Current monthly premium amount" },
  ],
};

export const MOCK_CHAT_HISTORY: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    text: "I want to create an insurance qualification agent in French. It should ask for zip code, date of birth, whether they have current coverage, and how much they pay monthly.",
    timestamp: new Date("2026-07-21T10:00:00"),
  },
  {
    id: "m2",
    role: "assistant",
    text: "I’ve set up your agent flow with a 2-part opening, 4 qualification questions, eligibility confirmation, and a success closing. Question 3 (current coverage) has a yes/no rule — if they don’t answer clearly, the call ends with an exit script. You can see the full flow on the right. Would you like to adjust any scripts or add more questions?",
    timestamp: new Date("2026-07-21T10:00:15"),
  },
  {
    id: "m3",
    role: "user",
    text: "Add edge cases for when someone is not interested, busy, asks who is calling, or says they already have good coverage.",
    timestamp: new Date("2026-07-21T10:01:00"),
  },
  {
    id: "m4",
    role: "assistant",
    text: "Done — I’ve added 4 edge cases with French scripts. The “Not interested” and “Busy” cases end politely, “Who is calling” re-introduces the agent, and “Already covered” tries to re-engage. Check the Edge Cases panel below the flow. Want me to create question variations too?",
    timestamp: new Date("2026-07-21T10:01:20"),
  },
  {
    id: "m5",
    role: "user",
    text: "Yes, add variations for the first 3 questions.",
    timestamp: new Date("2026-07-21T10:02:00"),
  },
  {
    id: "m6",
    role: "assistant",
    text: "Added 3 question variations with natural rephrasings. They appear in the Variations panel. Now you can upload recordings for each node — click the mic icon on any card. What else would you like to adjust?",
    timestamp: new Date("2026-07-21T10:02:15"),
  },
];

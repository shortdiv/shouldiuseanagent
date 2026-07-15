const recentLines: string[] = [];
const HISTORY_LENGTH = 5;
const MAX_ATTEMPTS = 10;
const DATA = {
  no: {
    templates: [
      { text: "I'd rather {manual}", rarity: "common" },
      { text: "I love the {nature}", rarity: "common" },
      { text: "I care about {cause}", rarity: "common" },
      { text: "Honestly? {confession}", rarity: "uncommon" },
      { text: "I could be {state}", rarity: "uncommon" },
    ],
    fillers: {
      manual: [
        "debug it by hand like my ancestors did",
        "expend my sweat, blood, and tears on this",
        "suffer through the stack trace myself",
        "grind this out from first principles",
        "feel the weight of my own human frailty",
        "die on this hill",
        "earn my carpal tunnel",
        "write it and refactor it again",
        "be stuck alone in rebase hell",
      ],
      nature: ["planet", "ocean", "dolphins", "bees", "forest", "sea turtles"],
      cause: ["my last remaining brain cell", "the bees"],
      confession: [
        "I don't trust anything I didn't type myself",
        "I like doing things the hard way",
        "I want it to be my fault and mine alone",
        "shortcuts make me nervous",
        "I don't trust the robots",
        "I like suffering and earning my learning",
        "I want to be in control",
        "This is my entire personality",
        "This code and I we go way back",
      ],
      state: [
        "elbow deep in technical debt",
        "fighting the compiler",
        "up to my eyeballs in a refactor",
        "arguing with my linter",
        "arguing with my parser",
        "bisecting git history for sport",
        "actually rubber ducking with my rubber duck",
        "shaving a yak yet again",
        "reading the code from the source like a real programmer",
        "committing wip for the fourteenth time today",
        "reinventing the wheel",
        "git blaming myself",
      ],
    },
  },
  yes: {
    templates: [
      { text: "I eat {ai} for breakfast", rarity: "common" },
      { text: "I have a {trait}", rarity: "common" },
      { text: "I am {characteristic}", rarity: "common" },
      { text: "I love {passion}", rarity: "uncommon" },
      { text: "I {lifestyle}", rarity: "rare" },
    ],
    fillers: {
      ai: [
        "tokens",
        "context",
        "weights",
        "tensors",
        "latent space",
        "checkpoints",
        "tool calls",
        "your uncertainty",
        "prompts",
      ],
      trait: [
        "personality built entirely around throughput",
        "burning need to finish this",
        "to-do list I've fully outsourced",
        "deadline in 20 minutes and zero shame about it",
      ],
      characteristic: [
        "clearly better than you",
        "built different",
        "gonna make it",
        "a genius",
      ],
      passion: [
        "loopedy loops",
        "my life",
        "recursion",
        "the smell of a fresh context window",
        "the sound of my own tool calls",
      ],
      lifestyle: [
        "like managing a team that never asks for PTO",
        "am so cooked and proud",
        "have lost the plot completely and it's kind of freeing",
        "have fully surrendered to the vibes",
        "am along for the ride",
        "believe in agi like I believe in mercury being in retrograde",
        "move at the speed of my ideas",
        "can prototype in minutes instead of days",
      ],
    },
  },
};

const WEIGHTS: Record<string, number> = {
  common: 10,
  uncommon: 3,
  rare: 1,
};

const PROBABILITY = 0.5;

function weightedPick(items: { text: string; rarity: string }[]) {
  const pool = items.flatMap((item) =>
    Array(WEIGHTS[item.rarity] ?? 1).fill(item),
  );
  return pool[Math.floor(Math.random() * pool.length)];
}

function uniformPick(items: string[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function fillTemplate(template: string, fillers: Record<string, string[]>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const options = fillers[key];
    if (!options) return `{${key}}`;
    return uniformPick(options);
  });
}

export function getVerdict(forceVerdict?: "yes" | "no") {
  const verdict = forceVerdict ?? (Math.random() < PROBABILITY ? "yes" : "no");
  const bucket = DATA[verdict];
  let text;
  let attempts = 0;
  do {
    const template = weightedPick(bucket.templates);
    text = fillTemplate(template.text, bucket.fillers);
    attempts++;
  } while (recentLines.includes(text) && attempts < MAX_ATTEMPTS);

  recentLines.push(text);
  if (recentLines.length > HISTORY_LENGTH) recentLines.shift();

  return { verdict, text };
}

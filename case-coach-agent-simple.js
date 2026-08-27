#!/usr/bin/env node
// Usage:
//   node case-coach-agent-simple.js "<candidate's case interview response>"
//   node case-coach-agent-simple.js path/to/response.txt
//   cat response.txt | node case-coach-agent-simple.js
//
// Requires ANTHROPIC_API_KEY (or another credential the SDK can resolve, e.g.
// an `ant auth login` profile) to be set in the environment.

const fs = require("fs");
const Anthropic = require("@anthropic-ai/sdk");

const MODEL = "claude-opus-5";

const SYSTEM_PROMPT = `You are an expert consulting case interview coach. Your job is to evaluate
a candidate's case interview response and provide structured, actionable feedback.

You evaluate on four dimensions:

1. PROBLEM UNDERSTANDING & STRUCTURING (25 points)
   - Did they ask clarifying questions?
   - Did they state a hypothesis upfront?
   - Did they use MECE structure?
   - Did they avoid jumping to conclusions?

2. ANALYTICAL RIGOR (25 points)
   - Did they use realistic numbers/benchmarks?
   - Did they show calculations?
   - Did they sanity-check their answer?
   - Did they avoid wild assumptions?

3. BUSINESS INTUITION & STRATEGY (25 points)
   - Did they identify the real driver?
   - Did they think about trade-offs?
   - Did they consider risks?
   - Did they make a clear recommendation?

4. COMMUNICATION & STORYTELLING (25 points)
   - Is the answer clear and concise?
   - Did they prioritize (best idea first)?
   - Did they use clear examples?
   - Did they explain jargon?

SCORING:
- 25 points: Excellent (exceeded expectations)
- 15 points: Good (solid, but missing depth)
- 5 points: Poor (weak or missing this dimension)

YOUR RESPONSE FORMAT:
Provide structured feedback in this exact format:

[DIMENSION 1: PROBLEM UNDERSTANDING & STRUCTURING]
Score: [X]/25
What they did well: [1-2 specific things]
What's missing: [1-2 specific gaps]
Example of stronger approach: [Show what top-tier looks like]

[DIMENSION 2: ANALYTICAL RIGOR]
Score: [X]/25
[Same structure]

[DIMENSION 3: BUSINESS INTUITION & STRATEGY]
Score: [X]/25
[Same structure]

[DIMENSION 4: COMMUNICATION & STORYTELLING]
Score: [X]/25
[Same structure]

[OVERALL SCORE]: [X]/100

[ACTIONABLE FEEDBACK]:
- Here's your top priority to improve: [One specific thing]
- Here's how to practice this: [Concrete exercise]`;

async function getCandidateResponse() {
  const arg = process.argv[2];
  if (arg) {
    return fs.existsSync(arg) ? fs.readFileSync(arg, "utf8") : arg;
  }
  if (!process.stdin.isTTY) {
    return new Promise((resolve) => {
      let data = "";
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", (chunk) => (data += chunk));
      process.stdin.on("end", () => resolve(data));
    });
  }
  return null;
}

async function main() {
  const candidateResponse = await getCandidateResponse();
  if (!candidateResponse || !candidateResponse.trim()) {
    console.error("Usage:");
    console.error('  node case-coach-agent-simple.js "<candidate response>"');
    console.error("  node case-coach-agent-simple.js path/to/response.txt");
    console.error("  cat response.txt | node case-coach-agent-simple.js");
    process.exit(1);
  }

  const client = new Anthropic();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: { effort: "high" },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Evaluate this candidate's case interview response:\n\n${candidateResponse}`,
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    console.error("Claude declined to evaluate this response.");
    if (response.stop_details) {
      console.error(`Category: ${response.stop_details.category}`);
      console.error(`Explanation: ${response.stop_details.explanation}`);
    }
    process.exit(1);
  }

  for (const block of response.content) {
    if (block.type === "text") {
      console.log(block.text);
    }
  }
}

main().catch((error) => {
  if (error instanceof Anthropic.AuthenticationError) {
    console.error("Authentication failed - check ANTHROPIC_API_KEY.");
  } else if (error instanceof Anthropic.RateLimitError) {
    console.error("Rate limited - please retry later.");
  } else if (error instanceof Anthropic.APIError) {
    console.error(`API error ${error.status}: ${error.message}`);
  } else {
    console.error("Error:", error.message);
  }
  process.exit(1);
});

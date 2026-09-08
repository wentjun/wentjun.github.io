export const layers = [
  {
    name: 'Interface',
    drawing: 'The status window makes the wait visible.',
    caption:
      'A good interface helps you understand what’s happening. I care about the small details, like knowing whether your request is still running or needs another try.',
  },
  {
    name: 'Systems',
    drawing: 'The return path reconnects a failed request.',
    caption:
      'I enjoy the connections between application logic, data and APIs, especially working through what happens when a request arrives twice or another service stops responding.',
  },
  {
    name: 'Applied AI',
    drawing: 'The direct route and the model both pass a check.',
    caption:
      'I care about AI that solves actual problems. I want to know where a model helps, how to verify its answers, and when a simpler heuristic makes more sense.',
  },
  {
    name: 'Delivery',
    drawing: 'The path continues through an opening in the barrier.',
    caption:
      'I turn ideas into products people actually use. I work alongside the team to challenge assumptions and break tradeoffs.',
  },
] as const;
export const INITIAL_LAYER = 2;

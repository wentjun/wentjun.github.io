export const layers = [
  {
    name: 'Interface',
    drawing:
      'A person delegates to an agent, which operates a control inside the application on their behalf.',
    caption:
      'I design interfaces that people and agents can use without guesswork. Accessible structure, clear feedback, and well-defined actions help both understand what is happening and what to do next.',
  },
  {
    name: 'Systems',
    drawing:
      'A request passes a defined boundary before reaching the application.',
    caption:
      'I connect application logic, data, and models so agents can work safely with existing software and each other. That includes the protocols they use to communicate and the environments they run in.',
  },
  {
    name: 'Applied AI',
    drawing:
      'The direct route and the model route share a verification checkpoint.',
    caption:
      'I build AI workflows that stay dependable in everyday use. I choose where a model adds value and combine agent judgment with explicit rules and checks.',
  },
  {
    name: 'Delivery',
    drawing:
      'An unfinished application outline leads to the same application completed and ready to use.',
    caption:
      'I work with teams to turn ideas into working products. From concept to launch, I challenge assumptions, weigh tradeoffs, and stay hands-on through implementation.',
  },
] as const;
export const INITIAL_LAYER = 2;

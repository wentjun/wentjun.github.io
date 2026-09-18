export const layers = [
  {
    name: 'Interface',
    drawing:
      'A person delegates to an agent, which operates a control inside the application on their behalf.',
    caption:
      'An interface should serve humans and agents equally well. I design for accessibility, with semantic structure, explicit state, and clearly defined actions so both can navigate without guesswork.',
  },
  {
    name: 'Systems',
    drawing:
      'A request passes a defined boundary before reaching the application.',
    caption:
      'I enjoy working at the boundaries between application logic, data, and models. From communication protocols to runtime harnesses, I build the integration layers that let agents interact safely with existing software and each other.',
  },
  {
    name: 'Applied AI',
    drawing:
      'The direct route and the model route share a verification checkpoint.',
    caption:
      'I care about AI that solves actual problems. That means knowing where a model adds value, and pairing deterministic safeguards with agent judgment so complex workflows stay dependable under real-world use.',
  },
  {
    name: 'Delivery',
    drawing:
      'An unfinished application outline leads to the same application completed and ready to use.',
    caption:
      'I collaborate with the team to take ideas from concept to launch. I challenge assumptions, break tradeoffs, and stay hands-on every step of the way.',
  },
] as const;
export const INITIAL_LAYER = 2;

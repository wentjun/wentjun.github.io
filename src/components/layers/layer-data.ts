export const layers = [
  {
    name: 'Interface',
    drawing:
      'A person delegates to an agent, which operates a control inside the application on their behalf.',
    caption:
      'A good interface makes it clear what’s happening, whether you’re waiting for a request to finish, deciding when to retry, or using an agent to navigate the app on your behalf.',
  },
  {
    name: 'Systems',
    drawing:
      'A request passes a defined boundary before reaching the application.',
    caption:
      'I enjoy the boundaries between application logic, data, and models. I’ve brought WebMCP into production to help agents interact safely with existing applications.',
  },
  {
    name: 'Applied AI',
    drawing:
      'The direct route and the model route share a verification checkpoint.',
    caption:
      'I care about AI that solves actual problems. That means knowing where a model adds value, and pairing deterministic safeguards with agent judgment so complex workflows stay dependable real-world use.',
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

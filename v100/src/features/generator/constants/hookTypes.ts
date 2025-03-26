import { HookType } from '../types';

export const hookTypes: HookType[] = [
  {
    type: 'Question',
    label: 'Question',
    placeholder: "Craft an intriguing question that immediately draws the reader's attention. The question should be relevant to the article's topic and evoke curiosity or challenge common beliefs.",
  },
  {
    type: 'Statistical',
    label: 'Statistical or Fact',
    placeholder: "Begin with a surprising statistic or an unexpected fact that relates directly to the article's main topic. This hook should provide a sense of scale or impact that makes the reader eager to learn more.",
  },
  {
    type: 'Quotation',
    label: 'Quotation',
    placeholder: 'Share a relevant quote from an expert or influential figure that introduces your topic. The quote should be thought-provoking or inspiring.',
  },
  {
    type: 'Anecdotal',
    label: 'Anecdotal or Story',
    placeholder: "Create a brief, engaging story or anecdote that is relevant to the article's main subject. This story should be relatable and set the stage for the main content.",
  },
  {
    type: 'Personal',
    label: 'Personal or Emotional',
    placeholder: "Write an emotionally resonant opening that connects personally with the reader. This could be a reflection, a personal experience, or an emotional appeal that aligns with the article's theme.",
  },
];
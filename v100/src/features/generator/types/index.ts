export interface FormData {
    mainKeyword: string;
    country: string;
    language: string;
    wordCount: string;
    targetAudience: string;
    links: string;
    internalLinks: string;
    faqs: string;
    seoKeywords: string;
    imageDetails: string;
    tone: string;
    hookType: string;
    hookBrief: string;
  }
  
  export interface HookType {
    type: string;
    label: string;
    placeholder: string;
  }
  
  export interface ArticleSize {
    range: string;
    h2: string;
    sections: {
      intro: string | number;
      body: string;
      conclusion: string;
    };
  }
  
  export interface GenerationResult {
    content: string;
    status: string;
  }
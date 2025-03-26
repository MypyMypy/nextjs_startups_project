export interface StartupFormDataI {
  values: {
    title: string;
    description: string;
    category: string;
    link: string;
    pitch: string;
  };
  error: string;
  status: string;
}

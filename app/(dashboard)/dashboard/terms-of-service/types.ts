export type TabType = "terms" | "privacy";

export interface Section {
  _id?: string;
  title: string;
  content: string;
}

export const INITIAL_SECTION: Section = {
  title: "",
  content: "",
};

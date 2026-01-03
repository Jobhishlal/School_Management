export interface CreateAnnouncementInput {
  title: string;
  content: string;
  scope: "GLOBAL" | "CLASS";
  classes?: string[];
  division?: string | null;
  attachment?: string | null;
  activeTime: Date;
  endTime: Date;
}
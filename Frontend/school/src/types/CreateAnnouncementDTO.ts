
export interface CreateAnnouncementDTO {
  title: string;
  content: string;
  scope: "GLOBAL" | "CLASS" | "DIVISION";
   classes: string[];
  division?: string;
  attachment: File | null;
  activeTime: string;
  endTime: string;
  status: "DRAFT" | "ACTIVE";
}

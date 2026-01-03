export interface UpdateAnnouncementDTO {
  title?: string;
  content?: string;
  scope?: "GLOBAL" | "CLASS" | "DIVISION";
  classes?: string[];
  division?: string | null;

  attachment?: {
    url: string;
    filename: string;
    uploadAt: string;
  } | undefined;

  activeTime?: string;
  endTime?: string;
  status?: "DRAFT" | "ACTIVE";
}

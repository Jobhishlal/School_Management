export interface CreateAnnouncementDTO {
  title: string;
  content: string;

  scope: "GLOBAL" | "CLASS" | "DIVISION";

  classes?: string[];    
  division?: string|undefined;    

  attachment?: {
    url: string;
    filename: string;
    uploadAt: string;
  };
  activeTime: Date | string;
  endTime: Date | string;

  status?: "DRAFT" | "ACTIVE";
  
}

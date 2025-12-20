export interface AnnouncementNotificationDTO{
    title:string,
    content:string,
    scope:'GLOBAL'|'CLASS'|'DIVISION',
    classes: string[];
    division?: string|undefined;
  
}
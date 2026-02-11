export class Announcement {
  private _id?: string;
  private _title: string;
  private _content: string;
  private _scope: "GLOBAL" | "CLASS" | "DIVISION";
  private _classes?: string[];
  private _division?: string | null;
  private _attachment?: { url: string; filename: string; uploadAt: string };
  private _activeTime: Date | string;
  private _endTime: Date | string;
  private _status: "DRAFT" | "ACTIVE";

  constructor(
    id: string | undefined,
    title: string,
    content: string,
    scope: "GLOBAL" | "CLASS" | "DIVISION",
    classes: string[] | undefined,
    division: string | null | undefined,
    attachment: { url: string; filename: string; uploadAt: string } | undefined,
    activeTime: Date | string,
    endTime: Date | string,
    status: "DRAFT" | "ACTIVE" = "DRAFT"
  ) {
    this._id = id;
    this._title = title;
    this._content = content;
    this._scope = scope;
    this._classes = classes;
    this._division = division;
    this._attachment = attachment;
    this._activeTime = activeTime;
    this._endTime = endTime;
    this._status = status;
  }

  get id(): string | undefined { return this._id; }

  get title(): string { return this._title; }
  set title(value: string) { this._title = value; }

  get content(): string { return this._content; }
  set content(value: string) { this._content = value; }

  get scope(): "GLOBAL" | "CLASS" | "DIVISION" { return this._scope; }
  set scope(value: "GLOBAL" | "CLASS" | "DIVISION") { this._scope = value; }

  get classes(): string[] | undefined { return this._classes; }
  set classes(value: string[] | undefined) { this._classes = value; }

  get division(): string | null | undefined { return this._division; }
  set division(value: string | null | undefined) { this._division = value; }

  get attachment(): { url: string; filename: string; uploadAt: string } | undefined { return this._attachment; }
  set attachment(value: { url: string; filename: string; uploadAt: string } | undefined) { this._attachment = value; }

  get activeTime(): Date | string { return this._activeTime; }
  set activeTime(value: Date | string) { this._activeTime = value; }

  get endTime(): Date | string { return this._endTime; }
  set endTime(value: Date | string) { this._endTime = value; }

  get status(): "DRAFT" | "ACTIVE" { return this._status; }
  set status(value: "DRAFT" | "ACTIVE") { this._status = value; }

  public static validateDate(activeTime: Date | string, endTime: Date | string): void {
    const start = new Date(activeTime);
    const end = new Date(endTime);
    if (end < start) {
      throw new Error("End time cannot be before active time");
    }
  }
}

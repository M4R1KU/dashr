export interface DashModel {
  title: string;
  shortcut: string;
  levelLabel?: string;
  url?: string;
  children: Array<DashModel>;
}

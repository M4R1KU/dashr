export interface DashModel {
    title: string;
    shortcut: string;
    profile?: string;
    levelLabel?: string;
    url?: string;
    children: Array<DashModel>;
}

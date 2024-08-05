export interface Notice {
    id: string;
    title: string;
    description: string;
    status: NoticeStatus;
}

export enum NoticeStatus {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}
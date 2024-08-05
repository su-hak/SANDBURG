export interface Admin {
    id: string;
    title: string;
    description: string;
    status: AdminStatus;
}

export enum AdminStatus {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}
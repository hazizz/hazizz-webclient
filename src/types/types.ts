export interface AuthResponse {
    token: string,
    refresh: string,
    scopes: null,
    expires_in: number,
    refresh_token: string,
    access_token: string,
}

export enum GroupType {
    Open = "OPEN",
    Closed = "CLOSED",
}

export enum GroupPermission {
    Owner = "OWNER",
    Moderator = "MODERATOR",
    User = "USER",
    Null = "NULL"
}

export interface PublicGroupData {
    id: number,
    name: string,
    groupType: GroupType
    userCount: number
}

export interface PublicUserData {
    id: number,
    username: string,
    displayName: string
}

export interface PublicSubjectData {
    id: number,
    name: string,
    subscribeOnly: boolean,
    manager?: PublicUserData,
    subscribed: boolean
}

export enum AssignationType {
    Group = "GROUP",
    Subject = "SUBJECT",
    User = "USER",
    Thera = "THERA"
}

export interface PublicTaskData {
    id: number
    assignation: {
        name: AssignationType,
        id: number
    },
    title?: string,
    description: string,
    dueDate: string,
    creator: PublicUserData,
    group: PublicGroupData,
    subject: PublicSubjectData,
    tags: Array<string>,

    // Optionally on Hazizz tasks
    completed: boolean,
    permission: GroupPermission
}

export interface ErrorCodeResponse {
    errorCode: number,
    message: string,
    time: string,
    title: string,
    url: string
}
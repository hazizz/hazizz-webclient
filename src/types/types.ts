import {futimes} from "fs";

export type AuthDetails = {
    token: string,
    refresh: string,
    scopes: null,
    expires_in: number,
    refresh_token: string,
    access_token: string,
};

export type Group = {
    id: number,
    name: string,
    groupType: "OPEN" | "CLOSED",
    userCount: number
};

export type User = {
    id: number,
    username: string,
    displayName: string
}

export type Subject = {
    id: number,
    name: string,
    subscribeOnly: boolean,
    manager: User,
    subscribed: boolean
}

export type Task = {
    id: number
    assignation: {
        name: string,
        id: number
    },
    title: string,
    description: string,
    dueDate: string,
    creator: User,
    group: Group,
    subject: Subject,
    tags: Array<string>,
    completed: boolean,
    permission: string
};

export type Error = {
    errorCode: number,
    message: string,
    time: string,
    title: string,
    url: string
};
export interface Event {
    _id: string;
    start: string;
    end: string;
    description: string;
    location: string;
    summary: string;
    people?: string[];
}

export interface User {
    _id: string;
    firstname: string;
    surname?: string;
    avatar?: string;
    bio?: string;
}

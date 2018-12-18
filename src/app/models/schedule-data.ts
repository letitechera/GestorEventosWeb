export interface Schedule {
    id: number;
    eventId: number;
    date?: Date;
    activities: Activity[];
}

export interface Activity {
    id: number;
}

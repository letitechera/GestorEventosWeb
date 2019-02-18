import { EventData } from "./event-data";

export interface ParticipantData {
    ParticipantId: number;
    EventId: number;
    FirstName: string;
    LastName: string;
    Email: string;
    Phone: string;
    CellPhone: string;
    attendant: AttendantData;
    event: EventData;
}

export interface AttendantData{
    fullName: string;
}
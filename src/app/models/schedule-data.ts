export interface Schedule {
    Id: number;
    EventId: number;
    Date?: Date;
    PrettyDate: string;
}

export interface Activity {
    Id: number;
    Description: string;
    StartTime : Date;
    ActivityTypeId: number;
    EventScheduleId : number;
}


export interface Speaker{
    Id: number;
    FirstName: string;
    LastName: string;
    Position: string;
    Nationality: string;
    Company: string;
    Contact: string;
    Image: string;
    ActivityId: number;
}

export interface ActivityType {
    Id: number;
    Name: string;
}
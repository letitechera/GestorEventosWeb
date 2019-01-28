export interface Schedule {
    Id: number;
    EventId: number;
    Date?: Date;
}

export interface Activity {
    Id: number;
    Description: string;
    StartTime : Date;
    EndTime : Date;
    ActivityTypeId: number;
    EventScheduleId : Date;
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
export interface Schedule {
    Id: number;
    EventId: number;
    Date?: Date;
    PrettyDate: string;
    Activities: Activity[];
}

export interface Activity {
    Id: number;
    Name: string;
    Description: string;
    StartTime: Date;
    ActivityTypeId: number;
    EventScheduleId: number;
}

export interface ActivitySendable {
    Id: number;
    Name: string;
    Description: string;
    StartTime: string;
    ActivityTypeId: number;
    EventScheduleId: number;
}

export interface Speaker {
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

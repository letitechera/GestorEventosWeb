import { Schedule } from './schedule-data';
import { Participant } from './participant-data';

export interface EventData {
    EventId: number;
    Name: string;
    StartDate: Date;
    EndDate: Date;
    Image: string;
    Description: string;
    LocationId: number;
    EventTopicId: number;
    Canceled: boolean;
    Schedules?: Schedule[];
    Participants?: Participant[];
    Location: number;
    EventTopic: number;
    prettyShortStartDate: string;
    PrettyStartDate: string;
    prettyShortEndDate: string;
    PrettyEndDate: string;
    PrettyStartTime: string;
    PrettyEndTime: string;
    CreatedByName: string;
    CreatedById: string;
    ModifiedByName: string;
    ModifiedById: string;
    PrettyCreatedDate: string;
    PrettyModifiedDate: string;
}

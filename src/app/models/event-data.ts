import { LocationData } from './location-data';

export interface EventData {
    EventId: number;
    Name: string;
    StartDate: Date;
    EndDate: Date;
    Image: string;
    Description: string;
    Location: string;
    Address: string;
    Topic: string;
    CreatedById: string;
}

export interface EventFullData {
    EventId: number;
    Name: string;
    StartDate: Date;
    EndDate: Date;
    Image: string;
    Description: string;
    Location: LocationData;
    EventTopic: TopicData;
    Canceled: boolean;
}

export interface EventSendableData {
    Id: number;
    Name: string;
    StartDate: string;
    EndDate: string;
    Image: string;
    Description: string;
    LocationId: number;
    EventTopicId: number;
    Canceled: boolean;
}

export interface TopicData {
    TopicId: number;
    Name: string;
}

export interface RoleData {
    RoleId: number;
    Name: string;
}

export type IStatusValues = 'active' | 'filled' | 'rejected' | 'accepted';
import {v4 as uuidv4} from 'uuid'

export interface IPosition {
    id: string | null;
    company: string;
    name: string;
    url: string;
    status: IStatusValues;
    tier: 'S' | 'A' | 'B';
    createdDate: string;
    lastUpdated: string;
}

export class Position implements IPosition {
    id: string | null;
    company: string;
    name: string;
    url: string;
    status: IStatusValues;
    tier: 'S' | 'A' | 'B';
    createdDate: string;
    lastUpdated: string;

    constructor(
        company: string,
        name: string,
        url: string,
        status: IStatusValues,
        // S tier positions to me are high demand
        // A tier positions are one off positions are big/small companies such as QA but at apple
        // B tier positions to me are could be positions for backup
        tier: 'S' | 'A' | 'B',
        createdDate: string,
        lastUpdated: string,
        id = uuidv4()
    ) {
        this.id = id;
        this.company = company;
        this.name = name;
        this.url = url;
        this.status = status;
        this.tier = tier;
        this.createdDate = createdDate;
        this.lastUpdated = lastUpdated;
    }
}


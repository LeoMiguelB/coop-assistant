export type IStatusValues = 'active' | 'filled' | 'rejected' | 'accepted';

export interface IPosition {
    company: string;
    name: string;
    url: string;
    status: IStatusValues;
    tier: 'S' | 'A' | 'B';
    lastChecked: string;
    lastUpdated: string;
}

export class Position implements IPosition {
    company: string;
    name: string;
    url: string;
    status: IStatusValues;
    tier: 'S' | 'A' | 'B';
    lastChecked: string;
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
        lastChecked: string,
        lastUpdated: string
    ) {
        this.company = company;
        this.name = name;
        this.url = url;
        this.status = status;
        this.tier = tier;
        this.lastChecked = lastChecked;
        this.lastUpdated = lastUpdated;
    }
}


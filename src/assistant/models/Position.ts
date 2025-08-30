export interface IPosition {
    company: string;
    name: string;
    url: string;
    status: 'active' | 'filled' | 'rejected' | 'accepted';
    tier: 'big name' | 'mid size' | 'small name';
    lastChecked: string;
    lastUpdated: string;
}

export class Position implements IPosition {
    company: string;
    name: string;
    url: string;
    status: 'active' | 'filled' | 'rejected' | 'accepted';
    tier: 'big name' | 'mid size' | 'small name';
    lastChecked: string;
    lastUpdated: string;

    constructor(
        company: string,
        name: string,
        url: string,
        status: 'active' | 'filled' | 'rejected' | 'accepted',
        tier: 'big name' | 'mid size' | 'small name',
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


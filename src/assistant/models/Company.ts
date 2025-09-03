import { IPosition } from "./Position.js";

export interface ICompany {
    id: string | null;
    company: string;
    positions: IPosition[];
    AddPosition: (position: IPosition) => void;
}

export class Company implements ICompany {

    id: string | null;
    company: string;
    positions: IPosition[];
    
    constructor(company: string = "", positions: IPosition[] = [], id: string | null = null) {
        this.id = id;
        this.company = company;
        this.positions = positions;
    }

    public AddPosition(position: IPosition) {
        this.positions.push(position);
    }
}
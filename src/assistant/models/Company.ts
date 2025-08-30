import { IPosition } from "./Position.js";

export interface ICompany {
    company: string;
    positions: IPosition[];
    AddPosition: (position: IPosition) => void;
}

export class Company implements ICompany {
    company: string;
    positions: IPosition[];

    constructor(company: string = "", positions: IPosition[] = []) {
        this.company = company;
        this.positions = positions;
    }

    public AddPosition(position: IPosition) {
        this.positions.push(position);
    }
}
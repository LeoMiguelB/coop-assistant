import { IPosition } from "./Position.js";

export interface ICompany {
    id: string | null;
    company: string;
    positions: IPosition[];
    AddPosition: (position: IPosition) => void;
}

export class Company implements ICompany {

    private _id: string | null;
    company: string;
    positions: IPosition[];
    
    constructor(company: string = "", positions: IPosition[] = [], id = null) {
        this._id = id;
        this.company = company;
        this.positions = positions;
    }

    public get id(): string | null {
        return this._id;
    }

    public set id(value: string | null) {
        this._id = value;
    }

    public AddPosition(position: IPosition) {
        this.positions.push(position);
    }
}
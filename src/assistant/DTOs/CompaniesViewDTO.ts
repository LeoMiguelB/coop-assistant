// DTO to send to consumer (cli view) to render itself component and associated data

import { CompaniesViewProps } from "../view/CompaniesView.js";

export class CompaniesViewDTO {
    private _component: React.FC<CompaniesViewProps>;

    private _props: CompaniesViewProps;

    public get Component(): React.FC<CompaniesViewProps> {
        return this._component;
    }

    public set Component(value: React.FC<CompaniesViewProps>) {
        this._component = value;
    }

    public get Props(): CompaniesViewProps {
        return this._props;
    }

    public set Props(value: CompaniesViewProps) {
        this._props = value;
    }

    constructor(component: React.FC<CompaniesViewProps>, props: CompaniesViewProps) {
        this._component = component;
        this._props = props;
    }
}
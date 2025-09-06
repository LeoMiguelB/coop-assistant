// DTO to send to consumer (cli view) to render itself component and associated data

import { PositionsViewProps } from "../view/PositionsView.js";

export class PositionsViewDTO {
    private _component: React.FC<PositionsViewProps>;

    private _props: PositionsViewProps;

    public get Component(): React.FC<PositionsViewProps> {
        return this._component;
    }

    public set Component(value: React.FC<PositionsViewProps>) {
        this._component = value;
    }

    public get Props(): PositionsViewProps {
        return this._props;
    }

    public set Props(value: PositionsViewProps) {
        this._props = value;
    }

    constructor(component: React.FC<PositionsViewProps>, props: PositionsViewProps) {
        this._component = component;
        this._props = props;
    }
}
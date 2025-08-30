// DTO to send to consumer (cli view) to render itself component and associated data

import { JobsViewProps } from "../view/JobsView.js";

export class JobsViewDTO {
    private _component: React.FC<JobsViewProps>;

    private _props: JobsViewProps;

    public get Component(): React.FC<JobsViewProps> {
        return this._component;
    }

    public set Component(value: React.FC<JobsViewProps>) {
        this._component = value;
    }

    public get Props(): JobsViewProps {
        return this._props;
    }

    public set Props(value: JobsViewProps) {
        this._props = value;
    }

    constructor(component: React.FC<JobsViewProps>, props: JobsViewProps) {
        this._component = component;
        this._props = props;
    }
}
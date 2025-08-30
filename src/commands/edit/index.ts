import { Command, Flags } from "@oclif/core";
import { ICompany } from "../../assistant/models/Company.js";
import { Level } from "level";
import { DocumentManager } from "../../assistant/DocumentManager.js";
import { DB_PATH } from "../../assistant/constants.js";
import { IPosition } from "../../assistant/models/Position.js";

export default class Edit extends Command {
    static description = 'Edit position record.'

    // TODO: for now only status only thing updated, but should look to track other fields
    static examples = [`path/to/cmd edit -c "Company Name" -j "Job Name" -s rejected`]

    static flags = {
        company: Flags.string({char: 'c', description: 'Company Name', required: true}),
        position: Flags.string({char: 'p', description: 'Position Name', required: true}),
        status: Flags.string({char: 's', description: 'Status Change', required: true}),
    }

    async run(): Promise<any> {
        const {flags} = await this.parse(Edit)

        const isValidStatus = (status: string): status is IPosition['status'] => {
            return ['active', 'filled', 'rejected', 'accepted'].includes(status as IPosition['status']);
        };

        let status: IPosition['status'];

        if (isValidStatus(flags.status)) {
            status = flags.status;
        } else {
            this.error('Invalid status provided. Must be one of active, filled, rejected, accepted.');
        }

        const db = new Level<string, ICompany>(DB_PATH, {valueEncoding: 'json'})

        const documentManager = new DocumentManager(db)

        var result = await documentManager.UpdatePosition(flags.company, flags.position, status);

        this.log(result);
    }

}
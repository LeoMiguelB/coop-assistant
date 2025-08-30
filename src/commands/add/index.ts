import {Args, Command, Flags} from '@oclif/core'
import { Level } from 'level';
import { ICompany } from '../../assistant/models/Company.js';
import { DB_PATH } from '../../assistant/constants.js';
import { DocumentManager } from '../../assistant/DocumentManager.js';
import { Position } from '../../assistant/models/Position.js';

export default class Add extends Command {
    static description = 'Add a job to track.'
    static examples = [
      `path/to/cmd add -c "Company Name" -j "Job Name" -u "https://www.google.com"`,
    ]
    static flags = {
      company: Flags.string({char: 'c', description: 'Company name', required: true}),
      jobName: Flags.string({char: 'j', description: 'Job name', required: true}),
      jobUrl: Flags.string({char: 'u', description: 'Job URL', required: true}),
    }

    async run(): Promise<any> {
        const { flags } = await this.parse(Add)

        const db = new Level<string, ICompany>(DB_PATH, { valueEncoding: 'json' });

        const documentManager = new DocumentManager(db);

        const position = new Position(
            flags.company,
            flags.jobName,
            flags.jobUrl,
            'active',
            'mid size',
            Date.now().toString(),
            Date.now().toString()
        );

        documentManager.AddPosition(flags.company, position);

        this.log(`Successfully added ${flags.jobUrl}`);
    }
}
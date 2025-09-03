import { Command, Flags } from '@oclif/core'
import { Level } from 'level'
import { DB_PATH } from '../../assistant/constants.js'
import { DocumentManager } from '../../assistant/DocumentManager.js'
import { ICompany } from '../../assistant/models/Company.js'

export default class ViewJobs extends Command {
    static description = 'View List of Jobs Currently Tracking'
    static examples = [`path/to/cmd view-jobs`]
    static flags = {
        company: Flags.string({char: 'c', description: 'Company name', required: true}),
    }

    async run(): Promise<void> {
        const {flags} = await this.parse(ViewJobs);

        const db = new Level<string, ICompany>(DB_PATH, {valueEncoding: 'json'})

        const documentManager = new DocumentManager(db)

        var result = await documentManager.DeleteCompany(flags.company);

        this.log(result);
    }
}

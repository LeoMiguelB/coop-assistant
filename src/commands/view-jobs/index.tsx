import {Command, Flags} from '@oclif/core'
import {Level} from 'level'
import {ICompany} from '../../assistant/models/Company.js'
import {DB_PATH} from '../../assistant/constants.js'
import {DocumentManager} from '../../assistant/DocumentManager.js'
import {Position} from '../../assistant/models/Position.js'
import { render } from 'ink'

export default class ViewJobs extends Command {
    static description = 'View List of Jobs Currently Tracking'
    static examples = [`path/to/cmd view-jobs`]
    static flags = {
        // TODO: enable query for jobs under specific company
        // company: Flags.string({char: 'c', description: 'Company name', required: true}),

        // TODO: enable query for jobs nearing due date
    }

    async run(): Promise<void> {
        const db = new Level<string, ICompany>(DB_PATH, {valueEncoding: 'json'})

        const documentManager = new DocumentManager(db)

        const dto = await documentManager.ViewAllPosition();
        
        render(<dto.Component {...dto.Props} />)
    }
}

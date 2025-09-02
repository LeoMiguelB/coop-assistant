import {Command, Flags} from '@oclif/core'
import {Level} from 'level'
import {ICompany} from '../../assistant/models/Company.js'
import {DB_PATH} from '../../assistant/constants.js'
import {DocumentManager} from '../../assistant/DocumentManager.js'
import {IPosition, Position} from '../../assistant/models/Position.js'
import { CoverLetterGenService } from '../../assistant/Services/CoverLetterGenService.js'

export default class Add extends Command {
    static description = 'Add a job to track.'
    static examples = [`path/to/cmd add -c "Company Name" -j "Job Name" -u "https://www.google.com"`]
    static flags = {
        company: Flags.string({char: 'c', description: 'Company name', required: true}),
        position: Flags.string({char: 'p', description: 'Job name', required: true}),
        jobUrl: Flags.string({char: 'u', description: 'Job URL', required: true}),
        addressLine: Flags.string({char: 'l', aliases: ['al'], description: 'Address Line One', required: true}),
        city: Flags.string({char: 'm', aliases: ['cy'], description: 'City of Company', required: true}),
        province: Flags.string({char: 'o', aliases: ['pv'], description: 'Province of Company', required: true}),
        country: Flags.string({char: 'q', aliases: ['ct'], description: 'Country of Company', required: true}),
        postal: Flags.string({char: 'z', aliases: ['pl'], description: 'Postal Code of Company', required: true}),
        tier: Flags.string({char: 't', description: 'Position tier', required: false, default: 'B'}),
    }

    async run(): Promise<any> {
        const {flags} = await this.parse(Add)

        const db = new Level<string, ICompany>(DB_PATH, {valueEncoding: 'json'})

        const documentManager = new DocumentManager(db)

        const isValidTier = (tier: string): tier is IPosition['tier'] => {
            return ['S', 'A', 'B'].includes(tier as IPosition['tier']);
        };

        let tier: IPosition['tier'];
        if (isValidTier(flags.tier)) {
            tier = flags.tier;
        } else {
            this.error('Invalid tier provided. Must be one of S, A, B.');
        }

        // TODO: have integrated AI fill missing info (ex, only url is passed)
        const position = new Position(
            flags.company,
            flags.position,
            flags.jobUrl,
            'active',
            tier,
            Date.now().toString(),
            Date.now().toString(),
        )

        var msg = await documentManager.AddPosition(flags.company, position);

        this.log(msg);

        // now going to call on cv gen service
        var cvGenService = new CoverLetterGenService(
            flags.company,
            flags.addressLine,
            flags.city,
            flags.province,
            flags.country,
            flags.position
        );

        await cvGenService.Run();
    }
}

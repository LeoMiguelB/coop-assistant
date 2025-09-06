import { Command, Flags } from '@oclif/core'
import { render } from 'ink'
import { Level } from 'level'
import React from 'react'
import { DB_PATH } from '../../assistant/constants.js'
import { DocumentManager } from '../../assistant/DocumentManager.js'
import { ICompany } from '../../assistant/models/Company.js'

export default class Positions extends Command {
    static description = 'View List of Position Applied To Under Some Company'
    static examples = [`path/to/cmd positions -c someCompany`]
    static flags = {
        company: Flags.string({char: 'c', description: 'Company name', required: true}),
    }

    async run(): Promise<void> {
        const {flags} = await this.parse(Positions);

        const db = new Level<string, ICompany>(DB_PATH, {valueEncoding: 'json'})

        const documentManager = new DocumentManager(db)

        const dto = await documentManager.ViewPositions(flags.company);

        if (dto == null) {
            this.log(`Something went wrong trying to fetch positions under ${flags.company}`);
            return;
        }
        
        const instance = render(React.createElement(dto!.Component, dto!.Props), {
            stdout: process.stdout,
            stdin: process.stdin,
            stderr: process.stderr,
            exitOnCtrlC: true,
            patchConsole: true,
            isScreenReaderEnabled: false,
            debug: false,
        });

        await instance.waitUntilExit();
        instance.unmount();
        instance.clear();
        instance.cleanup();
    }
}

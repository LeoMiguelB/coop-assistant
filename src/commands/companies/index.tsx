import { Command } from '@oclif/core'
import { render } from 'ink'
import { Level } from 'level'
import React from 'react'
import { DB_PATH } from '../../assistant/constants.js'
import { DocumentManager } from '../../assistant/DocumentManager.js'
import { ICompany } from '../../assistant/models/Company.js'

export default class Companies extends Command {
    static description = 'View List Of Companies Applied To'
    static examples = [`path/to/cmd companies`]

    async run(): Promise<void> {
        const db = new Level<string, ICompany>(DB_PATH, {valueEncoding: 'json'})

        const documentManager = new DocumentManager(db)

        const dto = await documentManager.ViewCompanies();
        
        const instance = render(React.createElement(dto.Component, dto.Props), {
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

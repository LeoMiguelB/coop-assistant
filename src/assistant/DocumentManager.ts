import { Company, ICompany } from "./models/Company.js";
import { IPosition, Position } from "./models/Position.js";
import { access, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import * as fs from 'fs';
import { Level } from "level";
import { error } from "node:console";

export class DocumentManager {
    private dbConn: Level<string, ICompany>;

    constructor(dbConn: Level<string, ICompany>) {
        this.dbConn = dbConn;
    }

    public async AddPosition(company: string, position: IPosition) {
        const companyDetails = await this.GetCompanyDetails(company);

        if (companyDetails == null) {
            throw error("something went wrong trying retrieve company details.");
        }

        companyDetails?.AddPosition(position);

        var result = await this.UpdateCompanyDetails(companyDetails!);

        if (!result) {
            throw error("something went wrong trying update company details.");
        }
    }

    private async GetCompanyDetails(company: string): Promise<ICompany | null> {
        try {
            const data: ICompany = await this.dbConn.get(company);

            if (data == undefined) {
                // means we don't yet have a record of company so let's return an empty one with specified name
                return new Company(company);
            }

            return data;
        } catch (error) {
            console.error(`Error encountered while reading from document db: ${error}`);
            return null;
        }
    }

    private async UpdateCompanyDetails(companyDetails: ICompany): Promise<boolean> {
        try {
            await this.dbConn.put(companyDetails.company, companyDetails);
            return true;
        } catch (error) {
            console.error(`Encountered a problem while trying update job: ${error}`);
            return false;
        }
    }
      
}
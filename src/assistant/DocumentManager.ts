import {Company, ICompany} from './models/Company.js'
import {IPosition, IStatusValues, Position} from './models/Position.js'
import {Level, ValueIterator} from 'level'
import {error} from 'node:console'
import { CompaniesView, CompaniesViewProps } from './view/CompaniesView.js'
import { CompaniesViewDTO } from './DTOs/CompaniesViewDTO.js'
import {v4 as uuidv4} from 'uuid'
import { PositionsViewDTO } from './DTOs/PositionsViewDTO.js'
import { PositionsView } from './view/PositionsView.js'

export class DocumentManager {
    private dbConn: Level<string, ICompany>

    constructor(dbConn: Level<string, ICompany>) {
        this.dbConn = dbConn
    }

    public async AddPosition(company: string, position: IPosition): Promise<string> {
        const companyDetails = await this.GetCompanyDetails(company)

        if (companyDetails == null) {
            return 'something went wrong trying retrieve company details.';
        }

        // TODO: implement equality in Position implementation to better compare
        // TODO: best to provide implementation on returns to indicate consumer whether to run other services rather than just return a string
        if (companyDetails.positions && companyDetails.positions.some(pos => pos.name === position.name)) {
            return `Position: ${position.name} already exists under ${companyDetails.company}.`;
        }

        companyDetails?.AddPosition(position)

        var result = await this.UpdateCompanyDetails(companyDetails!)

        if (!result) {
            return 'something went wrong trying update company details.';
        }

        return `Successfully added Position: ${position.name} under ${companyDetails.company}`;
    }

    public async ViewCompanies(): Promise<CompaniesViewDTO> {
        const data = this.dbConn.values();

        // Instead of returning a JSX element, return the component type and props for the consumer to render.
        var dto = new CompaniesViewDTO(CompaniesView, {positions: data})

        return dto;
    }

    public async ViewPositions(company: string): Promise<PositionsViewDTO | null> {
        
        const data = await this.dbConn.get(company);

        if (data == undefined) {
            return null;
        }

        // Instead of returning a JSX element, return the component type and props for the consumer to render.
        var dto = new PositionsViewDTO(PositionsView, {company: data})

        return dto;
    }

    public async UpdatePosition(company: string, position: string, status: IStatusValues): Promise<string> {
        const data = await this.dbConn.get(company);

        let found = false;

        // search/update position in company
        for (const position of data.positions) {
            if (position.company == company) {
                position.status = status;
                position.lastUpdated = Date.now().toString();
                found = true;
                break;
            }
        }

        await this.dbConn.put(company, data);

        return found ? `Successfully updated ${company}:${position} status to ${status}` : `Was not able to find ${company}:${position}`;
    }

    public async DeleteCompany(company: string): Promise<string> {
        try {
            await this.dbConn.del(company);
        } catch (error) {
            return `Failed to deleted ${company}, received: ${error}`;
        }

        return `Successfully deleted all entries related to ${company}`;
    }

    // TODO: make a delete position

    private async GetCompanyDetails(company: string): Promise<ICompany | null> {
        try {
            const data: ICompany = await this.dbConn.get(company)

            if (data == undefined) {
                // means we don't yet have a record of company so let's return an empty one with specified name
                const comp = new Company(company);
                comp.id = uuidv4()

                return comp;

            }

            // Clean the data by creating new instances with only the expected properties
            // This ensures we have proper class instances with methods
            const cleanCompany = new Company(
                data.company, 
                data.positions.map(p => new Position(
                    p.company, p.name, p.url, p.status, p.tier, p.createdDate, p.lastUpdated, p.id || undefined
                )), 
                data.id
            );

            return cleanCompany;
        } catch (error) {
            console.error(`Error encountered while reading from document db: ${error}`)
            return null;
        }
    }

    private async UpdateCompanyDetails(companyDetails: ICompany): Promise<boolean> {
        try {
            await this.dbConn.put(companyDetails.company, companyDetails)
            return true;
        } catch (error) {
            console.error(`Encountered a problem while trying update job: ${error}`)
            return false;
        }
    }
}

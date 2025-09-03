import { spawn } from "child_process";
import { IExtService } from "./IExtService.js";

export class CoverLetterGenService implements IExtService {
    private readonly cvProcessPath: string;
    private readonly companyName: string;
    private readonly companyAddress: string;
    private readonly city: string;
    private readonly prov: string;
    private readonly country: string;
    private readonly positionTitle: string;

    constructor(
        companyName: string, 
        companyAddress: string, 
        city: string, 
        prov: string, 
        country: string, 
        positionTitle: string,
        cvProcessPath: string) 
    {
        this.companyName = companyName;
        this.companyAddress = companyAddress;
        this.city = city;
        this.prov = prov;
        this.country = country;
        this.positionTitle = positionTitle;
        this.cvProcessPath = cvProcessPath;
    }

    async Run(): Promise<void> {
        // await process
        await new Promise<void>((resolve, reject) => {
            try {
                const cv_process = spawn('powershell', [
                    '-File', this.cvProcessPath,
                    '-c', this.companyName, 
                    '-a', this.companyAddress,
                    '-cy', this.city,
                    '-p', this.prov,
                    '-cn', this.country,
                    '-pt', this.positionTitle
                ]);

                cv_process.on('close', (code) => {
                    console.log(`Process exited with code: ${code}`);
                    if (code === 0) {
                        console.log('CV gen success.');
                        resolve();
                    } else {
                        reject(new Error(`CV gen failed with exit code: ${code}`));
                    }
                });
    
                cv_process.on('error', (error) => {
                    console.error(`Failed to start process: ${error.message}`);
                    reject(error);
                });
            } catch (error) {
                console.log(`Could not spawn ${this.cvProcessPath}`);
                console.log(error);
            }

        });
    }
}

export interface IExtService {
    /*
    Runs some external services be it a powershell script, executable, app, etc.
    */
    Run(): Promise<void>;
}
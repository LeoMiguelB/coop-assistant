// Use the user's documents folder if available, otherwise fallback to current directory
const getDefaultDbPath = () => {
    const child = "CoopAssistantCli"
    const home = process.env.HOME || process.env.USERPROFILE;
    let documentsPath: string | undefined;

    if (process.platform === 'win32' && process.env.USERPROFILE) {
        documentsPath = `${process.env.USERPROFILE}\\Documents`;
    } else if (home) {
        documentsPath = `${home}/Documents`;
    }

    if (documentsPath) {
        return `${documentsPath}/${child}`;
    }
    // fallback to current directory
    return `./${child}`;
};

export const DB_PATH = getDefaultDbPath();
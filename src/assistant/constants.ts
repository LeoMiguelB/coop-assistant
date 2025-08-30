// Use the user's documents folder if available, otherwise fallback to current directory
const getDefaultDbPath = () => {
    const home = process.env.HOME || process.env.USERPROFILE;
    let documentsPath: string | undefined;

    if (process.platform === 'win32' && process.env.USERPROFILE) {
        documentsPath = `${process.env.USERPROFILE}\\Documents`;
    } else if (home) {
        documentsPath = `${home}/Documents`;
    }

    if (documentsPath) {
        return `${documentsPath}/tracking-jobs-store`;
    }
    // fallback to current directory
    return "./tracking-jobs-store";
};

export const DB_PATH = getDefaultDbPath();
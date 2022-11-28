import { unlink, exists} from "react-native-fs";
import ManageApps from "./manageApps";

export const deleteFile = async (path: string) => {
    try {
    const exist = await exists(path);
    if(exist) {
        const deleted = await unlink(path);
        return deleted;
    }
    return false;
    } catch(e: any) {
        console.log({error: `deleteFile: ${e.message}`});
        return false;
    }
}

export const deleteFiles = async (paths: string[]) => {
    if(paths.length === 0 || paths.filter(e => e).length === 0) {
        return;
    }
    try {
        if((await Promise.all(
            paths.map(path => deleteFile(path))
        )).every(e => e)) {
            return true;
        }
        return false;
    }catch(e: any) {
        console.log({error: `deleteFiles: ${e.messge}`})
        return false;
    }

}
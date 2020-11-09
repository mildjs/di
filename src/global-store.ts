import { Dictionary } from "./types";

export class GlobalStore {

    static get(key: string) {
        if (getGlobalStore().data === undefined)
            getGlobalStore().data = {};
        if (getGlobalStore().data[key] === undefined)
            return undefined;
        return getGlobalStore().data[key].value;
    }

    static set(key: string, value: any) {
        setGlobalStore(key, { value, editable: true });
        return true;
    }

    static setConst(key: string, value: any) {
        setGlobalStore(key, { value, editable: false });
        return true;
    }

}

function setGlobalStore(key: string, data: DataItem) {
    if (getGlobalStore().data === undefined)
        getGlobalStore().data = {};

    if (isEditable(key)) {
        getGlobalStore().data[key] = data;
    } else {
        throw new Error(`Can't modify value, because '${key}' is constant.`);
    }
}

function isEditable(key: string) {
    if (getGlobalStore().data === undefined)
        return true;
    if (getGlobalStore().data[key] === undefined)
        return true;
    
    const editable = getGlobalStore().data[key].editable;
    return editable === undefined ? false : editable;
}


type DataItem = {
    value: any,
    editable: boolean
}

class Store {
    data: Dictionary<DataItem>;
}

/**
 * Gets global store.
 */

function getGlobalStore(): Store {
    if (!(global as any).mildjsDiGlobalStore)
        (global as any).mildjsDiGlobalStore = new Store();

    return (global as any).mildjsDiGlobalStore;
}

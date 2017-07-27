// Localstorage
import ls, {ls_key_exists} from "./localStorageImpl";

if (null===ls) throw "localStorage is required but isn't available on this platform";

const localStorage = (key) => {

    const STORAGE_KEY = key + key;

    return {
        get(key, dv = {}) {

            let rv;
            try {
                if ( ls_key_exists(STORAGE_KEY, ls) ) {
                    rv = JSON.parse(ls.getItem(STORAGE_KEY));
                }
                return rv ? rv : dv;
            } catch(err) {
                return dv;
            }
        },

        set(key, object) {
            if (object && object.toJS) {
                object = object.toJS();
            }
            ls.setItem(STORAGE_KEY, JSON.stringify(object));
        },

        remove(key) {
            ls.removeItem(STORAGE_KEY);
        },

        has(key) {
            return ls_key_exists(STORAGE_KEY, ls);
        }
    };
};

export default localStorage;

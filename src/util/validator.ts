export const isValidId = (id: number): boolean => {

    if (id && typeof id === 'number' && Number.isInteger(id) && id > 0){
        return true;
    }

    return false;

}

export const isValidObject = (obj: Object, ...nullableVal: string[]) => {

    return obj && Object.keys(obj).every(key => {

        if (nullableVal.includes(key)){
            return true;
        }

        return obj[key];

    });

}


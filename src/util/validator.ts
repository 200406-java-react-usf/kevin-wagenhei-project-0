export const isValidId = (id: number): boolean => {

    if (id && typeof id === 'number' && Number.isInteger(id) && id > 0){
        return true;
    }

    return false;

};

export const isValidString = (...input: string[]): boolean => {

    for (let i of input){
        if (!i || typeof i !== 'string'){
            return false;
        }
    }

    return true;
    
};

export const isValidObject = (obj: Object, ...nullableVal: string[]) => {

    return obj && Object.keys(obj).every(key => {

        if (nullableVal.includes(key)){
            return true;
        }

        return obj[key];

    });

};

export const isEmptyObject = (obj: any) => {

    if(!obj || Object.keys(obj).length === 0){
        return false;
    }

    return true;

};

export const isPropertyOf = (prop: string, type: any) => {

    if(!prop || !type){

        return false;

    }

    let typeCreator = <T>(Type: (new () => T)): T => {

        return new Type();

    }

    let tempInstance;
    try{
        tempInstance = typeCreator(type);
    } catch {
        return false;
    }

    return Object.keys(tempInstance).includes(prop);

};

export default {
    isValidId,
    isValidObject,
    isValidString,
    isEmptyObject,
    isPropertyOf
};




export const isValidId = (id: number): boolean => {

    if (id && typeof id === 'number' && Number.isInteger(id) && id > 0){
        return true;
    }

    return false;

}


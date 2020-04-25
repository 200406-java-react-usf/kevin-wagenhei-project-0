export interface CrudRepository<T> {

    getAll(): Promise<T[]>;
    getById(): Promise<T>;
    save(newObj: T): Promise<T>;
    update(updatedObj: T): Promise<boolean>;
    deleteById(id: number): Promise<boolean>;

}
export declare class MemoryStore<T extends {
    id: string;
}> {
    private items;
    list(): T[];
    get(id: string): T | undefined;
    create(data: Omit<T, 'id'>): T;
    update(id: string, data: Partial<T>): T | undefined;
}

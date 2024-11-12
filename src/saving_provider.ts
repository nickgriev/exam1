export interface SavingProvider<T> {
    save(item: T): void;
    load(): T;
}

export class LocalStorageSavingProvider<T> implements SavingProvider<T> {
    constructor(private key: string) { }

    save(item: T) {
        localStorage.setItem(this.key, JSON.stringify(item));
    }

    load(): T {
        const item = localStorage.getItem(this.key);
        return item ? JSON.parse(item) : null;
    }
}

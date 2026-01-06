"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryStore = void 0;
const crypto_1 = require("crypto");
class MemoryStore {
    constructor() {
        this.items = [];
    }
    list() {
        return this.items;
    }
    get(id) {
        return this.items.find((i) => i.id === id);
    }
    create(data) {
        const item = Object.assign({ id: (0, crypto_1.randomUUID)() }, data);
        this.items.push(item);
        return item;
    }
    update(id, data) {
        const idx = this.items.findIndex((i) => i.id === id);
        if (idx === -1)
            return undefined;
        this.items[idx] = Object.assign(Object.assign({}, this.items[idx]), data);
        return this.items[idx];
    }
}
exports.MemoryStore = MemoryStore;
//# sourceMappingURL=memory-store.js.map
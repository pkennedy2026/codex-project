"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const session_entity_1 = require("./session.entity");
const tenant_entity_1 = require("../tenants/tenant.entity");
const subscriber_entity_1 = require("../subscribers/subscriber.entity");
let SessionsService = class SessionsService {
    constructor(sessions, tenants, subscribers) {
        this.sessions = sessions;
        this.tenants = tenants;
        this.subscribers = subscribers;
    }
    list() {
        return this.sessions.find();
    }
    async start(input) {
        const tenant = await this.tenants.findOneByOrFail({ id: input.tenantId });
        const subscriber = await this.subscribers.findOneByOrFail({ id: input.subscriberId });
        const entity = this.sessions.create({
            tenant,
            subscriber,
            sessionType: input.sessionType,
            status: 'active',
            startedAt: new Date(),
            nasIp: input.nasIp,
            framedIp: input.framedIp,
            macAddress: input.macAddress,
        });
        return this.sessions.save(entity);
    }
    async end(id, payload) {
        const session = await this.sessions.findOneByOrFail({ id });
        session.status = 'ended';
        session.endedAt = new Date();
        if ((payload === null || payload === void 0 ? void 0 : payload.bytesIn) !== undefined)
            session.bytesIn = payload.bytesIn;
        if ((payload === null || payload === void 0 ? void 0 : payload.bytesOut) !== undefined)
            session.bytesOut = payload.bytesOut;
        return this.sessions.save(session);
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __param(1, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __param(2, (0, typeorm_1.InjectRepository)(subscriber_entity_1.Subscriber)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map
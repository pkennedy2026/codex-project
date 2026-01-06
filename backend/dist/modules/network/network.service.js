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
exports.NetworkService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nas_entity_1 = require("./nas.entity");
const tenant_entity_1 = require("../tenants/tenant.entity");
const ap_entity_1 = require("./ap.entity");
let NetworkService = class NetworkService {
    constructor(nasRepo, apRepo, tenants) {
        this.nasRepo = nasRepo;
        this.apRepo = apRepo;
        this.tenants = tenants;
    }
    listNas() {
        return this.nasRepo.find();
    }
    async createNas(input) {
        var _a;
        const tenant = await this.tenants.findOneByOrFail({ id: input.tenantId });
        const entity = this.nasRepo.create({
            tenant,
            name: input.name,
            ipAddress: input.ipAddress,
            secret: input.secret,
            type: (_a = input.type) !== null && _a !== void 0 ? _a : 'mikrotik',
            vpnIp: input.vpnIp,
            tunnelPort: input.tunnelPort,
        });
        return this.nasRepo.save(entity);
    }
    listAps() {
        return this.apRepo.find();
    }
    async createAp(input) {
        var _a;
        const tenant = await this.tenants.findOneByOrFail({ id: input.tenantId });
        const entity = this.apRepo.create({
            tenant,
            name: input.name,
            macAddress: input.macAddress,
            ipAddress: input.ipAddress,
            status: (_a = input.status) !== null && _a !== void 0 ? _a : 'unknown',
            firmwareVersion: input.firmwareVersion,
            ssidConfig: input.ssidConfig,
        });
        return this.apRepo.save(entity);
    }
    async diagnostics(input) {
        return { target: input.target, type: input.type, result: 'ok (mock)' };
    }
};
exports.NetworkService = NetworkService;
exports.NetworkService = NetworkService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(nas_entity_1.NasDevice)),
    __param(1, (0, typeorm_1.InjectRepository)(ap_entity_1.AccessPoint)),
    __param(2, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], NetworkService);
//# sourceMappingURL=network.service.js.map
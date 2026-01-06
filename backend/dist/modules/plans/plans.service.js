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
exports.PlansService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const plan_entity_1 = require("./plan.entity");
const tenant_entity_1 = require("../tenants/tenant.entity");
let PlansService = class PlansService {
    constructor(repo, tenants) {
        this.repo = repo;
        this.tenants = tenants;
    }
    list() {
        return this.repo.find();
    }
    async create(input) {
        var _a, _b;
        const tenant = await this.tenants.findOneByOrFail({ id: input.tenantId });
        const entity = this.repo.create({
            tenant,
            name: input.name,
            price: input.price,
            downloadSpeed: input.downloadSpeed,
            uploadSpeed: input.uploadSpeed,
            dataCap: input.dataCap,
            validityDays: input.validityDays,
            billingCycle: input.billingCycle,
            isHotspot: (_a = input.isHotspot) !== null && _a !== void 0 ? _a : false,
            isPppoe: (_b = input.isPppoe) !== null && _b !== void 0 ? _b : false,
        });
        return this.repo.save(entity);
    }
};
exports.PlansService = PlansService;
exports.PlansService = PlansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(plan_entity_1.Plan)),
    __param(1, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PlansService);
//# sourceMappingURL=plans.service.js.map
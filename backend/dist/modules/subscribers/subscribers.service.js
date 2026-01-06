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
exports.SubscribersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subscriber_entity_1 = require("./subscriber.entity");
const tenant_entity_1 = require("../tenants/tenant.entity");
const plan_entity_1 = require("../plans/plan.entity");
let SubscribersService = class SubscribersService {
    constructor(repo, tenants, plans) {
        this.repo = repo;
        this.tenants = tenants;
        this.plans = plans;
    }
    list() {
        return this.repo.find();
    }
    async create(input) {
        var _a;
        const tenant = await this.tenants.findOneByOrFail({ id: input.tenantId });
        const plan = input.planId ? await this.plans.findOneBy({ id: input.planId }) : null;
        const entity = this.repo.create({
            tenant,
            plan: plan !== null && plan !== void 0 ? plan : undefined,
            username: input.username,
            fullName: input.fullName,
            email: input.email,
            phone: input.phone,
            status: (_a = input.status) !== null && _a !== void 0 ? _a : 'active',
            connectionType: input.connectionType,
        });
        return this.repo.save(entity);
    }
};
exports.SubscribersService = SubscribersService;
exports.SubscribersService = SubscribersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscriber_entity_1.Subscriber)),
    __param(1, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __param(2, (0, typeorm_1.InjectRepository)(plan_entity_1.Plan)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SubscribersService);
//# sourceMappingURL=subscribers.service.js.map
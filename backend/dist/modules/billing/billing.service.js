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
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_entity_1 = require("./invoice.entity");
const tenant_entity_1 = require("../tenants/tenant.entity");
const subscriber_entity_1 = require("../subscribers/subscriber.entity");
let BillingService = class BillingService {
    constructor(invoices, tenants, subscribers) {
        this.invoices = invoices;
        this.tenants = tenants;
        this.subscribers = subscribers;
    }
    listInvoices() {
        return this.invoices.find();
    }
    async getInvoice(id) {
        const invoice = await this.invoices.findOneOrFail({
            where: { id },
        });
        const aggregate = (await this.invoices.manager
            .createQueryBuilder()
            .select('SUM(p.amount)', 'totalPaid')
            .from('payments', 'p')
            .where('p.invoiceId = :id', { id })
            .getRawOne()) || { totalPaid: '0' };
        return { invoice, totalPaid: Number(aggregate.totalPaid || 0) };
    }
    async createInvoice(input) {
        var _a;
        const tenant = await this.tenants.findOneByOrFail({ id: input.tenantId });
        const subscriber = await this.subscribers.findOneByOrFail({ id: input.subscriberId });
        const entity = this.invoices.create({
            tenant,
            subscriber,
            invoiceNumber: input.invoiceNumber,
            amount: input.amount,
            tax: (_a = input.tax) !== null && _a !== void 0 ? _a : 0,
            total: input.total,
            status: input.status,
            dueDate: input.dueDate,
            paidAt: input.paidAt ? new Date(input.paidAt) : undefined,
        });
        return this.invoices.save(entity);
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(1, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __param(2, (0, typeorm_1.InjectRepository)(subscriber_entity_1.Subscriber)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BillingService);
//# sourceMappingURL=billing.service.js.map
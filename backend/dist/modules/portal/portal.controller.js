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
exports.PortalController = void 0;
const common_1 = require("@nestjs/common");
const vouchers_service_1 = require("../vouchers/vouchers.service");
const subscribers_service_1 = require("../subscribers/subscribers.service");
let PortalController = class PortalController {
    constructor(vouchers, subscribers) {
        this.vouchers = vouchers;
        this.subscribers = subscribers;
    }
    health() {
        return { service: 'portal', status: 'ok' };
    }
    tenantPortal(tenantSlug) {
        return { portal: tenantSlug, status: 'placeholder' };
    }
    async redeem(tenantId, body) {
        await this.vouchers.redeem({ code: body.code, subscriberId: body.subscriberId });
        return { status: 'redeemed', code: body.code };
    }
    async register(tenantId, body) {
        const sub = await this.subscribers.create({
            tenantId,
            username: body.username,
            email: body.email,
            fullName: body.fullName,
            phone: body.phone,
            connectionType: body.connectionType,
            status: 'active',
        });
        return { subscriberId: sub.id };
    }
};
exports.PortalController = PortalController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "health", null);
__decorate([
    (0, common_1.Get)(':tenantSlug'),
    __param(0, (0, common_1.Param)('tenantSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "tenantPortal", null);
__decorate([
    (0, common_1.Post)(':tenantId/redeem'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PortalController.prototype, "redeem", null);
__decorate([
    (0, common_1.Post)(':tenantId/register'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PortalController.prototype, "register", null);
exports.PortalController = PortalController = __decorate([
    (0, common_1.Controller)('portal'),
    __metadata("design:paramtypes", [vouchers_service_1.VouchersService,
        subscribers_service_1.SubscribersService])
], PortalController);
//# sourceMappingURL=portal.controller.js.map
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
exports.SubscribersController = void 0;
const common_1 = require("@nestjs/common");
const subscribers_service_1 = require("./subscribers.service");
const dtos_1 = require("../../common/dtos");
const auth_guard_1 = require("../auth/auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
let SubscribersController = class SubscribersController {
    constructor(subscribers) {
        this.subscribers = subscribers;
    }
    health() {
        return { service: 'subscribers', status: 'ok' };
    }
    list() {
        return this.subscribers.list();
    }
    create(body) {
        return this.subscribers.create(body);
    }
};
exports.SubscribersController = SubscribersController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubscribersController.prototype, "health", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscribersController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.SubscriberCreateDto]),
    __metadata("design:returntype", Promise)
], SubscribersController.prototype, "create", null);
exports.SubscribersController = SubscribersController = __decorate([
    (0, common_1.Controller)('subscribers'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [subscribers_service_1.SubscribersService])
], SubscribersController);
//# sourceMappingURL=subscribers.controller.js.map
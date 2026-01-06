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
exports.NetworkController = void 0;
const common_1 = require("@nestjs/common");
const network_service_1 = require("./network.service");
const auth_guard_1 = require("../auth/auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
let NetworkController = class NetworkController {
    constructor(network) {
        this.network = network;
    }
    health() {
        return { service: 'network', status: 'ok' };
    }
    listNas() {
        return this.network.listNas();
    }
    createNas(body) {
        return this.network.createNas(body);
    }
    listAps() {
        return this.network.listAps();
    }
    createAp(body) {
        return this.network.createAp(body);
    }
    diagnostics(body) {
        return this.network.diagnostics(body);
    }
};
exports.NetworkController = NetworkController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NetworkController.prototype, "health", null);
__decorate([
    (0, common_1.Get)('nas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NetworkController.prototype, "listNas", null);
__decorate([
    (0, common_1.Post)('nas'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NetworkController.prototype, "createNas", null);
__decorate([
    (0, common_1.Get)('access-points'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NetworkController.prototype, "listAps", null);
__decorate([
    (0, common_1.Post)('access-points'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NetworkController.prototype, "createAp", null);
__decorate([
    (0, common_1.Post)('diagnostics'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NetworkController.prototype, "diagnostics", null);
exports.NetworkController = NetworkController = __decorate([
    (0, common_1.Controller)('network'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [network_service_1.NetworkService])
], NetworkController);
//# sourceMappingURL=network.controller.js.map
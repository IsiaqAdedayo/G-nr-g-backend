"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GarmentsModule = void 0;
const common_1 = require("@nestjs/common");
const garments_service_js_1 = require("./garments.service.js");
const garments_controller_js_1 = require("./garments.controller.js");
let GarmentsModule = class GarmentsModule {
};
exports.GarmentsModule = GarmentsModule;
exports.GarmentsModule = GarmentsModule = __decorate([
    (0, common_1.Module)({
        controllers: [garments_controller_js_1.GarmentsController],
        providers: [garments_service_js_1.GarmentsService],
        exports: [garments_service_js_1.GarmentsService],
    })
], GarmentsModule);
//# sourceMappingURL=garments.module.js.map
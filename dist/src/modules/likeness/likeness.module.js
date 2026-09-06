"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikenessModule = void 0;
const common_1 = require("@nestjs/common");
const likeness_service_js_1 = require("./likeness.service.js");
const likeness_controller_js_1 = require("./likeness.controller.js");
const matching_service_js_1 = require("./matching.service.js");
let LikenessModule = class LikenessModule {
};
exports.LikenessModule = LikenessModule;
exports.LikenessModule = LikenessModule = __decorate([
    (0, common_1.Module)({
        controllers: [likeness_controller_js_1.LikenessController],
        providers: [likeness_service_js_1.LikenessService, matching_service_js_1.MatchingService],
        exports: [likeness_service_js_1.LikenessService],
    })
], LikenessModule);
//# sourceMappingURL=likeness.module.js.map
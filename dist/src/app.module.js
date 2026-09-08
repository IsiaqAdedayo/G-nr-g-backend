"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const bullmq_1 = require("@nestjs/bullmq");
const prisma_module_js_1 = require("./prisma/prisma.module.js");
const auth_module_js_1 = require("./modules/auth/auth.module.js");
const profiles_module_js_1 = require("./modules/profiles/profiles.module.js");
const likeness_module_js_1 = require("./modules/likeness/likeness.module.js");
const garments_module_js_1 = require("./modules/garments/garments.module.js");
const try_ons_module_js_1 = require("./modules/try-ons/try-ons.module.js");
const looks_module_js_1 = require("./modules/looks/looks.module.js");
const models_module_js_1 = require("./modules/models/models.module.js");
const brands_module_js_1 = require("./modules/brands/brands.module.js");
const fit_analysis_module_js_1 = require("./modules/fit-analysis/fit-analysis.module.js");
const jobs_module_js_1 = require("./modules/jobs/jobs.module.js");
const ai_module_js_1 = require("./modules/ai/ai.module.js");
const uploads_module_js_1 = require("./modules/uploads/uploads.module.js");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 60_000,
                        limit: 60,
                    },
                ],
            }),
            bullmq_1.BullModule.forRoot({
                connection: {
                    host: process.env.REDIS_HOST || '127.0.0.1',
                    port: parseInt(process.env.REDIS_PORT || '6379', 10),
                },
            }),
            prisma_module_js_1.PrismaModule,
            auth_module_js_1.AuthModule,
            profiles_module_js_1.ProfilesModule,
            likeness_module_js_1.LikenessModule,
            garments_module_js_1.GarmentsModule,
            try_ons_module_js_1.TryOnsModule,
            looks_module_js_1.LooksModule,
            models_module_js_1.ModelsModule,
            brands_module_js_1.BrandsModule,
            fit_analysis_module_js_1.FitAnalysisModule,
            jobs_module_js_1.JobsModule,
            ai_module_js_1.AiModule,
            uploads_module_js_1.UploadsModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
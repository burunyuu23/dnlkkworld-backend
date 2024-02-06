"use strict";
import { ChatGateway } from './chat/chat.gateway';
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var process_1 = require("process");
var nest_keycloak_connect_1 = require("nest-keycloak-connect");
var core_1 = require("@nestjs/core");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var questionnaires_module_1 = require("./questionnaires/questionnaires.module");
var user_module_1 = require("./user/user.module");
var NODE_ENV = process_1.env.NODE_ENV;
if (!NODE_ENV) {
    throw new Error('Не задана переменная окружения NODE_ENV');
}
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: [".env.".concat(NODE_ENV), '.env'],
                    expandVariables: true,
                }),
                questionnaires_module_1.QuestionnairesModule,
                user_module_1.UserModule,
                nest_keycloak_connect_1.KeycloakConnectModule.register({
                    authServerUrl: process.env.KEYCLOAK_URL,
                    realm: process.env.KEYCLOAK_REALM,
                    clientId: process.env.KEYCLOAK_CLIENT_ID,
                    secret: process.env.KEYCLOAK_SECRET,
                    logLevels: ['error'],
                    policyEnforcement: nest_keycloak_connect_1.PolicyEnforcementMode.ENFORCING,
                    tokenValidation: nest_keycloak_connect_1.TokenValidation.OFFLINE,
                }),
            ],
            controllers: [app_controller_1.AppController],
            providers: [
                app_service_1.AppService,
                {
                    provide: core_1.APP_GUARD,
                    useClass: nest_keycloak_connect_1.AuthGuard, // Global Authentication Guard
                },
                {
                    provide: core_1.APP_GUARD,
                    useClass: nest_keycloak_connect_1.RoleGuard, // Global Role Guard
                },
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;

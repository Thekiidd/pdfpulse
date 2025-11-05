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
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const counter_entity_1 = require("./entities/counter.entity");
const procesados_entity_1 = require("./entities/procesados.entity");
let StatsService = class StatsService {
    counterRepo;
    procesadosRepo;
    constructor(counterRepo, procesadosRepo) {
        this.counterRepo = counterRepo;
        this.procesadosRepo = procesadosRepo;
    }
    async getCount() {
        const counter = await this.counterRepo.findOne({ where: { id: 1 } });
        return { total: counter?.total || 0 };
    }
    async increment(type = 'pdf', hash = null) {
        await this.procesadosRepo.insert({ tipo: type, hash });
        await this.counterRepo.increment({ id: 1 }, 'total', 1);
        const counter = await this.counterRepo.findOne({ where: { id: 1 } });
        return { total: counter.total };
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(counter_entity_1.CounterEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(procesados_entity_1.ProcesadosEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StatsService);
//# sourceMappingURL=stats.service.js.map
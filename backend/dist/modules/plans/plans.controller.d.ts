import { PlansService } from './plans.service';
import { PlanCreateDto } from '../../common/dtos';
import { Plan } from './plan.entity';
export declare class PlansController {
    private readonly plans;
    constructor(plans: PlansService);
    health(): {
        service: string;
        status: string;
    };
    list(): Promise<Plan[]>;
    create(body: PlanCreateDto): Promise<Plan>;
}

import { PaymentsService } from './payments.service';
import { PaymentCreateDto } from '../../common/dtos';
import { Payment } from './payment.entity';
export declare class PaymentsController {
    private readonly payments;
    constructor(payments: PaymentsService);
    health(): {
        service: string;
        status: string;
    };
    list(): Promise<Payment[]>;
    create(body: PaymentCreateDto): Promise<Payment>;
}

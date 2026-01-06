import { SubscribersService } from './subscribers.service';
import { SubscriberCreateDto } from '../../common/dtos';
import { Subscriber } from './subscriber.entity';
export declare class SubscribersController {
    private readonly subscribers;
    constructor(subscribers: SubscribersService);
    health(): {
        service: string;
        status: string;
    };
    list(): Promise<Subscriber[]>;
    create(body: SubscriberCreateDto): Promise<Subscriber>;
}

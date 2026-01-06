import { Controller, Get } from '@nestjs/common';

@Controller('shop')
export class ShopController {
  @Get('health')
  health() {
    return { service: 'shop', status: 'ok' };
  }
}

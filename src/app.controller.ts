import { Body, Controller, Get, Header, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('web-sockets api')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('ws-api')
    @Header('content-type', 'text/html')
    async getWebSocketsApi() {
        return fs.readFileSync('src/views/ws-api.html').toString();
    }
}

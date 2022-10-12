import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'net';
import { ScheduleService } from './schedule.service';
import { UseGuards } from '@nestjs/common';
import { ReserveItemDto } from './dto/reserve-item.dto';
import { AuthWSGuard } from '../auth/authWS.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { DeleteEventDto } from './dto/delete-event.dto';

@WebSocketGateway({ transports: ['websocket'] })
export class ScheduleGateway {
    @WebSocketServer() server: Server;

    constructor(private readonly scheduleService: ScheduleService) {}

    @UseGuards(AuthWSGuard)
    @SubscribeMessage('reserve-item')
    async reserveItem(
        @MessageBody() data: ReserveItemDto,
        @ConnectedSocket() client
    ) {
        return await this.scheduleService.reserveItem(
            data.itemId,
            client.user,
            { mode: 'WS' }
        );
    }

    @UseGuards(AuthWSGuard)
    @SubscribeMessage('create-event')
    async createEvent(
        @MessageBody() data: CreateEventDto,
        @ConnectedSocket() client
    ) {
        return await this.scheduleService.createEvent(data, client.user, {
            mode: 'WS',
        });
    }

    @UseGuards(AuthWSGuard)
    @SubscribeMessage('delete-event')
    async deleteEvent(
        @MessageBody() data: DeleteEventDto,
        @ConnectedSocket() client
    ) {
        return await this.scheduleService.deleteEvent(
            data.eventId,
            client.user,
            {
                mode: 'WS',
            }
        );
    }
}

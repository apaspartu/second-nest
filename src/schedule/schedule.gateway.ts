import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ScheduleService } from './schedule.service';
import { UseGuards } from '@nestjs/common';
import { ReserveItemDto } from './dto/reserve-item.dto';
import { AuthWSGuard } from '../auth/authWS.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { DeleteEventDto } from './dto/delete-event.dto';
import { EventService } from '../event/event.service';

@WebSocketGateway({ transports: ['websocket'] })
export class ScheduleGateway {
    @WebSocketServer() server: Server;

    constructor(
        private readonly scheduleService: ScheduleService,
        private readonly eventService: EventService
    ) {}

    @UseGuards(AuthWSGuard)
    @SubscribeMessage('reserve-item')
    async reserveItem(
        @MessageBody() data: ReserveItemDto,
        @ConnectedSocket() client
    ) {
        const item = await this.scheduleService.reserveItem(
            data.itemId,
            client.user
        );
        this.server.emit('reserve-item', item);
    }

    @UseGuards(AuthWSGuard)
    @SubscribeMessage('create-event')
    async createEvent(
        @MessageBody() data: CreateEventDto,
        @ConnectedSocket() client
    ) {
        const event = await this.scheduleService.createEvent(data, client.user);
        this.server.emit('create-event', event);
    }

    @UseGuards(AuthWSGuard)
    @SubscribeMessage('delete-event')
    async deleteEvent(
        @MessageBody() data: DeleteEventDto,
        @ConnectedSocket() client
    ) {
        await this.scheduleService.deleteEvent(data.eventId, client.user);
        this.server.emit('delete-event', data.eventId);
    }

    @UseGuards(AuthWSGuard)
    @SubscribeMessage('get-events')
    async getEvents(@MessageBody() data, @ConnectedSocket() client: Socket) {
        return this.eventService.getAllCompleteEvents({
            withItems: true,
        });
    }
}

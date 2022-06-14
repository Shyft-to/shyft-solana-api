import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NftCreationEvent } from '../events/nft-creation.event';

@Injectable()
export class NftCreatedListener {
    @OnEvent('nft.created')
    handleOrderCreatedEvent(event: NftCreationEvent) {
        console.log(event.createNftDto.attributes);
    }
}
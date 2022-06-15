import { Test, TestingModule } from '@nestjs/testing';
import { CreateNftDto } from './create-nft.dto';

describe('CreateNftService', () => {

    it('what is the output', () => {
        let c = new CreateNftDto()
        c.attributes = [{
            traitType: "vg",
            value: "100"
        },
        {
            traitType: "sb",
            value: "50"
        }]

        let r = c.getAttributesJson()
        console.log(r)
    });
});

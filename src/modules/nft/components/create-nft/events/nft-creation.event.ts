import { CreateNftDto } from '../dto/create-nft.dto';
import { IpfsUploadResponse } from '../create-nft.service';
import { MintNFTResponse } from '@metaplex/js/lib/actions';

export class NftCreationEvent {
    createNftDto: CreateNftDto;
    uploadedImageData: IpfsUploadResponse;
    metaDataUri: string;
    nft: MintNFTResponse;
    user: string;
}
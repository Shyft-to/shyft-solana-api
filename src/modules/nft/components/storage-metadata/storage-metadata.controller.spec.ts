import { Test, TestingModule } from '@nestjs/testing';
import { StorageMetadataController } from './storage-metadata.controller';

describe('StorageController', () => {
  let controller: StorageMetadataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageMetadataController],
    }).compile();

    controller = module.get<StorageMetadataController>(StorageMetadataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

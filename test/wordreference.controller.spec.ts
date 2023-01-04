import { Test, TestingModule } from '@nestjs/testing';
import { WordreferenceController } from './wordreference.controller';

describe('WordreferenceController', () => {
  let controller: WordreferenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WordreferenceController],
    }).compile();

    controller = module.get<WordreferenceController>(WordreferenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { WordreferenceService } from '../src/wordreference/wordreference.service';

describe('WordreferenceService', () => {
  let service: WordreferenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WordreferenceService],
    }).compile();

    service = module.get<WordreferenceService>(WordreferenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

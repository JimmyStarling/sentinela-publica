import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceService } from './auth-service.service';

describe('AuthServiceService', () => {
  let service: AuthServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthServiceService],
    }).compile();

    service = module.get<AuthServiceService>(AuthServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

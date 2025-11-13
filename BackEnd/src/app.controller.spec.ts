import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const mockDataSource = {
    query: jest.fn().mockResolvedValue([{ 1: 1 }]),
    options: { type: 'better-sqlite3' },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('health check', () => {
    it('should return health check data', async () => {
      const result = await appController.getHealthCheck();

      expect(result).toHaveProperty('status', 'healthy');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('environment');
      expect(result).toHaveProperty('version', '1.0.0');
      expect(result).toHaveProperty('database');
      expect(result.database).toHaveProperty('status', 'connected');
      expect(result.database).toHaveProperty('type', 'better-sqlite3');
    });

    it('should return formatted uptime', async () => {
      const result = await appController.getHealthCheck();

      expect(result.uptime).toHaveProperty('seconds');
      expect(result.uptime).toHaveProperty('formatted');
      expect(typeof result.uptime.seconds).toBe('number');
      expect(typeof result.uptime.formatted).toBe('string');
    });
  });
});

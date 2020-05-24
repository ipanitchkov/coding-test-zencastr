import * as sinon from 'sinon';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { batchCleanupNumOfItems } from './config';

describe('AppController', () => {
  let clock;
  let appController: AppController;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('cleanup', () => {
    it('should trigger active expire', () => {
      clock.tick(1000);
      for (let i = 0; i < batchCleanupNumOfItems; i++) {
        appController.setItem(`key${i}`, { data: 'value', ttl: 10 * 1000 });
      }
      clock.tick(10 * 1000);

      expect(appController.getAllKeys()).toStrictEqual([]);
    });
  });

  describe('setItem', () => {
    it('should set an item', () => {
      expect(appController.setItem('key', { data: '' })).toBe(undefined);
    });
  });

  describe('getItem', () => {
    it('should fail as item is not set', () => {
      expect(() => {
        appController.getItem('key');
      }).toThrow(Error);
    });

    it('should get an item', () => {
      appController.setItem('key', { data: 'data' });

      expect(appController.getItem('key')).toBe('data');
    });

    it('should fail as the item has expired because of the ttl', () => {
      clock.tick(1000);
      appController.setItem('key', { data: 'data', ttl: 10 * 1000 });
      clock.tick(10 * 1000);

      expect(() => {
        appController.getItem('key');
      }).toThrow(Error);
    });

    it('should trigger passive expire', () => {
      clock.tick(1000);
      appController.setItem('key', { data: 'data', ttl: 20 });
      clock.tick(40);

      expect(() => {
        appController.getItem('key');
      }).toThrow(Error);
    });
  });

  describe('delItem', () => {
    it('should fail as item is not set', () => {
      expect(() => {
        appController.delItem('key');
      }).toThrow(Error);
    });

    it('should delete an item', () => {
      appController.setItem('key', { data: 'data' });
      expect(appController.delItem('key')).toBe(undefined);
    });
  });

  describe('getAllKeys', () => {
    it('should return all registered keys', () => {
      appController.setItem('key1', { data: 'data' });
      appController.setItem('key2', { data: [1, 2, 3] });
      appController.setItem('key3', { data: { property: 'value' } });
      appController.setItem('key4', { data: true });

      expect(appController.getAllKeys()).toStrictEqual([
        'key1',
        'key2',
        'key3',
        'key4',
      ]);
    });

    it('should return only not expired keys', () => {
      clock.tick(1000);
      appController.setItem('key1', { data: 'data' });
      appController.setItem('key2', { data: [1, 2, 3] });
      appController.setItem('key3', {
        data: { property: 'value' },
        ttl: 10 * 1000,
      });
      appController.setItem('key4', { data: true });
      clock.tick(10 * 1000);

      expect(appController.getAllKeys()).toStrictEqual([
        'key1',
        'key2',
        'key4',
      ]);
    });
  });
});

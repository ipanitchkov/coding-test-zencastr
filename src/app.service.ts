import * as _ from 'lodash';
import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { Item } from './item.interface';
import { Value } from './value.class';
import {
  cleanupIntervalMs,
  batchCleanupNumOfItems,
  forcedCleanupTreshold,
} from './config';

@Injectable()
export class AppService {
  private storage: { [key: string]: Item } = {};

  constructor() {
    setInterval(() => {
      this.cleanup();
    }, cleanupIntervalMs);
  }

  // Cleans up expired keys according to https://redis.io/commands/expire
  private cleanup() {
    const now = moment.now();
    const keys = this.getRandomKeys(batchCleanupNumOfItems);
    let expiredKeys = 0;

    for (const key of keys) {
      const { expire } = this.storage[key].meta;

      if (expire && expire <= now) {
        // active expire
        delete this.storage[key];
        expiredKeys++;
      }
    }
    if (expiredKeys / batchCleanupNumOfItems > forcedCleanupTreshold) {
      this.cleanup();
    }
  }

  private getRandomKeys(n: number): string[] {
    const keys = Object.keys(this.storage);

    return _.sampleSize(keys, n);
  }

  set(key: string, value: Value): void {
    const now = moment.now();
    const { data, ttl } = value;
    const item: Item = {
      data,
      meta: {
        timestamp: now,
      },
    };

    if (ttl) {
      item.meta.expire = now + ttl;
    }

    this.storage[key] = item;
  }

  get(key: string): Item {
    if (this.storage[key]) {
      const now = moment.now();

      if (
        this.storage[key].meta.expire &&
        this.storage[key].meta.expire <= now
      ) {
        // passive expire
        delete this.storage[key];
      } else {
        return this.storage[key];
      }
    }
    return null;
  }

  del(key: string): boolean {
    if (this.storage[key]) {
      delete this.storage[key];
      return true;
    }
    return false;
  }

  getAllKeys(): string[] {
    return Object.keys(this.storage);
  }
}

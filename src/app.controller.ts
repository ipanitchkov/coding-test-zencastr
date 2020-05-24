import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiBody } from '@nestjs/swagger';
import { Value } from './value.class';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post(':key')
  @ApiOperation({ summary: 'Sets a new item into the cache' })
  @ApiBody({ type: Value })
  setItem(@Param('key') key: string, @Body() value: Value): void {
    this.appService.set(key, value);
  }

  @Get(':key')
  @ApiOperation({ summary: 'Retrieves an item from the cache' })
  getItem(@Param('key') key: string): any {
    const result = this.appService.get(key);

    if (result) {
      const { data } = result;

      return data;
    }
    throw new HttpException(`Key '${key}' not found`, HttpStatus.NOT_FOUND);
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Deletes an item into the cache' })
  delItem(@Param('key') key: string): void {
    if (!this.appService.del(key)) {
      throw new HttpException(`Key '${key}' not found`, HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves all registered keys' })
  getAllKeys(): string[] {
    return this.appService.getAllKeys();
  }
}

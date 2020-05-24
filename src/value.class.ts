import { ApiProperty } from '@nestjs/swagger';

export class Value {
  @ApiProperty({
    name: 'data',
    required: true,
    description: 'The data to be stored under the key',
  })
  data: any;
  @ApiProperty({
    name: 'ttl',
    type: 'number',
    required: false,
    description: 'The TTL of the key in milliseconds',
  })
  ttl?: number;
}

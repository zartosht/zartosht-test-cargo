import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseSchema {
  @ApiProperty({
    type: 'string',
    description: 'Jwt token generated for the user',
  })
  token!: string;
}

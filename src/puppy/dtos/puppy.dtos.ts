import { Timestamp } from '@google-cloud/firestore';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEmpty } from 'class-validator';

export class CreatePuppyDto {
  static collectionName = 'puppy';

  @IsOptional()
  id: string;

  @IsNotEmpty()
  @ApiProperty({ description: `Name of the puppy` })
  completeName: string;

  @IsNotEmpty()
  @ApiProperty({ description: `Description of the puppy` })
  description: string;

  @IsNotEmpty()
  @ApiProperty({ description: `Profile Image of the puppy` })
  profileImage: string;

  @IsNotEmpty()
  @ApiProperty({ description: `Profile Image of the puppy` })
  skills: Array<string>;
}

export class GetPuppyDto extends CreatePuppyDto {
  @IsEmpty()
  @ApiProperty({ description: `Date of creation` })
  createdAt: Timestamp;

  @IsEmpty()
  @ApiProperty({ description: `Date of last update` })
  updatedAt: Timestamp;
}

export class UpdatePuppyDto extends PartialType(GetPuppyDto) {}

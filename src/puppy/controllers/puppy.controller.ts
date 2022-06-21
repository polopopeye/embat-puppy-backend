import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePuppyDto, UpdatePuppyDto } from '../dtos/puppy.dtos';
import { PuppyService } from '../services/puppy.service';

@ApiTags('puppies')
@Controller('puppy')
export class PuppyController {
  constructor(private puppyService: PuppyService) {}

  @Get()
  @ApiOperation({ summary: 'List all the Puppies' })
  findAll() {
    return this.puppyService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new Puppy ' })
  create(@Body() body: CreatePuppyDto) {
    return this.puppyService.create(body);
  }

  @Get(':prop/:value')
  @ApiOperation({ summary: 'Find Puppy by param' })
  findBy(@Param('prop') prop: string, @Param('value') value: string) {
    return this.puppyService.findBy(prop, value);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Puppy' })
  update(@Param('id') id: string, @Body() body: UpdatePuppyDto) {
    return this.puppyService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete  Puppy' })
  delete(@Param('id') id: string) {
    return this.puppyService.delete(id);
  }
}

import { Injectable } from '@nestjs/common';
import { UploadDto } from './dto/upload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Upload)
    private uploadRepository: Repository<Upload>,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  create(uploadDto: UploadDto) {
    return this.uploadRepository.save(uploadDto);
  }
}

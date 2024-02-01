import { Injectable } from '@nestjs/common';
import { UploadDto } from './dto/upload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { Repository } from 'typeorm';
const fs = require('fs');
const path = require('path')

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Upload)
    private uploadRepository: Repository<Upload>,
  ) { }

  async list(fullUrl: string): Promise<any[]> {
    const directoryPath = path.join(__dirname, '..', 'files');
    const checkExist = await this.isExistingDirectory(directoryPath);

    if (checkExist) {
      return await new Promise((resolve) => {
        fs.readdir(directoryPath, (err, files) => {
          if (err) {
            resolve([])
          } else {
            const newFiles = files.map(file => {
              return {
                url: `${fullUrl}/medias/${file}`,
                fileName: file
              }
            });
            resolve(newFiles)
          }
        })
      })
    }
  }

  create(uploadDto: UploadDto) {
    return this.uploadRepository.save(uploadDto);
  }

  isExistingDirectory = (directory) => {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(directory)) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  }

  readDataFromFile = (filename) => {
    return new Promise(function (resolve, reject) {
      fs.readFile(filename, "utf-8", function (err, data) {
        if (err)
          reject(err);
        else
          resolve(data);
      });
    });
  };
}

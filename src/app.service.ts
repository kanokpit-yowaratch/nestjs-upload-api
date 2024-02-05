import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UploadDto } from './dto/upload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { Repository } from 'typeorm';
import { promisify } from 'util';
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
                fileName: file,
                url: `${fullUrl}/medias/${file}`,
                delete: `${fullUrl}/delete/${file}`
              }
            });
            resolve(newFiles)
          }
        })
      })
    }
  }

  async create(uploadDto: UploadDto) {
    return this.uploadRepository.save(uploadDto).catch((error: any) => {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      // switch (error.name) {
      //   case 'QueryFailedError':
      //     throw new HttpException({
      //       status: error.errno,
      //       error_code: error.code,
      //       message: error.message,
      //       sql_state: error.sqlState,
      //       query_string: error.sql
      //     }, HttpStatus.INTERNAL_SERVER_ERROR);
      //   default:
      //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      // }
    });
  }

  async delete(fileName: string): Promise<string> {
    const unlinkAsync = promisify(fs.unlink);
    try {
      const directoryPath = path.join(__dirname, '..', 'files');
      const checkExist = await this.isExistingDirectory(directoryPath);

      if (checkExist) {
        const fullPath = `${directoryPath}/${fileName}`;
        await unlinkAsync(fullPath)
        return `Delete file: ${fileName} successfully.`
      }
      return `Cannot delete file: ${fileName}!`;
    } catch (error) {
      console.log(error);
      return `Cannot delete file: ${fileName}!`;
    }
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

  isDuplicateCode(imageCode: string): Promise<Upload> {
    return this.uploadRepository.findOne({ where: { image_code: imageCode } });
  }
}

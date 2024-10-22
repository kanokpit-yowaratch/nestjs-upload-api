import { Body, Controller, Delete, FileTypeValidator, Get, HttpException, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UploadDto } from './dto/upload.dto';
import { Request } from "express";
// import { diskStorage } from 'multer';
// import { extname } from 'path';

@ApiTags('Upload')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/medias')
  async getMedias() { // @Req() req: URLRequest
    // const protocol = req.protocol;
    // const host = req.get("Host");
    // const fullUrl = `${protocol}://${host}`;
    const files = await this.appService.fileList();
    const fileWithCodeList = await this.appService.fetchAllData(files);
    return fileWithCodeList;
  }

  @Post('/upload')
  @ApiResponse({ status: 201, description: 'File has been successfully uploaded.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({
    type: UploadDto,
    description: 'Json structure for upload object',
  })
  @UseInterceptors(FileInterceptor('file'))
  // Works!
  // @UseInterceptors(FileInterceptor('file', {
  //   storage: diskStorage({
  //     destination: './files',
  //     filename: (req: Request, file, cb) => {
  //       const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
  //       cb(null, `${randomName}${extname(file.originalname)}`)
  //     }
  //   })
  // }))
  async uploadFile(
    // @Body() uploadDto: UploadDto, => Required all column exist in table => Not recommened, it has effect to table structure
    @Body() formData: Request, // Not need all column
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: (1024 * 1024 * 1) }), // Not over than 1MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File
  ) {
    const fileName = file?.filename;
    if (!fileName) {
      throw new HttpException('Please select any file.', HttpStatus.BAD_REQUEST);
    }

    let imageCode = formData['image_code'] || '';
    if (!imageCode) {
      imageCode = fileName.split('.')[0]
    }

    const isDup = await this.appService.isDuplicateCode(imageCode);
    if (isDup) {
      // remove file upload previously
      throw new HttpException('Duplicate image code.', HttpStatus.BAD_REQUEST);
    }

    const uploadDto = new UploadDto()
    uploadDto.source = formData['source'] || '';
    uploadDto.image_code = imageCode;
    uploadDto.file_name = fileName;
    uploadDto.active_status = formData['active_status'] || 1;
    return this.appService.create(uploadDto);
  }

  @Get('medias/:file_name')
  display(@Res() res, @Param('file_name') fileName: string) {
    res.sendFile(fileName, { root: './files' });
  }

  @Delete('delete/:file_name')
  async delete(@Param('file_name') fileName: string) {
    const result = await this.appService.delete(fileName);
    const media = await this.appService.findCodeByFileName(fileName);
    if (media && media.image_code) {
      await this.appService.remove(media.image_code);
    }
    return { message: result };
  }
}

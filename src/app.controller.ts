import { Body, Controller, Delete, FileTypeValidator, Get, HttpException, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UploadDto } from './dto/upload.dto';
import { Request as URLRequest } from "express";
import { diskStorage } from 'multer';
import { extname } from 'path';

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

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
  // @UseInterceptors(FileInterceptor('file'))
   // Try this
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './files',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }))
  // Alternative
  // @UseInterceptors(FileInterceptor('file', {
  //   storage: diskStorage({
  //     destination: './uploads'
  //     , filename: (req, file, cb) => {
  //       // Generating a 32 random chars long string
  //       const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
  //       //Calling the callback passing the random name generated with the original extension name
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
          new MaxFileSizeValidator({ maxSize: 2000 }),
          // new FileTypeValidator({ fileType: 'image/jpeg' }),
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

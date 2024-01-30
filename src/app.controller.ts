import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body() formData: Request,
    @UploadedFile() file: Express.Multer.File
  ) {
    // console.log(formData);
    // console.log(formData['image_code']);
    // console.log(file);
    return { ...formData, file };
  }
}

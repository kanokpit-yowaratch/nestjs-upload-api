import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UploadDto } from './dto/upload.dto';

@ApiTags('Upload')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/upload')
  @ApiResponse({ status: 201, description: 'File has been successfully uploaded.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({
    type: UploadDto,
    description: 'Json structure for upload object',
  })
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

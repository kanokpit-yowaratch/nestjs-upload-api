import { Body, Controller, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UploadDto } from './dto/upload.dto';
import { Request as URLRequest } from "express";

@ApiTags('Upload')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/medias')
  async getHello(@Req() req: URLRequest) {
    const protocol = req.protocol;
    const host = req.get("Host");
    const fullUrl = `${protocol}://${host}`;
    return await this.appService.list(fullUrl);
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
    // @Body() uploadDto: UploadDto, => Required all column exist in table => Not recommened, it has effect to table structure
    @Body() formData: Request, // Not need all column
    @UploadedFile() file: Express.Multer.File
  ) {
    const fileName = file?.filename || '';
    const uploadDto = new UploadDto()
    uploadDto.source = formData['source'];
    // check dup (dup => aut oupdate, no dup => add new)
    uploadDto.image_code = formData['image_code'];
    uploadDto.file_name = fileName;
    return this.appService.create(uploadDto);
  }

  @Get('medias/:file_name')
  display(@Res() res, @Param('file_name') fileName: string) {
    res.sendFile(fileName, { root: './files' });
  }
}

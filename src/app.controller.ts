import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
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
  async uploadFile(
    // @Body() uploadDto: UploadDto, => Required all column exist in table => Not recommened, it has effect to table structure
    @Body() formData: Request, // Not need all column
    @UploadedFile() file: Express.Multer.File
  ) {
    const fileName = file?.filename;
    if (!fileName) {
      throw new HttpException('Please select any file.', HttpStatus.BAD_REQUEST);
    }

    const imageCode = formData['image_code'] || '';
    const isDup = await this.appService.isDuplicateCode(imageCode);

    if (isDup) {
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

  @Get('delete/:file_name')
  async delete(@Param('file_name') fileName: string) {
    const result = await this.appService.delete(fileName);
    return { message: result };
  }
}

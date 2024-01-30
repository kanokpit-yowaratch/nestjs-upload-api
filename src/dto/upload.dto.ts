import { ApiProperty } from '@nestjs/swagger';

export class UploadDto {
  @ApiProperty({
    example: 'AAA-001',
    required: true
  })
  image_code: string;

  @ApiProperty({
    example: {
      fieldname: 'file',
      originalname: 'cover.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: 'files/',
      filename: '88266c78-d325-49b7-9195-22a6d8e3e2ec.jpg',
      path: 'files\\88266c78-d325-49b7-9195-22a6d8e3e2ec.jpg',
      size: 280377
    },
    required: true
  })
  file: Express.Multer.File;
}

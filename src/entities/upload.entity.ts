import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('medias') // Custom table name
export class Upload {
  @PrimaryColumn()
  image_code: string;

  @Column()
  @Exclude() // not require
  source: string;

  @Column()
  file_name: string;

  @Column()
  @Exclude() // not require
  active_status: number;

  // @Column({ type: 'timestamptz' })
  // created_at: Date;

  // @Column({ type: 'timestamptz' })
  // updated_at: Date;
}

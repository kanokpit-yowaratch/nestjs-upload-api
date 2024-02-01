import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('medias')
export class Upload {
  // Optional: Auto gen with call API first
  @PrimaryColumn()
  image_code: string;

  // product-master
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

import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityShared } from 'src/common/models';
import { Sale } from './sale.entity';

@Entity('schedules')
export class Schedule extends BaseEntityShared {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'timestamp', name: 'date_schedule' })
  dateschedule: Date;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string | null;

  // 👇 relación inversa correcta
//   @OneToOne(() => Sale, (sale) => sale.schedule)
//   sale?: Sale;
}

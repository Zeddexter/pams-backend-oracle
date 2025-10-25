import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntityShared {
	@CreateDateColumn({ select: false })
	createdat: Date;

	@UpdateDateColumn({ select: false })
	updatedat: Date;
}

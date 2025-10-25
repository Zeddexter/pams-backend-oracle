import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class CleanDtoPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		if (typeof value !== 'object' || value === null) return value;
		return Object.fromEntries(
			Object.entries(value).filter(([_, v]) => v !== undefined),
		);
	}
}

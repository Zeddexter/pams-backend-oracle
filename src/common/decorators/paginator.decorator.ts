import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationParams } from '../interfaces/paginator-params.interface';

export const Pagination = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): PaginationParams => {
		const request = ctx.switchToHttp().getRequest();
		const page = Math.max(parseInt(request.query.page, 10) || 1, 1); // Asegurar que sea al menos 1
		const limit = Math.max(parseInt(request.query.limit, 10) || 10, 1); // Asegurar que sea al menos 1
		const search = request.query.search || '';

		return { page, limit, search };
	},
);

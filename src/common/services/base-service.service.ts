import { NotFoundException, LoggerService } from '@nestjs/common';
import { Repository } from 'typeorm';

export abstract class BaseService<T> {
	constructor(
		protected readonly repository: Repository<T>,
		protected readonly logger: LoggerService,
	) {}

	/** 
	 * Quita el ORDER BY externo (nivel 0), sin afectar subconsultas ni funciones con paréntesis.
	 */
	private stripTrailingOuterOrderBy(sql: string): string {
		const s = sql.trim().replace(/;+\s*$/g, '');
		let depth = 0;
		let lastOrderBy = -1;

		for (let i = 0; i < s.length; i++) {
			const ch = s[i];
			if (ch === '(') depth++;
			else if (ch === ')') depth = Math.max(0, depth - 1);
			else if (depth === 0 && s.slice(i).toLowerCase().startsWith('order by')) {
				lastOrderBy = i;
			}
		}
		return lastOrderBy >= 0 ? s.slice(0, lastOrderBy).trim() : s;
	}

	/**
	 * Construye WHERE dinámico con búsqueda insensible a mayúsculas.
	 * Usa CAST() para convertir valores numéricos o de fecha a texto.
	 */
	private buildSearchWhere(alias: string, columns: string[], bind: string): string {
		const terms = columns.map(
			(c) => `LOWER(CAST(${alias}."${c}" AS TEXT)) LIKE ${bind}`,
		);
		return terms.length ? `(${terms.join(' OR ')})` : '';
	}

	/**
	 * Reemplaza literales de texto por espacios para evitar falsos positivos en parsing.
	 */
	private removeStringLiterals(src: string): string {
		let out = '';
		let inStr = false;
		for (let i = 0; i < src.length; i++) {
			const ch = src[i];
			if (!inStr) {
				if (ch === "'") {
					inStr = true;
					out += ' ';
				} else {
					out += ch;
				}
			} else {
				if (ch === "'") {
					if (src[i + 1] === "'") {
						out += ' ';
						i++;
					} else {
						inStr = false;
						out += ' ';
					}
				} else out += ' ';
			}
		}
		return out;
	}

	/**
	 * Devuelve el listado de columnas del SELECT principal (nivel 0).
	 */
	private sanitizeTopSelectList(innerSql: string): string {
		const sql = innerSql.trim();
		const lower = sql.toLowerCase();
		const selIdx = lower.indexOf('select');
		if (selIdx < 0) return '';
		let depth = 0;
		let fromIdx = -1;
		for (let i = selIdx + 6; i < sql.length; i++) {
			const ch = sql[i];
			if (ch === '(') depth++;
			else if (ch === ')') depth = Math.max(0, depth - 1);
			else if (depth === 0 && lower.slice(i).startsWith(' from')) {
				fromIdx = i;
				break;
			}
		}
		if (fromIdx === -1) return '';

		const selectList = sql.slice(selIdx + 6, fromIdx);
		const noStrings = this.removeStringLiterals(selectList);

		let out = '';
		let d = 0;
		for (let i = 0; i < noStrings.length; i++) {
			const ch = noStrings[i];
			if (d === 0) {
				out += ch;
				if (ch === '(') d = 1;
			} else {
				if (ch === '(') {
					d++;
					out += ' ';
				} else if (ch === ')') {
					d--;
					if (d === 0) out += ')';
					else out += ' ';
				} else out += ' ';
			}
		}
		return out;
	}

	private hasTopLevelSelectStar(innerSql: string): boolean {
		const list = this.sanitizeTopSelectList(innerSql);
		return list.trim().replace(/\s+/g, '') === '*';
	}

	private extractProjectedColumns(innerSql: string): string[] {
		const list = this.sanitizeTopSelectList(innerSql);
		const result = new Set<string>();

		let m: RegExpExecArray | null;
		const qualifiedCol = /[A-Za-z0-9_]+\s*\.\s*"([A-Za-z0-9_]+)"/g;
		while ((m = qualifiedCol.exec(list)) !== null) result.add(m[1]);

		const asAlias = /\bas\s*"([A-Za-z0-9_]+)"/gi;
		while ((m = asAlias.exec(list)) !== null) result.add(m[1]);

		const loneQuoted = /(^|[^.])"([A-Za-z0-9_]+)"/g;
		while ((m = loneQuoted.exec(list)) !== null) result.add(m[2]);

		return Array.from(result);
	}

	private pickExistingColumns(innerSql: string, columns: string[]): string[] {
		const projected = new Set(this.extractProjectedColumns(innerSql));
		return columns.filter((c) => projected.has(c));
	}

	private normalizeSearchTerm(s: string): string {
		return s.trim().replace(/\s+/g, ' ').toLowerCase();
	}

	/**
	 * En PostgreSQL usamos COALESCE() y CONCAT_WS() para concatenar columnas.
	 */
	private buildConcatSearchWhere(
		alias: string,
		columns: string[],
		bind: string,
	): string {
		const concatExpr = `LOWER(TRIM(REGEXP_REPLACE(CONCAT_WS(' ', ${columns
			.map((c) => `COALESCE(${alias}."${c}", '')`)
			.join(', ')}), '\\s+', ' ', 'g')))`;
		return `${concatExpr} LIKE ${bind}`;
	}

	/**
	 * Paginación dinámica para PostgreSQL
	 */
	async paginate({
		page,
		limit,
		search,
		customQuery,
		searchColumns,
		searchConcatColumns,
	}: {
		page: number;
		limit: number;
		search?: string;
		customQuery?: string;
		searchColumns?: string[];
		searchConcatColumns?: string[];
	}): Promise<{ data: T[]; meta: any }> {
		const currentPage = Math.max(1, Number(page) || 1);
		const take = Math.max(1, Number(limit) || 10);
		const skip = (currentPage - 1) * take;

		const tableName = this.repository.metadata.tableName;

		let innerQuery = (customQuery || '').trim();
		if (!innerQuery) innerQuery = `SELECT * FROM ${tableName} ORDER BY id`;

		const defaultCols = this.repository.metadata.columns.map((c) => c.databaseName);
		const isSelectStar = this.hasTopLevelSelectStar(innerQuery);
		const projectedCols = this.extractProjectedColumns(innerQuery);

		const desired =
			searchColumns?.length
				? searchColumns
				: Array.from(new Set([...defaultCols, ...projectedCols]));

		const cols = isSelectStar ? desired : this.pickExistingColumns(innerQuery, desired);

		const concatCols = Array.isArray(searchConcatColumns)
			? isSelectStar
				? searchConcatColumns
				: this.pickExistingColumns(innerQuery, searchConcatColumns)
			: [];

		let searchWhere = '';
		const params: any[] = [];

		if (search) {
			const normalized = this.normalizeSearchTerm(search);
			if (concatCols.length) searchWhere = this.buildConcatSearchWhere('t', concatCols, `$1`);
			else if (cols.length) searchWhere = this.buildSearchWhere('t', cols, `$1`);
			params.push(`%${normalized}%`);
		}

		// Armado de la query con paginación
		const baseParamsOffset = params.length;
		const paginatedQuery = `
			SELECT t.*
			FROM (${innerQuery}) t
			${searchWhere ? `WHERE ${searchWhere}` : ''}
			ORDER BY t."id"
			LIMIT $${baseParamsOffset + 1} OFFSET $${baseParamsOffset + 2};
		`;
		params.push(take, skip);

		const data = await this.repository.query(paginatedQuery, params);

		// Total sin paginación
		const countQuery = `
			SELECT COUNT(*) AS total
			FROM (${this.stripTrailingOuterOrderBy(innerQuery)}) t
			${searchWhere ? `WHERE ${searchWhere}` : ''};
		`;
		const totalResult = await this.repository.query(countQuery, search ? [params[0]] : []);
		const total = Number(totalResult?.[0]?.total ?? 0);

		return {
			data,
			meta: {
				total,
				currentPage,
				limit: take,
				totalPages: Math.max(1, Math.ceil(total / take)),
				hasNextPage: currentPage * take < total,
				hasPrevPage: currentPage > 1,
			},
		};
	}

	async findOneById(id: string, relations: string[] = []): Promise<T> {
		const entity = await this.repository.findOne({
			where: { id } as any,
			relations,
		});
		if (!entity) throw new NotFoundException(`Entity with id ${id} not found`);
		return entity;
	}
}

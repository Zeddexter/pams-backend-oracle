// UpperCaseNamingStrategy.ts
import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

export class UpperCaseNamingStrategy
	extends DefaultNamingStrategy
	implements NamingStrategyInterface
{
	tableName(targetName: string, userSpecifiedName: string | undefined): string {
		return (userSpecifiedName ?? targetName).toUpperCase();
	}

	columnName(
		propertyName: string,
		customName: string | undefined,
		embeddedPrefixes: string[],
	): string {
		return [...embeddedPrefixes, customName ?? propertyName]
			.join('_')
			.toUpperCase();
	}

	relationName(propertyName: string): string {
		return propertyName.toUpperCase();
	}

	joinColumnName(relationName: string, referencedColumnName: string): string {
		return `${relationName}_${referencedColumnName}`.toUpperCase();
	}

	joinTableName(
		firstTableName: string,
		secondTableName: string,
		firstPropertyName: string,
		secondPropertyName: string,
	): string {
		return `${firstTableName}_${firstPropertyName}_${secondTableName}_${secondPropertyName}`.toUpperCase();
	}

	joinTableColumnName(
		tableName: string,
		propertyName: string,
		columnName?: string,
	): string {
		return `${tableName}_${columnName ?? propertyName}`.toUpperCase();
	}

	classTableInheritanceParentColumnName(
		parentTableName: string,
		parentTableIdPropertyName: string,
	): string {
		return `${parentTableName}_${parentTableIdPropertyName}`.toUpperCase();
	}
}

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as oracledb from 'oracledb';
import { DataSource } from 'typeorm';
import { InvoiceResult } from 'src/database/entities/invoice-result.entity';

@Injectable()
export class InvoiceService {
  constructor(private readonly dataSource: DataSource) {}

  async consultaDNI_RUC(
    DNI: string = '',
    RUC: string = '',
    TIPO: string = '1',
  ): Promise<InvoiceResult[]> {
    let connection: oracledb.Connection | null = null;

    try {
      // 🔹 Obtener parámetros de conexión desde TypeORM
      const options = (this.dataSource.driver as any).options;

      console.log('🧩 Intentando conectar a Oracle con:');
      console.log({
        user: options.username,
        connectString: options.connectString,
        serviceName: options.serviceName || '(no especificado)',
        host: options.host || '(localhost)',
      });

      // 🔹 Crear la conexión real con el cliente Oracle
      connection = await oracledb.getConnection({
        user: options.username,
        password: options.password,
        connectString: options.connectString,
      });

      // 🔹 Verificar el usuario de sesión actual
      const sessionUser = await connection.execute(
        `SELECT SYS_CONTEXT('USERENV','CURRENT_SCHEMA') AS CURRENT_SCHEMA,
                SYS_CONTEXT('USERENV','SESSION_USER') AS SESSION_USER,
                SYS_CONTEXT('USERENV','SERVICE_NAME') AS SERVICE_NAME
         FROM DUAL`
      );
      console.log('✅ Sesión Oracle activa:', sessionUser.rows);

      // 🔹 Forzar el schema PAMS (por si acaso)
      await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = PAMS`);
      console.log('🔁 Schema cambiado a PAMS');

      // 🔹 Ejecutar el SP
      const result = await connection.execute(
        `
        BEGIN
          PAMS.SP_CONSULTA_FACTURAS_PAMS(:p_tipo, :p_dni, :p_ruc, :p_cursor);
        END;
        `,
        {
          p_tipo: TIPO,
          p_dni: DNI || null,
          p_ruc: RUC || null,
          p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );

      console.log('📤 Procedimiento ejecutado correctamente, leyendo cursor...');

      const cursor = result.outBinds.p_cursor;
      const rows = await cursor.getRows(1000);
      await cursor.close();

      console.log(`✅ Registros devueltos: ${rows.length}`);
      return rows as InvoiceResult[];
    } catch (error) {
      console.error('❌ Error ejecutando SP_CONSULTA_FACTURAS_PAMS:', error);
      throw new HttpException(
        {
          message: 'Error al ejecutar el procedimiento almacenado.',
          detalle: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      if (connection) {
        try {
          await connection.close();
          console.log('🔒 Conexión Oracle cerrada correctamente.');
        } catch (closeErr) {
          console.warn('⚠️ Error cerrando conexión Oracle:', closeErr);
        }
      }
    }
  }
}

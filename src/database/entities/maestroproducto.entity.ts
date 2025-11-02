import { Entity, PrimaryColumn, Column } from 'typeorm';

/**
 * Tabla de productos (adaptada a PostgreSQL)
 */
@Entity({ name: 'MAESTROPRODUCTO', synchronize: false })
export class MAESTROPRODUCTO {
  @PrimaryColumn({ name: 'cod_tienda', type: 'varchar', length: 2 })
  codTienda: string;

  @PrimaryColumn({ name: 'id_maestro_producto', type: 'varchar', length: 7 })
  idMaestroProducto: string;

  @Column({ name: 'nom_producto_maestro', type: 'varchar', length: 4000, nullable: true })
  nomProductoMaestro: string;

  @Column({ name: 'cod_barra', type: 'varchar', length: 50, nullable: true })
  codBarra: string;

  @Column({ name: 'valor_compra', type: 'numeric', precision: 14, scale: 2, nullable: true })
  valorCompra: number;

  @Column({ name: 'valor_venta', type: 'numeric', precision: 14, scale: 2, nullable: true })
  valorVenta: number;

  @Column({ name: 'usuario_creacion', type: 'varchar', length: 10, nullable: true })
  usuarioCreacion: string;

  @Column({ name: 'fecha_creacion', type: 'timestamp', nullable: true })
  fechaCreacion: Date;

  @Column({ name: 'usuario_modificacion', type: 'varchar', length: 10, nullable: true })
  usuarioModificacion: string;

  @Column({ name: 'fecha_modificacion', type: 'timestamp', nullable: true })
  fechaModificacion: Date;

  @Column({ name: 'flag_eliminado', type: 'varchar', length: 1, nullable: true })
  flagEliminado: string;

  @Column({ name: 'id_modelo', type: 'varchar', length: 3, nullable: true })
  idModelo: string;

  @Column({ name: 'id_marca', type: 'varchar', length: 3, nullable: true })
  idMarca: string;

  @Column({ name: 'id_producto', type: 'varchar', length: 5, nullable: true })
  idProducto: string;

  @Column({ name: 'tamano_migra', type: 'varchar', length: 2, nullable: true })
  tamanoMigra: string;

  @Column({ name: 'stock_actual', type: 'numeric', nullable: true })
  stockActual: number;

  @Column({ name: 'migracion', type: 'varchar', length: 1, nullable: true })
  migracion: string;

  @Column({ name: 'descontinuado', type: 'numeric', nullable: true })
  descontinuado: number;

  @Column({ name: 'id_familia', type: 'varchar', length: 5, nullable: true })
  idFamilia: string;

  @Column({ name: 'flag_regalo', type: 'varchar', length: 1, nullable: true })
  flagRegalo: string;

  @Column({ name: 'flag_serie', type: 'varchar', length: 1, nullable: true })
  flagSerie: string;

  @Column({ name: 'cod_med', type: 'varchar', length: 3, nullable: true })
  codMed: string;

  @Column({ name: 'cod_tip_prd', type: 'varchar', length: 3, nullable: true })
  codTipPrd: string;

  @Column({ name: 'igv', type: 'varchar', length: 1, nullable: true })
  igv: string;

  @Column({ name: 'id_proveedor', type: 'varchar', length: 11, nullable: true })
  idProveedor: string;

  @Column({ name: 'nom_abreviado', type: 'varchar', length: 50, nullable: true })
  nomAbreviado: string;

  @Column({ name: 'stock_actual_sunat', type: 'numeric', nullable: true })
  stockActualSunat: number;

  @Column({ name: 'id_existencia', type: 'varchar', length: 2, nullable: true })
  idExistencia: string;

  @Column({ name: 'stock_minimo', type: 'numeric', precision: 16, scale: 4, nullable: true })
  stockMinimo: number;

  @Column({ name: 'flag_oferta', type: 'varchar', length: 1, nullable: true })
  flagOferta: string;

  @Column({ name: 'codigo_referencia', type: 'varchar', length: 30, nullable: true })
  codigoReferencia: string;

  @Column({ name: 'id_talla', type: 'varchar', length: 3, nullable: true })
  idTalla: string;

  @Column({ name: 'id_color', type: 'varchar', length: 3, nullable: true })
  idColor: string;

  @Column({ name: 'flag_mueve_stock', type: 'varchar', length: 1, nullable: true })
  flagMueveStock: string;

  @Column({ name: 'id_color2', type: 'varchar', length: 3, nullable: true })
  idColor2: string;

  @Column({ name: 'id_color3', type: 'varchar', length: 3, nullable: true })
  idColor3: string;

  @Column({ name: 'id_planta', type: 'varchar', length: 4, nullable: true })
  idPlanta: string;

  @Column({ name: 'id_material', type: 'varchar', length: 4, nullable: true })
  idMaterial: string;

  @Column({ name: 'id_tipo', type: 'varchar', length: 4, nullable: true })
  idTipo: string;

  @Column({ name: 'id_caracteristica', type: 'varchar', length: 4, nullable: true })
  idCaracteristica: string;

  @Column({ name: 'id_genero', type: 'varchar', length: 4, nullable: true })
  idGenero: string;

  @Column({ name: 'imagenes', type: 'varchar', length: 4000, nullable: true })
  imagenes: string;

  @Column({ name: 'precio_venta_min', type: 'numeric', precision: 18, scale: 4, nullable: true })
  precioVentaMin: number;

  @Column({ name: 'precio_venta_max', type: 'numeric', precision: 18, scale: 4, nullable: true })
  precioVentaMax: number;

  @Column({ name: 'cuenta_contable', type: 'varchar', length: 20, nullable: true })
  cuentaContable: string;

  @Column({ name: 'utilidad', type: 'numeric', precision: 10, scale: 2, nullable: true })
  utilidad: number;

  @Column({ name: 'codigo_referencia2', type: 'varchar', length: 30, nullable: true })
  codigoReferencia2: string;

  @Column({ name: 'codigo_equivalencia1', type: 'varchar', length: 50, nullable: true })
  codigoEquivalencia1: string;

  @Column({ name: 'codigo_equivalencia2', type: 'varchar', length: 50, nullable: true })
  codigoEquivalencia2: string;

  @Column({ name: 'codigo_equivalencia3', type: 'varchar', length: 50, nullable: true })
  codigoEquivalencia3: string;

  @Column({ name: 'codigo_equivalencia4', type: 'varchar', length: 50, nullable: true })
  codigoEquivalencia4: string;

  @Column({ name: 'descripcion1', type: 'varchar', length: 300, nullable: true })
  descripcion1: string;

  @Column({ name: 'descripcion2', type: 'varchar', length: 300, nullable: true })
  descripcion2: string;
}

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateWaterReportTable1789107240937 implements MigrationInterface {
  name = 'CreateWaterReportTable1789107240937';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'WATER_REPORT',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'address',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'severity',
            type: 'varchar',
          },
          {
            name: 'reporterPhone',
            type: 'varchar',
          },
          {
            name: 'isResolved',
            type: 'boolean',
            default: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('WATER_REPORT');
  }
}

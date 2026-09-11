import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSystemUserTable1789107239937 implements MigrationInterface {
  name = 'CreateSystemUserTable1789107239937';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'SYSTEM_USER',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'isNotificationEnabled',
            type: 'boolean',
            default: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('SYSTEM_USER');
  }
}

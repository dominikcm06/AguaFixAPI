import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPhotoUrlsToWaterReport1789107241937 implements MigrationInterface {
  name = 'AddPhotoUrlsToWaterReport1789107241937';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('WATER_REPORT', [
      new TableColumn({
        name: 'photoUrl',
        type: 'varchar',
        default: "''",
      }),
      new TableColumn({
        name: 'repairPhotoUrl',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
    await queryRunner.query(
      `ALTER TABLE "WATER_REPORT" ALTER COLUMN "photoUrl" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('WATER_REPORT', [
      'photoUrl',
      'repairPhotoUrl',
    ]);
  }
}

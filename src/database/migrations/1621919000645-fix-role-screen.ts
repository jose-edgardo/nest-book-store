import {MigrationInterface, QueryRunner} from "typeorm";

export class fixRoleScreen1621919000645 implements MigrationInterface {
    name = 'fixRoleScreen1621919000645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" ADD "status" character varying(8) NOT NULL DEFAULT 'ACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "status"`);
    }

}

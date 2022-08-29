import {MigrationInterface, QueryRunner} from "typeorm";

export class addParentIdFieldCommentsTable1661727912517 implements MigrationInterface {
    name = 'addParentIdFieldCommentsTable1661727912517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."comments" ADD "parentId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."comments" DROP COLUMN "parentId"`);
    }

}

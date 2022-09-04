import {MigrationInterface, QueryRunner} from "typeorm";

export class addPublicIdSubs1662312936954 implements MigrationInterface {
    name = 'addPublicIdSubs1662312936954'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."subs" ADD "publicId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."subs" DROP COLUMN "publicId"`);
    }

}

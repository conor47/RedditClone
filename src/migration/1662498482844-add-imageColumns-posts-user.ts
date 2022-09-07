import {MigrationInterface, QueryRunner} from "typeorm";

export class addImageColumnsPostsUser1662498482844 implements MigrationInterface {
    name = 'addImageColumnsPostsUser1662498482844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."subs" DROP COLUMN "publicId"`);
        await queryRunner.query(`ALTER TABLE "public"."subs" ADD "imagePublicId" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."subs" ADD "bannerPublicId" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "imageUrn" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "imagePublicId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "imagePublicId"`);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "imageUrn"`);
        await queryRunner.query(`ALTER TABLE "public"."subs" DROP COLUMN "bannerPublicId"`);
        await queryRunner.query(`ALTER TABLE "public"."subs" DROP COLUMN "imagePublicId"`);
        await queryRunner.query(`ALTER TABLE "public"."subs" ADD "publicId" character varying`);
    }

}

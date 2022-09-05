import {MigrationInterface, QueryRunner} from "typeorm";

export class addImageColumnsPosts1662329921890 implements MigrationInterface {
    name = 'addImageColumnsPosts1662329921890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."posts" RENAME COLUMN "postId" TO "publicId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."posts" RENAME COLUMN "publicId" TO "postId"`);
    }

}

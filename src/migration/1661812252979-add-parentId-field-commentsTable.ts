import {MigrationInterface, QueryRunner} from "typeorm";

export class addParentIdFieldCommentsTable1661812252979 implements MigrationInterface {
    name = 'addParentIdFieldCommentsTable1661812252979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`);
        await queryRunner.query(`ALTER TABLE "public"."comments" RENAME COLUMN "postId" TO "post"`);
        await queryRunner.query(`ALTER TABLE "public"."comments" ADD CONSTRAINT "FK_e5492a8073292e306965b4bc364" FOREIGN KEY ("post") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."comments" DROP CONSTRAINT "FK_e5492a8073292e306965b4bc364"`);
        await queryRunner.query(`ALTER TABLE "public"."comments" RENAME COLUMN "post" TO "postId"`);
        await queryRunner.query(`ALTER TABLE "public"."comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

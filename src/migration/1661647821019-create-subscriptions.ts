import {MigrationInterface, QueryRunner} from "typeorm";

export class createSubscriptions1661647821019 implements MigrationInterface {
    name = 'createSubscriptions1661647821019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."subscriptions" DROP CONSTRAINT "FK_95083be28ea30b39011bf7b9d9d"`);
        await queryRunner.query(`ALTER TABLE "public"."subscriptions" DROP CONSTRAINT "unique_sub"`);
        await queryRunner.query(`ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "FK_95083be28ea30b39011bf7b9d9d" FOREIGN KEY ("sub_id") REFERENCES "subs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."subscriptions" DROP CONSTRAINT "FK_95083be28ea30b39011bf7b9d9d"`);
        await queryRunner.query(`ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "unique_sub" UNIQUE ("sub_id")`);
        await queryRunner.query(`ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "FK_95083be28ea30b39011bf7b9d9d" FOREIGN KEY ("sub_id") REFERENCES "subs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

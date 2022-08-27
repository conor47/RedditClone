import {MigrationInterface, QueryRunner} from "typeorm";

export class createSubscriptions1661632358919 implements MigrationInterface {
    name = 'createSubscriptions1661632358919'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subscriptions" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "sub_id" integer, "user_id" integer, CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_95083be28ea30b39011bf7b9d9d" FOREIGN KEY ("sub_id") REFERENCES "subs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_95083be28ea30b39011bf7b9d9d"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
    }

}

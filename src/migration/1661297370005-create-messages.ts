import {MigrationInterface, QueryRunner} from "typeorm";

export class createMessages1661297370005 implements MigrationInterface {
    name = 'createMessages1661297370005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "messages" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "body" character varying NOT NULL, "username" character varying NOT NULL, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_18325f38ae6de43878487eff986" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_7dee93f6489824b0c7f50e593c9" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_7dee93f6489824b0c7f50e593c9"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_18325f38ae6de43878487eff986"`);
        await queryRunner.query(`DROP TABLE "messages"`);
    }

}

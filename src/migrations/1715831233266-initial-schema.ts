import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1715831233266 implements MigrationInterface {
    name = 'InitialSchema1715831233266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "board" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "list" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "boardId" integer)`);
        await queryRunner.query(`CREATE TABLE "subtask" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "isDone" boolean NOT NULL, "taskId" integer)`);
        await queryRunner.query(`CREATE TABLE "task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar NOT NULL, "listId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_list" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "boardId" integer, CONSTRAINT "FK_bbb2794eef8a900448a5f487eb5" FOREIGN KEY ("boardId") REFERENCES "board" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_list"("id", "name", "boardId") SELECT "id", "name", "boardId" FROM "list"`);
        await queryRunner.query(`DROP TABLE "list"`);
        await queryRunner.query(`ALTER TABLE "temporary_list" RENAME TO "list"`);
        await queryRunner.query(`CREATE TABLE "temporary_subtask" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "isDone" boolean NOT NULL, "taskId" integer, CONSTRAINT "FK_8209040ec2c518c62c70cd382dd" FOREIGN KEY ("taskId") REFERENCES "task" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_subtask"("id", "name", "isDone", "taskId") SELECT "id", "name", "isDone", "taskId" FROM "subtask"`);
        await queryRunner.query(`DROP TABLE "subtask"`);
        await queryRunner.query(`ALTER TABLE "temporary_subtask" RENAME TO "subtask"`);
        await queryRunner.query(`CREATE TABLE "temporary_task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar NOT NULL, "listId" integer, CONSTRAINT "FK_d2275fe92da6a114d70796b7344" FOREIGN KEY ("listId") REFERENCES "list" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_task"("id", "name", "description", "listId") SELECT "id", "name", "description", "listId" FROM "task"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`ALTER TABLE "temporary_task" RENAME TO "task"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" RENAME TO "temporary_task"`);
        await queryRunner.query(`CREATE TABLE "task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar NOT NULL, "listId" integer)`);
        await queryRunner.query(`INSERT INTO "task"("id", "name", "description", "listId") SELECT "id", "name", "description", "listId" FROM "temporary_task"`);
        await queryRunner.query(`DROP TABLE "temporary_task"`);
        await queryRunner.query(`ALTER TABLE "subtask" RENAME TO "temporary_subtask"`);
        await queryRunner.query(`CREATE TABLE "subtask" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "isDone" boolean NOT NULL, "taskId" integer)`);
        await queryRunner.query(`INSERT INTO "subtask"("id", "name", "isDone", "taskId") SELECT "id", "name", "isDone", "taskId" FROM "temporary_subtask"`);
        await queryRunner.query(`DROP TABLE "temporary_subtask"`);
        await queryRunner.query(`ALTER TABLE "list" RENAME TO "temporary_list"`);
        await queryRunner.query(`CREATE TABLE "list" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "boardId" integer)`);
        await queryRunner.query(`INSERT INTO "list"("id", "name", "boardId") SELECT "id", "name", "boardId" FROM "temporary_list"`);
        await queryRunner.query(`DROP TABLE "temporary_list"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "subtask"`);
        await queryRunner.query(`DROP TABLE "list"`);
        await queryRunner.query(`DROP TABLE "board"`);
    }

}

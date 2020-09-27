import { Migration } from '@mikro-orm/migrations';

export class Migration20200927134305 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "id" uuid not null default uuid_generate_v4(), "email" text not null, "name" text not null, "password" text not null);'
    );
    this.addSql(
      'alter table "user" add constraint "user_pkey" primary key ("id");'
    );
    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");'
    );
  }
}

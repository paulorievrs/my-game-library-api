import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class GameReviewMigration1708739792020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'game_review',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'review',
            type: 'text',
          },
          {
            name: 'rating',
            type: 'int',
          },
          {
            name: 'beat',
            type: 'boolean',
            default: false,
          },
          {
            name: 'gave_up',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_public',
            type: 'boolean',
            default: false,
          },
          {
            name: 'review_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'played_for',
            type: 'int',
          },
          {
            name: 'gameId',
            type: 'int',
          },
          {
            name: 'userId',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'game_review',
      new TableForeignKey({
        columnNames: ['gameId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'game',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'game_review',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('game_review');
    const foreignKeyGame = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('gameId') !== -1,
    );
    if (foreignKeyGame) {
      await queryRunner.dropForeignKey('game_review', foreignKeyGame);
    }

    const foreignKeyUser = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );
    if (foreignKeyUser) {
      await queryRunner.dropForeignKey('game_review', foreignKeyUser);
    }

    await queryRunner.dropTable('game_review');
  }
}

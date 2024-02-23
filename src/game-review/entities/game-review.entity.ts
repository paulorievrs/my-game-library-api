import { Game } from '../../game/entities/game.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class GameReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  review: string;

  @Column()
  rating: number;

  @Column({ default: false })
  beat: boolean;

  @Column({ default: false })
  gave_up: boolean;

  @Column({ default: false })
  is_public: boolean;

  @Column()
  review_at: Date;

  // in seconds
  @Column()
  played_for: number;

  @OneToOne(() => Game, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  game: Game;

  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}

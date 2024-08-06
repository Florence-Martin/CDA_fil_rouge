// src/entity/refer.ts
import { Relation, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tag } from './tag';
import { SharingSession } from './sharingSession';

@Entity('refer')
export class Refer {
  @PrimaryColumn('uuid')
  tag_uuid!: string;

  @PrimaryColumn('uuid')
  sharing_session_uuid!: string;

  @ManyToOne(() => Tag)
  @JoinColumn({ name: 'tag_uuid' })
  tag!: Relation<Tag>;

  @ManyToOne(() => SharingSession)
  @JoinColumn({ name: 'sharing_session_uuid' })
  sharingSession!: Relation<SharingSession>;
}

import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UUID } from "../types/common.types";
import type { User } from "./user.entity";

export abstract class AbstractEntity {
  // ID
  @PrimaryGeneratedColumn("uuid")
  id!: UUID;

  // CREATED AT
  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  // UPDATED AT
  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;

  // CREATED BY ID
  @Column({ name: "created_by_id", type: "uuid", nullable: true })
  createdById: UUID;

  // LAST UPDATED BY ID
  @Column({ name: "last_updated_by_id", type: "uuid", nullable: true })
  lastUpdatedById: UUID;

  /**
   * RELATIONS
   */

  // CREATED BY (lazy require avoids circular import: AbstractEntity → User → Person → AbstractEntity)
  @ManyToOne(() => require("./user.entity").User, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "created_by_id" })
  createdBy: User;

  // LAST UPDATED BY (lazy require avoids circular import: AbstractEntity → User → Person → AbstractEntity)
  @ManyToOne(() => require("./user.entity").User, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "last_updated_by_id" })
  lastUpdatedBy: User;
}

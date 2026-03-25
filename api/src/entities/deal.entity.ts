import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { UUID } from "../types/common.types";
import {
  CommercialModelType,
  UseType,
  PriceType,
} from "../constants/ddex.constants";
import { Release } from "./release.entity";
import { Store } from "./store.entity";

@Entity("deals")
@Unique(["releaseId", "storeId", "useType", "commercialModelType"])
export class Deal extends AbstractEntity {
  // RELEASE ID
  @Column({ name: "release_id", type: "uuid", nullable: false })
  releaseId!: UUID;

  // STORE ID (nullable — null means applies to ALL stores)
  @Column({ name: "store_id", type: "uuid", nullable: true })
  storeId?: UUID;

  // COMMERCIAL MODEL TYPE
  @Column({
    name: "commercial_model_type",
    type: "enum",
    enum: CommercialModelType,
    nullable: false,
  })
  commercialModelType!: CommercialModelType;

  // USE TYPE
  @Column({
    name: "use_type",
    type: "enum",
    enum: UseType,
    nullable: false,
  })
  useType!: UseType;

  // TERRITORIES (ISO 3166-1 alpha-2 codes)
  @Column({
    name: "territories",
    type: "jsonb",
    nullable: false,
    default: () => "'[]'",
  })
  territories!: string[];

  // EXCLUDED TERRITORIES
  @Column({
    name: "excluded_territories",
    type: "jsonb",
    nullable: true,
    default: () => "'[]'",
  })
  excludedTerritories?: string[];

  // START DATE
  @Column({ name: "start_date", type: "date", nullable: false })
  startDate!: string;

  // END DATE (nullable — null = indefinite)
  @Column({ name: "end_date", type: "date", nullable: true })
  endDate?: string;

  // PREORDER DATE
  @Column({ name: "preorder_date", type: "date", nullable: true })
  preorderDate?: string;

  // PRICE TYPE
  @Column({
    name: "price_type",
    type: "enum",
    enum: PriceType,
    nullable: true,
  })
  priceType?: PriceType;

  // PRICE AMOUNT
  @Column({ name: "price_amount", type: "numeric", nullable: true })
  priceAmount?: string;

  // PRICE CURRENCY (ISO 4217)
  @Column({ name: "price_currency", type: "varchar", length: 3, nullable: true })
  priceCurrency?: string;

  // TAKEDOWN DATE
  @Column({ name: "takedown_date", type: "date", nullable: true })
  takedownDate?: string;

  // TAKEDOWN REASON
  @Column({ name: "takedown_reason", type: "varchar", length: 500, nullable: true })
  takedownReason?: string;

  // IS ACTIVE
  @Column({ name: "is_active", type: "boolean", nullable: false, default: true })
  isActive!: boolean;

  /**
   * RELATIONS
   */

  // RELEASE
  @ManyToOne(() => Release, (release) => release.deals, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "release_id" })
  release!: Release;

  // STORE (nullable — null means all stores)
  @ManyToOne(() => Store, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "store_id" })
  store?: Store;
}

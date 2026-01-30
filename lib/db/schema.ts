import {
  pgTable,
  text,
  timestamp,
  integer,
  real,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

// Users table - synced from Clerk
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  imageUrl: text("image_url"),
  emailNotifications: boolean("email_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(false),
  notificationFrequency: text("notification_frequency").default("daily"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Properties table - real estate listings
export const properties = pgTable(
  "properties",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    // Basic info
    address: text("address").notNull(),
    city: text("city").notNull(),
    state: text("state").notNull(),
    zip: text("zip").notNull(),
    propertyType: text("property_type").notNull(), // single_family, multi_family, condo, etc.

    // Property details
    bedrooms: integer("bedrooms").notNull(),
    bathrooms: real("bathrooms").notNull(),
    sqft: integer("sqft"),
    lotSize: integer("lot_size"),
    yearBuilt: integer("year_built"),

    // Pricing & financials
    price: integer("price").notNull(),
    capRate: real("cap_rate"),
    cashOnCash: real("cash_on_cash"),
    arvEstimate: integer("arv_estimate"),
    rehabCostEstimate: integer("rehab_cost_estimate"),
    monthlyRentEstimate: integer("monthly_rent_estimate"),

    // Investment score (0-100)
    score: integer("score").default(0),

    // Listing info
    daysOnMarket: integer("days_on_market").default(0),
    listingSource: text("listing_source"), // zillow, redfin, mls, etc.
    listingUrl: text("listing_url"),
    mlsNumber: text("mls_number"),

    // Media
    photos: jsonb("photos").$type<string[]>().default([]),
    primaryPhoto: text("primary_photo"),

    // AI analysis
    aiAnalysis: text("ai_analysis"),
    aiInsights: jsonb("ai_insights").$type<Record<string, unknown>>(),

    // Metadata
    rawData: jsonb("raw_data").$type<Record<string, unknown>>(),
    dataSource: text("data_source"), // rentcast, attom, etc.
    lastSyncedAt: timestamp("last_synced_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    cityIdx: index("properties_city_idx").on(table.city),
    scoreIdx: index("properties_score_idx").on(table.score),
    priceIdx: index("properties_price_idx").on(table.price),
    propertyTypeIdx: index("properties_type_idx").on(table.propertyType),
  })
);

// Investment criteria - user's deal requirements
export const investmentCriteria = pgTable(
  "investment_criteria",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id")
      .notNull()
      .references(() => users.clerkId, { onDelete: "cascade" }),
    name: text("name").notNull(),
    minCapRate: real("min_cap_rate"),
    minCashOnCash: real("min_cash_on_cash"),
    maxPrice: integer("max_price"),
    minBeds: integer("min_beds"),
    maxBeds: integer("max_beds"),
    propertyTypes: jsonb("property_types").$type<string[]>().default([]),
    targetMarkets: jsonb("target_markets").$type<string[]>().default([]),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("criteria_user_idx").on(table.userId),
  })
);

// Favorites - saved properties
export const favorites = pgTable(
  "favorites",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id")
      .notNull()
      .references(() => users.clerkId, { onDelete: "cascade" }),
    propertyId: text("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("favorites_user_idx").on(table.userId),
    uniqueIdx: index("favorites_unique_idx").on(table.userId, table.propertyId),
  })
);

// Markets - tracked real estate markets
export const markets = pgTable("markets", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  avgPrice: integer("avg_price"),
  avgCapRate: real("avg_cap_rate"),
  avgRent: integer("avg_rent"),
  propertyCount: integer("property_count").default(0),
  trend: text("trend"), // up, down, stable
  lastUpdated: timestamp("last_updated"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Alerts - notification triggers
export const alerts = pgTable(
  "alerts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id")
      .notNull()
      .references(() => users.clerkId, { onDelete: "cascade" }),
    criteriaId: text("criteria_id").references(() => investmentCriteria.id, {
      onDelete: "cascade",
    }),
    propertyId: text("property_id").references(() => properties.id, {
      onDelete: "cascade",
    }),
    type: text("type").notNull(), // new_deal, price_drop, score_change
    message: text("message"),
    isRead: boolean("is_read").default(false),
    sentAt: timestamp("sent_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("alerts_user_idx").on(table.userId),
    unreadIdx: index("alerts_unread_idx").on(table.userId, table.isRead),
  })
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  criteria: many(investmentCriteria),
  favorites: many(favorites),
  alerts: many(alerts),
}));

export const propertiesRelations = relations(properties, ({ many }) => ({
  favorites: many(favorites),
  alerts: many(alerts),
}));

export const investmentCriteriaRelations = relations(
  investmentCriteria,
  ({ one, many }) => ({
    user: one(users, {
      fields: [investmentCriteria.userId],
      references: [users.clerkId],
    }),
    alerts: many(alerts),
  })
);

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.clerkId],
  }),
  property: one(properties, {
    fields: [favorites.propertyId],
    references: [properties.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  user: one(users, {
    fields: [alerts.userId],
    references: [users.clerkId],
  }),
  criteria: one(investmentCriteria, {
    fields: [alerts.criteriaId],
    references: [investmentCriteria.id],
  }),
  property: one(properties, {
    fields: [alerts.propertyId],
    references: [properties.id],
  }),
}));

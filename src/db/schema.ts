import { pgTable, text, boolean, timestamp, uuid, varchar, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users / Basic Members
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  slug: varchar('slug', { length: 256 }).notNull().unique(),
  firstName: varchar('first_name', { length: 256 }),
  lastName: varchar('last_name', { length: 256 }),
  email: varchar('email', { length: 256 }).notNull().unique(),
  phoneNo: varchar('phone_no', { length: 20 }),
  password: varchar('password', { length: 256 }), // hashed
  education: varchar('education', { length: 50 }), // High School Student, Senior School Student, College Student, Corporate Professional
  emailVerified: boolean('email_verified').default(false),
  introductionCompleted: boolean('introduction_completed').default(false),
  testCompleted: boolean('test_completed').default(false),
  candidateReport: text('candidate_report'), // URL to report file
  
  // Test enable flags
  enableFiroB: boolean('enable_firo_b').default(false),
  enableWorkValues: boolean('enable_work_values').default(false),
  enableGeneralAptitude: boolean('enable_general_aptitude').default(false),
  enableInterestInventory: boolean('enable_interest_inventory').default(false),
  enablePersonalityAspect: boolean('enable_personality_aspect').default(false),
  enableBehaviorResponse: boolean('enable_behavior_response').default(false),
  
  // Test statuses
  firoBStatus: varchar('firo_b_status', { length: 20 }).default('Pending'), // Pending, Completed
  generalAptitudeStatus: varchar('general_aptitude_status', { length: 20 }).default('Pending'),
  gatbPart2Status: varchar('gatb_part_2_status', { length: 20 }).default('Pending'),
  gatbPart3Status: varchar('gatb_part_3_status', { length: 20 }).default('Pending'),
  gatbPart4Status: varchar('gatb_part_4_status', { length: 20 }).default('Pending'),
  gatbPart5Status: varchar('gatb_part_5_status', { length: 20 }).default('Pending'),
  gatbPart6Status: varchar('gatb_part_6_status', { length: 20 }).default('Pending'),
  gatbPart7Status: varchar('gatb_part_7_status', { length: 20 }).default('Pending'),
  workValuesStatus: varchar('work_values_status', { length: 20 }).default('Pending'),
  interestInventoryStatus: varchar('interest_inventory_status', { length: 20 }).default('Pending'),
  personalityAspectStatus: varchar('personality_aspect_status', { length: 20 }).default('Pending'),
  behaviorResponseStatus: varchar('behavior_response_status', { length: 20 }).default('Pending'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Blog Posts
export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  slug: varchar('slug', { length: 256 }).notNull().unique(),
  postBody: text('post_body'),
  postSummary: text('post_summary'),
  mainImage: text('main_image'), // URL
  thumbnailImage: text('thumbnail_image'), // URL
  featured: boolean('featured').default(false),
  color: varchar('color', { length: 7 }), // hex color
  metaTitle: varchar('meta_title', { length: 256 }),
  metaDescription: text('meta_description'),
  altTextForSeo: varchar('alt_text_for_seo', { length: 256 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Testimonials
export const testimonials = pgTable('testimonials', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  slug: varchar('slug', { length: 256 }).notNull().unique(),
  testimonialText: text('testimonial_text').notNull(),
  authorName: varchar('author_name', { length: 256 }),
  authorTitle: varchar('author_title', { length: 256 }),
  authorLocation: varchar('author_location', { length: 256 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// GATB Test Questions
export const gatbQuestions = pgTable('gatb_questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  part: varchar('part', { length: 10 }).notNull(), // 'part-1', 'part-2', etc.
  questionNumber: varchar('question_number', { length: 10 }),
  questionText: text('question_text'),
  questionImage: text('question_image'), // URL
  options: jsonb('options'), // Array of options
  correctAnswer: varchar('correct_answer', { length: 10 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Work Values Questions
export const workValuesQuestions = pgTable('work_values_questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionNumber: varchar('question_number', { length: 10 }),
  questionText: text('question_text').notNull(),
  options: jsonb('options'), // Array of options
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// FIRO-B Questions
export const firoBQuestions = pgTable('firo_b_questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionNumber: varchar('question_number', { length: 10 }),
  questionText: text('question_text').notNull(),
  options: jsonb('options'), // Array of options
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Interest Inventory Questions
export const interestInventoryQuestions = pgTable('interest_inventory_questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionNumber: varchar('question_number', { length: 10 }),
  questionText: text('question_text').notNull(),
  options: jsonb('options'), // Array of options
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Personality Aspect Questions
export const personalityAspectQuestions = pgTable('personality_aspect_questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionNumber: varchar('question_number', { length: 10 }),
  questionText: text('question_text').notNull(),
  options: jsonb('options'), // Array of options
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Behavior Response Questions
export const behaviorResponseQuestions = pgTable('behavior_response_questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionNumber: varchar('question_number', { length: 10 }),
  questionText: text('question_text').notNull(),
  options: jsonb('options'), // Array of options
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User Test Responses
export const userTestResponses = pgTable('user_test_responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  testType: varchar('test_type', { length: 50 }).notNull(), // 'gatb-part-1', 'work-values', etc.
  responses: jsonb('responses').notNull(), // { questionId: answer }
  score: jsonb('score'), // Test scores/results
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  testResponses: many(userTestResponses),
}));

export const userTestResponsesRelations = relations(userTestResponses, ({ one }) => ({
  user: one(users, {
    fields: [userTestResponses.userId],
    references: [users.id],
  }),
}));


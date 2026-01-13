/**
 * Migration script to extract and migrate content from Webflow to Astro/Neon DB
 * 
 * This script extracts:
 * - Testimonials from Webflow CMS
 * - Blog posts from Webflow CMS
 * - Page content from Webflow pages
 * 
 * Run with: pnpx tsx scripts/migrate-webflow-content.ts
 */

import { db } from '../src/db/index';
import { testimonials, blogPosts } from '../src/db/schema';
import { eq } from 'drizzle-orm';

// Testimonials data extracted from Webflow CMS
const webflowTestimonials = [
  {
    name: "John Doe",
    position: "Senior Vice President",
    company: "XYZ Company",
    testimonial: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget a lacinia dapibus vestibulum, sit egestas. Ut aliquam nisl tincidunt quis. Sit suscipit morbi fermentum, tempor, sagittis. Sagittis quam sed vitae at.",
    slug: "john-doe"
  },
  {
    name: "Jane Does",
    position: "Vice President",
    company: "XYZ Company",
    testimonial: "Lorem Ipsem",
    slug: "jane-does"
  }
];

// Real testimonials extracted from Webflow homepage content
const homepageTestimonials = [
  {
    name: "Muskaan",
    position: "College Student",
    company: "Hyderabad",
    testimonial: "Taking a counselling session with Suresh sir has helped me greatly, i was struggling with college and career but after taking the counselling a lot of things became clear to me. My strengths, weaknesses, problems i need to work on, what am i lacking everything slowly fell into place. It was totally worth my time , and has greatly helped me in improving myself and setting my future goals.",
    slug: "muskaan"
  },
  {
    name: "Soman Yadav",
    position: "Marketing Head",
    company: "Bangalore",
    testimonial: "Being a person who wants to improve everyday in life, I believe, this session with Mr. Suresh Lachwani has provided me direction to analyse my current weakness and strengths and pointers on how to improve my overall personality. The experience is such, you would be able to relate to the session result as soon as it is explained by Mr. Suresh. I would recommend to everyone who is looking to improve themselves in their daily lives personally and professionally to take up a session and experience the inner self.",
    slug: "soman-yadav"
  },
  {
    name: "Roshan Singh",
    position: "Professional Editor",
    company: "Bangalore",
    testimonial: "I am an introvert person, it isn't easy for me to share my feeling with other persons, but with Mr. Suresh Lachhwani it was easy for me to open up about my personal challenges, being in a creative space, the insights about my personality that were explained in detail by Mr. Suresh Lachhwani helped me immensely to connect with more people and boost my confidence. Also the session helped me to try and experiments new things in life which has changed my perspective 360.",
    slug: "roshan-singh"
  },
  {
    name: "Sargam Chopra",
    position: "College Student",
    company: "Ahmedabad",
    testimonial: "I have had career counseling sessions since when I was in 9th grade. There is just so much to choose from! Met with at least 10 career counselors, but my search ended when I flew to Ahmedabad only to get career counseling done from Suresh Uncle. There's comfort in knowing that a person with so much experience, expertise, understanding in the field actually exists! Any and every doubt, be it about personality, career, or even evaluating which area of life to work on, and how to go about with it, he's just 1 message away.",
    slug: "sargam-chopra"
  },
  {
    name: "Tarun",
    position: "Business Owner",
    company: "Bangalore",
    testimonial: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget a lacinia dapibus vestibulum, sit egestas. Ut aliquam nisl tincidunt quis. Sit suscipit morbi fermentum, tempor, sagittis. Sagittis quam sed vitae at.",
    slug: "tarun"
  }
];

async function migrateTestimonials() {
  console.log('Migrating testimonials...');
  
  // Combine CMS and homepage testimonials
  const allTestimonials = [...webflowTestimonials, ...homepageTestimonials];
  
  for (const testimonial of allTestimonials) {
    try {
      // Check if testimonial already exists
      const existing = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.slug, testimonial.slug))
        .limit(1);
      
      if (existing.length > 0) {
        console.log(`Testimonial ${testimonial.slug} already exists, skipping...`);
        continue;
      }
      
      // Insert new testimonial (mapping Webflow fields to schema)
      await db.insert(testimonials).values({
        name: testimonial.name,
        slug: testimonial.slug,
        testimonialText: testimonial.testimonial,
        authorName: testimonial.name,
        authorTitle: testimonial.position,
        authorLocation: testimonial.company,
      });
      
      console.log(`✓ Migrated testimonial: ${testimonial.name}`);
    } catch (error) {
      console.error(`✗ Error migrating testimonial ${testimonial.slug}:`, error);
    }
  }
  
  console.log(`\nCompleted migrating ${allTestimonials.length} testimonials\n`);
}

async function main() {
  try {
    console.log('Starting Webflow content migration...\n');
    
    await migrateTestimonials();
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
main();


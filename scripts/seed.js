const { getConnection, sql } = require('../config/database'); 
 
async function seedDatabase() { 
  try { 
    console.log('Seeding database...'); 
    const pool = await getConnection(); 
    console.log('? Database seeded successfully!'); 
  } catch (error) { 
    console.error('Seeding failed:', error); 
  } 
} 
 
seedDatabase(); 

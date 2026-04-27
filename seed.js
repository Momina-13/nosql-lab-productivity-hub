require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('./db/connection');

(async () => {
  const db = await connect();

  // Clear existing data
  await db.collection('users').deleteMany({});
  await db.collection('projects').deleteMany({});
  await db.collection('tasks').deleteMany({});
  await db.collection('notes').deleteMany({});

  // Insert 2 Users
  const hash1 = await bcrypt.hash('password123', 10);
  const hash2 = await bcrypt.hash('password456', 10);

  const u1 = await db.collection('users').insertOne({
    name: 'Alice Johnson',
    email: 'alice@example.com',
    passwordHash: hash1,
    createdAt: new Date()
  });
  const u2 = await db.collection('users').insertOne({
    name: 'Bob Smith',
    email: 'bob@example.com',
    passwordHash: hash2,
    createdAt: new Date()
  });

  const aliceId = u1.insertedId;
  const bobId = u2.insertedId;

  // Insert 4 Projects
  const p1 = await db.collection('projects').insertOne({
    ownerId: aliceId,
    name: 'Website Redesign',
    description: 'Redesign the company website',
    archived: false,
    createdAt: new Date('2026-01-01')
  });
  const p2 = await db.collection('projects').insertOne({
    ownerId: aliceId,
    name: 'Mobile App',
    description: 'Build a cross-platform mobile app',
    archived: false,
    createdAt: new Date('2026-02-01')
  });
  const p3 = await db.collection('projects').insertOne({
    ownerId: bobId,
    name: 'Database Lab',
    description: 'Complete the NoSQL lab',
    archived: false,
    createdAt: new Date('2026-03-01')
  });
  const p4 = await db.collection('projects').insertOne({
    ownerId: aliceId,
    name: 'Old Marketing Campaign',
    description: 'Archived old project',
    archived: true,
    createdAt: new Date('2025-06-01')
  });

  const proj1 = p1.insertedId;
  const proj2 = p2.insertedId;
  const proj3 = p3.insertedId;

  // Insert 5 Tasks
  await db.collection('tasks').insertOne({
    ownerId: aliceId,
    projectId: proj1,
    title: 'Design Homepage Layout',
    status: 'in-progress',
    priority: 3,
    tags: ['design', 'frontend'],
    subtasks: [
      { title: 'Create wireframe', done: true },
      { title: 'Pick color scheme', done: false }
    ],
    dueDate: new Date('2026-05-01'), // schema flexibility - optional field
    createdAt: new Date('2026-04-01')
  });

  await db.collection('tasks').insertOne({
    ownerId: aliceId,
    projectId: proj1,
    title: 'Write CSS Styles',
    status: 'todo',
    priority: 2,
    tags: ['frontend', 'styling'],
    subtasks: [
      { title: 'Setup Tailwind', done: false }
    ],
    createdAt: new Date('2026-04-05')
  });

  await db.collection('tasks').insertOne({
    ownerId: aliceId,
    projectId: proj2,
    title: 'Setup React Native',
    status: 'done',
    priority: 3,
    tags: ['setup', 'mobile'],
    subtasks: [
      { title: 'Install dependencies', done: true },
      { title: 'Configure Expo', done: true }
    ],
    dueDate: new Date('2026-04-15'), // schema flexibility
    createdAt: new Date('2026-04-10')
  });

  await db.collection('tasks').insertOne({
    ownerId: aliceId,
    projectId: proj2,
    title: 'Build Login Screen',
    status: 'in-progress',
    priority: 2,
    tags: ['auth', 'frontend'],
    subtasks: [
      { title: 'Add form validation', done: false },
      { title: 'Connect to API', done: false }
    ],
    createdAt: new Date('2026-04-15')
  });

  await db.collection('tasks').insertOne({
    ownerId: bobId,
    projectId: proj3,
    title: 'Implement MongoDB Queries',
    status: 'todo',
    priority: 3,
    tags: ['backend', 'database'],
    subtasks: [
      { title: 'Write seed.js', done: true },
      { title: 'Implement all 15 queries', done: false }
    ],
    createdAt: new Date('2026-04-20')
  });

  // Insert 5 Notes
  await db.collection('notes').insertOne({
    ownerId: aliceId,
    projectId: proj1,
    title: 'Design Meeting Notes',
    body: 'Client wants blue and white color theme. Keep it minimal.',
    tags: ['design', 'meeting'],
    createdAt: new Date('2026-04-01')
  });

  await db.collection('notes').insertOne({
    ownerId: aliceId,
    projectId: proj2,
    title: 'App Feature Ideas',
    body: 'Add dark mode, push notifications, offline support.',
    tags: ['ideas', 'mobile'],
    createdAt: new Date('2026-04-05')
  });

  await db.collection('notes').insertOne({
    ownerId: aliceId,
    // no projectId - standalone note (schema flexibility)
    title: 'Personal Reminder',
    body: 'Buy groceries and book dentist appointment.',
    tags: ['personal'],
    createdAt: new Date('2026-04-10')
  });

  await db.collection('notes').insertOne({
    ownerId: aliceId,
    projectId: proj1,
    title: 'SEO Checklist',
    body: 'Add meta tags, sitemap, robots.txt, and alt text on images.',
    tags: ['seo', 'frontend'],
    createdAt: new Date('2026-04-12')
  });

  await db.collection('notes').insertOne({
    ownerId: bobId,
    // no projectId - standalone note (schema flexibility)
    title: 'MongoDB Study Notes',
    body: 'Remember: $addToSet avoids duplicates, $pull removes elements.',
    tags: ['database', 'learning'],
    createdAt: new Date('2026-04-20')
  });

  console.log('✅ Seeding complete!');
  process.exit(0);
})();
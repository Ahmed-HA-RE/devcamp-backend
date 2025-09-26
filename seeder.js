import colors from '@colors/colors';
import path from 'path';
import { connectDB } from './config/database.js';
import fs from 'fs';
import { Course } from './models/Course.js';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const coursesDummyData = path.join(__dirname, '/data/courses.json');

const parsedCourses = JSON.parse(fs.readFileSync(coursesDummyData, 'utf-8'));

const importData = async () => {
  try {
    await Course.create(parsedCourses, { new: true });
    console.log('Data imported...'.bgGreen);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Course.deleteMany();
    console.log('Data deleted...'.bgRed);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const result = async () => {
  await connectDB();
  if (process.argv[2] === '-i') {
    importData();
  } else if (process.argv[2] === '-d') {
    deleteData();
  }
};

result();

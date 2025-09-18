import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import mongoose from "mongoose";
import { paramCase } from "param-case"; // A utility to create slugs
import connectDB from "../db/index.js";
import { Category } from "../models/category.model.js";



// A predefined list of meaningful categories
const potentialCategories = [
  "Technology",
  "Software Engineering",
  "Web Development",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Cybersecurity",
  "Cloud Computing",
  "Health & Wellness",
  "Fitness",
  "Nutrition",
  "Mental Health",
  "Personal Finance",
  "Investing",
  "Budgeting",
  "Cryptocurrency",
  "Science",
  "Space Exploration",
  "Biology",
  "Physics",
  "Travel",
  "Digital Nomad",
  "World Culture",
  "Adventure Travel",
  "Lifestyle",
  "Productivity",
  "Minimalism",
  "Book Reviews",
];

const addCategories = async () => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Database connected.");

    // Fetch existing category names to avoid duplicates
    const existingCategories = await Category.find().select("name");
    const existingNames = existingCategories.map((cat) => cat.name);

    // Filter out categories that already exist
    const newCategoriesToAdd = potentialCategories
      .filter((name) => !existingNames.includes(name))
      .slice(0, 10); // Take the next 10 new categories

    if (newCategoriesToAdd.length === 0) {
      console.log("✅ No new categories to add from the predefined list.");
      return;
    }

    console.log(`Adding ${newCategoriesToAdd.length} new categories...`);

    const categoriesToCreate = newCategoriesToAdd.map((name) => ({
      name: name,
      slug: paramCase(name), // Creates a URL-friendly slug, e.g., "Web Development" -> "web-development"
    }));

    await Category.insertMany(categoriesToCreate);
    console.log(
      `✅ Success! ${categoriesToCreate.length} new categories have been added.`
    );
  } catch (error) {
    console.error("\n❌ --- Error while adding categories --- ❌");
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\nDatabase connection closed.");
  }
};

addCategories();

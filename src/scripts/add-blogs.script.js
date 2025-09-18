import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import connectDB from "../db/index.js";
import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";
import { faker } from "@faker-js/faker";
import { Blog } from "../models/blog.model.js";
import mongoose from "mongoose";

const NUM_BLOGS_TO_ADD = 200;

const addBlogs = async () => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Database connected.");

    const existingUsers = await User.find().select("_id");
    const existingCategories = await Category.find().select("_id");

    if (existingUsers.length === 0) {
      throw new Error(
        "No users found in the database. Please add users before addding blogs."
      );
    }
    if (existingCategories.length === 0) {
      throw new Error(
        "No categories found. Please add categories before adding blogs."
      );
    }

    console.log(`Generating ${NUM_BLOGS_TO_ADD} new blogs...`);
    const blogsToCreate = [];
    for (let i = 0; i < NUM_BLOGS_TO_ADD; i++) {
      const title = faker.lorem.sentence({ min: 5, max: 10 });
      const randomCategory = faker.helpers.arrayElement(existingCategories);
      blogsToCreate.push({
        title: title,
        slug: faker.helpers.slugify(title).toLowerCase(),
        thumbnail: `https://source.unsplash.com/random/800x600?${randomCategory.slug}&sig=${i}`,
        content: faker.lorem.paragraphs(8),
        owner: faker.helpers.arrayElement(existingUsers)._id,
        categories: [randomCategory._id],
        isPublished: true,
        status: "published",
        views: faker.number.int({ min: 0, max: 5000 }),
      });
    }
    await Blog.insertMany(blogsToCreate);
    console.log(`✅ Success! ${NUM_BLOGS_TO_ADD} new blogs have been added.`);
  } catch (error) {
    console.error("\n❌ --- Error while adding blogs --- ❌");
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\nDatabase connection closed.");
  }
};

addBlogs();

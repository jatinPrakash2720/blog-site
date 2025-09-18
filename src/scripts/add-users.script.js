import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { User } from "../models/user.model.js";
import connectDB from "../db/index.js";

const NUM_TO_ADD = 1000;

const addUsers = async () => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Database connected.");

    console.log(`Generating ${NUM_TO_ADD} new users...`);
    const usersToCreate = [];

    const unique_suffix = Date.now();

    for (let i = 0; i < NUM_TO_ADD; i++) {
      usersToCreate.push({
        fullName: faker.person.fullName(),
        username: `${faker.internet.userName().toLowerCase()}_${unique_suffix}_${i}`,
        email: `${unique_suffix}_${i}_${faker.internet.email().toLowerCase()}`,
        password: "password123",
        avatar: `https://source.unsplash.com/random/200x200?face&sig=${i}`,
        converImage: `https://source.unsplash.com/random/1200x400?landscape,nature&sig=${i}`,
        bio: faker.lorem.sentence(),
      });
    }

    await User.insertMany(usersToCreate);
    console.log(`✅ Success! ${NUM_TO_ADD} new users have been added.`);
  } catch (error) {
    console.error("\n❌ --- Error while adding users --- ❌");
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\nDatabase connection closed.");
  }
};

addUsers();

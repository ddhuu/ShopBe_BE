"use strict";

const mongoose = require("mongoose");
const connectString = "mongodb://localhost:27017/shopDEV";

const testSchema = new mongoose.Schema({
  name: String,
});

const Test = mongoose.model("Test", testSchema);

describe("Mongoose Connect", () => {
  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(connectString);
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it("Should connect to mongo", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  it("should save a document to the database", async () => {
    const user = new Test({ name: "ddhuu" });
    await user.save();
    expect(user.isNew).toBe(false);
  });

  it("should have a document to the database", async () => {
    const user = await Test.findOne({ name: "ddhuu" });
    expect(user.name).toBeDefined();
    expect(user.name).toBe("ddhuu");
  });
});

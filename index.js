require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

// In-memory database
const db = {
  flights: [
    { id: 1, flightNumber: "AA123", destination: "New York" },
    { id: 2, flightNumber: "UA456", destination: "Chicago" },
  ],
  airports: [
    { id: 1, name: "JFK International Airport", city: "New York" },
    { id: 2, name: "O'Hare International Airport", city: "Chicago" },
  ],
};

// Helper functions object
const acbd = {
  findAll: (collection) => db[collection],

  findById: (collection, id) => db[collection].find((item) => item.id === id),

  create: (collection, data) => {
    const newItem = { id: db[collection].length + 1, ...data };
    db[collection].push(newItem);
    return newItem;
  },

  update: (collection, id, data) => {
    const index = db[collection].findIndex((item) => item.id === id);
    if (index !== -1) {
      db[collection][index] = { id, ...data };
      return db[collection][index];
    }
    return null;
  },

  remove: (collection, id) => {
    const index = db[collection].findIndex((item) => item.id === id);
    if (index !== -1) {
      return db[collection].splice(index, 1);
    }
    return null;
  },
};

// Generic CRUD endpoints
const createCrudEndpoints = (app, collection) => {
  // GET /api/{collection} - Retrieve a list of items
  app.get(`/${collection}`, (req, res) => {
    res.json(acbd.findAll(collection));
  });

  // GET /api/{collection}/:id - Retrieve a single item by ID
  app.get(`/${collection}/:id`, (req, res) => {
    const item = acbd.findById(collection, parseInt(req.params.id));
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: `${collection.slice(0, -1)} not found` });
    }
  });

  // POST /api/{collection} - Create a new item
  app.post(`/${collection}`, (req, res) => {
    const newItem = acbd.create(collection, req.body);
    res.status(201).json(newItem);
  });

  // PUT /api/{collection}/:id - Update an item by ID
  app.put(`/${collection}/:id`, (req, res) => {
    const updatedItem = acbd.update(
      collection,
      parseInt(req.params.id),
      req.body
    );
    if (updatedItem) {
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: `${collection.slice(0, -1)} not found` });
    }
  });

  // DELETE /api/{collection}/:id - Delete an item by ID
  app.delete(`/${collection}/:id`, (req, res) => {
    const deletedItem = acbd.remove(collection, parseInt(req.params.id));
    if (deletedItem) {
      res.json({ message: `${collection.slice(0, -1)} deleted` });
    } else {
      res.status(404).json({ message: `${collection.slice(0, -1)} not found` });
    }
  });
};

// Create endpoints for each collection
["flights", "airports"].forEach((collection) => {
  createCrudEndpoints(app, collection);
});

const port = process.env.PORT || 3000;
const address = process.env.BIND_ADDRESS || "127.0.0.1";
app.listen(port, address, () => {
  console.log(`Server is running at http://${address}:${port}`);
});

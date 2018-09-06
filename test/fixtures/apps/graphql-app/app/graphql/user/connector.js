'use strict';

const DataLoader = require('dataloader');

class UserConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  fetch(ids) {
    // this.ctx.model.user.find(ids);
    return Promise.resolve(
      ids.map(id => ({
        id,
        name: `name${id}`,
        upperName: `name${id}`,
        password: `password${id}`,
        createAt: 1528375304600,
        projects: [],
      }))
    );
  }

  fetchByIds(ids) {
    return this.loader.loadMany(ids);
  }

  fetchById(id) {
    return this.loader.load(id);
  }
}

module.exports = UserConnector;

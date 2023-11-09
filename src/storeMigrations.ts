type MigrationFunction = (store: { [key: string]: any }) => { [key: string]: any };

interface Migrations {
  [version: string]: MigrationFunction;
}

export default {
  '1.0.4': (store) => {
    Object.keys(store).forEach((key) => {
      store[key] = null;
    });

    return store;
  },
} as Migrations;

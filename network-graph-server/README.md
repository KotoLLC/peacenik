This project has been built with Express.
This is a backend project for Network Graph of PosgreSQL DB.

Step 1: PostgreSQL installation
  Create a new database ‘postgres-graphql’ under postgres. 
Step 2: Creating Node-Express server
  Create node-express server which will connect to your database. 
Step 3: Create and execute migrations using Knex-Migrations
  Next, add knex-migrate to maintain schema and to insert dummy/static data into your database. 
Step 4: Integrate PostGraphile to enable graphiql
  And finally, add postgraphile to generate graphiql for your client for CRUD operations.

You can reference this [documentation](https://medium.com/make-it-heady/part-1-building-full-stack-web-app-with-postgraphile-and-react-server-side-529e2f19e6f1).
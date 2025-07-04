This project has been built with Express.
This is a backend project for Network Graph of PosgreSQL DB.

Step 1: PostgreSQL installation <br />
  Create a new database ‘postgres-graphql’ under postgres. <br />
Step 2: Creating Node-Express server<br />
  Create node-express server which will connect to your database. <br />
Step 3: Create and execute migrations using Knex-Migrations<br />
  Next, add knex-migrate to maintain schema and to insert dummy/static data into your database. <br />
Step 4: Integrate PostGraphile to enable graphiql<br />
  And finally, add postgraphile to generate graphiql for your client for CRUD operations.<br />
<br />
You can reference this [documentation](https://medium.com/make-it-heady/part-1-building-full-stack-web-app-with-postgraphile-and-react-server-side-529e2f19e6f1).

- install knex node module
`npm install knex knex-migrate`

- knex init
`npx knex init`

- Create a migration file
`knex migrate:make migration_create_table`

- Update lastest migration
`npx knex migrate:latest`

- Generate seeder
`npx knex seed:make 01_users`
`npx knex seed:make 02_posts`

- Run seeder
`npx knex seed:run`

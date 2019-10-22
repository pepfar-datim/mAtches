# mAppr
Data source to target mapping utility

**Repo Owner:** Annah Ngaruro [@angaruro](https://github.com/angaruro)

**HOW TO RUN mAppr locally**

A. Fork repo

B. Configure backend locally

Set up instructions assume that you have PostgresSQL installed locally. If not, you will first need to install. The following guides may prove useful (but have not been reviewed for accuracy)
Windows: https://www.microfocus.com/documentation/idol/IDOL_12_0/MediaServer/Guides/html/English/Content/Getting_Started/Configure/_TRN_Set_up_PostgreSQL.htm
Mac: https://www.codementor.io/engineerapart/getting-started-with-postgresql-on-mac-osx-are8jcopb


1. Connect to postgres
`psql postgres`

2. Create new role `me`
`CREATE ROLE me WITH LOGIN PASSWORD 'password';`

3. Give role the permission to create a database
`ALTER ROLE me CREATEDB;`

4. Create new database `api`
CREATE DATABASE api;

5. Run commands contained in createDBtables.sql file in same postgres session, or disconnect and run
`psql -U me -d api -f database/createDBtables.sql`



C. Set up and start frontend
<br/>
App is configured to run on port 5001, to change this, edit server.js file, line 6

1. Install dependencies
`npm install`

2. Run app
`npm start`


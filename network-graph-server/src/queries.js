const Pool = require('pg').Pool

dbs = process.env.DATABASE.split(" ")
const pools = dbs.map( db => {
  return new Pool({
    user: process.env.PG_USER,
    host: process.env.HOST,
    database: db,
    password: process.env.PASSWORD,
    port: process.env.PG_PORT,
  })
})

const getHubsWithUsers = (request, response) => {
  let users
  let hubs = []
  let nPoolLaunchCnt = 0

  pools.forEach((pool, idx) => {
    if ( idx === 0 ){
      pool.query('SELECT id,full_name,hide_identity FROM users', (error, results) => {
        if (error) {
          throw error
        }
        users = results.rows
        nPoolLaunchCnt++
        if ( nPoolLaunchCnt === pools.length){
          response.status(200).json({
            users,
            hubs
          })
        }
      })
    } else {
      pool.query('SELECT id FROM public.users', (error, results) => {
        if (error) {
          throw error
        }
        hubs.push({ 
          hub: dbs[idx],
          users: results.rows
        }) 
        nPoolLaunchCnt++
        if ( nPoolLaunchCnt === pools.length){
          response.status(200).json({
            users,
            hubs
          })
        }
      })
    }
  });
}

module.exports = {
  getHubsWithUsers,
}
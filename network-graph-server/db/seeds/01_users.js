exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([{
        id: 1,
        name: 'Oscar Cardoso',
        email: 'oscar@cardoso-devstar.com',
        password: 'password',
      }, ])
    })
}
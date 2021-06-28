exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('posts')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('posts').insert([{
        id: 1,
        title: 'Sample blog',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec elementum mi purus, dignissim faucibus lectus pulvinar vitae.',
        user_id: 1,
      }, ])
    })
}
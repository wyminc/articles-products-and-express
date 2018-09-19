
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('articles').del()
    .then(function () {
      // Inserts seed entries
      return knex('articles').insert([
        {
          title: "Kingdom Come",
          body: 'Satire of "This is the End"',
          author: "Seth Green"
        },
        {
          title: "I am the best",
          body: "I am literally the best",
          author: "Yobert Rang"
        },
        {
          title: "3Fiddy",
          body: "I need about three fiddy",
          author: "South Park"
        }
      ]);
    });
};

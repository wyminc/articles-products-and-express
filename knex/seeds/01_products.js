
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('products').del()
    .then(function () {
      // Inserts seed entries
      return knex('products').insert([
        {
          name: "Pencil",
          price: "3.50",
          inventory: "1"
        },
        {
          name: "Cookies",
          price: "2.50",
          inventory: "10"
        },
        {
          name: "Chairs",
          price: "100.00",
          inventory: "25"
        }
      ]);
    });
};

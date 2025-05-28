// Wechsel zur gewünschten Datenbank
db = db.getSiblingDB('users_data');

// Benutzer einfügen
db.users.insertOne({
  username: 'admin',
  password: '$2y$12$mYmHXulK4Qi.bvODf9RuZukNKuvCZdH1IdSBkRy60cTPEptyTwgja',
  created_at: ISODate('2025-02-24T20:51:36.233Z'),
  isAdmin: true,
  user_tag: 'admin',
});

db = db.getSiblingDB('users');

db.createUser({
    user: 'userone',
    pwd: 'userone',
    roles: [
        {
            role: 'readWrite',
            db: 'users'
        }
    ]
});

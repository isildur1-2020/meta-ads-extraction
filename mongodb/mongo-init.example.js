db.createUser({
    user: 'YOUR_USERNAME',
    pwd: 'YOUR_PASSWORD',
    roles: [
        {
            role: 'readWrite',
            db: 'kiwanas',
        },
    ],
});

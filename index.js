// implement your API here
const express = require('express');
const db = require('./data/db');
const server = express();



server.use(express.json());

server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'The user information could not be retrieved',
            });
        });
});

server.post('/api/users', (req, res) => {
    const { name, bio, created_at, updated_at} = req.body;

    if (!name || !bio) {
        res.status(400).json({
            success: false,
            message: 'Please provide name and information for the user',
        });
    }

    db.insert({
        name, bio, created_at, updated_at
    })
        .then(resp => {
            res.status(201).json(resp);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'There was an error while saving the user to the database',
                err,
            })
        });
});


server.get('/api/users/:id', (req, res) => {
    db.findById(req.params.id)
        .then(user => {
            if (user) {
                res.status(200).json({
                    success: true,
                    user,
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    message: 'The user with that ID does not exist.',
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: 'The user information could not be retrieved.'
            });
        });
    });


server.delete('/api/users/:id', (req, res) => {
    
    db.remove(req.params.id)
        .then(user => {
            if (user) {
                res.status(200).json({
                    success: true,
                    message: 'User removed',
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    message: 'The user with that ID does not exist.',
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: 'The user could not be removed.'
            });
        });
});


server.put('/api/users/:id', (req, res) => {

    const { id } = req.params;
    const { name, bio } = req.body;

    if (!name || !bio) {
        res.status(400).json({
            success: false,
            message: 'Please provide name and information for the user',
        });
    }

    db
    .update(id, {name, bio})
        .then(response => {
           if (response === 0) {
               res.status(404).json({
                   success: false,
                   message: 'The user with that ID does not exist.'
               });
           }
        db
        .findById(id)
            .then(user => {
                if (user.length === 0) {
                    res.status(404).json({
                        success: false,
                        message: 'User with that id not found',
                    })
                }
                else {
                res.status(200).json({
                    success: true,
                    message: 'User updated',
                    user,
                })
            }
            })
            .catch(error => {
                res.status(500).json({
                   success: false,
                   message: 'The user information could not be modified.' 
                })
            })
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: 'You Broke It.'
            })
        })
})



server.listen(5000, () => console.log('Server running on port 5000'));
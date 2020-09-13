const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Order } = require('./database/models/order.model');
const { User } = require('./database/models/user.model');
const { Product } = require('./database/models/product.model');
const { Client } = require('./database/models/client.model');
const { Reservation } = require('./database/models/reservation.model');
const { Rent } = require('./database/models/rent.model');


/* SERVER FRONT START */
const app = express();
app.use(express.static(__dirname + '/dist/fluence-erp'));
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/fluence-erp/index.html'));
});
app.listen(process.env.PORT || 8080);

/* SERVER FRONT END */

/**       START       */


const db = require("./database/mongoose");
const dbName = "fluenceerp";
const collectionName = "clients";

db.initialize(dbName, collectionName, function(dbCollection) { // successCallback
    // get all items
    dbCollection.find().toArray(function(err, result) {
        if (err) throw err;
          console.log(result);
    });

    // << db CRUD routes >>

}, function(err) { // failureCallback
    throw (err);
});

/**       STOP        */
const jwt = require('jsonwebtoken');
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, fluence-access-token, fluence-refresh-token, _id");
    res.header('Content-Type', 'text/html');

    res.header(
        'Access-Control-Expose-Headers',
        'fluence-access-token, fluence-refresh-token'
    );

    next();
});

let authenticate = (req, res, next) => {
    let token = req.header('fluence-access-token');

    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            res.status(401).send(err);
        } else {
            req.user_id = decoded._id;
            next();
        }
    });
}

let verifySession = (req, res, next) => {
    let refreshToken = req.header('fluence-refresh-token');
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            next();
        } else {
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}

app.post('/users', (req, res) => {
    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        return newUser.generateAccessAuthToken().then((accessToken) => {
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        res
            .header('fluence-refresh-token', authTokens.refreshToken)
            .header('fluence-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            return user.generateAccessAuthToken().then((accessToken) => {
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            res
                .header('fluence-refresh-token', authTokens.refreshToken)
                .header('fluence-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})

app.get('/users/me/access-token', verifySession, (req, res) => {
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('fluence-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})

// ORDERS:

app.get('/orders', authenticate, (req, res) => {
    Order.find().then(orders => {
        res.send(orders);
    }).catch(e => {
        res.send(e);
    });
})

app.post('/orders', authenticate, (req, res) => {
    let newOrder = new Order({
        name: req.body.name,
        productId: req.body.productId,
        subject: req.body.subject,
        status: req.body.status,
        creationDate: new Date(),
        author: req.body.author,
        value: req.body.value,
        comment: req.body.comment
    });

    newOrder.save().then((order) => {
        res.send(order);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

app.get('/orders/:id', authenticate, (req, res) => {
    Order.findOne({
        _id: req.params.id
    }).then((order) => {
        res.send(order);
    }).catch(e => {
        res.status(400).send(e);
    });
});

app.patch('/orders/:id', authenticate, (req, res) => {
    Order.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'Updated successfully' });
    });
});

app.delete('/orders/:id', authenticate, (req, res) => {
    Order.findOneAndRemove({
        _id: req.params.id
    }).then(() => {
        res.send({ 'message': 'Deleted succesfully' });
    })
});

// PRODUCTS:

app.get('/products', authenticate, (req, res) => {
    Product.find().then(products => {
        res.send(products);
    }).catch(e => {
        res.send(e);
    });
})

app.post('/products', authenticate, (req, res) => {
    let newProduct = new Product({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        available: req.body.available
    });

    newProduct.save().then((product) => {
        res.send(product);
    });
});

app.get('/products/:id', authenticate, (req, res) => {
    Product.findOne({
        _id: req.params.id
    }).then((product) => {
        res.send(product);
    }).catch(e => {
        res.status(400).send(e);
    });
});

app.patch('/products/:id', authenticate, (req, res) => {
    Product.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'Updated successfully' });
    });
});

app.delete('/products/:id', authenticate, (req, res) => {
    Product.findOneAndRemove({
        _id: req.params.id
    }).then(() => {
        res.send({ 'message': 'Deleted succesfully' });
    })
});




// CLIENTS:

app.get('/clients', authenticate, (req, res) => {
    Client.find().then(clients => {
       res.json(clients);
    }).catch(e => {
        res.send(e);
    });
})
app.get("/clients", (request, response) => {
    // return updated list
    dbCollection.find().toArray((error, result) => {
        if (error) throw error;
        response.json(result);
    });
});

app.post('/clients', authenticate, (req, res) => {
    let newClient = new Client({
        name: req.body.name,
        address: req.body.address,
        tax: req.body.tax
    });

    newClient.save().then((client) => {
        res.send(client);
    });
});

app.patch('/clients/:id', authenticate, (req, res) => {
    Client.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'Updated successfully' });
    });
});

app.delete('/clients/:id', authenticate, (req, res) => {
    // We want to delete the specified list (document with id in the URL)
    Client.findOneAndRemove({
        _id: req.params.id
    }).then(() => {
        res.send({ 'message': 'Deleted succesfully' });
    })
});

// RESERVATION:

app.get('/reservations', authenticate, (req, res) => {
    // We want to return an array of all the lists that belong to the authenticated user 
    Reservation.find().then(reservations => {
        res.send(reservations);
    }).catch(e => {
        res.send(e);
    });
})

app.post('/reservations', authenticate, (req, res) => {
    let newReservation = new Reservation({
        client: req.body.client,
        items: req.body.items,
        dateStart: req.body.dateStart,
        dateEnd: req.body.dateEnd
    });

    newReservation.save().then((reservation) => {
        res.send(reservation);
    });
});

app.patch('/reservations/:id', authenticate, (req, res) => {
    Reservation.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'Updated successfully' });
    });
});

app.delete('/reservations/:id', authenticate, (req, res) => {
    // We want to delete the specified list (document with id in the URL)
    Reservation.findOneAndRemove({
        _id: req.params.id
    }).then(() => {
        res.send({ 'message': 'Deleted succesfully' });
    })
});

// RENT:

app.get('/rents', (req, res) => {
    Rent.find().then(rents => {
        res.send(rents);
    }).catch(e => {
        res.send(e);
    });
})

app.post('/rents', (req, res) => {
    let newRent = new Rent({
        client: req.body.client,
        items: req.body.items,
        dateStart: req.body.dateStart,
        dateEnd: req.body.dateEnd
    });

    newRent.save().then((rent) => {
        res.send(rent);
    });
});

app.patch('/rents/:id', authenticate, (req, res) => {
    Rent.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'Updated successfully' });
    });
});

app.delete('/rents/:id', authenticate, (req, res) => {
    Rent.findOneAndRemove({
        _id: req.params.id
    }).then(() => {
        res.send({ 'message': 'Deleted succesfully' });
    })
});
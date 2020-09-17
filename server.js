const express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const { Order } = require('./database/models/order.model');
const { User } = require('./database/models/user.model');
const { Product } = require('./database/models/product.model');
const { Client } = require('./database/models/client.model');
const { Reservation } = require('./database/models/reservation.model');
const { Rent } = require('./database/models/rent.model');

const path = require('path');
const CONNECTION_URL = "mongodb+srv://Nespire:damianos12@cluster0.mmmzg.mongodb.net/fluenceerp?retryWrites=true&w=majority";
const DATABASE_NAME = "fluenceerp";

var app = express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var database,
    collectionClients,
    collectionProducts,
    collectionUsers,
    collectionOrders,
    collectionReservations,
    collectionRents

app.listen(4200, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if (error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collectionClients = database.collection("clients");
        collectionProducts = database.collection("products");
        collectionUsers = database.collection("users");
        collectionOrders = database.collection("orders");
        collectionReservations = database.collection("reservations");
        collectionRents = database.collection("rents");

        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

//////////////////////////////////////////////////////////
/************************* API *************************/
//////////////////////////////////////////////////////////

/*/ AUTH //

const jwt = require('jsonwebtoken');

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

*/
//ORDERS:

app.get('/orders', /*authenticate,*/(req, res) => {
    collectionOrders.find({}).toArray((error, result) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
})

app.post('/orders', /*authenticate,*/(req, res) => {
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

    collectionOrders.insertOne(newOrder, (error, res) => {
        if (error) throw error;
        collectionOrders.find().toArray((_error, _res) => {
            if (_error) throw _error;
            res.json(_res);
        });
    });
});

app.get('/orders/:id', /*authenticate,*/(req, res) => {
    const itemId = req.params.id;

    collectionOrders.findOne({ id: itemId }, (error, result) => {
        if (error) throw error;
        // return item
        res.json(result);
    });
});

app.patch('/orders/:id', /*authenticate,*/(req, res) => {
    Order.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'Updated successfully' });
    });
});

app.delete('/orders/:id', /*authenticate,*/(req, res) => {
    const _id = req.params.id;

    collectionOrders.deleteOne({ "_id": ObjectId(_id) }, function (error, result) {
        if (error) throw error;
        // send back entire updated list after successful request
        collectionOrders.find().toArray(function (_error, _result) {
            if (_error) throw _error;
            res.json(_result);
        });
    });

});

// PRODUCTS:

app.get('/products', /*authenticate,*/(req, res) => {
    collectionProducts.find({}).toArray((error, result) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
})

app.post('/products', /*authenticate,*/(req, res) => {
    let newProduct = new Product({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        available: req.body.available
    });

    collectionProducts.insertOne(newProduct, (error, result) => { // callback of insertOne
        collectionProducts.find({}).toArray((_error, _result) => { // callback of find
            if (_error) throw _error;
            res.send(_result);
        });
    });
});

app.get('/products/:id', /*authenticate,*/(req, res) => {
    const itemId = req.params.id;

    collectionProducts.findOne({ id: itemId }, (error, result) => {
        if (error) throw error;
        // return item
        res.json(result);
    });
});

app.patch('/products/:id', /*authenticate,*/(req, res) => {
    Product.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'Updated successfully' });
    });
});

app.delete('/products/:id', /*authenticate,*/(req, res) => {
    const _id = req.params.id;

    collectionProducts.deleteOne({ "_id": ObjectId(_id) }, function (error, result) {
        if (error) throw error;
        // send back entire updated list after successful request
        collectionProducts.find().toArray(function (_error, _result) {
            if (_error) throw _error;
            res.json(_result);
        });
    });
});

// CLIENTS:

app.get("/clients", (req, res) => {
    collectionClients.find({}).toArray((error, result) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

app.post('/clients', /*authenticate,*/(req, res) => {
    let newClient = new Client({
        name: req.body.name,
        address: req.body.address,
        tax: req.body.tax
    });

    collectionClients.insertOne(newClient, (error, result) => { // callback of insertOne
        collectionClients.find({}).toArray((_error, _result) => { // callback of find
            if (_error) throw _error;
            res.send(_result);
        });
    });
});

app.patch('/clients/:id', /*authenticate,*/(req, res) => {
    Client.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'Updated successfully' });
    });
});

app.delete('/clients/:id', /*authenticate,*/(req, res) => {
    const _id = req.params.id;

    collectionClients.deleteOne({ "_id": ObjectId(_id) }, function (error, result) {
        if (error) throw error;
        // send back entire updated list after successful request
        collectionProducts.find().toArray(function (_error, _result) {
            if (_error) throw _error;
            res.json(_result);
        });
    });
});

// RESERVATION:

app.get('/reservations', /*authenticate,*/(req, res) => {
    collectionReservations.find({}).toArray((error, result) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
})

app.post('/reservations', /*authenticate,*/(req, res) => {
    let newReservation = new Reservation({
        client: req.body.client,
        items: req.body.items,
        dateStart: req.body.dateStart,
        dateEnd: req.body.dateEnd
    });

    collectionReservations.insertOne(newReservation, (error, result) => { // callback of insertOne
        if (error) throw error;
        // return updated list
        collectionReservations.find().toArray((_error, _result) => { // callback of find
            if (_error) throw _error;
            res.json(_result);
        });
    });
});

app.patch('/reservations/:id', /*authenticate,*/(req, res) => {
    Reservation.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'Updated successfully' });
    });
});

app.delete('/reservations/:id', /*authenticate,*/(req, res) => {
    const _id = req.params.id;

    collectionReservations.deleteOne({ "_id": ObjectId(_id) }, function (error, result) {
        if (error) throw error;
        // send back entire updated list after successful request
        collectionReservations.find().toArray(function (_error, _result) {
            if (_error) throw _error;
            res.json(_result);
        });
    });
});

// RENT:

app.get('/rents', (req, res) => {
    collectionRents.find({}).toArray((error, result) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
})

app.post('/rents', (req, res) => {
    let newRent = new Rent({
        client: req.body.client,
        items: req.body.items,
        dateStart: req.body.dateStart,
        dateEnd: req.body.dateEnd
    });

    collectionRents.insertOne(newRent, (error, result) => { // callback of insertOne
        if (error) throw error;
        // return updated list
        collectionRents.find().toArray((_error, _result) => { // callback of find
            if (_error) throw _error;
            res.json(_result);
        });
    });
});

app.patch('/rents/:id', /*authenticate,*/(req, res) => {
    Rent.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'Updated successfully' });
    });
});

app.delete('/rents/:id', /*authenticate,*/(req, res) => {
    const _id = req.params.id;

    collectionRents.deleteOne({ "_id": ObjectId(_id) }, function (error, result) {
        if (error) throw error;
        // send back entire updated list after successful request
        collectionRents.find().toArray(function (_error, _result) {
            if (_error) throw _error;
            res.json(_result);
        });
    });
});

////////////////////*////////////////////////////////////////

app.use(express.static(__dirname + '/dist/fluence-erp'));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/fluence-erp/index.html'));
});

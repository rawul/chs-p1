import * as express from 'express';

import { User } from "./models/User";
import { hash } from "./utils/Crypto";

import * as userController from './controllers/UserController';
import * as surveyController from './controllers/SurveyController';
import { authorizationMiddleware } from './middlewares/AuthorizationMiddleware';
import * as cors from 'cors';


const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const chalk = require('chalk');

const app = express();


app.set('host', '0.0.0.0');
app.set('port', 8085);

/**
 * Mongoose cononection
 * 
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/chs');
mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
})

mongoose.connection.on('open', () => {
    console.log('%s MongoDB connection is successful', chalk.green('✓'));
    const createAdmin = async () => {
        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            User.create({
                email: 'admin@admin.admin',
                password: await hash('123'),
                role: 'admin'
            });
            console.log('%s Platform admin created', chalk.green('✓'));
        } else {
            console.log('%s Platform admin already existent', chalk.green('✓'));
        }
    }

    createAdmin();
});

/*
 * Express middlewares
 */
app.use(bodyParser.json());
app.use(cors());

/*
 * Controller routes
 */

/**
 * Unprotected routes
 */
const unprotectedRouter = express.Router();
unprotectedRouter.post('/auth/login', userController.postLogin);
unprotectedRouter.get('/survey/:id', surveyController.getSurvey);
unprotectedRouter.post('/answers/:id', surveyController.postAnswers);

/**
 * Protected Routes
 */
const authenticatedRouter = express.Router();
authenticatedRouter.use(authorizationMiddleware)
authenticatedRouter.post('/user', userController.postCreateClient);
authenticatedRouter.get('/users', userController.getUsers);
authenticatedRouter.delete('/user', userController.deleteClient);
authenticatedRouter.post('/survey', surveyController.postCreateSurvey);
authenticatedRouter.get('/surveys', surveyController.getUserSurveys);
authenticatedRouter.get('/survey/:id/qr', surveyController.getQRPdf);

app.use('/v1', unprotectedRouter);
app.use('/v1', authenticatedRouter);

/*
 * Error handlers
 */
// app.use(errorHandler());

app.use((err, req, res, next) => {
    console.log({ err });
    res.status(500).send({ error: 'Server Error' });
});


/**
 * Boostrap app
 */
app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});
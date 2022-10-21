import express from 'express';
import { NextFunction, Request, Response } from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import * as routes from './routes';
import webRoutes from './routes/web';
import apiRoutes from './routes/api';
import bodyParser from 'body-parser';
import cors from 'cors';

const server = express();
server.use(cors());
server.use(express.json());

server.use(bodyParser.urlencoded({ extended: true }));

server.use(favicon(path.join('public', 'favicon.ico')));
server.use(express.static('public'));

// Configure Express to parse incoming JSON data

// Configure routes
routes.register(server);
server.use('/', webRoutes);
server.use('/api', apiRoutes);

export default server;

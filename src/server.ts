
require('dotenv').config()

import config from './config'

import { Server } from '@hapi/hapi'

import { log } from './log'

import { join } from 'path'

const Joi = require('joi')

const Pack = require('../package');

import { load } from './server/handlers'

import { plugin as websockets } from './ws/plugin'

const handlers = load(join(__dirname, './server/handlers'))

export const server = new Server({
  host: config.get('host'),
  port: config.get('port'),
  routes: {
    cors: true,
    validate: {
      options: {
        stripUnknown: true
      }
    }
  }
});

if (config.get('prometheus_enabled')) {

  log.info('server.metrics.prometheus', { path: '/metrics' })

  const { register: prometheus } = require('./metrics')

  server.route({
    method: 'GET',
    path: '/metrics',
    handler: async (req, h) => {
      return h.response(await prometheus.metrics())
    },
    options: {
      description: 'Prometheus Metrics about Node.js Process & Business-Level Metrics',
      tags: ['system']
    }
  })

}

server.route({
  method: 'GET',
  path: '/api/v0/status',
  handler: handlers.Status.index,
  options: {
    description: 'Simply check to see that the server is online and responding',
    tags: ['api', 'system'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        status: Joi.string().valid('OK', 'ERROR').required(),
        error: Joi.string().optional()
      }).label('ServerStatus')
    }
  }
})

server.route({
  method: 'GET',
  path: '/api/v1/objects/{location}',
  handler: handlers.Objects.show,
  options: {
    description: 'Details and Locations of a Smart Object On Chain',
    tags: ['api', 'objects'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        origin: Joi.string().required().description('Txid and Output Index of First Location of This Smart Contract Instance'),
        code_part: Joi.string().optional().description('Code Part of the Smart Object, Remains Unchanged Across All Locations'),
        abi: Joi.object().optional().description('Abstract Binary Interface of Smart Contract If Known'),
        locations: Joi.array().items(Joi.object({
          outpoint: Joi.string().description('Txid and Output Index of The Object State in This Location'),
          state: Joi.string().description('Start Part of the Output Script (As Opposed to the Code Part)'), 
          properties: Joi.object().optional().description('Parsed Variables And Their Values In This State')
        })).description('List of State Updates And Their Location On Chain Most Recent First'),
        destruction: Joi.string().optional().description('Txid and Input Index (Inpoint) If / When The Object Is Finally Unlocked'),
        error: Joi.string().optional()
      }).label('ServerStatus')
    }
  }
})



var started = false

export async function start() {

  if (started) return;

  started = true

  if (config.get('swagger_enabled')) {

    const swaggerOptions = {
      info: {
        title: 'Stateful',
        version: Pack.version,
        description: 'Track Updates To Stateful Smart Contracts In Real Time'
      },
      schemes: ['http', 'https'],
      host: 'state.pow.co',
      documentationPath: '/api',
      grouping: 'tags'
    }

    const Inert = require('@hapi/inert');

    const Vision = require('@hapi/vision');

    const HapiSwagger = require('hapi-swagger');

    await server.register([
        Inert,
        Vision,
        {
          plugin: HapiSwagger,
          options: swaggerOptions
        }
    ]);

    log.info('server.api.documentation.swagger', swaggerOptions)
  }

  await server.register(websockets);

  await server.start();

  log.info(server.info)

  return server;

}

if (require.main === module) {

  start()

}


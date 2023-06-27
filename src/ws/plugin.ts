require('dotenv').config()

import { WebSocketServer, WebSocket } from "ws";

import { Server } from '@hapi/hapi'

import { log } from '../log'

import { Actor } from 'rabbi'

import { EventEmitter } from "events";

import { getChannel, publish } from 'rabbi'

const events = new EventEmitter()

import { v4 as uuid } from 'uuid'

interface StatefulObjectCreatedEvent {

}

interface StatefulObjectUpdatedEvent {

}

interface StatefulObjectDestroyedEvent {

}

function sendMessage(socket:WebSocket, type:string, content:any) {

  socket.send(JSON.stringify({ type, content }))

}

async function handleConnectionChatChannel(socket: WebSocket, request, channel: string) {

  sendMessage(socket, `websockets.chat.channels.${channel}.connected`, { success:true })

  const amqpChannel = await getChannel()

  const queue = uuid()

  amqpChannel.assertQueue(queue)

  const routingKey = `chat.channels.${channel}.message`

  amqpChannel.bindQueue(queue, 'powco', routingKey)

  amqpChannel.consume(queue, (msg) => {

    if (!msg) { return }

    sendMessage(socket, routingKey,  JSON.parse(msg.content.toString()))

    amqpChannel.ack(msg)

  })

  socket.on('close', () => {

    amqpChannel.deleteQueue(queue)

  }) 

}

async function subscribeToObjectUpdates(socket: WebSocket, { origin }: { origin: string }) {

  // create queue

  sendMessage(socket, 'stateful.object.updated', { success:true })

  log.info('websocket.connection', { socket })

  socket.on('close', () => {            
      log.info('websocket.close', { socket })

      // unsubscribe to temporary queue
  })
}

export const plugin = (() => {

  return {

    name: 'websockets',

    register: function(server: Server) {

      const port = process.env.websockets_port || 5201
      
      const wsServer = new WebSocketServer({ port });

      log.info('websockets.server.started', { port })

      wsServer.on("connection", (socket, request) => {

        log.info('stateful.ws.connected', {uri:request.uri, url:request.url})

        socket.on('message', message => {

          try {

            const { method, params } = JSON.parse(message)

            switch(method) {

            case 'stateful.subscribe':

              if (params.origin) {

                return subscribeToObjectUpdates(socket, { origin: params.origin })

              }

              break;

            default:
                return;
            }


          } catch(error) {

            log.error('websocket.message.parser.error', error)

          }

        })

        socket.on('error', () => {            
            log.info('websocket.error', { socket })
        })
      

      });

      wsServer.on("message", (data) => {

        log.info('websocket.message.received', {data})

        const packet = JSON.parse(data);

        switch (packet.type) {
          case "hello from client":
            // ...
            break;
        }
      });
  
      Actor.create({

        exchange: 'powco',

        routingkey: 'stateful.object.created',

        queue: 'on_stateful_object_created',

      })
      .start(async (channel, msg, json) => {

        const event: StatefulObjectCreatedEvent = json 

        events.emit('stateful.object.created', json)

      });

      Actor.create({

        exchange: 'powco',

        routingkey: 'stateful.object.updated',

        queue: 'on_stateful_object_updated',

      })
      .start(async (channel, msg, json) => {

        const event: StatefulObjectUpdatedEvent = json 

        events.emit('stateful.object.updated', json)

      });

      Actor.create({

        exchange: 'powco',

        routingkey: 'stateful.object.destroyed',

        queue: 'on_stateful_object_destroyed',

      })
      .start(async (channel, msg, json) => {

        const event: StatefulObjectDestroyedEvent = json 

        events.emit('stateful.object.destroyed', json)

      });

    }

  }

})()



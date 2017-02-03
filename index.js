const Discord = require('discord.js')
const stenoToBuffer = require('./steno.js').stenoToBuffer
const token = require('./token').token

const bot = new Discord.Client()
// the token of your bot - https://discordapp.com/developers/applications/me

// the ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
bot.on('ready', () => {
  console.log('I am ready!')
})

const stenoGroups = /`([A-Z#\d\/ \*-]+)`/g

// create an event listener for messages
bot.on('message', message => {
  // if the message is "ping",
  const content = message.content
  const channel = message.channel.name
  const summoned = channel === 'learners' || content.startsWith('!')
  let steno = content.match(stenoGroups)
  if (steno && summoned) {
    if (Array.isArray(steno)) {
      steno = steno.join(' ')
    }
    console.log('Processing ', steno)
    const buffer = stenoToBuffer(steno)
    // send "pong" to the same channel.
    if (buffer) {
      message.channel.sendFile(buffer)
    } else {
      message.react('❓')
    }
  }
})

// log our bot in
bot.login(token)

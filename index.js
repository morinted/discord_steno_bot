const Discord = require('discord.js')
const stenoToBuffer = require('./steno.js').stenoToBuffer
const token = require('./token').token // Need a token.json with: { "token": "TOKEN HERE" }

const bot = new Discord.Client()

bot.on('ready', () => {
  console.log('I am ready!')
})

const stenoGroups = /`([A-Z#\d\/ \*-]+)`/g

bot.on('message', message => {
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
    if (buffer) {
      message.channel.sendFile(buffer)
    } else {
      message.react('❓')
    }
  }
})

bot.login(token)

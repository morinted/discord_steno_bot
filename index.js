import { config } from 'dotenv'
config()
import Discord from "discord.js";
import { Stroke, stenoToBuffer, normalizeUrlSafe } from "./steno.js"
import { lookup } from './lookup.js'

import { readFileSync } from 'fs';

const token = process.env.token

const bot = new Discord.Client();

bot.on("ready", () => {
  console.log("I am ready!");
});

const stenoGroups = /`([A-Z#\d\/ \*-]+)`/g;
const stenoGroupsTicksOptional = /`?([A-Z#\d\/ \*-]+)`?/g;

bot.on("message", async (message) => {
  try {
    const content = message.content;
    const channel = message.channel.name;
    const isDM = message.channel.type === "dm";

    if (content.startsWith("!lookup")) {
      const searchTerm = content.split(' ').slice(1).join(' ')
      const results = await lookup(searchTerm)
      message.channel.send({
        embed: {
            color: 0x3503FF,
            description: results
        }
      })
      return;
    }

    const summoned = channel === "learners" || content.startsWith("!") || isDM;
    let steno = content.match(isDM ? stenoGroupsTicksOptional : stenoGroups);
    if (steno && summoned) {
      if (Array.isArray(steno)) {
        steno = steno.join(" ");
      }
      console.log("Processing ", steno);
      const buffer = stenoToBuffer(steno);
      if (buffer) {
        const filename = normalizeUrlSafe(steno) + ".png";
        const attachment = new Discord.MessageAttachment(buffer, filename);

        const embed = new Discord.MessageEmbed()
          .attachFiles(attachment)
          .setImage("attachment://" + filename);
        message.channel.send(embed);
      } else {
        message.react("❓");
      }
    }
  } catch (e) {
    console.log("Something went wrong while handling a message.");
    console.log(e);
  }
});

bot.login(token);

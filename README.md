# Steno Bot

This Discord bot reads in messages written in `RAW STENO` and tries to display them graphically. E.g.:

- `RAU STOIN` → `RAU/STOEUPB` (normalization) → to image on node-canvas and uploaded to channel

![Screenshot demonstrating usage](screenshot.png)

Each steno layout picture seems to be about 3KB.

## Development

1. Clone
1. `npm install`
1. Create token.json, contents: `{ "token": "DISCORD_TOKEN" }`
1. `npm start` to run bot.
1. `npm run dev` to run bot with restart on files changed.
1. `npm run test` to execute tests.

## Steno Bot Says…

> Thanks for adding me to your server. I'm created by Ted over at https://github.com/morinted/discord_steno_bot
>
> To summon me, you need raw or pseudo steno in ALL CAPS in between back ticks: \`HI\`
>
> Outside of the #learners channel, messages should be prefixed with !, for example: !\`HI\`
>
> I can accept multiple separate strokes in one message: "My stroke for cat isn't \`KAT\` but rather \`CAT\`"
>
> Within a single pair of back ticks you can give multiple strokes separated by slashes or spaces: \`HEL/LO WORLD\`
>
> I accept some special short forms: `-SH` → `-RB`, `-CH` → `-FP`, `-SHN`, as well as with vowel repetition: `AA` → `AEU`, `II` → `AOEU`…

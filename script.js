const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const { EmbedBuilder } = require('discord.js');
const info = require('./info.json')
// const axios = require('axios')
const llamaNode = require('llama-node');
const { LLM } = llamaNode
console.log(llamaNode)
console.log(LLM)

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

try {
    const llama = new LLM();
    console.log("LLM instance created successfully!");
} catch (error) {
    console.error("Error creating LLM instance:", error);
}


// const llama = new LLM();
// // const llama = llamaNode.LLama ? new llamaNode.LLama() : null;
// // llama.load('.Llama-Guard-3-1B/consolidated.00.pth')
// llama.load({
//     modelPath: './Llama-Guard-3-1B/consolidated.00.pth',
//     tokenizerPath: './Llama-Guard-3-1B/tokenizer.model', // If required
// }).then(() => {
//     console.log('Model loaded successfully');
// }).catch(err => {
//     console.error('Failed to load the model:', err);
// });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

let interval;

client.on('messageCreate', async msg => {
    console.log(`Recieved message: ${msg.content}`)
    switch (msg.content) { 
        case '!chat':
            
            const output = await llama.generate({
                prompt: `You are a sarcastic and witty chatbot. Respond as if Scott Lang responding to ${msg.content}`,
                maxTokens: 100,
                temperature: 0.7,
            })
            msg.reply(output)
            break;
        case '!help':
            const helpEmbed = new EmbedBuilder() 
                .setColor('#FF4949')
                .setTitle('Need some help? You got it!')
                .setDescription('Here are the commands you can use: ')
                .addFields(
                    { name: '!help', value: 'Displays this message'},
                    { name: '!subscribe', value: 'Sends messages every 3 seconds if turned on'},
                    { name: '!stop', value: 'Stop receiving messages within the interval'},
                    { name: '!message', value: 'Displays a random Scott Lang quote'},
                    { name: '!ant-man', value: 'Displays a random Scott Lang quote from Ant-Man (2015)'},
                    { name: '!amatw', value: 'Displays a random Scott Lang quote from Ant-Man and the Wasp (2018)'},
                    { name: '!cw', value: 'Displays a random Scott Lang quote from Captain America: Civil War (2016)'},
                    { name: '!endgame', value: 'Displays a random Scott Lang quote from Avengers: Endgame (2019)'},
                    { name: '!amatwq', value: 'Displays a random Scott Lang quote from Ant-Man and the Wasp: Quantumania (2023)'},
                    { name: '!whatif', value: 'Displays a random Scott Lang quote from What If...? (2020-2024)'}
                    // { name: '!pics', value: 'Displays a random picture of Scott Lang'}
                )
                
            msg.channel.send({ embeds : [helpEmbed]});
            break;
        case '!antman':
            var index = randomIndex(info.antman)
            msg.reply(info.antman[index]);
            break;
        case '!amatw':
            var index = randomIndex(info.amatw)
            msg.reply(info.amatw[index]);
            break;
        case '!cw':
            var index = randomIndex(info.cw)
            msg.reply(info.cw[index]);
            break;
        case '!endgame':
            var index = randomIndex(info.endgame)
            msg.reply(info.endgame[index]);
            break;
        case '!amatwq':
            var index = randomIndex(info.amatwq)
            msg.reply(info.amatwq[index]);
            break;
        case '!whatif':
            var index = randomIndex(info.whatif)
            msg.reply(info.whatif[index]);
            break;
        // case '!pics':
        //     var index = randomIndex(info.pics)
        //     const shortUrl = info.pics[index];
        //     console.log(shortUrl);
            
        //     const response = await axios.head(shortUrl)
        //     const resolvedUrl = response.request.res.responseUrl;
        //     console.log(resolvedUrl)

        //     const picEmbed = new EmbedBuilder()
        //         .setColor('#FF4949')
        //         .setImage(resolvedUrl)

        //     msg.channel.send({ embeds: [picEmbed]});
        //     break;
        case '!subscribe':
            msg.channel.send('You will now receive a message every 3 seconds');
            interval = setInterval(function () {
                msg.channel.send('Hi! I\'m Scott!')
                .catch(console.error);
            }, 3000)
            break;
        case '!stop':
            msg.channel.send('You will no longer receive messages automatically.')
            clearInterval(interval)
            break;
    }
});

function randomIndex(list) {
    return (Math.floor(Math.random() * list.length))
}

client.login(process.env.DISCORD_TOKEN);

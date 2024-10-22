// main.js

import { fetchData, afficherCoursAujourdhui, afficherCours } from './data.js';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';


async function main(){
    const client = new Client({
        puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            authStrategy: new LocalAuth(),
        }
    });
    
    client.on('ready', () => {
        console.log('Client is ready!');
    });
    
    client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
    });


    
    client.on('message_create', async message => {
        if (message.body === '!today') {
            message.reply('⌛ Récupération des données en cours...');
            let data = await fetchData();
            if (data) {
                const res = afficherCours(data[50]);
                message.reply(res);
            } else {
                message.reply('Erreur lors de la récupération des données.');
            }
        }
    });
    
    client.initialize();
}

main();
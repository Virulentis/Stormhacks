
const fs = require('fs');
const path = require('path');
const redis = require('redis');

async function seed() {
    const client = redis.createClient({
        url: 'redis://localhost:6379'
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();
    console.log('Connected to Redis');

    const dataPath = path.join(__dirname, '../../data/all_cards.json');
    console.log(`Reading data from ${dataPath}`);

    if (!fs.existsSync(dataPath)) {
        console.error('Data file not found!');
        process.exit(1);
    }

    const rawData = fs.readFileSync(dataPath);
    const cards = JSON.parse(rawData);

    console.log(`Found ${cards.length} cards. Inserting into Redis...`);

    let count = 0;
    for (const card of cards) {
        // Use a simple key strategy or based on name
        // The frontend expects { key, value }
        // Let's use a counter or uuid, or Name if unique. 
        // Using "card:index" is safe.
        const key = `card:${count}`;
        
        // Also if we want to search by name later, we might want to store it efficiently, 
        // but for now let's just dump the json object as value.
        await client.set(key, JSON.stringify(card));
        count++;
        if (count % 100 === 0) process.stdout.write('.');
    }

    console.log(`\nInserted ${count} cards.`);
    await client.disconnect();
}

seed().catch(console.error);

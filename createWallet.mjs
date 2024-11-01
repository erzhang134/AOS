import fs from 'fs';
import { createWallet } from 'arweavekit/wallet';

async function createAndSaveWallet() {
    const numberOfWallets = xxxxx; // Number of wallets you want to create
    const detailsFilename = 'AR_walletDetails.json'; // File to store all wallet details

    // Create or clear the details file at the beginning of the script
    fs.writeFileSync(detailsFilename, '', 'utf8');

    for (let i = 0; i < numberOfWallets; i++) {
        try {
            // Create the wallet
            const wallet = await createWallet({
                seedPhrase: true,
                environment: 'mainnet',
            });

            // Extract the key object, seed phrase, and wallet address
            const keyObject = wallet.key;
            const seedPhrase = wallet.seedPhrase;
            const walletAddress = wallet.walletAddress; // Assuming walletAddress is available here

            // Serialize the key object to a JSON string
            const keyJson = JSON.stringify(keyObject, null, 4);

            // Generate a filename based on the current date and time
            const date = new Date();
            const timeSuffix = date.toISOString();
            const keyFilename = `AR_key-${walletAddress}.json`;
            console.log(seedPhrase);
            console.log(walletAddress);

            // Write the JSON string to a file with a unique name
            fs.writeFile(keyFilename, keyJson, 'utf8', (err) => {
                if (err) {
                    console.error('Failed to write key to file:', err);
                } else {
                    console.log(`Key successfully saved to ${keyFilename}`);
                }
            });

            // Append the seed phrase and wallet address to the details file, separated by a comma
            fs.appendFileSync(detailsFilename, `${seedPhrase},${walletAddress}\n`, 'utf8');

        } catch (err) {
            console.error('Error during wallet creation or file writing:', err);
        }

        // Delay between creating wallets (optional, e.g., 2000ms = 2 seconds)
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
}

createAndSaveWallet().catch(console.error);

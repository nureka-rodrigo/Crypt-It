# Crypt-It

Crypt-It is a web application built with React and TypeScript
that allows users to encrypt and decrypt messages using various algorithms.
This project aims to provide a simple and intuitive interface for cryptographic operations.

## Features

- **Substitution Ciphers:**: Substitution ciphers replace plaintext characters with other characters.
  - `Caesar Cipher`: A simple substitution cipher that shifts letters by a fixed amount.
  - `Monoalphabetic Cipher`: A monoalphabetic cipher using a single substitution alphabet.
  - `Playfair Cipher`: A monoalphabetic cipher that encrypts pairs of letters in a 5x5 grid.
  - `Vigenère Cipher`: A polyalphabetic cipher using a keyword to shift letters.
  - `Vernam Cipher (One-Time Pad)`: A polyalphabetic cipher that XORs plaintext with a random key.
- **Transposition Ciphers:**: Transposition ciphers rearrange the order of plaintext characters.
  - `Rail Fence Cipher`: A transposition cipher that writes text in a zigzag pattern.
  - `Columnar Cipher`: A transposition cipher that arranges text into columns and reads them in a different order.
- **Symmetric Encryption:**: Symmetric encryption uses the same key for both encryption and decryption.
  - `AES-CTR`: A symmetric encryption algorithm that turns a block cipher into a stream cipher.
  - `AES-CBC`: A symmetric encryption algorithm that provides confidentiality by chaining blocks.
  - `AES-GCM`: A symmetric encryption algorithm that provides authentication and integrity.
- **Asymmetric Encryption:**: Asymmetric encryption uses a pair of public and private keys.
  - `RSA-OAEP`: An asymmetric encryption algorithm that encrypts data using public and private keys.
- **Hash Functions:**: Hash functions map data of arbitrary size to fixed-size values.
  - `SHA-1`: A cryptographic hash function that produces a 160-bit hash value.
  - `SHA-256`: A cryptographic hash function that produces a 256-bit hash value. 
  - `SHA-384`: A cryptographic hash function that produces a 384-bit hash value. 
  - `SHA-512`: A cryptographic hash function that produces a 512-bit hash value.

## Technologies Used

- React: JavaScript library for building user interfaces.
- Vite: Build tool that aims to provide a faster and leaner development experience.
- TypeScript: Superset of JavaScript that adds static types to the language.
- Tailwind CSS: Utility-first CSS framework for rapidly building custom designs.
- shadcn/ui: React components library for building user interfaces.
- Web Crypto API: JavaScript API for performing basic cryptographic operations.
- React Icons: Icon library for React.

## Installation

This project was bootstrapped with [Vite](https://vitejs.dev/).
To set up and run this project locally,
you'll need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
Follow these steps:

1. Clone the repository: `git clone https://github.com/nureka-rodrigo/Crypt-It.git`
2. Navigate into the project directory: `cd Crypt-It`
3. Install the dependencies: `npm install`
4. Start the application: `npm start`

The application will start running on `http://localhost:3000/Crypt-It/`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the terms of the [Apache-2.0 license](https://github.com/nureka-rodrigo/Crypt-It/blob/main/LICENSE).
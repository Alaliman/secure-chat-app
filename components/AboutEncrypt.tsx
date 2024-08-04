'use client';

import React, { useState, useEffect, useRef } from 'react';
import { decrypt, encrypt } from '@/lib/crypto';

function AboutEncrypt() {
  const [inputText, setInputText] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [cipherText, setCipherText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingD, setIsLoadingD] = useState(false);
  const me = useRef<HTMLDivElement | null>(null);
  const top = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    top.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEncryptedText('');
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const encryptText = encrypt(inputText);
    setDecryptedText('');
    setEncryptedText(encryptText);
    setIsLoading(false);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setCipherText(encryptText);
    me.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDecryptMessage = async (message: string) => {
    setIsLoadingD(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const decryptText = decrypt(message);
    setDecryptedText(decryptText);
    setIsLoadingD(false);
  };

  return (
    <>
      <div className="bg-light container mx-auto py-5" ref={top}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="p-4">
            <form onSubmit={handleFormSubmit}>
              <label
                htmlFor="inputText"
                className="mb-2 block text-xl font-bold"
              >
                Test out out Encryption Algorithm
              </label>
              <input
                type="text"
                id="inputText"
                className="w-full border border-gray-300 p-2"
                placeholder="Enter text here"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                required
              />
              <button
                type="submit"
                className="mt-4 rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
              >
                {!isLoading ? (
                  'Convert'
                ) : (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin"></span>
                    Converting...
                  </>
                )}
              </button>
            </form>
          </div>
          <div className="p-4">
            <label
              htmlFor="outputText"
              className="mb-2 block text-xl font-bold"
            >
              Encrypted Text will show here
            </label>
            <textarea
              id="outputText"
              className="h-32 w-full resize-none border border-gray-300 p-2"
              value={encryptedText}
              readOnly
            ></textarea>
          </div>
        </div>
      </div>

      <div className="bg-light container mx-auto py-5">
        <h1 className="mb-4 text-4xl font-bold">
          About Secure Messaging with Cryptography
        </h1>
        <p className="mb-4 text-lg leading-relaxed">
          Welcome to our secure messaging system, where your messages are
          protected with state-of-the-art encryption.
        </p>
        <p className="mb-4">
          We are committed to ensuring your privacy and the security of your
          communications. Our encryption technology employs the latest
          cryptographic techniques to safeguard your messages from unauthorized
          access.
        </p>
        <p className="mb-4">
          With our system, only you and the intended recipient can decipher the
          messages, making it virtually impossible for anyone else to intercept
          or read your confidential information. Your data remains confidential
          and secure throughout the communication process.
        </p>
        <p className="mb-4">
          Our mission is to provide a seamless and secure communication
          experience for individuals and organizations alike. Join us in
          experiencing the power of secure communication using cryptography.
        </p>
        <p className="mb-4">
          Whether you&apos;re sending personal messages or confidential business
          information, trust our system to keep your data safe and private. Get
          started today and explore the world of secure messaging with
          confidence.
        </p>
      </div>

      <div className="container mx-auto bg-secondary py-5">
        <DecryptMessage
          cipherText={cipherText}
          me={me}
          handleDecryptMessage={handleDecryptMessage}
          decryptedText={decryptedText}
          isLoadingD={isLoadingD}
        />
      </div>
    </>
  );
}

type DecryptMessageProps = {
  cipherText: string;
  me: React.RefObject<HTMLDivElement>;
  handleDecryptMessage: (cipherText: string) => void;
  decryptedText: string;
  isLoadingD: boolean;
};

function DecryptMessage({
  cipherText,
  me,
  handleDecryptMessage,
  decryptedText,
  isLoadingD,
}: DecryptMessageProps) {
  return (
    <div ref={me} className="container mx-auto py-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Decrypt Message</h1>
        <hr className="mx-auto mt-2 w-16 border-t-2 border-blue-500" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="col-span-1">
          <div className="card rounded-lg border border-gray-300 bg-white p-4">
            <textarea
              className="form-control h-32 w-full resize-none border border-gray-300 p-2"
              value={cipherText}
              readOnly
            ></textarea>
          </div>
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <button
            className="btn btn-primary rounded-md px-6 py-2"
            disabled={isLoadingD}
            onClick={() => handleDecryptMessage(cipherText)}
          >
            {!isLoadingD ? 'Decrypt' : 'Decrypting...'}
          </button>
        </div>
        <div className="col-span-1">
          <div className="card rounded-lg border border-gray-300 bg-white p-4">
            <textarea
              className="form-control h-32 w-full resize-none border border-gray-300 p-2"
              value={decryptedText}
              readOnly
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutEncrypt;

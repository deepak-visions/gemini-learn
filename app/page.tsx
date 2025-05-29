"use client";

import { GoogleGenAI } from "@google/genai";
import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { CodeProps } from 'react-markdown/lib/ast-to-react';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY });

interface Message {
  role: string;
  parts: { text: string }[];
}

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const model = ai.chats.create({ model: "gemini-2.0-flash" });
  const chatRef = useRef(model);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", parts: [{ text: input }] };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    try {
      const stream = await chatRef.current.sendMessageStream({
        message: input
      });

      let botResponse = "";
      // Add a placeholder for the bot response immediately
      setMessages(prevMessages => [...prevMessages, { role: "model", parts: [{ text: "..." }] }]);

      for await (const chunk of stream) {
        const chunkText = chunk.text || '';
        botResponse += chunkText;
        // Update the last message with streaming content
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1] = { role: "model", parts: [{ text: botResponse }] };
          return newMessages;
        });
      }

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prevMessages => [...prevMessages, { role: "model", parts: [{ text: "Error: Unable to send message." }] }]);
    }
  };

  console.log(messages)

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4 text-center">Gemini Chat</h1>
      <div className="border rounded p-4 h-96 overflow-y-auto mb-4 bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
              {msg.parts.map((part, partIndex) => (
                <React.Fragment key={partIndex}>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown
                      components={{
                        code(props: CodeProps) {
                          const { inline, className, children } = props;
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {part.text}
                    </ReactMarkdown>
                  </div>
                </React.Fragment>
              ))}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow border rounded-l p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask me a question..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-r px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Page;

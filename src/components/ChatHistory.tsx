'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import BubbleChat from './BubbleChat'

interface ChatMessage {
    id: number
    content: string
    is_user: boolean
    timestamp: string
}

interface ChatHistoryProps {
    messages: ChatMessage[]
    isSending: boolean
    error: string | null
    onSendMessage: (message: string) => Promise<{ success: boolean; error?: string }>
    onClearError: () => void
}

export default function ChatHistory({
    messages,
    isSending,
    error,
    onSendMessage,
    onClearError
}: ChatHistoryProps) {
    const [message, setMessage] = useState("")
    const [showScrollButton, setShowScrollButton] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = (smooth = true) => {
        messagesEndRef.current?.scrollIntoView({
            behavior: smooth ? 'smooth' : 'auto',
            block: 'end'
        })
    }

    // Check if user is at bottom
    const checkIfAtBottom = () => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
            const isAtBottom = scrollHeight - scrollTop - clientHeight < 100 // 100px threshold
            setShowScrollButton(!isAtBottom && messages.length > 0)
        }
    }

    // Auto-scroll when messages change (new message added)
    useEffect(() => {
        if (messages.length > 0) {
            // Always scroll to bottom when new message arrives
            const timer = setTimeout(() => scrollToBottom(), 100)
            return () => clearTimeout(timer)
        }
    }, [messages.length])

    // Auto-scroll when typing indicator appears
    useEffect(() => {
        if (isSending) {
            const timer = setTimeout(() => scrollToBottom(), 100)
            return () => clearTimeout(timer)
        }
    }, [isSending])

    const handleSendMessage = async () => {
        if (message.trim() && !isSending) {
            const result = await onSendMessage(message.trim())
            if (result.success) {
                setMessage('')
            }
        }
    }

    const handleKeyPress = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && message.trim() && !isSending) {
            await handleSendMessage()
        }
    }

    const setSuggestedMessage = (suggestedMessage: string) => {
        setMessage(suggestedMessage)
    }

    return (
        <div className="relative h-[90vh] bg-transparent w-2/3">
            {/* Scrollable chat area */}
            <div
                ref={scrollContainerRef}
                className="h-full overflow-y-auto pb-24 px-6 pt-8"
                onScroll={checkIfAtBottom}
            >
                <div className={`max-w-4xl mx-auto ${messages.length === 0 ? 'min-h-[calc(100vh-200px)] flex flex-col justify-center' : 'min-h-full'}`}>
                    {/* Welcome section when no messages */}
                    {messages.length === 0 && (
                        <div className="text-center mb-8">
                            <div className="mb-6 flex justify-center">
                                <div className="flex space-x-2">
                                    <Image
                                        src="/chatbot_page/chatbot droplets.svg"
                                        alt="Droplets AI"
                                        width={100}
                                        height={100}
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Hi, I&apos;m Eco and here to help you 🌱
                            </h2>

                            <div className="mb-8">
                                <p className="text-gray-600 mb-6">Suggestions on what to ask Our AI</p>
                                <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto">
                                    <button
                                        onClick={() => setSuggestedMessage("How does ReCoil work?")}
                                        className="bg-white border border-gray-200 hover:border-[#04BB84] hover:bg-green-50 px-4 py-2 rounded-full text-sm transition-colors"
                                    >
                                        How does ReCoil work?
                                    </button>
                                    <button
                                        onClick={() => setSuggestedMessage("How do I track my environmental impact?")}
                                        className="bg-white border border-gray-200 hover:border-[#04BB84] hover:bg-green-50 px-4 py-2 rounded-full text-sm transition-colors"
                                    >
                                        How do I track my environmental impact?
                                    </button>
                                    <button
                                        onClick={() => setSuggestedMessage("What happens to my oil after collection?")}
                                        className="bg-white border border-gray-200 hover:border-[#04BB84] hover:bg-green-50 px-4 py-2 rounded-full text-sm transition-colors"
                                    >
                                        What happens to my oil after collection?
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chat Messages */}
                    <div className="space-y-6 mb-4 flex-1">
                        {messages.map((msg) => (
                            <BubbleChat
                                key={msg.id}
                                type={msg.is_user ? 'user' : 'assistant'}
                                content={msg.content}
                            />
                        ))}

                        {/* Typing indicator */}
                        {isSending && (
                            <BubbleChat
                                type="assistant"
                                content=""
                                isTyping={true}
                            />
                        )}
                    </div>

                    {/* Error display */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex justify-between items-center">
                                <p className="text-red-700">{error}</p>
                                <button
                                    onClick={onClearError}
                                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Invisible div to scroll to */}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Scroll to bottom button */}
            {showScrollButton && (
                <div className="absolute bottom-20 right-6">
                    <button
                        onClick={() => scrollToBottom()}
                        className="bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl cursor-pointer"
                        aria-label="Scroll to bottom"
                    >
                        <svg
                            className="w-5 h-5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                    </button>
                </div>
            )}

            {/* Floating Input - positioned within chat component */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-6">
                <div className="bg-white rounded-full shadow-lg border border-gray-200 px-6 py-3">
                    <div className="flex items-center space-x-3">

                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Ask me anything about your projects"
                            className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500"
                            disabled={isSending}
                            onKeyPress={handleKeyPress}
                        />

                        <button
                            onClick={handleSendMessage}
                            disabled={isSending || !message.trim()}
                            className="p-2 text-[#04BB84] hover:bg-green-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
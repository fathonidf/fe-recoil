"use client"

import Image from "next/image"
import { useAuthContext } from "@/contexts/AuthContext"
import { useChatbot } from "@/hooks/useChatbot"
import ChatHistory from "@/components/ChatHistory"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ChatPage() {
    const { isAuthenticated } = useAuthContext()
    const router = useRouter()
    const {
        messages,
        isSending,
        error,
        sendMessage,
        clearError
    } = useChatbot()

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, router])

    // Show loading or redirect if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting to login...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[50vh] bg-white relative">
            {/* Background blob - dengan z-index 0 dan pointer-events-none agar tidak menghalangi klik */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="relative h-full w-full">
                    <Image
                        src="/landing_page/blur blob.svg"
                        alt=""
                        width={1100}
                        height={1100}
                        className="absolute -bottom-50 left-1/2 -translate-x-1/2 object-contain opacity-90"
                        priority
                    />
                </div>
            </div>

            {/* Chat Area */}
            <div className="relative z-10 flex items-center justify-center min-h-[50vh]">
                <ChatHistory
                    messages={messages}
                    isSending={isSending}
                    error={error}
                    onSendMessage={async (msg) => {
                        const result = await sendMessage(msg)
                        return result || { success: true }
                    }}
                    onClearError={clearError}
                />
            </div>
        </div>
    )
}
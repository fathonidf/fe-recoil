'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import MarkdownRenderer from "./MarkdownRenderer";

interface BubbleChatProps {
    type: 'assistant' | 'user';
    content: string;
    isTyping?: boolean;
}

export default function BubbleChat({ type, content, isTyping = false }: BubbleChatProps) {
    const [clickedButton, setClickedButton] = useState<string | null>(null);
    const [rawContent, setRawContent] = useState<string>('');
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

    const isAssistant = type === 'assistant';
    const isUser = type === 'user';

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setClickedButton('copy');
        setTimeout(() => setClickedButton(null), 2000);
    };

    const handleTextToSpeech = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setClickedButton(null);
            return;
        }

        const speech = new SpeechSynthesisUtterance(rawContent || '');

        // Baca pilihan bahasa dari localStorage
        const selectedLang = (typeof window !== 'undefined' && localStorage.getItem('speechLang')) || 'id';

        const voices = window.speechSynthesis.getVoices();

        // Cari voice berdasarkan pilihan bahasa
        const targetVoice = voices.find(v => v.lang.startsWith(selectedLang));
        if (targetVoice) {
            speech.voice = targetVoice;
        } else {
            console.warn(`Voice for the selected language (${selectedLang}) not found. Using default voice.`);
        }

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);
        setIsSpeaking(true);
        setClickedButton('text-to-speech');

        speech.onend = () => {
            setIsSpeaking(false);
            setClickedButton(null);
        };
    };

    const handleDownload = () => {
        const blob = new Blob([content], { type: "text/plain" });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = "message.txt";
        a.click();
        URL.revokeObjectURL(a.href);
        setClickedButton('download');
        setTimeout(() => setClickedButton(null), 2000);
    };

    const CheckmarkIcon = () => (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M18.0303 7.96967C18.3232 8.26256 18.3232 8.73744 18.0303 9.03033L11.0303 16.0303C10.7374 16.3232 10.2626 16.3232 9.96967 16.0303L5.96967 12.0303C5.67678 11.7374 5.67678 11.2626 5.96967 10.9697C6.26256 10.6768 6.73744 10.6768 7.03033 10.9697L10.5 14.4393L16.9697 7.96967C17.2626 7.67678 17.7374 7.67678 18.0303 7.96967Z" fill="#04BB84" />
        </svg>
    );

    const SpeakIcon = () => (
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M8.85527 3.7282C9.55914 3.14164 10.6332 3.56547 10.7468 4.47463C11.0971 7.27651 11.0971 10.1111 10.7468 12.913C10.6332 13.8222 9.55914 14.246 8.85526 13.6594L5.95241 11.2404C5.92236 11.2153 5.88449 11.2016 5.84538 11.2016H3.4125C2.76615 11.2016 2.24219 10.6777 2.24219 10.0313V7.35631C2.24219 6.70996 2.76615 6.186 3.4125 6.186H5.84538C5.88449 6.186 5.92236 6.17228 5.95241 6.14725L8.85527 3.7282ZM9.75144 4.59905C9.73618 4.47697 9.59196 4.42006 9.49745 4.49882L6.59459 6.91787C6.38427 7.09314 6.11916 7.18912 5.84538 7.18912H3.4125C3.32016 7.18912 3.24531 7.26397 3.24531 7.35631V10.0313C3.24531 10.1236 3.32016 10.1985 3.4125 10.1985H5.84538C6.11916 10.1985 6.38427 10.2945 6.59459 10.4697L9.49745 12.8888C9.59196 12.9676 9.73618 12.9106 9.75144 12.7886C10.0913 10.0693 10.0913 7.31831 9.75144 4.59905Z" fill="#6B7280" />
            <path d="M14.0511 4.64504C14.3141 4.55806 14.5978 4.70075 14.6848 4.96374C15.0729 6.13738 15.2828 7.39159 15.2828 8.69382C15.2828 9.99604 15.0729 11.2503 14.6848 12.4239C14.5978 12.6869 14.3141 12.8296 14.0511 12.7426C13.7881 12.6556 13.6454 12.3719 13.7324 12.1089C14.0874 11.0356 14.2797 9.88767 14.2797 8.69382C14.2797 7.49996 14.0874 6.35203 13.7324 5.27873C13.6454 5.01574 13.7881 4.73203 14.0511 4.64504Z" fill="#6B7280" />
            <path d="M12.7966 5.98383C12.7011 5.72382 12.4128 5.59049 12.1528 5.68602C11.8928 5.78155 11.7595 6.06978 11.855 6.32979C12.1255 7.06604 12.2734 7.86209 12.2734 8.69381C12.2734 9.3837 12.1717 10.0489 11.9827 10.6758C11.9721 10.7107 11.9613 10.7455 11.9503 10.7802C11.9205 10.8736 11.8887 10.9662 11.855 11.0578C11.7595 11.3178 11.8928 11.6061 12.1528 11.7016C12.4128 11.7971 12.7011 11.6638 12.7966 11.4038C12.8352 11.2986 12.8717 11.1924 12.9059 11.0852C12.9186 11.0454 12.931 11.0054 12.9431 10.9653C13.1601 10.2456 13.2766 9.48285 13.2766 8.69381C13.2766 7.74232 13.1072 6.82925 12.7966 5.98383Z" fill="#6B7280" />
        </svg>
    );

    const StopIcon = () => (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M14.535 0.766193C15.265 1.03516 15.75 1.7307 15.75 2.50872V13.4912C15.75 14.2692 15.265 14.9648 14.535 15.2337C13.5442 15.5987 12.4558 15.5987 11.465 15.2337C10.735 14.9648 10.25 14.2692 10.25 13.4912L10.25 2.50872C10.25 1.7307 10.735 1.03516 11.465 0.766193C12.4558 0.401178 13.5442 0.401178 14.535 0.766193ZM14.25 2.50872C14.25 2.35914 14.1568 2.22542 14.0164 2.17371C13.3604 1.93201 12.6396 1.93201 11.9836 2.17371C11.8432 2.22542 11.75 2.35914 11.75 2.50872L11.75 13.4912C11.75 13.6408 11.8432 13.7745 11.9836 13.8262C12.6396 14.0679 13.3604 14.0679 14.0164 13.8262C14.1568 13.7745 14.25 13.6408 14.25 13.4912V2.50872Z" fill="#EF4444" />
            <path fillRule="evenodd" clipRule="evenodd" d="M4.53496 0.766193C5.26501 1.03516 5.75 1.7307 5.75 2.50872L5.75 13.4912C5.75 14.2692 5.26501 14.9648 4.53496 15.2337C3.5442 15.5987 2.4558 15.5987 1.46504 15.2337C0.734992 14.9648 0.25 14.2692 0.25 13.4912L0.250001 2.50872C0.250001 1.7307 0.734991 1.03516 1.46504 0.766193C2.4558 0.401178 3.5442 0.401178 4.53496 0.766193ZM4.25 2.50872C4.25 2.35914 4.15676 2.22542 4.0164 2.17371C3.36035 1.93201 2.63965 1.93201 1.9836 2.17371C1.84324 2.22542 1.75 2.35914 1.75 2.50872L1.75 13.4912C1.75 13.6408 1.84324 13.7745 1.9836 13.8262C2.63965 14.0679 3.36035 14.0679 4.0164 13.8262C4.15676 13.7745 4.25 13.6408 4.25 13.4912L4.25 2.50872Z" fill="#EF4444" />
        </svg>
    );

    useEffect(() => {
        // Save raw content for speech-to-text
        const rawContentTemp = content.
            replace(/\*/g, '').replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '$1'); // Remove asterisks from content
        setRawContent(rawContentTemp);
    }, [content]);

    if (isTyping) {
        return (
            <div className="flex items-start flex-col mb-4">
                <div className="flex flex-row items-center mb-2">
                    <Image src="/chatbot_page/profile icon chatbot.svg" height={70} width={70} alt="Eco AI" className="pr-3" priority />
                    <div className="font-bold text-gray-800">Eco AI Assistant</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-lg ml-14">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-6`}>
            {isAssistant && (
                <div className="flex flex-row items-center mb-2">
                    <Image src="/chatbot_page/profile icon chatbot.svg" height={70} width={70} alt="Eco AI" className="pr-3" priority />
                    <div className="font-bold text-gray-800">Eco AI Assistant</div>
                </div>
            )}

            <div className={`p-4 rounded-2xl shadow-lg max-w-4xl ${isAssistant ? 'bg-white ml-14' : 'bg-secondary text-white mr-4'
                }`}>
                <MarkdownRenderer content={content} />
            </div>

            {/* Action buttons hanya untuk assistant */}
            {isAssistant && (
                <div className="flex mt-2 ml-16 space-x-3 opacity-70 hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={handleCopy}
                        title="Copy"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {clickedButton === 'copy' ? <CheckmarkIcon /> :
                            <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.01865 2.17334C3.89494 2.17334 2.17334 3.89494 2.17334 6.01865V10.7714C2.17334 11.0484 2.3979 11.2729 2.6749 11.2729C2.95191 11.2729 3.17646 11.0484 3.17646 10.7714V6.01865C3.17646 4.44896 4.44896 3.17646 6.01865 3.17646H10.7085C10.9855 3.17646 11.2101 2.95191 11.2101 2.6749C11.2101 2.3979 10.9855 2.17334 10.7085 2.17334H6.01865Z" fill="#6B7280" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M12.3066 4.54289C10.1392 4.30066 7.91685 4.30066 5.74947 4.54289C5.13202 4.6119 4.63586 5.09781 4.56308 5.72004C4.30602 7.91787 4.30602 10.1382 4.56308 12.336C4.63586 12.9582 5.13202 13.4441 5.74947 13.5132C7.91685 13.7554 10.1392 13.7554 12.3066 13.5132C12.9241 13.4441 13.4202 12.9582 13.493 12.336C13.75 10.1382 13.75 7.91787 13.493 5.72004C13.4202 5.09781 12.9241 4.6119 12.3066 4.54289ZM5.86089 5.53981C7.95422 5.30585 10.1019 5.30585 12.1952 5.53981C12.3539 5.55755 12.4787 5.68308 12.4967 5.83657C12.7447 7.95698 12.7447 10.0991 12.4967 12.2195C12.4787 12.373 12.3539 12.4985 12.1952 12.5162C10.1019 12.7502 7.95422 12.7502 5.86089 12.5162C5.70216 12.4985 5.57737 12.373 5.55941 12.2195C5.31141 10.0991 5.31141 7.95698 5.55941 5.83657C5.57737 5.68308 5.70216 5.55755 5.86089 5.53981Z" fill="#6B7280" />
                            </svg>
                        }
                    </button>

                    <button
                        onClick={handleTextToSpeech}
                        title={isSpeaking ? "Stop Speaking" : "Text to Speech"}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {clickedButton === 'text-to-speech' && !isSpeaking ? <CheckmarkIcon /> :
                            isSpeaking ? <StopIcon /> : <SpeakIcon />
                        }
                    </button>

                    <button
                        onClick={handleDownload}
                        title="Download"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {clickedButton === 'download' ? <CheckmarkIcon /> :
                            <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M7.21669 10.7825C7.18363 10.7685 7.15223 10.7508 7.12307 10.7299L3.03868 7.21894C2.87979 7.08305 2.80547 6.87272 2.84371 6.66718C2.88195 6.46164 3.02694 6.29212 3.22407 6.22247C3.42119 6.15281 3.6405 6.19361 3.79938 6.3295L6.91826 9.00952V2.09297C6.91826 1.7698 7.18025 1.50781 7.50342 1.50781C7.82659 1.50781 8.08857 1.7698 8.08857 2.09297V9.00952L11.2192 6.3295C11.4648 6.11944 1.8342 6.14826 12.0442 6.39387C12.2543 6.63948 12.2255 7.00888 11.9799 7.21894L7.88377 10.7299C7.8546 10.7508 7.8232 10.7685 7.79014 10.7825L7.71993 10.8294C7.5809 10.8847 7.42594 10.8847 7.28691 10.8294L7.21669 10.7825ZM13.355 12.0406V10.8703C13.355 10.5471 13.093 10.2852 12.7698 10.2852C12.4467 10.2852 12.1847 10.5471 12.1847 10.8703V11.9997C12.1326 12.0279 12.0741 12.042 12.015 12.0406H2.99186C2.93269 12.042 2.87419 12.0279 2.82217 11.9997V10.8703C2.82217 10.5471 2.56018 10.2852 2.23701 10.2852C1.91384 10.2852 1.65186 10.5471 1.65186 10.8703V12.0406C1.7049 12.7307 2.30088 13.2512 2.99186 13.2109H12.015C12.706 13.2512 13.3019 12.7307 13.355 12.0406Z" fill="#6B7280" />
                            </svg>
                        }
                    </button>
                </div>
            )}

            {isUser && (
                <div className="flex mt-2 mr-6 opacity-70 hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={handleCopy}
                        title="Copy"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {clickedButton === 'copy' ? <CheckmarkIcon /> :
                            <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.01865 2.17334C3.89494 2.17334 2.17334 3.89494 2.17334 6.01865V10.7714C2.17334 11.0484 2.3979 11.2729 2.6749 11.2729C2.95191 11.2729 3.17646 11.0484 3.17646 10.7714V6.01865C3.17646 4.44896 4.44896 3.17646 6.01865 3.17646H10.7085C10.9855 3.17646 11.2101 2.95191 11.2101 2.6749C11.2101 2.3979 10.9855 2.17334 10.7085 2.17334H6.01865Z" fill="#6B7280" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M12.3066 4.54289C10.1392 4.30066 7.91685 4.30066 5.74947 4.54289C5.13202 4.6119 4.63586 5.09781 4.56308 5.72004C4.30602 7.91787 4.30602 10.1382 4.56308 12.336C4.63586 12.9582 5.13202 13.4441 5.74947 13.5132C7.91685 13.7554 10.1392 13.7554 12.3066 13.5132C12.9241 13.4441 13.4202 12.9582 13.493 12.336C13.75 10.1382 13.75 7.91787 13.493 5.72004C13.4202 5.09781 12.9241 4.6119 12.3066 4.54289ZM5.86089 5.53981C7.95422 5.30585 10.1019 5.30585 12.1952 5.53981C12.3539 5.55755 12.4787 5.68308 12.4967 5.83657C12.7447 7.95698 12.7447 10.0991 12.4967 12.2195C12.4787 12.373 12.3539 12.4985 12.1952 12.5162C10.1019 12.7502 7.95422 12.7502 5.86089 12.5162C5.70216 12.4985 5.57737 12.373 5.55941 12.2195C5.31141 10.0991 5.31141 7.95698 5.55941 5.83657C5.57737 5.68308 5.70216 5.55755 5.86089 5.53981Z" fill="#6B7280" />
                            </svg>
                        }
                    </button>
                </div>
            )}
        </div>
    );
}
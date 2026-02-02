import React from 'react';

interface ScrollCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function ScrollCard({ children, className, ...props }: ScrollCardProps) {
    return (
        <div className={`relative ${className}`} {...props}>
            {/* Scroll Top Roll */}
            <div className="h-4 bg-[#e6dcc0] rounded-full border border-[#c4b58e] shadow-sm mb-[-8px] mx-2 relative z-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>

            {/* Main Content Area */}
            <div className="bg-[#f3e9ce] border-x-2 border-[#d4c5a0] px-8 py-10 shadow-xl relative overflow-hidden">
                {/* Paper texture overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>

                {/* Decorative corner borders */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-amber-800/20 rounded-tl-lg m-2 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-amber-800/20 rounded-tr-lg m-2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-amber-800/20 rounded-bl-lg m-2 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-amber-800/20 rounded-br-lg m-2 pointer-events-none"></div>

                <div className="relative z-10 text-stone-800">
                    {children}
                </div>
            </div>

            {/* Scroll Bottom Roll */}
            <div className="h-4 bg-[#e6dcc0] rounded-full border border-[#c4b58e] shadow-sm mt-[-8px] mx-2 relative z-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>
        </div>
    );
}

import { Link, Head } from '@inertiajs/react';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { __ } from '@/app';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f2e8] p-6 text-[#252a24]">
            <Head title={__('Page Not Found | OrbyChat')} />
            
            <div className="relative mb-12 w-full max-w-lg text-center">
                <div className="relative mx-auto mb-10 h-80 w-80">
                    <div className="absolute inset-0 scale-110 animate-pulse rounded-full bg-[#173f2c]/5 blur-3xl"></div>
                    <img 
                        src="/404-illustration.png" 
                        alt="Lost Orb" 
                        className="relative z-10 h-full w-full object-contain drop-shadow-[0_20px_50px_rgba(23,63,44,0.15)]"
                    />
                </div>
                
                <div className="inline-flex items-center rounded-full bg-[#173f2c] px-4 py-1.5 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f7f4ec]">
                        {__('Error 404')}
                    </span>
                </div>
                
                <h1 className="mb-4 text-5xl font-black tracking-tight text-[#173f2c] sm:text-6xl">
                    {__("Oops! You've drifted away.")}
                </h1>
                
                <p className="mx-auto mb-10 max-w-sm text-base font-medium leading-relaxed text-[#41483f]/70">
                    {__('The page you are looking for might have been moved, deleted, or never existed in this timeline.')}
                </p>
                
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Button 
                        asChild
                        size="lg"
                        className="h-14 rounded-2xl bg-[#173f2c] px-8 text-base font-bold text-[#f7f4ec] transition-all hover:scale-105 hover:bg-[#123322] active:scale-95 shadow-lg shadow-[#173f2c]/20"
                    >
                        <Link href="/">
                            <Home className="mr-2 size-5" />
                            {__('Back to Home')}
                        </Link>
                    </Button>
                    
                    <Button 
                        variant="ghost" 
                        size="lg"
                        onClick={() => window.history.back()}
                        className="h-14 rounded-2xl border-none px-8 text-base font-bold text-[#173f2c] transition-all hover:bg-[#173f2c]/5 active:scale-95"
                    >
                        <ArrowLeft className="mr-2 size-5" />
                        {__('Go Back')}
                    </Button>
                </div>
            </div>
            
            <div className="flex items-center gap-2 opacity-30">
                <div className="h-px w-8 bg-[#173f2c]"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#173f2c]">
                    OrbyChat
                </p>
                <div className="h-px w-8 bg-[#173f2c]"></div>
            </div>
        </div>
    );
}

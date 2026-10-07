import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Zap,
    Target,
    BarChart3,
    Clock3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MarketingShell } from '@/layouts/marketing-shell';
import { __ } from '@/app';
import { register } from '@/routes';

type Props = {
    canRegister: boolean;
    brand: string;
    vertical: {
        id: string;
        name: string;
        description: string;
        prompts: string[];
        capabilities: string[];
    };
    seo: any;
    shell: any;
};

export default function SolutionPage({ brand, vertical, seo, shell }: Props) {
    return (
        <MarketingShell content={shell}>
            <Head>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
                <link rel="canonical" href={seo.canonical} />
            </Head>

            <main className="relative overflow-hidden pt-16 pb-24">
                {/* Background Decor */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/2 h-[800px] w-[1200px] -translate-x-1/2 opacity-20 [background:radial-gradient(circle_at_center,#52ad6a_0,transparent_70%)]" />
                    <div className="absolute top-[20%] right-0 h-96 w-96 opacity-10 [background:radial-gradient(circle_at_center,#173f2c_0,transparent_70%)]" />
                </div>

                <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
                    {/* Hero Section */}
                    <div className="max-w-3xl">
                        <Badge variant="outline" className="mb-6 border-[#52ad6a]/30 bg-[#52ad6a]/5 px-3 py-1 text-[#2d5c38]">
                            <Sparkles className="mr-2 size-3.5" />
                            {__('Industry Solutions')}
                        </Badge>
                        <h1 className="marketing-display text-5xl leading-[1.1] text-[#173f2c] sm:text-6xl lg:text-7xl">
                            {__('AI Sales Assistant for :industry', { industry: __(vertical.name) })}
                        </h1>
                        <p className="mt-8 text-xl leading-8 text-[#3d6a4d]">
                            {__(vertical.description)} {__('Deploy a custom-trained AI agent that understands your specific needs and speaks your customers language perfectly.')}
                        </p>
                        <div className="mt-10 flex flex-wrap gap-4">
                            <Button size="lg" className="h-12 rounded-full bg-[#173f2c] px-8 text-base font-bold hover:bg-[#123322]" asChild>
                                <Link href="/register" className="!text-white flex items-center gap-2">
                                    {__('Start Free Trial')}
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" className="h-12 rounded-full border-[#d8d2c4] bg-white px-8 text-base font-bold shadow-sm hover:bg-[#f3f0e8] transition-colors" asChild>
                                <Link href="/how-it-works" className="!text-[#173f2c]">
                                    {__('How it works')}
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mt-32 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <FeatureCard 
                            icon={Zap}
                            title={__('Instant Responses')}
                            description={__('Zero wait time for your customers. Our AI answers complex industry queries in under a second.')}
                        />
                        <FeatureCard 
                            icon={Target}
                            title={__('High Precision')}
                            description={__('Trained specifically for :industry needs, ensuring high-accuracy answers from your data.', { industry: __(vertical.name) })}
                        />
                        <FeatureCard 
                            icon={BarChart3}
                            title={__('Lead Generation')}
                            description={__('Automatically qualifies and captures leads when buying intent is detected in the conversation.')}
                        />
                    </div>

                    {/* Preview / Interactive Section */}
                    <div className="mt-32 rounded-[40px] border border-[#d8d2c4] bg-white p-8 shadow-2xl lg:p-16">
                        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
                            <div>
                                <h2 className="marketing-display text-4xl text-[#173f2c] sm:text-5xl">
                                    {__('Ready to handle')} <br/>
                                    {__('real conversations.')}
                                </h2>
                                <p className="mt-6 text-lg text-[#3d6a4d]">
                                    {__('Our :industry preset comes pre-loaded with the most effective starter prompts and behavior rules to maximize conversions.', { industry: __(vertical.name) })}
                                </p>
                                
                                <div className="mt-10 space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eef2e8] text-[#52ad6a]">
                                            <CheckCircle2 className="size-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#173f2c]">{__('Suggested Prompts')}</h4>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {vertical.prompts.map((p, i) => (
                                                    <span key={i} className="rounded-lg border border-[#d8d2c4] bg-[#fbf9f3] px-3 py-1.5 text-sm font-medium text-[#4f514c]">
                                                        {__(p)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eef2e8] text-[#52ad6a]">
                                            <Clock3 className="size-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#173f2c]">{__('Built-in Capabilities')}</h4>
                                            <div className="mt-8 flex flex-wrap gap-2">
                                                {vertical.capabilities.map((c: string, i: number) => (
                                                    <Badge key={i} variant="secondary" className="bg-[#eff1e8] text-[#2d5c38] font-bold">
                                                        {__(c)}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="relative">
                                <div className="absolute -inset-4 rounded-[32px] bg-[linear-gradient(135deg,#52ad6a,#173f2c)] opacity-5 blur-2xl" />
                                <Card className="relative overflow-hidden rounded-[24px] border-[#d8d2c4] bg-[#fbf9f3] shadow-lg">
                                    <div className="border-b border-[#d8d2c4] p-5">
                                        <div className="flex items-center gap-2">
                                            <div className="size-2.5 rounded-full bg-[#52ad6a]" />
                                            <span className="text-sm font-bold text-[#173f2c]">{brand} AI</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4 p-6">
                                        <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-tr-sm bg-[#173f2c] p-4 text-sm text-white">
                                            {vertical.prompts[0] || __('Tell me more about your services.')}
                                        </div>
                                        <div className="mr-auto flex w-fit max-w-[80%] items-start gap-3">
                                            <div className="size-8 shrink-0 rounded-full bg-[#52ad6a] p-1.5 text-white">
                                                <Sparkles className="size-full" />
                                            </div>
                                            <div className="rounded-2xl rounded-tl-sm border border-[#d8d2c4] bg-white p-4 text-sm text-[#3d6a4d]">
                                                {__(vertical.sample_answer)}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="mt-32 text-center">
                        <h2 className="marketing-display text-4xl text-[#173f2c] sm:text-5xl">
                            {__('Start growing your :industry business today.', { industry: __(vertical.name) })}
                        </h2>
                        <div className="mt-10 flex flex-center gap-4 justify-center">
                            <Button size="lg" className="h-14 rounded-full bg-[#173f2c] px-10 text-lg font-bold hover:bg-[#123322]" asChild>
                                <Link href="/register" className="!text-white">
                                    {__('Create Your AI Agent')}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </MarketingShell>
    );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <Card className="group relative border-[#d8d2c4] bg-white transition-all hover:-translate-y-1 hover:shadow-xl">
            <CardContent className="p-8">
                <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-[#eef2e8] text-[#52ad6a] transition-colors group-hover:bg-[#52ad6a] group-hover:text-white">
                    <Icon className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-[#173f2c]">{title}</h3>
                <p className="mt-4 leading-relaxed text-[#3d6a4d]">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}

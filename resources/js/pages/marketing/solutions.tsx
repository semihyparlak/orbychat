import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Sparkles,
    Building2,
    ShoppingCart,
    Stethoscope,
    GraduationCap,
    Home,
    Globe,
    Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MarketingShell } from '@/layouts/marketing-shell';
import { __ } from '@/app';

type Props = {
    canRegister: boolean;
    brand: string;
    presets: Array<{
        slug: string;
        label: string;
        description: string;
    }>;
    seo: any;
    shell: any;
};

const iconMap: Record<string, any> = {
    'real-estate': Home,
    'ecommerce': ShoppingCart,
    'medical': Stethoscope,
    'education': GraduationCap,
    'saas': Zap,
    'tourism': Globe,
    'marketing': Sparkles,
    'law': Building2,
};

export default function SolutionsIndex({ brand, presets, seo, shell }: Props) {
    return (
        <MarketingShell content={shell}>
            <Head>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
                <link rel="canonical" href={seo.canonical} />
            </Head>

            <main className="relative overflow-hidden pt-20 pb-32">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 opacity-10 [background:radial-gradient(circle_at_center,#52ad6a_0,transparent_70%)]" />
                </div>

                <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
                    <div className="text-center">
                        <Badge variant="outline" className="mb-6 border-[#52ad6a]/30 bg-[#52ad6a]/5 px-3 py-1 text-[#2d5c38]">
                            {__('Industry Verticals')}
                        </Badge>
                        <h1 className="marketing-display text-5xl text-[#173f2c] sm:text-6xl">
                            {__('Tailored AI for Every Industry')}
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-[#3d6a4d]">
                            {__('Our AI sales assistants are pre-configured with industry-specific knowledge and best practices to ensure the highest conversion rates for your business.')}
                        </p>
                    </div>

                    <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {presets.slice().sort((a, b) => {
                            const featured = ['ecommerce', 'medical'];
                            if (featured.includes(a.slug) && !featured.includes(b.slug)) return -1;
                            if (!featured.includes(a.slug) && featured.includes(b.slug)) return 1;
                            return 0;
                        }).map((preset) => {
                            const Icon = iconMap[preset.slug] || Sparkles;
                            const isFeatured = ['ecommerce', 'medical'].includes(preset.slug);
                            return (
                                <Link key={preset.slug} href={`/solutions/${preset.slug}`} className="group">
                                    <Card className="h-full border-[#d8d2c4] bg-white transition-all hover:-translate-y-1 hover:border-[#52ad6a]/50 hover:shadow-xl">
                                        <CardContent className="p-8">
                                            <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-[#eef2e8] text-[#52ad6a] group-hover:bg-[#52ad6a] group-hover:text-white transition-colors">
                                                <Icon className="size-6" />
                                            </div>
                                            <h3 className="text-xl font-bold text-[#173f2c] group-hover:text-[#52ad6a] transition-colors">
                                                {__(preset.label)}
                                            </h3>
                                            <p className="mt-4 text-sm leading-relaxed text-[#3d6a4d]">
                                                {__(preset.description)}
                                            </p>
                                            <div className="mt-6 flex items-center text-sm font-bold text-[#173f2c] opacity-0 group-hover:opacity-100 transition-all">
                                                {__('Learn more')}
                                                <ArrowRight className="ml-2 size-4" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-32 rounded-[40px] bg-[#173f2c] p-12 text-center text-white lg:p-20">
                        <h2 className="marketing-display text-4xl sm:text-5xl">
                            {__('Dont see your industry?')}
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg text-[#a8c9b3]">
                            {__('Our AI is flexible and can be trained on any knowledge base. Create a generic agent and watch it learn your business in minutes.')}
                        </p>
                        <div className="mt-10">
                            <Button size="lg" className="h-14 rounded-full bg-[#52ad6a] px-10 text-lg font-bold !text-white hover:bg-[#45965a]" asChild>
                                <Link href="/register">
                                    {__('Get Started Now')}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </MarketingShell>
    );
}

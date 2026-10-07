import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Package,
    Search,
    ShoppingBag,
    Tag,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Agent = {
    id: string;
    name: string;
};

type Product = {
    id: string;
    name: string;
    price: string;
    currency: string;
    url: string;
    image?: string;
    status: 'in_stock' | 'out_of_stock';
};

type Props = {
    agent: Agent;
};

export default function Products({ agent }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: __('Agents'), href: '/app/agents' },
        { title: agent.name, href: `/app/agents/${agent.id}` },
        { title: __('Products'), href: '#' },
    ];

    const [search, setSearch] = useState('');

    // Placeholder products - in a real app these would come from the backend
    // after analyzing the crawled knowledge base.
    const products: Product[] = [
        {
            id: '1',
            name: 'Sample Product A',
            price: '49.99',
            currency: 'USD',
            url: '#',
            status: 'in_stock',
        },
        {
            id: '2',
            name: 'Sample Product B',
            price: '29.99',
            currency: 'USD',
            url: '#',
            status: 'in_stock',
        },
    ];

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__(':name — Products', { name: agent.name })} />
            
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {__('Scanned Products')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {__('All products identified and indexed from your website sources.')}
                        </p>
                    </div>
                    <Button variant="ghost" asChild>
                        <Link href={`/app/agents/${agent.id}`}>
                            <ArrowLeft className="size-4" /> {__('Back to agent')}
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={__('Search products...')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="grid gap-6">
                    {filteredProducts.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredProducts.map((product) => (
                                <Card key={product.id} className="overflow-hidden">
                                    <div className="aspect-square bg-muted flex items-center justify-center border-b">
                                        <Package className="size-12 text-muted-foreground/30" />
                                    </div>
                                    <CardHeader className="p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="text-sm font-semibold">{product.name}</CardTitle>
                                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                {product.price} {product.currency}
                                            </span>
                                        </div>
                                        <CardDescription className="text-xs mt-1 truncate">
                                            {product.url}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Tag className="size-3" />
                                            <span>{product.status === 'in_stock' ? __('In Stock') : __('Out of Stock')}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                                <ShoppingBag className="size-6 text-muted-foreground" />
                            </div>
                            <h3 className="mt-4 text-sm font-semibold">{__('No products found')}</h3>
                            <p className="mt-2 text-xs text-muted-foreground max-w-xs">
                                {__('We haven\'t identified any specific products in your knowledge sources yet. Make sure your sitemap or product pages are correctly indexed.')}
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

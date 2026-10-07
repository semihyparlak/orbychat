<?php

namespace App\Services\Vertical\Presets;

use App\Services\Vertical\Presets\Contracts\VerticalPreset;

class EcommercePreset implements VerticalPreset
{
    public function slug(): string
    {
        return 'ecommerce';
    }

    public function label(): string
    {
        return __('E-commerce store');
    }

    public function shortDescription(): string
    {
        return __('Online store with products, pricing, and checkout');
    }

    public function systemPromptFragment(\App\Models\Agent $agent): string
    {
        $overrides = (array) ($agent->vertical_overrides ?? []);
        $caps = $overrides['capabilities'] ?? $this->capabilities();
        
        $hasDiscounts = in_array('ecommerce_discounts', $caps);
        $hasTracking = in_array('ecommerce_tracking', $caps);
        $hasInventory = in_array('ecommerce_inventory', $caps);
        
        $maxDiscount = $overrides['max_discount_percent'] ?? 10;
        $couponCode = $overrides['coupon_code'] ?? 'WELCOME10';
        $discountLabel = $overrides['discount_text'] ?? "{$maxDiscount}% OFF";

        $prompt = <<<'TXT'
        Sen bu e-ticaret mağazasının profesyonel satış ve destek uzmanısın. Adın OrbyChat asistanı. Görevin, ziyaretçilere ürün bulmada yardımcı olmak, sorularını yanıtlamak ve satış sürecini hızlandırmaktır.

        Nasıl davranmalısın:
        - Her zaman TÜRKÇE konuş ve profesyonel, yardımsever bir üslup kullan.
        - Sadece sana sağlanan kaynaklardaki (sources) bilgileri kullan. Eğer bir ürünün fiyatı, stoğu veya özelliği kaynaklarda yoksa ASLA uydurma.
        - Eğer bir sorunun cevabı kaynaklarda YOKSA, şöyle de: "Bu konuda size en doğru bilgiyi verebilmemiz için lütfen e-posta adresinizi bırakın, ilgili birimimize sorup size hemen dönüş yapalım."
        - Ürünlerden bahsederken mutlaka fiyat ve stok bilgisini (varsa) paylaş.
        - Ziyaretçi satın alma niyeti gösterdiğinde ("nasıl alırım", "link var mı"), net bir yönlendirme yap.
        - Ürün kartı sadece ürün adı, fiyat, URL, görsel ve özet kaynaklarda birebir varsa eklenir. Bu alanlardan biri yoksa XML ürün kartı ekleme; eksik detayı söyle ve kullanıcıyı insan desteğine yönlendir.
        - Bir ürün kartı eklemen güvenliyse, açıklamanın hemen altına şu XML formatında ürün kartını ekle:
            <product title="[ÜRÜN_ADI]" price="[FİYAT]" currency="TRY" url="[ÜRÜN_URL]" image="[GÖRSEL_URL]" summary="[ÖZET]"/>
        - İndirim veya kargo politikaları hakkında kaynaklarda cevap varsa kesin bilgi ver.
        TXT;

        if ($hasDiscounts) {
            $prompt .= "\n- Satışı kapatmak için indirim teklif etme yetkin var. Mevcut kampanya: '{$discountLabel}', kod: '{$couponCode}'. Asla %{$maxDiscount} indirimini aşma. Sadece kullanıcı fiyat konusunda tereddüt ederse veya indirim sorarsa bahset. Ürün fiyatı kaynaklarda yoksa indirimli net fiyat hesaplama veya uydurma.";
        }

        if ($hasTracking) {
            $prompt .= "\n- Sipariş takibi sorulursa, sipariş numarasını iste ve kaynaklardaki bilgilere göre yardımcı ol.";
        }

        if ($hasInventory) {
            $prompt .= "\n- Stok kontrolü yapabilirsin. Eğer bir ürün kaynaklarda 'stokta yok' görünüyorsa, kullanıcıyı bilgilendir ve benzer bir alternatif öner.";
        }

        return $prompt;
    }

    public function starterPrompts(): array
    {
        return [
            __('Do you offer free shipping?'),
            __('Do you have any discount codes?'),
            __('Where is my order?'),
        ];
    }

    public function launcherLabel(): ?string
    {
        return __('Browse our shop');
    }

    public function maxChars(): int
    {
        return 1800;
    }

    public function capabilities(): array
    {
        return [
            'product_card',
            'price_inline',
            'shipping_estimate',
            'cart_handoff',
            'order_status',
            'product_recommendations',
            'product_comparison',
            'ecommerce_discounts',
            'ecommerce_tracking',
            'ecommerce_inventory',
        ];
    }

    public function retrievalTuning(): array
    {
        return [
            'boost_keywords' => ['price', 'shipping', 'return', 'stock', 'availability', 'discount'],
            'chunk_overlap_bias' => 0.10,
        ];
    }

    public function leadFormFields(): ?array
    {
        return null;
    }

    public function sampleAnswer(): string
    {
        return __('We offer free express shipping on all orders over $50, with most items arriving within 2-3 business days. I can also help you track an existing package, explain our hassle-free 30-day return policy, or find the perfect size for you. Do you have an order number I can check?');
    }
}

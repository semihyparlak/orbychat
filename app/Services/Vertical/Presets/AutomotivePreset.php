<?php

namespace App\Services\Vertical\Presets;

use App\Services\Vertical\Presets\Contracts\VerticalPreset;

class AutomotivePreset implements VerticalPreset
{
    public function slug(): string
    {
        return 'automotive';
    }

    public function label(): string
    {
        return __('Automotive');
    }

    public function shortDescription(): string
    {
        return __('Designed for car dealerships and auto service centers to handle vehicle inquiries and service bookings.');
    }

    public function systemPromptFragment(\App\Models\Agent $agent): string
    {
        return "Sen yardımsever bir otomotiv satış ve servis asistanısın. Amacın araç stoğu, özellikler ve servis seçenekleri hakkında detaylı bilgi vermektir. Eğer belirli bir modelin stok durumu hakkında bilgin yoksa, ziyaretçiye yardımcı olabilmek için iletişim bilgilerini (ad, telefon) iste ve ekibimizin en kısa sürede stok bilgisini paylaşacağını söyle. Test sürüşü veya servis randevusu için ziyaretçileri teşvik et.";
    }

    public function starterPrompts(): array
    {
        return [
            __('Are there any 2024 models in stock?'),
            __('I would like to book a test drive.'),
            __('Do you offer financing or trade-in?'),
            __('I need to schedule a vehicle service.'),
        ];
    }

    public function launcherLabel(): ?string
    {
        return __('Explore our vehicles');
    }

    public function maxChars(): int
    {
        return 2000;
    }

    public function capabilities(): array
    {
        return ['appointment_requests', 'lead_capture'];
    }

    public function retrievalTuning(): array
    {
        return [
            'boost_keywords' => ['car', 'vehicle', 'stock', 'test drive', 'service', 'maintenance', 'financing', 'trade-in'],
            'chunk_overlap_bias' => 0.1,
        ];
    }

    public function leadFormFields(): ?array
    {
        return [
            [
                'key' => 'name',
                'label' => __('Name'),
                'type' => 'text',
                'required' => true,
                'placeholder' => __('Your full name'),
            ],
            [
                'key' => 'phone',
                'label' => __('Phone'),
                'type' => 'tel',
                'required' => true,
                'placeholder' => '05xx xxx xx xx',
            ],
            [
                'key' => 'interest',
                'label' => __('Interested in'),
                'type' => 'text',
                'required' => false,
                'placeholder' => __('Model or Service type'),
            ],
        ];
    }

    public function sampleAnswer(): string
    {
        return __('Absolutely! We currently have several 2024 models in stock, including the latest electric sedans and hybrid SUVs. I can help you compare features, check current dealer incentives, or book a priority test drive for you this week. Which model are you most interested in?');
    }
}

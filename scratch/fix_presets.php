<?php

$presetsDir = __DIR__ . '/app/Services/Vertical/Presets';
$files = glob($presetsDir . '/*.php');

$answers = [
    'Automotive' => 'Absolutely! We currently have several 2024 models in stock, including the latest electric sedans and hybrid SUVs. I can help you compare features, check current dealer incentives, or book a test drive for you this week. Which model are you most interested in?',
    'Documentation' => 'The integration process is designed to be developer-friendly. You can either use our dedicated NPM package for modern environments or simply drop a single async script tag into your HTML. I can walk you through the Quick Start guide or provide specific API examples.',
    'Ecommerce' => 'We offer free express shipping on all orders over $50, with most items arriving within 2-3 business days. I can also help you track an existing package, explain our 30-day return policy, or find the perfect size for you. Do you have an order number I can check?',
    'Education' => 'Our curriculum is built by industry experts to ensure you gain practical skills. We offer flexible learning paths, including evening sessions and intensive bootcamps, all backed by 1-on-1 mentor support. Would you like to see a detailed syllabus or attend an open house?',
    'Generic' => 'Hello! I am here to help you with any questions you have about our products or services. Feel free to ask anything, and I will do my best to provide the information you need!',
    'HelpCenter' => 'I can assist you with technical troubleshooting, billing inquiries, or navigating our platform features. If you are experiencing an issue, I can search our knowledge base for a step-by-step fix or escalate this to our support team for a priority response.',
    'InternalKb' => 'You can find our latest internal policies and procedure manuals here. If you are looking for HR forms, IT support guides, or company-wide announcements, I can point you to the right document immediately.',
    'Law' => 'We specialize in corporate law, litigation, and family matters, providing strategic counsel tailored to your situation. While I cannot offer legal advice directly, I can provide info on our practice areas and help you schedule a confidential consultation with one of our partners.',
    'Marketing' => 'Our platform helps you scale your outreach and improve conversion rates through AI-driven insights. Would you like to see some case studies from similar businesses in your industry, or learn more about our campaign automation features?',
    'Medical' => 'We offer comprehensive health screenings and specialized care. You can use this chat to learn more about our doctors and services, or to request a secure call back from our front desk to discuss your specific needs.',
    'RealEstate' => 'We have an exclusive portfolio of properties in this area, from luxury downtown penthouses to quiet suburban family estates. I can filter these by your requirements — like square footage or budget — and even set up a private tour for you. What is your ideal move-in date?',
    'Saas' => 'Our platform is built to scale with your business, offering deep integrations with tools like HubSpot, Salesforce, and Slack to automate your entire workflow. I can help you understand our API limits, security compliance, or set up a personalized demo.',
    'Tourism' => 'We curate premium travel experiences designed to create lasting memories. Whether you are looking for a private cruise, a luxury safari, or a bespoke city tour, I can help you build a custom itinerary and handle all the logistics. Where do you dream of visiting?',
];

foreach ($files as $file) {
    $name = basename($file, 'Preset.php');
    if (!isset($answers[$name])) continue;

    $content = file_get_contents($file);
    if (str_contains($content, 'public function sampleAnswer')) continue;

    $answer = $answers[$name];
    $method = "\n    public function sampleAnswer(): string\n    {\n        return __('$answer');\n    }\n}";
    
    $newContent = preg_replace('/}\s*$/', $method, $content);
    file_put_contents($file, $newContent);
    echo "Updated $name\n";
}

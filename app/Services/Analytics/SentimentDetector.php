<?php

namespace App\Services\Analytics;

class SentimentDetector
{
    /**
     * Very basic keyword-based sentiment analysis for Turkish and English.
     * Returns a float between -1.0 (angry) and 1.0 (happy).
     * 0.0 is neutral.
     */
    public function detect(string $text): float
    {
        $text = mb_strtolower($text);
        
        $positive = [
            'teşekkür', 'sagol', 'sağol', 'harika', 'süper', 'super', 'iyi', 'güzel', 'guzel', 'başarılı',
            'thanks', 'thank', 'awesome', 'great', 'good', 'perfect', 'excellent', 'amazing', 'happy', 'love'
        ];
        
        $negative = [
            'kötü', 'kotu', 'berbat', 'çalışmıyor', 'hata', 'problem', 'sorun', 'yavaş', 'yavas', 'pahalı', 'sikayet', 'şikayet',
            'bad', 'worst', 'broken', 'error', 'slow', 'expensive', 'useless', 'angry', 'hate', 'fail'
        ];
        
        $score = 0.0;
        
        foreach ($positive as $p) {
            if (str_contains($text, $p)) $score += 0.3;
        }
        
        foreach ($negative as $n) {
            if (str_contains($text, $n)) $score -= 0.4;
        }
        
        return max(-1.0, min(1.0, $score));
    }
}

<?php

namespace App\Services\Parsers;

use App\Services\Parsers\Contracts\FileParser;
use Smalot\PdfParser\Parser as Smalot;

class PdfParser implements FileParser
{
    public function supports(string $extension): bool
    {
        return strtolower($extension) === 'pdf';
    }

    public function parse(string $bytes, string $filename): array
    {
        $parser = new Smalot;
        $pdf = $parser->parseContent($bytes);

        $segments = [];
        foreach ($pdf->getPages() as $page) {
            $text = trim((string) $page->getText());
            if ($text !== '') {
                $segments[] = $text;
            }
        }

        return $segments;
    }
}

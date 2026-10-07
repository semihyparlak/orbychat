<?php

namespace App\Services\Parsers;

use App\Services\Parsers\Contracts\FileParser;

class ParserRegistry
{
    /** @var array<int, FileParser> */
    private array $parsers;

    public function __construct(?array $parsers = null)
    {
        $this->parsers = $parsers ?? [
            new PdfParser,
            new DocxParser,
            new CsvParser,
            new TextParser,
        ];
    }

    public function for(string $extension): ?FileParser
    {
        foreach ($this->parsers as $parser) {
            if ($parser->supports($extension)) {
                return $parser;
            }
        }

        return null;
    }
}

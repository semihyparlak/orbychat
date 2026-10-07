<?php

use App\Services\Crawl\PlainHttpCrawler;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;

test('PlainHttpCrawler returns response body for 200', function () {
    $mock = new MockHandler([new Response(200, [], '<html>hi</html>')]);
    $crawler = new PlainHttpCrawler(new Client(['handler' => HandlerStack::create($mock)]));

    expect($crawler->content('https://example.com'))->toBe('<html>hi</html>');
});

test('PlainHttpCrawler throws on 4xx/5xx', function () {
    $mock = new MockHandler([new Response(503, [], 'down')]);
    $crawler = new PlainHttpCrawler(new Client(['handler' => HandlerStack::create($mock)]));

    $crawler->content('https://example.com');
})->throws(RuntimeException::class, '503');

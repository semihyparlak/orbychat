<?php

$baseDir = realpath(__DIR__ . '/..');
$targetDirs = ['app', 'resources', 'routes', 'lang', 'database', 'config'];

$replacements = [
    '—' => '—',
    'â€¦' => '…',
    'â†\'' => '→',
    'â†»' => '↺',
    ''' => '’',
    'â€œ' => '“',
    'â€' => '”',
    'â€¢' => '•',
    'â€¢â€¢â€¢â€¢' => '••••',
];

$extensions = ['php', 'tsx', 'ts', 'js', 'json', 'blade.php'];

foreach ($targetDirs as $sub) {
    $dir = $baseDir . DIRECTORY_SEPARATOR . $sub;
    if (!is_dir($dir)) continue;

    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));

    foreach ($iterator as $file) {
        if ($file->isDir()) continue;
        
        $ext = pathinfo($file->getFilename(), PATHINFO_EXTENSION);
        if (str_ends_with($file->getFilename(), '.blade.php')) $ext = 'blade.php';
        
        if (!in_array($ext, $extensions)) continue;
        
        $path = $file->getRealPath();
        if (str_contains($path, 'node_modules') || str_contains($path, '.git')) continue;

        $content = file_get_contents($path);
        $newContent = $content;
        
        foreach ($replacements as $search => $replace) {
            $newContent = str_replace($search, $replace, $newContent);
        }
        
        if ($newContent !== $content) {
            file_put_contents($path, $newContent);
            echo "Fixed: $path\n";
        }
    }
}
echo "Done cleaning mojibake.\n";

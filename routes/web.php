<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/openapi.yaml', function () {
    return response()->file(
        resource_path('openapi.yaml'),
        ['Content-Type' => 'application/yaml']
    );
});

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublicCatalogController;

Route::get('/services', [PublicCatalogController::class, 'listServices']);
Route::get('/branches', [PublicCatalogController::class, 'listBranches']);

Route::post('/selections/service', [PublicCatalogController::class, 'selectService']);
Route::post('/selections/branch', [PublicCatalogController::class, 'selectBranch']);

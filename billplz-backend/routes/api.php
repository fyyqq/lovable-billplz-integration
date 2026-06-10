<?php

use Illuminate\Http\Request;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Route untuk React panggil
Route::post('/checkout', [PaymentController::class, 'createPayment']);

// Route untuk Webhook Billplz (Mesti sebiji dengan callback_url di atas)
Route::post('/billplz-webhook', [PaymentController::class, 'handleWebhook'])->name('billplz.webhook');

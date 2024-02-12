<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\Auth\LoginRegisterController;
use App\Http\Controllers\TaskStatisticsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes of authtication
Route::controller(LoginRegisterController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
});

// Protected routes of task and logout and Statistics
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [LoginRegisterController::class, 'logout']);
    Route::controller(TaskController::class)->group(function () {
        Route::get('/tasks', 'index');
        Route::post('/tasks', 'store');
        Route::post('/tasks/{id}', 'update');
        Route::delete('/tasks/{id}', 'destroy');
    });
    Route::controller(TaskStatisticsController::class)->group(function () {
        Route::get('/dailystatistics', 'dailyStatistics');
        Route::get('/weeklystatistics', 'weeklyStatistics');
        Route::get('/monthlystatistics', 'monthlyStatistics');
    });
});

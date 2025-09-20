<?php

use Illuminate\Support\Facades\Route;

 

use App\Http\Controllers\v1\AuthController;  
use App\Http\Controllers\v1\ProfileController; 
use App\Http\Controllers\v1\WorkspaceController; 


Route::get('/', function () {
    return redirect('/login');
});

Route::get('/login', [AuthController::class, 'login'])->name('login');
Route::get('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'authenticate'])->name('login.submit');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');


Route::get('/profile', [ProfileController::class, 'profile'])->name('profile');
Route::get('/workspace', [WorkspaceController::class, 'workspace'])->name('workspace');



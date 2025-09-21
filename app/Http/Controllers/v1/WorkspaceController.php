<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class WorkspaceController extends Controller
{
    //
    public function workspace(){
        return view('v1.workspace');
    }
}

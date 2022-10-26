<?php

namespace App\Http\Middleware;
use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
class JWTAuthentication
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if(Auth::check()){
            error_log("true");
            return $next($request);
        }
        else{
            error_log("false");
            return response()->json(["authenticated" => "false"]);
        }
        //check if user is logged in
        //if not route user to sign up page
        //on signin save user to auth


        //register middleware for every route

        // $t = Str::after($request->header("Authorization"), "Bearer ");
        // $user = JWTAuth::toUser($t);
        // Auth::logout();

    }
}

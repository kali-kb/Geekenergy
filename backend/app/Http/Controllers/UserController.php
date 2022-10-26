<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\ChallengeController;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;


class UserController extends Controller
{

    // public function __construct()
    // {
    //     $this->middleware('auth:api', ['except' => ['signIn']]);
    // }

    #logout
    #github login

    public function signUp(Request $request){
       $payload = json_decode($request->getContent());
       $email = $payload->email; 
       $password = $payload->password;
       $name = strstr($email, "@", true);
       try{
           DB::table('user')->insert([
            "name" => $name,
            "email" => $email,
            "password" => Hash::make($password),
           ]);
           $credential = $request->only('email', 'password');
           $created_token = Auth::attempt($credential);
           error_log("success");
           return response()->json(["status" => "success", "access_token" => $this->respondWithToken($created_token)]);
       }
       catch(Exception $exeption){
            // Logger::error
           error_log("record not created: " . $exeption->getMessage());
           return response()->json(["status" => "failed"]);
       }
    }

    protected function respondWithToken($token)
        {
            return [
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60
            ];
        }


    public function signIn(Request $request){
       $payload = json_decode($request->getContent());
       $email = $payload->email;
       $password = $payload->password;

       try{
           $user = DB::table("user")->where("email", $email)->get()->first();
           error_log("". $user->name);
           if(Hash::check($password, $user->password)){
                $credentials =  $request->only('email', 'password');
                $token = Auth::attempt($credentials);
                error_log("auth: " . Auth::user());
                return response()->json(["errors" => 0, "auth" => $this->respondWithToken($token)]);
           }
           else{
                return response()->json(["errors" => 1]);
           }
       }
       catch(Exception $ex){
           error_log("something has gone wrong" . $ex->getMessage());
           return response()->json(["errors" => 1]);
       }
    }

    public function updateUser(Request $request){
        try{
            $data = json_decode($request->getContent());
            $user = User::where("user_id", $data->id)->get()->first();
            $user->name = $data->name;
            $user->email = $data->email;
            $data_array = json_decode($request->getContent(), true);
            if($data_array["password"]["changed"] == "true"){
                $user->password = Hash::make($data_array["password"]["newPassword"]);
                $user->save();            
            }
            else{
                $user->save();
            }
        }
        catch(Exception $e){
            error_log("Operation Failed", $e->getMessage());
            Log::error("Operation has Failed");
        }
    }


    public function user(){
        $user = Auth::user();
        return $user;
    }

    public function logout(){
        return Auth::logout();
    }


    public function oauthController(){
        $google_url = Socialite::driver("google")->stateless()->redirect()->getTargetUrl();
        $github_url = Socialite::driver("github")->scopes(['read:user', 'public_repo'])->stateless()->redirect()->getTargetUrl();
        return response()->json(["google_auth_url" => $google_url, "github_auth_url" => $github_url]);
    }

    public function handleGoogleAuthCallback(Request $request){
        try{
            $user = Socialite::driver('google')->stateless()->user();
            $u = null;
            $strip_name = Str::before($user->getEmail(), "@");
            $password = $user->getId() . "" . $strip_name;
            if(User::where("email", $user->getEmail())->exists()){
                error_log("exists");
                $u = ["email" => $user->getEmail(), "password" => $password];
            }
            else{
                $new_user = User::create(["name" => $strip_name, "email" => $user->getEmail(), "password" => Hash::make($password)]);
                $u = ["email" => $new_user->email, "password" => $password];
            }            
            return response()->json(["message" => "success", "user" => $u]);  
        }
        catch(Exception $e){
            // Log::error()
            error_log("" . $e);
            error_log("" . $e->getMessage());
            return response()->json(["message" => $e->getMessage()]);
        }
        // error_log("user: " . $User);

    }
    // Slow and Dirty workaround
    public function handleGithubAuthCallback(Request $request){
        try{
            $user = Socialite::driver('github')->stateless()->user();
            $u = null;
            $strip_name = Str::before($user->getEmail(), "@");
            $password = $user->getId() . "" . $strip_name;
            if(User::where("email", $user->getEmail())->exists()){
                error_log("exists");
                $u = ["email" => $user->getEmail(), "password" => $password];
            }
            else{
                $new_user = User::create(["name" => $strip_name, "email" => $user->getEmail(), "password" => Hash::make($password)]);
                $u = ["email" => $new_user->email, "password" => $password];
            }            
            return response()->json(["message" => "success", "user" => $u]);  
        }
        catch(Exception $e){
            // Log::error()
            error_log("" . $e);
            error_log("" . $e->getMessage());
            return response()->json(["message" => $e->getMessage()]);
        }
    }

    // public function handleGithubAuthCallback(Request $request){
    //     try{
    //         $user = Socialite::driver('github')->stateless()->user();
    //         if(User::where("email", $user->getEmail())->exists()){
    //             error_log("exists");
    //             $u = User::where("email", $user->getEmail())->get()->first();
    //             Auth::loginUsingId($u->user_id);
    //             // Auth::attempt(["email" => $u->email, "password" => $u->password]);
    //             // Auth::login($u);
    //         }
    //         else{
    //             error_log("nickname: " .   $user->getNickname());
    //             error_log("name: " .   $user->getName());
    //             $strip_name = Str::before($user->getEmail(), "@");
    //             $password = $user->getId() . "" . $strip_name;
    //             $new_user = User::create(["name" => $strip_name, "email" => $user->getEmail(), "password" => Hash::make($password)]);
    //             if(Auth::attempt(["email" => $new_user->email, "password" => $password])){
    //                 error_log("logged in");
    //             }
    //             else{
    //                 error_log("not logged in");
    //             }
    //             // Auth::login($u);
    //         }            
    //         return response()->json(["message" => "success"]);  
    //     }
    //     catch(Exception $e){
    //         // Log::error()
    //         error_log("" . $e);
    //         error_log("" . $e->getMessage());
    //         return response()->json(["message" => $e->getMessage()]);
    //     }
    //     // 
    // }








    // public function oauthData(Request $request){
    //     #password --> id + name
    //     #name
    //     #email
    //     //check if data exists in database --> if so redirect to other page
    //     //if data doesnt exist exist save and redirect

    //     $user = User::create(["name" => $name, "email" => $email, "password" => $password]);
    //     $user->save();


    // }

}

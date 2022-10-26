<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DiscussionController;
use App\Http\Controllers\MiscController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ChallengeController;
use PhpOption\None;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/home/{id}', function (Request $request, $id) {
    return response()->json(["pageId" => $id]);
});


Route::post("/execute", [MiscController::class, "executor"]);
Route::get("/user", [UserController::class, "user"])->middleware("jwtauth");
Route::get("/get-challenges", [ChallengeController::class, "challengesList"])->middleware("jwtauth");
Route::get("/challenge/{slug}", [ChallengeController::class, "challengeDetail"])->middleware("jwtauth");
Route::post("/challenge-form", [ChallengeController::class, "challengeForm"])->middleware("jwtauth");
Route::post("/signin", [UserController::class, "signIn"]);
Route::post("/signup", [UserController::class, "signUp"]);
Route::post("/open-discussion", [DiscussionController::class, "openDiscussion"]);
Route::get("/discussions", [DiscussionController::class, "getDiscussionList"])->middleware("jwtauth");
Route::get("/discussion/{slug}", [DiscussionController::class, "getDiscussion"]);
Route::post("/discussion/add-comment", [DiscussionController::class, "createComment"]);
Route::post("/user/update-user", [UserController::class, "updateUser"]);
Route::get("/auth", [UserController::class, "oauthController"]);
Route::get('/auth/google/callback', [UserController::class, 'handleGoogleAuthCallback']);
Route::get('/auth/github/callback', [UserController::class, 'handleGithubAuthCallback']);
Route::get('/notifications', [MiscController::class, 'getNotification'])->middleware("jwtauth");
Route::get('/guides', [MiscController::class, "guideList"])->middleware("jwtauth");
Route::get('/guide/{id}', [MiscController::class, "guide"])->middleware("jwtauth");
Route::get('/hot-discussion', [DiscussionController::class, "hotDiscussions"])->middleware("jwtauth");
Route::post("/createReply", [DiscussionController::class, "createReply"])->middleware("jwtauth");
Route::post("/testcase", [MiscController::class, "runTest"]);
















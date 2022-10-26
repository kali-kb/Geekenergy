<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Challenge;
use Exception;
use Illuminate\Support\Facades\Log;

class ChallengeController extends Controller
{


    public function challengeForm(Request $request){
        $challenge_form = json_decode($request->getContent());
        try{
            DB::table("challenge")->insert([
                "title" => $challenge_form->title,
                "description" => $challenge_form->description,
                "difficulty" => $challenge_form->difficulty,
                "tags" => json_encode(["tags_list" => $challenge_form->tags]),
                "posted_by" => 1,
                "example_input" => $challenge_form->example_input,
                "example_output" => $challenge_form->example_output,
                "slug" => Str::slug($challenge_form->title, "-")

            ]);
            return response("created", 201);
        }
        catch(Exception $ex){
            error_log("didnt work \n" . $ex->getMessage());
            return response("failed to create", 500);
        }
        return null;
    }

    //list of paginated pages
    //items per page


    public function challengesList(Request $request){

        $query_string = $request->get("difficulty");
        if ($query_string == ""){
            try{
              $challenges = Challenge::with(["solved" => function($solved){ 
                return $solved->where("user_id", Auth::user()->user_id) ;
              }])->paginate(3);
              // $challenges = Challenge::paginate(3);
              return response()->json(["user" => Auth::user(), "challenges" => $challenges]);
            }
            catch(Exception $exception){
                error_log("Something went wrong");
                Log::error("Something went wrong at " . $exception->getMessage());
            }
        }
        else{
            // $challenges =  Challenge::where("difficulty", Str::title($query_string))->paginate(3);
            $challenges = Challenge::where("difficulty", Str::title($query_string))
            ->with(["solved" => function($solved){
                return $solved->where("user_id", Auth::user()->user_id);
            }])
            ->paginate(3);
            return response()->json(["user" => Auth::user(), "challenges" => $challenges]);
        }

    }


    public function challengeDetail(Request $request, $slug){
        $data = DB::table("challenge")->where("slug", $slug)->get()->first();
        return response()->json(["challenge" => (array)$data, "user" => Auth::user()]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Comment;
use Illuminate\Support\Facades\Auth;
use App\Models\Discussion;
use App\Models\Notification;
use App\Models\Reply;
use Exception;
use Illuminate\Support\Facades\Log;

class DiscussionController extends Controller
{

    public function openDiscussion(Request $request){
        $discussion = json_decode($request->getContent());
        error_log("" . $discussion->user_id);
        try{
            DB::table("discussion")->insert([
                "title" => $discussion->title,
                "description" => $discussion->description,
                "user_id" => $discussion->user_id,
                "tags" => json_encode($discussion->tags),
                "slug" => Str::slug($discussion->title, "-")
            ]);
            error_log("saved");
        }
        catch(Exception $e){
            error_log("didnt't work \n" . $e->getMessage());
        }
        return response()->json(["message" => "success"]);
    }


    public function getDiscussionList(){
        try{
            $discussions = Discussion::with(["comments", "user"])->paginate(2);
            return response()->json(["user" => Auth::user(), "discussion" => $discussions]);
        }
        catch(Exception $ex){
            error_log("Something went wrong" . $ex->getMessage());
        }
    }


    public function getDiscussion(Request $request, $slug){
        error_log("executed");
        try{
            $discussion = Discussion::where("slug", $slug)->with(["comments.user", "comments.reply.user", "user"])->get()->first();
            return response()->json(["user" => Auth::user() ,"discussion" => $discussion])->header("Access-Control-Allow-Origin", "*");
        }
        catch(Exception $e){
            error_log($e->getMessage());
        }
    }

    public function createComment(Request $request){
        $comment_data = json_decode($request->getContent());
        $discussion = Discussion::where("slug", $comment_data->slug)->get()->first();
        try{
            $comment = new Comment();
            $comment->comment_text = $comment_data->text;
            $comment->user_id = $comment_data->user_id;
            $comment->discussion_id = $comment_data->discussion_id;
            $comment->save();
            Notification::create([
                "user_id" => $comment_data->discussion_op,
                "notification_message" => "Somebody has responded to discussion you opened"
            ]);
            error_log("created");
            return response()->json(Discussion::with(["comments.user", "comments.reply.user", "user"])->get()->first());
        }
        catch(Exception $e){
            // Log::error("something has failed when trying to create a comment")
            error_log("comment has not been created \n" . $e->getMessage());
        }

    }

    public function createReply(Request $request){
        $reply_data = json_decode($request->getContent());
        try{
            Reply::create([
                "reply_text" => $reply_data->reply_text,
                "comment_id" => $reply_data->comment_id,
                "user_id" => $reply_data->user_id,
            ]);
            $updated = Discussion::where("discussion_id", $reply_data->discussion_id)->with(["comments.user", "comments.reply.user", "user"])->get()->first();
            return response()->json($updated);
        }
        catch(Exception $e){
            error_log("something went wrong: " . $e->getMessage());
        }
    }

    public function hotDiscussions(Request $requests){
        $discussion = Discussion::has("comments", ">=", 1)->with(["user", "comments"])->get();
        return response()->json($discussion);
    }

}

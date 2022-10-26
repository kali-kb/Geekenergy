<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Comment;


class Discussion extends Model
{
    use HasFactory;

    protected $table = "discussion";
    protected $primaryKey = "discussion_id";
    public $timestamps = false;


    public function comments(){
        return $this->hasMany(Comment::class, "discussion_id", "discussion_id");
    }

    public function user(){
        return $this->hasOne(User::class, "user_id", "user_id");
    }
}

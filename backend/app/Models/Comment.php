<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Comment extends Model
{
    use HasFactory;

    protected $table = "comment";
    public $timestamps = false;
    protected $primaryKey = "comment_id";
    protected $guarded = [];


    public function user(){
        return $this->hasOne(User::class, "user_id", "user_id");
    }

    public function reply(){
        return $this->hasMany(Reply::class, "comment_id", "comment_id");
    }
}

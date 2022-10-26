<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;



class Reply extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $guarded = [];
    protected $table = "reply";
    protected $primaryKey = "reply_id";

    public function user(){
        return $this->hasOne(User::class, "user_id", "user_id");
    }

}

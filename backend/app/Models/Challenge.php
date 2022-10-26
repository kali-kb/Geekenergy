<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Challenge extends Model
{
    use HasFactory;
    
    protected $table = "challenge";
    public $primaryKey = "challenge_id";


    public function solved(){
        return $this->hasMany(Solved::class, "challenge_id", "challenge_id");
    }
    
}

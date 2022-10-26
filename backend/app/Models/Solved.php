<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Solved extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $guarded = [];
    protected $primaryKey = "solved_id";
    protected $table = "solved_challenges";


    public function user_solved(){
        $this->hasMany(User::class);
    }
}

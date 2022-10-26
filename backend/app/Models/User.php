<?php

namespace App\Models;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $table = "user";
    protected $primaryKey = "user_id";
    protected $guarded = [];
    public $timestamps = false;
    

    public function solved_challenges(){
        $this->hasMany(Solved::class);
    }



    public function getJWTIdentifier()
    {
        return $this->getKey();
    }




    public function getJWTCustomClaims()
    {
        return [];
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("solved_challenges", function(Blueprint $table){
            $table->id("solved_id");
            $table->foreignId("challenge_id")->references("challenge_id")->on("challenge")->cascadeOnDelete();
            $table->foreignId("user_id")->references("user_id")->on("user")->cascadeOnDelete();
        });  
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop("solved_challenges");
    }
};

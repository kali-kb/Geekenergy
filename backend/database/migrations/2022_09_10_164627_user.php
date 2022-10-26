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
        Schema::create("user", function(Blueprint $table){
            $table->id("user_id");
            $table->string("name")->nullable();
            $table->string("email")->unique();
            $table->string("password");
            $table->date("date_joined")->default(date("D M j G:i:s T Y"));
            $table->integer("problems_solved")->default(0);
            $table->rememberToken();
            $table->integer("points")->default(0);
            $table->foreignId("passed_challeges")->reference("challenge_id")->on("challenge")->onDelete("cascade")->nullable(); //maybe create a table to store challenges associated with the users those passed/solved them
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop("user");
    }
};

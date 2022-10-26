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
        Schema::create("challenge", function(Blueprint $table){
            $table->id("challenge_id");
            $table->string("title");
            $table->longText("description")->nullable();
            $table->string("example_output");
            $table->string("example_input");
            $table->string("difficulty")->nullable(); //should have enums(easy, medium, hard)
            $table->json("tags");
            $table->foreignId("posted_by")->references("user_id")->on("user");
            $table->timestamp("created_at")->default(date("D M j G:i:s T Y"));
            $table->string("slug");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop("challenge");
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
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
        Schema::create("discussion", function(Blueprint $table){
            $table->id("discussion_id");
            $table->string("title");
            $table->string("description");
            $table->string("created_date")->default(Carbon::now());
            $table->foreignId("user_id")->references("user_id")->on("user")->onDelete("cascade");
            $table->string("slug");
            $table->json("tags");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop("discussion");
    }
};

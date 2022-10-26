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
        Schema::create("comment", function(Blueprint $table){
            $table->id("comment_id");
            $table->string("comment_text");
            $table->string("created_at")->default(Carbon::now());
            $table->foreignId("user_id")->references("user_id")->on("user")->onDelete("cascade");
            $table->foreignId("discussion_id")->references("discussion_id")->on("discussion")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop("comment");
    }
};

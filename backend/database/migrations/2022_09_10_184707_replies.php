<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Carbon;
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
        Schema::create("reply", function(Blueprint $table){
            $table->id("reply_id");
            $table->string("reply_text");
            $table->string("date_replied")->default(Carbon::now());
            $table->foreignId("comment_id")->references("comment_id")->on("comment")->onDelete("cascade");
            $table->foreignId("user_id")->references("user_id")->on("user")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop("reply");
    }
};

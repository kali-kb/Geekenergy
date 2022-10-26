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
        Schema::create("notifications", function(Blueprint $table){
            $table->id("notification_id");
            $table->date("created_at")->default(date("D M j G:i:s T Y"));
            $table->string("notification_message");
            $table->boolean("unread")->default(false);
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
        Schema::create("notifications");
    }
};

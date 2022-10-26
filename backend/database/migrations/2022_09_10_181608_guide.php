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
        Schema::create("guide", function(Blueprint $table){
            $table->id();
            $table->string("title");
            $table->string("content");
            $table->date("date_created")->default(date("D M j G:i:s T Y"));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop("guide");
    }
};

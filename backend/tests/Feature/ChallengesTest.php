<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ChallengesTest extends TestCase
{
    // public function __construct()
    // {
    //     $this->header = ["Authorization" => "Bearer " . env("TEST_TOKEN")];
    // }
    /**
     * A basic feature test example.
     *
     * @return void
     */

    public function test_returns_challenge_list()
    {
        $response = $this->get('/api/get-challenges');
        $response->assertStatus(200);
    }

    public function test_returns_challenge_details()
    {
        $response = $this->getJson("/api/challenge/add-two-numbers");
        $response->assertStatus(200);
    }

}



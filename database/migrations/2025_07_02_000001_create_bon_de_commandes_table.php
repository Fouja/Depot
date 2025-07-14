<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bon_de_commandes', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique();
            $table->date('date');
            $table->string('envoyeur');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bon_de_commandes');
    }
};

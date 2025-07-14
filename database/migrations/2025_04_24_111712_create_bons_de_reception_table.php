<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bons_de_receptions', function (Blueprint $table) { // Plural table name
            $table->id();
            $table->string('numero')->unique();
            $table->date('date');
            $table->string('envoyeur');
            $table->string('type');
            $table->date('peremption')->nullable();
            $table->string('marque')->nullable();
            $table->string('image_path')->nullable();
            $table->text('description')->nullable();
            $table->decimal('prix_total', 14, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bons_de_receptions'); // Match plural
    }
};

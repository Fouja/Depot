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
        Schema::create('produits_transferes', function (Blueprint $table) {
            $table->id();
            $table->string('produit_id'); // Using product name as identifier
            $table->integer('quantite');
            $table->string('destination');
            $table->enum('type_transfert', ['interne', 'externe']);
            $table->string('nom_personnel')->nullable();
            $table->timestamp('date_transfert')->useCurrent();
            
            // Additional fields from Produit model
            $table->string('unite')->nullable();
            $table->string('type_produit')->nullable();
            $table->string('marque')->nullable();
            $table->string('dosage')->nullable();
            $table->string('image_url')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produits_transferes');
    }
};